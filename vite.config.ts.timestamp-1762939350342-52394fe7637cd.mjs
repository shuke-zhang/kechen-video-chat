// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/@tailwindcss+vite@4.1.11_vi_a6b616c6a4c569500b70d9d80794a129/node_modules/@tailwindcss/vite/dist/index.mjs";
import vue from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_15e944e1f64a35a22152bc17488423e6/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.2._ec508d6bd8dd71843e8cfdaeffa9a60d/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/unplugin-auto-import@0.18.6_a5f23bafd7453cb209d87ad795764707/node_modules/unplugin-auto-import/dist/vite.js";
import IconsResolver from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/unplugin-icons@0.20.2_@vue+compiler-sfc@3.5.22/node_modules/unplugin-icons/dist/resolver.js";
import Icons from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/unplugin-icons@0.20.2_@vue+compiler-sfc@3.5.22/node_modules/unplugin-icons/dist/vite.js";
import { ElementPlusResolver, NaiveUiResolver } from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/unplugin-vue-components@0.2_30de04a04fd924c63fac4d0a5793d993/node_modules/unplugin-vue-components/dist/resolvers.js";
import Components from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/unplugin-vue-components@0.2_30de04a04fd924c63fac4d0a5793d993/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig, loadEnv } from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/vite@5.4.19_@types+node@20._d2e0a39a5ed366d19c496d05bc07decc/node_modules/vite/dist/node/index.js";
import vueDevTools from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/vite-plugin-vue-devtools@7._c10432b40a3ad233fd88b4fdab25dc88/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";

// script/iconfont.ts
import fs from "node:fs";
import path from "node:path";
import chokidar from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/chokidar@4.0.3/node_modules/chokidar/esm/index.js";
import ejs from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/ejs@3.1.10/node_modules/ejs/lib/ejs.js";
var __vite_injected_original_dirname = "D:\\project\\kechen\\kechen-video-chat\\script";
var debounce = (func, delay = 1e3) => {
  let timer;
  return async (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(async () => {
        await func(...args);
        resolve();
      }, delay);
    });
  };
};
var sourceDir = path.resolve(__vite_injected_original_dirname, "__iconfont");
var targetDir = path.resolve(__vite_injected_original_dirname, "../src/components/icon-font/");
var ignored = [
  /\/src\/iconfont\/demo_index\.html$/,
  /\/src\/iconfont\/demo\.css$/,
  /\/src\/iconfont\/iconfont\.js$/,
  /\/src\/iconfont\/iconfont\.json$/,
  /\/src\/iconfont\/iconfont\.ttf$/,
  /\/src\/iconfont\/iconfont\.woff$/,
  /\/src\/iconfont\/iconfont\.woff2$/
];
function copyFile(sourceFile, targetFile) {
  if (!fs.existsSync(sourceFile)) {
    throw new Error(`Source file "${sourceFile}" does not exist.`);
  }
  const fileContent = fs.readFileSync(sourceFile);
  fs.writeFileSync(targetFile, fileContent);
}
var cssDelimiter = [
  "/* [",
  "] */"
];
var jsDelimiter = [
  "'/* [",
  "] */'"
];
function getEjsData() {
  const css = fs.readFileSync(
    path.resolve(__vite_injected_original_dirname, "__iconfont", "iconfont.css"),
    "utf-8"
  );
  const index = css.indexOf(".icon-");
  const content = css.slice(index, css.length - 1).replace(/\r?\n*$/, "");
  const json = fs.readFileSync(path.resolve(__vite_injected_original_dirname, "__iconfont", "iconfont.json")).toString();
  const typesObject = JSON.parse(json).glyphs.map((e) => `'${e.font_class}'`).sort();
  const types = typesObject.join(" |\n").replace(/\r?\n*$/, "");
  const ejsData = {
    content,
    types
  };
  return ejsData;
}
function getTemplateData(templateName, [openDelimiter, closeDelimiter] = cssDelimiter) {
  const ejsData = getEjsData();
  const _templatePath = path.resolve(__vite_injected_original_dirname, "./__template", templateName);
  const source = fs.readFileSync(_templatePath).toString();
  const template = ejs.compile(source, {
    openDelimiter,
    closeDelimiter
  });
  return template(ejsData);
}
async function copy() {
  try {
    fs.writeFileSync(
      path.resolve(targetDir, "iconfont.css"),
      getTemplateData("iconfont.css"),
      "utf-8"
    );
    fs.writeFileSync(
      path.resolve(targetDir, "iconfont.ts"),
      getTemplateData("iconfont.ts", jsDelimiter)
    );
    await copyFile(
      path.resolve(__vite_injected_original_dirname, "__iconfont", "iconfont.js"),
      path.resolve(targetDir, "iconfont.js")
    );
  } catch (error) {
    console.error(`${error}`);
  }
}
function generatedIcons(isBuild) {
  if (isBuild)
    return;
  console.log("generatedIcons");
  const handler = debounce(copy);
  const watcher = chokidar.watch(sourceDir, {
    ignored
  });
  watcher.on("all", async (type) => {
    if (type !== "addDir" && type !== "unlink" && type !== "unlinkDir")
      handler();
  });
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///D:/project/kechen/kechen-video-chat/vite.config.ts";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isBuild = command === "build";
  return {
    define: {
      __DEV__: mode === "development",
      __PROD__: mode === "production",
      __APP_TITLE__: `"${env.VITE_APP_TITLE}"`,
      __API_URL__: `"${env.VITE_API_URL}"`,
      __STATIC_URL__: `"${env.VITE_API_URL}"`
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/styles/global.scss" as global;
          @use '@/styles/variables.scss' as vars;
          @use "@/styles/element/index.scss" as elVas;

          `,
          api: "modern"
        }
      }
    },
    plugins: [
      vue(),
      generatedIcons(isBuild),
      tailwindcss(),
      vueJsx(),
      vueDevTools(),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        dts: "./types/auto-imports.d.ts",
        // 指定生成的自动导入声明文件的路径
        dirs: ["./src/hooks", "./src/utils", "./src/stores"],
        // 告诉AutoImport插件在哪些目录中自动导入模块。插件会扫描这些目录中的文件，并根据文件内容自动生成导入语句。
        eslintrc: {
          enabled: true,
          // 生成 ESLint 配置，避免 import 报错
          filepath: "./.eslintrc-auto-import.json",
          // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true
          // 自动设置全局变量
        },
        resolvers: [
          ElementPlusResolver({ importStyle: "sass" }),
          // 自动导入图标组件
          IconsResolver({
            prefix: "Icon"
          })
        ]
      }),
      Components({
        dirs: ["./src/components"],
        dts: "./types/components.d.ts",
        // 指定生成的组件声明文件的路径
        resolvers: [
          // 自动注册图标组件
          IconsResolver({
            prefix: "Icon"
          }),
          ElementPlusResolver({ importStyle: "sass" }),
          NaiveUiResolver()
        ]
      }),
      Icons({
        autoInstall: true
      })
    ],
    server: {
      host: "0.0.0.0",
      open: false,
      port: 8090
    },
    build: {
      rollupOptions: {
        external: ["fs"]
        // 确保不打包 Node.js 模块
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0L2ljb25mb250LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxrZWNoZW5cXFxca2VjaGVuLXZpZGVvLWNoYXRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RcXFxca2VjaGVuXFxcXGtlY2hlbi12aWRlby1jaGF0XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9wcm9qZWN0L2tlY2hlbi9rZWNoZW4tdmlkZW8tY2hhdC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5cclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcclxuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIsIE5haXZlVWlSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXHJcbmltcG9ydCB7IGdlbmVyYXRlZEljb25zIH0gZnJvbSAnLi9zY3JpcHQvaWNvbmZvbnQnXHJcbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJylcclxuICBjb25zdCBpc0J1aWxkID0gY29tbWFuZCA9PT0gJ2J1aWxkJ1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZGVmaW5lOiB7XHJcbiAgICAgIF9fREVWX186IG1vZGUgPT09ICdkZXZlbG9wbWVudCcsXHJcbiAgICAgIF9fUFJPRF9fOiBtb2RlID09PSAncHJvZHVjdGlvbicsXHJcbiAgICAgIF9fQVBQX1RJVExFX186IGBcIiR7ZW52LlZJVEVfQVBQX1RJVExFfVwiYCxcclxuICAgICAgX19BUElfVVJMX186IGBcIiR7ZW52LlZJVEVfQVBJX1VSTH1cImAsXHJcbiAgICAgIF9fU1RBVElDX1VSTF9fOiBgXCIke2Vudi5WSVRFX0FQSV9VUkx9XCJgLFxyXG4gICAgfSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBjc3M6IHtcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIHNjc3M6IHtcclxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgXHJcbiAgICAgICAgICBAdXNlIFwiQC9zdHlsZXMvZ2xvYmFsLnNjc3NcIiBhcyBnbG9iYWw7XHJcbiAgICAgICAgICBAdXNlICdAL3N0eWxlcy92YXJpYWJsZXMuc2NzcycgYXMgdmFycztcclxuICAgICAgICAgIEB1c2UgXCJAL3N0eWxlcy9lbGVtZW50L2luZGV4LnNjc3NcIiBhcyBlbFZhcztcclxuXHJcbiAgICAgICAgICBgLFxyXG4gICAgICAgICAgYXBpOiAnbW9kZXJuJyxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgdnVlKCksXHJcbiAgICAgIGdlbmVyYXRlZEljb25zKGlzQnVpbGQpLFxyXG5cclxuICAgICAgdGFpbHdpbmRjc3MoKSxcclxuICAgICAgdnVlSnN4KCksXHJcbiAgICAgIHZ1ZURldlRvb2xzKCksXHJcbiAgICAgIEF1dG9JbXBvcnQoe1xyXG4gICAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnXSxcclxuICAgICAgICBkdHM6ICcuL3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzJywgLy8gXHU2MzA3XHU1QjlBXHU3NTFGXHU2MjEwXHU3Njg0XHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XHU3Njg0XHU4REVGXHU1Rjg0XHJcbiAgICAgICAgZGlyczogWycuL3NyYy9ob29rcycsICcuL3NyYy91dGlscycsICcuL3NyYy9zdG9yZXMnXSwgLy8gXHU1NDRBXHU4QkM5QXV0b0ltcG9ydFx1NjNEMlx1NEVGNlx1NTcyOFx1NTRFQVx1NEU5Qlx1NzZFRVx1NUY1NVx1NEUyRFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NkEyMVx1NTc1N1x1MzAwMlx1NjNEMlx1NEVGNlx1NEYxQVx1NjI2Qlx1NjNDRlx1OEZEOVx1NEU5Qlx1NzZFRVx1NUY1NVx1NEUyRFx1NzY4NFx1NjU4N1x1NEVGNlx1RkYwQ1x1NUU3Nlx1NjgzOVx1NjM2RVx1NjU4N1x1NEVGNlx1NTE4NVx1NUJCOVx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMFx1NUJGQ1x1NTE2NVx1OEJFRFx1NTNFNVx1MzAwMlxyXG4gICAgICAgIGVzbGludHJjOiB7XHJcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLCAvLyBcdTc1MUZcdTYyMTAgRVNMaW50IFx1OTE0RFx1N0Y2RVx1RkYwQ1x1OTA3Rlx1NTE0RCBpbXBvcnQgXHU2MkE1XHU5NTE5XHJcbiAgICAgICAgICBmaWxlcGF0aDogJy4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb24nLCAvLyBEZWZhdWx0IGAuLy5lc2xpbnRyYy1hdXRvLWltcG9ydC5qc29uYFxyXG4gICAgICAgICAgZ2xvYmFsc1Byb3BWYWx1ZTogdHJ1ZSwgLy8gXHU4MUVBXHU1MkE4XHU4QkJFXHU3RjZFXHU1MTY4XHU1QzQwXHU1M0Q4XHU5MUNGXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoeyBpbXBvcnRTdHlsZTogJ3Nhc3MnIH0pLFxyXG4gICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XHJcbiAgICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgICAgcHJlZml4OiAnSWNvbicsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICBdLFxyXG4gICAgICB9KSxcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgZGlyczogWycuL3NyYy9jb21wb25lbnRzJ10sXHJcbiAgICAgICAgZHRzOiAnLi90eXBlcy9jb21wb25lbnRzLmQudHMnLCAvLyBcdTYzMDdcdTVCOUFcdTc1MUZcdTYyMTBcdTc2ODRcdTdFQzRcdTRFRjZcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcdTc2ODRcdThERUZcdTVGODRcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NkNFOFx1NTE4Q1x1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxyXG4gICAgICAgICAgSWNvbnNSZXNvbHZlcih7XHJcbiAgICAgICAgICAgIHByZWZpeDogJ0ljb24nLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKHsgaW1wb3J0U3R5bGU6ICdzYXNzJyB9KSxcclxuICAgICAgICAgIE5haXZlVWlSZXNvbHZlcigpLFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0pLFxyXG4gICAgICBJY29ucyh7XHJcbiAgICAgICAgYXV0b0luc3RhbGw6IHRydWUsXHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgICBvcGVuOiBmYWxzZSxcclxuICAgICAgcG9ydDogODA5MCxcclxuICAgIH0sXHJcblxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIGV4dGVybmFsOiBbJ2ZzJ10sIC8vIFx1Nzg2RVx1NEZERFx1NEUwRFx1NjI1M1x1NTMwNSBOb2RlLmpzIFx1NkEyMVx1NTc1N1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9XHJcbn0pXHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxrZWNoZW5cXFxca2VjaGVuLXZpZGVvLWNoYXRcXFxcc2NyaXB0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXGtlY2hlblxcXFxrZWNoZW4tdmlkZW8tY2hhdFxcXFxzY3JpcHRcXFxcaWNvbmZvbnQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3Byb2plY3Qva2VjaGVuL2tlY2hlbi12aWRlby1jaGF0L3NjcmlwdC9pY29uZm9udC50c1wiO2ltcG9ydCBmcyBmcm9tICdub2RlOmZzJztcclxuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJztcclxuXHJcbmltcG9ydCBjaG9raWRhciBmcm9tICdjaG9raWRhcic7XHJcbmltcG9ydCBlanMgZnJvbSAnZWpzJztcclxuXHJcbnR5cGUgRGVib3VuY2VGdW5jdGlvbiA9IDxUIGV4dGVuZHMgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk+KFxyXG4gIGZ1bmM6IFQsXHJcbiAgZGVsYXk/OiBudW1iZXJcclxuKSA9PiAoLi4uYXJnczogUGFyYW1ldGVyczxUPikgPT4gdm9pZDtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWJvdW5jZTogRGVib3VuY2VGdW5jdGlvbiA9IChmdW5jLCBkZWxheSA9IDEwMDApID0+IHtcclxuICBsZXQgdGltZXI6IE5vZGVKUy5UaW1lb3V0O1xyXG5cclxuICByZXR1cm4gYXN5bmMgKC4uLmFyZ3MpID0+IHtcclxuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcclxuICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICBhd2FpdCBmdW5jKC4uLmFyZ3MpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSwgZGVsYXkpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxufTtcclxuXHJcbmNvbnN0IHNvdXJjZURpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdfX2ljb25mb250Jyk7XHJcbmNvbnN0IHRhcmdldERpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9zcmMvY29tcG9uZW50cy9pY29uLWZvbnQvJyk7XHJcblxyXG5jb25zdCBpZ25vcmVkID0gW1xyXG4gIC9cXC9zcmNcXC9pY29uZm9udFxcL2RlbW9faW5kZXhcXC5odG1sJC8sXHJcbiAgL1xcL3NyY1xcL2ljb25mb250XFwvZGVtb1xcLmNzcyQvLFxyXG4gIC9cXC9zcmNcXC9pY29uZm9udFxcL2ljb25mb250XFwuanMkLyxcclxuICAvXFwvc3JjXFwvaWNvbmZvbnRcXC9pY29uZm9udFxcLmpzb24kLyxcclxuICAvXFwvc3JjXFwvaWNvbmZvbnRcXC9pY29uZm9udFxcLnR0ZiQvLFxyXG4gIC9cXC9zcmNcXC9pY29uZm9udFxcL2ljb25mb250XFwud29mZiQvLFxyXG4gIC9cXC9zcmNcXC9pY29uZm9udFxcL2ljb25mb250XFwud29mZjIkLyxcclxuXTtcclxuXHJcbmZ1bmN0aW9uIGNvcHlGaWxlKHNvdXJjZUZpbGU6IHN0cmluZywgdGFyZ2V0RmlsZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgLy8gXHU2OEMwXHU2N0U1XHU2RTkwXHU2NTg3XHU0RUY2XHU2NjJGXHU1NDI2XHU1QjU4XHU1NzI4XHJcbiAgaWYgKCFmcy5leGlzdHNTeW5jKHNvdXJjZUZpbGUpKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNvdXJjZSBmaWxlIFwiJHtzb3VyY2VGaWxlfVwiIGRvZXMgbm90IGV4aXN0LmApO1xyXG4gIH1cclxuXHJcbiAgLy8gXHU4QkZCXHU1M0Q2XHU2RTkwXHU2NTg3XHU0RUY2XHU1MTg1XHU1QkI5IChcdTRGNUNcdTRFM0FCdWZmZXJcdTU5MDRcdTc0MDZcdTRFOENcdThGREJcdTUyMzZcdTY1ODdcdTRFRjYpXHJcbiAgY29uc3QgZmlsZUNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlRmlsZSk7XHJcblxyXG4gIC8vIFx1NTE5OVx1NTE2NVx1NzZFRVx1NjgwN1x1NjU4N1x1NEVGNiAoQnVmZmVyXHU2NjJGVWludDhBcnJheVx1NzY4NFx1NUI1MFx1N0M3Qlx1RkYwQ1x1NkVFMVx1OERCM0FycmF5QnVmZmVyVmlld1x1ODk4MVx1NkM0MilcclxuICBmcy53cml0ZUZpbGVTeW5jKHRhcmdldEZpbGUsIGZpbGVDb250ZW50IGFzIHVua25vd24gYXMgVWludDhBcnJheSk7XHJcbn1cclxuXHJcbmNvbnN0IGNzc0RlbGltaXRlciA9IFtcclxuICAnLyogWycsXHJcbiAgJ10gKi8nLFxyXG5dIGFzIFtzdHJpbmcsIHN0cmluZ107XHJcblxyXG5jb25zdCBqc0RlbGltaXRlciA9IFtcclxuICAnXFwnLyogWycsXHJcbiAgJ10gKi9cXCcnLFxyXG5dIGFzIFtzdHJpbmcsIHN0cmluZ107XHJcblxyXG5mdW5jdGlvbiBnZXRFanNEYXRhKCkge1xyXG4gIGNvbnN0IGNzcyA9IGZzLnJlYWRGaWxlU3luYyhcclxuICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdfX2ljb25mb250JywgJ2ljb25mb250LmNzcycpLFxyXG4gICAgJ3V0Zi04JyxcclxuICApO1xyXG4gIGNvbnN0IGluZGV4ID0gY3NzLmluZGV4T2YoJy5pY29uLScpO1xyXG4gIGNvbnN0IGNvbnRlbnQgPSBjc3Muc2xpY2UoaW5kZXgsIGNzcy5sZW5ndGggLSAxKS5yZXBsYWNlKC9cXHI/XFxuKiQvLCAnJyk7XHJcbiAgLy8gdHlwZXNcclxuICBjb25zdCBqc29uID0gZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdfX2ljb25mb250JywgJ2ljb25mb250Lmpzb24nKSkudG9TdHJpbmcoKTtcclxuICBjb25zdCB0eXBlc09iamVjdCA9IChKU09OLnBhcnNlKGpzb24pLmdseXBocyBhcyB7IGZvbnRfY2xhc3M6IHN0cmluZyB9W10pLm1hcChlID0+IGAnJHtlLmZvbnRfY2xhc3N9J2ApLnNvcnQoKTtcclxuICBjb25zdCB0eXBlcyA9IHR5cGVzT2JqZWN0LmpvaW4oJyB8XFxuJykucmVwbGFjZSgvXFxyP1xcbiokLywgJycpO1xyXG4gIGNvbnN0IGVqc0RhdGEgPSB7XHJcbiAgICBjb250ZW50LFxyXG4gICAgdHlwZXMsXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIGVqc0RhdGE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRlbXBsYXRlRGF0YSh0ZW1wbGF0ZU5hbWU6IHN0cmluZywgW29wZW5EZWxpbWl0ZXIsIGNsb3NlRGVsaW1pdGVyXTogW3N0cmluZywgc3RyaW5nXSA9IGNzc0RlbGltaXRlcikge1xyXG4gIGNvbnN0IGVqc0RhdGEgPSBnZXRFanNEYXRhKCk7XHJcbiAgY29uc3QgX3RlbXBsYXRlUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL19fdGVtcGxhdGUnLCB0ZW1wbGF0ZU5hbWUpO1xyXG4gIGNvbnN0IHNvdXJjZSA9IGZzLnJlYWRGaWxlU3luYyhfdGVtcGxhdGVQYXRoKS50b1N0cmluZygpO1xyXG4gIGNvbnN0IHRlbXBsYXRlID0gZWpzLmNvbXBpbGUoc291cmNlLCB7XHJcbiAgICBvcGVuRGVsaW1pdGVyLFxyXG4gICAgY2xvc2VEZWxpbWl0ZXIsXHJcbiAgfSk7XHJcbiAgcmV0dXJuIHRlbXBsYXRlKGVqc0RhdGEpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBjb3B5KCkge1xyXG4gIHRyeSB7XHJcbiAgICAvLyBmb250c1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhcclxuICAgICAgcGF0aC5yZXNvbHZlKHRhcmdldERpciwgJ2ljb25mb250LmNzcycpLFxyXG4gICAgICBnZXRUZW1wbGF0ZURhdGEoJ2ljb25mb250LmNzcycpLFxyXG4gICAgICAndXRmLTgnLFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyB0eXBlc1xyXG4gICAgZnMud3JpdGVGaWxlU3luYyhcclxuICAgICAgcGF0aC5yZXNvbHZlKHRhcmdldERpciwgJ2ljb25mb250LnRzJyksXHJcbiAgICAgIGdldFRlbXBsYXRlRGF0YSgnaWNvbmZvbnQudHMnLCBqc0RlbGltaXRlciksXHJcbiAgICApO1xyXG5cclxuICAgIC8vIC8vIFx1NUI1N1x1NEY1M1xyXG5cclxuICAgIGF3YWl0IGNvcHlGaWxlKFxyXG4gICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnX19pY29uZm9udCcsICdpY29uZm9udC5qcycpLFxyXG4gICAgICBwYXRoLnJlc29sdmUodGFyZ2V0RGlyLCAnaWNvbmZvbnQuanMnKSxcclxuICAgICk7XHJcbiAgfVxyXG4gIGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihgJHtlcnJvcn1gKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZWRJY29ucyhpc0J1aWxkOiBib29sZWFuKSB7XHJcbiAgaWYgKGlzQnVpbGQpXHJcbiAgICByZXR1cm47XHJcbiAgY29uc29sZS5sb2coJ2dlbmVyYXRlZEljb25zJyk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZXIgPSBkZWJvdW5jZShjb3B5KTtcclxuXHJcbiAgY29uc3Qgd2F0Y2hlciA9IGNob2tpZGFyLndhdGNoKHNvdXJjZURpciwge1xyXG4gICAgaWdub3JlZCxcclxuICB9KTtcclxuXHJcbiAgd2F0Y2hlci5vbignYWxsJywgYXN5bmMgKHR5cGUpID0+IHtcclxuICAgIGlmICh0eXBlICE9PSAnYWRkRGlyJyAmJiB0eXBlICE9PSAndW5saW5rJyAmJiB0eXBlICE9PSAndW5saW5rRGlyJylcclxuICAgICAgaGFuZGxlcigpO1xyXG4gIH0pO1xyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVMsU0FBUyxlQUFlLFdBQVc7QUFFdFUsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFdBQVc7QUFDbEIsU0FBUyxxQkFBcUIsdUJBQXVCO0FBRXJELE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8saUJBQWlCOzs7QUNaNFIsT0FBTyxRQUFRO0FBQ25VLE9BQU8sVUFBVTtBQUVqQixPQUFPLGNBQWM7QUFDckIsT0FBTyxTQUFTO0FBSmhCLElBQU0sbUNBQW1DO0FBV2xDLElBQU0sV0FBNkIsQ0FBQyxNQUFNLFFBQVEsUUFBUztBQUNoRSxNQUFJO0FBRUosU0FBTyxVQUFVLFNBQVM7QUFDeEIsaUJBQWEsS0FBSztBQUNsQixXQUFPLElBQUksUUFBYyxDQUFDLFlBQVk7QUFDcEMsY0FBUSxXQUFXLFlBQVk7QUFDN0IsY0FBTSxLQUFLLEdBQUcsSUFBSTtBQUNsQixnQkFBUTtBQUFBLE1BQ1YsR0FBRyxLQUFLO0FBQUEsSUFDVixDQUFDO0FBQUEsRUFDSDtBQUNGO0FBRUEsSUFBTSxZQUFZLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQ3RELElBQU0sWUFBWSxLQUFLLFFBQVEsa0NBQVcsOEJBQThCO0FBRXhFLElBQU0sVUFBVTtBQUFBLEVBQ2Q7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRjtBQUVBLFNBQVMsU0FBUyxZQUFvQixZQUEwQjtBQUU5RCxNQUFJLENBQUMsR0FBRyxXQUFXLFVBQVUsR0FBRztBQUM5QixVQUFNLElBQUksTUFBTSxnQkFBZ0IsVUFBVSxtQkFBbUI7QUFBQSxFQUMvRDtBQUdBLFFBQU0sY0FBYyxHQUFHLGFBQWEsVUFBVTtBQUc5QyxLQUFHLGNBQWMsWUFBWSxXQUFvQztBQUNuRTtBQUVBLElBQU0sZUFBZTtBQUFBLEVBQ25CO0FBQUEsRUFDQTtBQUNGO0FBRUEsSUFBTSxjQUFjO0FBQUEsRUFDbEI7QUFBQSxFQUNBO0FBQ0Y7QUFFQSxTQUFTLGFBQWE7QUFDcEIsUUFBTSxNQUFNLEdBQUc7QUFBQSxJQUNiLEtBQUssUUFBUSxrQ0FBVyxjQUFjLGNBQWM7QUFBQSxJQUNwRDtBQUFBLEVBQ0Y7QUFDQSxRQUFNLFFBQVEsSUFBSSxRQUFRLFFBQVE7QUFDbEMsUUFBTSxVQUFVLElBQUksTUFBTSxPQUFPLElBQUksU0FBUyxDQUFDLEVBQUUsUUFBUSxXQUFXLEVBQUU7QUFFdEUsUUFBTSxPQUFPLEdBQUcsYUFBYSxLQUFLLFFBQVEsa0NBQVcsY0FBYyxlQUFlLENBQUMsRUFBRSxTQUFTO0FBQzlGLFFBQU0sY0FBZSxLQUFLLE1BQU0sSUFBSSxFQUFFLE9BQW9DLElBQUksT0FBSyxJQUFJLEVBQUUsVUFBVSxHQUFHLEVBQUUsS0FBSztBQUM3RyxRQUFNLFFBQVEsWUFBWSxLQUFLLE1BQU0sRUFBRSxRQUFRLFdBQVcsRUFBRTtBQUM1RCxRQUFNLFVBQVU7QUFBQSxJQUNkO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFFQSxTQUFPO0FBQ1Q7QUFFQSxTQUFTLGdCQUFnQixjQUFzQixDQUFDLGVBQWUsY0FBYyxJQUFzQixjQUFjO0FBQy9HLFFBQU0sVUFBVSxXQUFXO0FBQzNCLFFBQU0sZ0JBQWdCLEtBQUssUUFBUSxrQ0FBVyxnQkFBZ0IsWUFBWTtBQUMxRSxRQUFNLFNBQVMsR0FBRyxhQUFhLGFBQWEsRUFBRSxTQUFTO0FBQ3ZELFFBQU0sV0FBVyxJQUFJLFFBQVEsUUFBUTtBQUFBLElBQ25DO0FBQUEsSUFDQTtBQUFBLEVBQ0YsQ0FBQztBQUNELFNBQU8sU0FBUyxPQUFPO0FBQ3pCO0FBRUEsZUFBZSxPQUFPO0FBQ3BCLE1BQUk7QUFFRixPQUFHO0FBQUEsTUFDRCxLQUFLLFFBQVEsV0FBVyxjQUFjO0FBQUEsTUFDdEMsZ0JBQWdCLGNBQWM7QUFBQSxNQUM5QjtBQUFBLElBQ0Y7QUFHQSxPQUFHO0FBQUEsTUFDRCxLQUFLLFFBQVEsV0FBVyxhQUFhO0FBQUEsTUFDckMsZ0JBQWdCLGVBQWUsV0FBVztBQUFBLElBQzVDO0FBSUEsVUFBTTtBQUFBLE1BQ0osS0FBSyxRQUFRLGtDQUFXLGNBQWMsYUFBYTtBQUFBLE1BQ25ELEtBQUssUUFBUSxXQUFXLGFBQWE7QUFBQSxJQUN2QztBQUFBLEVBQ0YsU0FDTyxPQUFPO0FBQ1osWUFBUSxNQUFNLEdBQUcsS0FBSyxFQUFFO0FBQUEsRUFDMUI7QUFDRjtBQUVPLFNBQVMsZUFBZSxTQUFrQjtBQUMvQyxNQUFJO0FBQ0Y7QUFDRixVQUFRLElBQUksZ0JBQWdCO0FBRTVCLFFBQU0sVUFBVSxTQUFTLElBQUk7QUFFN0IsUUFBTSxVQUFVLFNBQVMsTUFBTSxXQUFXO0FBQUEsSUFDeEM7QUFBQSxFQUNGLENBQUM7QUFFRCxVQUFRLEdBQUcsT0FBTyxPQUFPLFNBQVM7QUFDaEMsUUFBSSxTQUFTLFlBQVksU0FBUyxZQUFZLFNBQVM7QUFDckQsY0FBUTtBQUFBLEVBQ1osQ0FBQztBQUNIOzs7QURySXFMLElBQU0sMkNBQTJDO0FBZXRPLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQU07QUFDakQsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFFBQU0sVUFBVSxZQUFZO0FBRTVCLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNOLFNBQVMsU0FBUztBQUFBLE1BQ2xCLFVBQVUsU0FBUztBQUFBLE1BQ25CLGVBQWUsSUFBSSxJQUFJLGNBQWM7QUFBQSxNQUNyQyxhQUFhLElBQUksSUFBSSxZQUFZO0FBQUEsTUFDakMsZ0JBQWdCLElBQUksSUFBSSxZQUFZO0FBQUEsSUFDdEM7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsTUFDdEQ7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFNaEIsS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osZUFBZSxPQUFPO0FBQUEsTUFFdEIsWUFBWTtBQUFBLE1BQ1osT0FBTztBQUFBLE1BQ1AsWUFBWTtBQUFBLE1BQ1osV0FBVztBQUFBLFFBQ1QsU0FBUyxDQUFDLE9BQU8sY0FBYyxPQUFPO0FBQUEsUUFDdEMsS0FBSztBQUFBO0FBQUEsUUFDTCxNQUFNLENBQUMsZUFBZSxlQUFlLGNBQWM7QUFBQTtBQUFBLFFBQ25ELFVBQVU7QUFBQSxVQUNSLFNBQVM7QUFBQTtBQUFBLFVBQ1QsVUFBVTtBQUFBO0FBQUEsVUFDVixrQkFBa0I7QUFBQTtBQUFBLFFBQ3BCO0FBQUEsUUFDQSxXQUFXO0FBQUEsVUFDVCxvQkFBb0IsRUFBRSxhQUFhLE9BQU8sQ0FBQztBQUFBO0FBQUEsVUFFM0MsY0FBYztBQUFBLFlBQ1osUUFBUTtBQUFBLFVBQ1YsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULE1BQU0sQ0FBQyxrQkFBa0I7QUFBQSxRQUN6QixLQUFLO0FBQUE7QUFBQSxRQUNMLFdBQVc7QUFBQTtBQUFBLFVBRVQsY0FBYztBQUFBLFlBQ1osUUFBUTtBQUFBLFVBQ1YsQ0FBQztBQUFBLFVBQ0Qsb0JBQW9CLEVBQUUsYUFBYSxPQUFPLENBQUM7QUFBQSxVQUMzQyxnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsTUFBTTtBQUFBLFFBQ0osYUFBYTtBQUFBLE1BQ2YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUVBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFFQSxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixVQUFVLENBQUMsSUFBSTtBQUFBO0FBQUEsTUFDakI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
