# server_import.py
# ---------------------------------------------------------
# 依赖安装（Windows PowerShell 任意一条一行执行）:
#   python -m pip install -U pip
#   python -m pip install "fastapi==0.115.*" "uvicorn[standard]>=0.30"
#
# 启动方式 1（直接运行本文件，已内置入口）:
#   python .\server_import.py
#
# 启动方式 2（用 uvicorn CLI）:
#   python -m uvicorn server_import:app --host 0.0.0.0 --port 8001 --reload
#
# 环境变量（可选）:
#   YFJZ_UPLOAD_DIR        上传目录，默认 ./uploads/yfjz
#   YFJZ_MAX_SIZE_BYTES    文件大小上限，默认 10MB
# ---------------------------------------------------------

from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Any
from typing import Dict

from fastapi import FastAPI
from fastapi import File
from fastapi import HTTPException
from fastapi import UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# === 配置 ===
UPLOAD_DIR: Path = Path(os.getenv("YFJZ_UPLOAD_DIR", "./uploads/yfjz")).resolve()
MAX_SIZE_BYTES: int = int(os.getenv("YFJZ_MAX_SIZE_BYTES", str(10 * 1024 * 1024)))
ALLOWED_EXT: str = ".yfjz"

app: FastAPI = FastAPI(title="YFJZ Upload API", version="1.0.0")

# 视需要放开跨域（示例：本机/局域网调试）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境请改成你的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === 工具函数 ===
_filename_safe_re = re.compile(r"[\\/:*?\"<>|\r\n]+")

def sanitize_filename(name: str) -> str:
    name = (name or "").strip().strip("'\"")
    name = _filename_safe_re.sub("_", name)
    return name or "unnamed.yfjz"

def ensure_yfjz_structure(obj: Dict[str, Any]) -> None:
    if not isinstance(obj, dict):
        raise HTTPException(status_code=400, detail="yfjz 内容必须为 JSON 对象")
    if "BQItem" not in obj:
        raise HTTPException(status_code=400, detail="缺少必需字段：BQItem")
    bq = obj["BQItem"]
    if not isinstance(bq, dict):
        raise HTTPException(status_code=400, detail="BQItem 必须为对象")
    if "Norms" not in bq:
        raise HTTPException(status_code=400, detail="缺少必需字段：BQItem.Norms")

# === 路由 ===
@app.get("/health")
def health() -> dict:
    return {"status": "ok"}

@app.post("/upload/yfjz")
async def upload_yfjz(file: UploadFile = File(...)) -> JSONResponse:
    # 1) 扩展名校验
    original_name: str = file.filename or "unnamed.yfjz"
    safe_name: str = sanitize_filename(original_name)
    ext: str = Path(safe_name).suffix.lower()
    if ext != ALLOWED_EXT:
        raise HTTPException(status_code=400, detail=f"只允许上传扩展名为 {ALLOWED_EXT} 的文件")

    # 2) 读取并限制大小
    data: bytes = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="文件为空")
    if len(data) > MAX_SIZE_BYTES:
        raise HTTPException(status_code=400, detail=f"文件过大，最大 {MAX_SIZE_BYTES} 字节")

    # 3) 尝试解析 JSON（支持 UTF-8 与 UTF-8-BOM）
    try:
        text: str = data.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="文件必须为 UTF-8 编码")

    try:
        obj: Dict[str, Any] = json.loads(text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="文件内容不是合法 JSON")

    # 4) 结构校验：必须含有 BQItem.Norms
    ensure_yfjz_structure(obj)

    # 5) 持久化保存
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    save_path: Path = UPLOAD_DIR / safe_name
    if save_path.exists():
        stem: str = save_path.stem
        suffix: str = save_path.suffix
        i: int = 1
        while True:
            alt: Path = UPLOAD_DIR / f"{stem}({i}){suffix}"
            if not alt.exists():
                save_path = alt
                break
            i += 1
    save_path.write_bytes(data)

    # 6) 返回概要信息（例如 Norms 的类型与长度）
    bq = obj["BQItem"]
    norms = bq.get("Norms")
    norms_type: str = type(norms).__name__
    norms_len = len(norms) if isinstance(norms, (list, dict)) else None

    return JSONResponse(
        {
            "message": "上传成功",
            "filename": save_path.name,
            "size": len(data),
            "bqitem_norms_type": norms_type,
            "bqitem_norms_len": norms_len,
            "path": str(save_path),
        },
        status_code=200,
    )

# === 可直接运行的入口（等价于 Flask 的 app.run） ===
if __name__ == "__main__":
    import uvicorn
    # ⚠️ 注意：这里的 "server_import:app" 必须与当前文件名一致（去掉 .py）
    # 如果你把文件改名为 yfjz_api.py，就要改成 "yfjz_api:app"
    uvicorn.run("server_import:app", host="0.0.0.0", port=8001, reload=True)
