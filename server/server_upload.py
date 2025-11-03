# server_upload.py
# ----------------------------
# 依赖：
#   pip install flask flask-cors
#   （可选：视频封面需要 ffmpeg；PDF 封面需要 pip install PyMuPDF）
# 运行：
#   python server_upload.py
# ----------------------------

import os
import uuid
import mimetypes
import subprocess
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# ============ 固定上传根目录到 D:/file_upload ============
UPLOAD_ROOT = Path(r"D:\file_upload").resolve()
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)

# ============ 可选能力 ============
FFMPEG_BIN = "ffmpeg"          # ffmpeg 不在 PATH 时，改成绝对路径：r"D:\ffmpeg\bin\ffmpeg.exe"
ENABLE_PDF_COVER = False       # 如需 PDF 首页封面，改 True，并 pip install PyMuPDF

app = Flask(__name__)

# ============ CORS 开启 ============
# 精确允许你的前端来源（可按需增减）
ALLOWED_ORIGINS = [
    "http://192.168.3.174:8090",
    "http://localhost:8090",
    "http://127.0.0.1:8090",
]

CORS(
    app,
    resources={r"/*": {"origins": ALLOWED_ORIGINS}},
    supports_credentials=False,  # 如需携带 cookie 把这项改 True，并确保前端也 withCredentials
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
    max_age=86400,
)

@app.after_request
def add_cors_headers(resp):
    # 保险起见：若 flask-cors 未命中，也补一份（不会覆盖已存在的）
    origin = request.headers.get("Origin")
    if origin in ALLOWED_ORIGINS:
        resp.headers.setdefault("Access-Control-Allow-Origin", origin)
        resp.headers.setdefault("Vary", "Origin")
    return resp


# ============ 工具函数 ============
def ok(data=None, msg="ok"):
    return jsonify({"code": 0, "msg": msg, "data": data or {}})

def fail(msg="error", code=1):
    return jsonify({"code": code, "msg": msg, "data": None})

def _safe_mime(path: Path) -> str:
    mime, _ = mimetypes.guess_type(str(path))
    return mime or "application/octet-stream"

def _utc_last_modified(path: Path):
    try:
        return datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)
    except Exception:
        return None

def _run_ffmpeg_cover(input_path: Path, out_path: Path, ts: float = 1.0) -> bool:
    """从视频第 ts 秒截一帧为封面，需要本机 ffmpeg。"""
    try:
        out_path.parent.mkdir(parents=True, exist_ok=True)
        cmd = [
            FFMPEG_BIN, "-ss", str(ts),
            "-i", str(input_path),
            "-frames:v", "1",
            "-y", str(out_path),
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return out_path.exists() and out_path.stat().st_size > 0
    except Exception:
        return False

def _pdf_first_page_cover(pdf_path: Path, out_path: Path) -> bool:
    """（可选）给 PDF 生成首页封面，需 PyMuPDF。"""
    try:
        import fitz  # type: ignore
        out_path.parent.mkdir(parents=True, exist_ok=True)
        doc = fitz.open(str(pdf_path))
        if doc.page_count == 0:
            return False
        page = doc.load_page(0)
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        pix.save(str(out_path))
        return True
    except Exception:
        return False


# ============ 上传接口 ============
@app.post("/file/upload")
def upload_file():
    """
    表单字段：
      - file: 文件
      - note: 备注（可选）
    保存到：D:/file_upload/<YYYYMMDD>/<uuid>.<ext>
    返回：
      {
        code, msg, data: {
          original_name, content_type, size,
          public_name, accessPath, coverPath, note
        }
      }
    其中：
      accessPath = /p/<YYYYMMDD>/<uuid>.<ext>
      如果是视频，会返回 coverPath = /p/<YYYYMMDD>/<uuid>_cover.jpg
      （PDF 封面在 ENABLE_PDF_COVER=True 时也会返回）
    """
    f = request.files.get("file")
    note = request.form.get("note") or ""
    if not f:
        return fail("缺少文件字段 file")

    # 按日期分目录
    date_dir = datetime.now().strftime("%Y%m%d")
    public_dir = (UPLOAD_ROOT / date_dir).resolve()

    # 防御：禁止越权路径
    if not str(public_dir).startswith(str(UPLOAD_ROOT)):
        return fail("非法路径")

    public_dir.mkdir(parents=True, exist_ok=True)

    # 规范化文件名并保存
    original = secure_filename(f.filename or "file.bin")
    ext = (Path(original).suffix or "").lower()
    uid = uuid.uuid4().hex
    public_name = f"{uid}{ext}"
    save_path = public_dir / public_name
    f.save(str(save_path))

    # 元信息
    content_type = _safe_mime(save_path)
    size = save_path.stat().st_size

    # 封面：视频 or（可选）PDF
    cover_public = None
    if content_type.startswith("video/"):
        cover_public = f"{uid}_cover.jpg"
        ok_cover = _run_ffmpeg_cover(save_path, public_dir / cover_public, ts=1.0)
        if not ok_cover:
            cover_public = None
    elif ENABLE_PDF_COVER and content_type == "application/pdf":
        cover_public = f"{uid}_page1.jpg"
        ok_cover = _pdf_first_page_cover(save_path, public_dir / cover_public)
        if not ok_cover:
            cover_public = None

    # 对外直链
    accessPath = f"/p/{date_dir}/{public_name}"
    coverPath = f"/p/{date_dir}/{cover_public}" if cover_public else ""

    data = {
        "original_name": original,
        "content_type": content_type,
        "size": size,
        "public_name": f"{date_dir}/{public_name}",
        "accessPath": accessPath,
        "coverPath": coverPath,
        "note": note,
    }
    return ok(data=data, msg="上传成功")


# ============ 直链预览 ============
@app.get("/p/<path:public_name>")
def public_preview(public_name: str):
    """
    直链访问：
      <img src="/p/20251031/xxx.jpg">
      <video src="/p/20251031/xxx.mp4" controls>
    物理位置：
      D:/file_upload/<public_name>
    """
    path = (UPLOAD_ROOT / public_name).resolve()
    if not str(path).startswith(str(UPLOAD_ROOT)):
        return fail("非法路径")
    if not path.exists():
        return fail("文件不存在")

    kwargs = dict(
        as_attachment=False,
        mimetype=_safe_mime(path),
        conditional=True,  # 支持 Range/缓存
        etag=True,
        max_age=3600,
    )
    lm = _utc_last_modified(path)
    if lm:
        kwargs["last_modified"] = lm

    return send_file(str(path), **kwargs)


if __name__ == "__main__":
    # 示例启动信息：
    # * Running on http://127.0.0.1:8000
    # * Running on http://192.168.3.174:8000
    app.run(host="0.0.0.0", port=8000, debug=True)
