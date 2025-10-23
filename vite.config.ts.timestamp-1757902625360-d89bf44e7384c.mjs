// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/@tailwindcss+vite@4.1.11_vi_a6b616c6a4c569500b70d9d80794a129/node_modules/@tailwindcss/vite/dist/index.mjs";
import vue from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_15e944e1f64a35a22152bc17488423e6/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.2._ec508d6bd8dd71843e8cfdaeffa9a60d/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import AutoImport from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/unplugin-auto-import@0.18.6_77c383ebb7230e0dadfef4a272c02e11/node_modules/unplugin-auto-import/dist/vite.js";
import IconsResolver from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/unplugin-icons@0.20.2_@vue+compiler-sfc@3.5.17/node_modules/unplugin-icons/dist/resolver.js";
import Icons from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/unplugin-icons@0.20.2_@vue+compiler-sfc@3.5.17/node_modules/unplugin-icons/dist/vite.js";
import { ElementPlusResolver, NaiveUiResolver } from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/unplugin-vue-components@0.2_7f300d82db9355c8089459e884173274/node_modules/unplugin-vue-components/dist/resolvers.js";
import Components from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/unplugin-vue-components@0.2_7f300d82db9355c8089459e884173274/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig, loadEnv } from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/vite@5.4.19_@types+node@20._d2e0a39a5ed366d19c496d05bc07decc/node_modules/vite/dist/node/index.js";
import vueDevTools from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/vite-plugin-vue-devtools@7._4828be0034d8e1a99327169ed6b6117a/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";

// script/iconfont.ts
import fs from "node:fs";
import path from "node:path";
import chokidar from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/chokidar@4.0.3/node_modules/chokidar/esm/index.js";
import ejs from "file:///D:/project/kechen/kechen-software-pc/node_modules/.pnpm/ejs@3.1.10/node_modules/ejs/lib/ejs.js";
var __vite_injected_original_dirname = "D:\\project\\kechen\\kechen-software-pc\\script";
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
var __vite_injected_original_import_meta_url = "file:///D:/project/kechen/kechen-software-pc/vite.config.ts";
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isBuild = command === "build";
  return {
    define: {
      __DEV__: mode === "development",
      __PROD__: mode === "production",
      __APP_TITLE__: `"${env.VITE_APP_TITLE}"`,
      __API_URL__: `"${env.VITE_API_URL}"`
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
          @use "@/styles/element/index.scss" as *;
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0L2ljb25mb250LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxrZWNoZW5cXFxca2VjaGVuLXNvZnR3YXJlLXBjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXGtlY2hlblxcXFxrZWNoZW4tc29mdHdhcmUtcGNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3Byb2plY3Qva2VjaGVuL2tlY2hlbi1zb2Z0d2FyZS1wYy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5cclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gJ0B0YWlsd2luZGNzcy92aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcclxuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnXHJcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIsIE5haXZlVWlSZXNvbHZlciB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXHJcbmltcG9ydCB7IGdlbmVyYXRlZEljb25zIH0gZnJvbSAnLi9zY3JpcHQvaWNvbmZvbnQnXHJcbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XHJcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJylcclxuICBjb25zdCBpc0J1aWxkID0gY29tbWFuZCA9PT0gJ2J1aWxkJ1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZGVmaW5lOiB7XHJcbiAgICAgIF9fREVWX186IG1vZGUgPT09ICdkZXZlbG9wbWVudCcsXHJcbiAgICAgIF9fUFJPRF9fOiBtb2RlID09PSAncHJvZHVjdGlvbicsXHJcbiAgICAgIF9fQVBQX1RJVExFX186IGBcIiR7ZW52LlZJVEVfQVBQX1RJVExFfVwiYCxcclxuICAgICAgX19BUElfVVJMX186IGBcIiR7ZW52LlZJVEVfQVBJX1VSTH1cImAsXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGNzczoge1xyXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcclxuICAgICAgICAgIEB1c2UgXCJAL3N0eWxlcy9nbG9iYWwuc2Nzc1wiIGFzIGdsb2JhbDtcclxuICAgICAgICAgIEB1c2UgXCJAL3N0eWxlcy9lbGVtZW50L2luZGV4LnNjc3NcIiBhcyAqO1xyXG4gICAgICAgICAgYCxcclxuICAgICAgICAgIGFwaTogJ21vZGVybicsXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSgpLFxyXG4gICAgICBnZW5lcmF0ZWRJY29ucyhpc0J1aWxkKSxcclxuXHJcbiAgICAgIHRhaWx3aW5kY3NzKCksXHJcbiAgICAgIHZ1ZUpzeCgpLFxyXG4gICAgICB2dWVEZXZUb29scygpLFxyXG4gICAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgICBpbXBvcnRzOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3BpbmlhJ10sXHJcbiAgICAgICAgZHRzOiAnLi90eXBlcy9hdXRvLWltcG9ydHMuZC50cycsIC8vIFx1NjMwN1x1NUI5QVx1NzUxRlx1NjIxMFx1NzY4NFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NThGMFx1NjYwRVx1NjU4N1x1NEVGNlx1NzY4NFx1OERFRlx1NUY4NFxyXG4gICAgICAgIGRpcnM6IFsnLi9zcmMvaG9va3MnLCAnLi9zcmMvdXRpbHMnLCAnLi9zcmMvc3RvcmVzJ10sIC8vIFx1NTQ0QVx1OEJDOUF1dG9JbXBvcnRcdTYzRDJcdTRFRjZcdTU3MjhcdTU0RUFcdTRFOUJcdTc2RUVcdTVGNTVcdTRFMkRcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTZBMjFcdTU3NTdcdTMwMDJcdTYzRDJcdTRFRjZcdTRGMUFcdTYyNkJcdTYzQ0ZcdThGRDlcdTRFOUJcdTc2RUVcdTVGNTVcdTRFMkRcdTc2ODRcdTY1ODdcdTRFRjZcdUZGMENcdTVFNzZcdTY4MzlcdTYzNkVcdTY1ODdcdTRFRjZcdTUxODVcdTVCQjlcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTVCRkNcdTUxNjVcdThCRURcdTUzRTVcdTMwMDJcclxuICAgICAgICBlc2xpbnRyYzoge1xyXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSwgLy8gXHU3NTFGXHU2MjEwIEVTTGludCBcdTkxNERcdTdGNkVcdUZGMENcdTkwN0ZcdTUxNEQgaW1wb3J0IFx1NjJBNVx1OTUxOVxyXG4gICAgICAgICAgZmlsZXBhdGg6ICcuLy5lc2xpbnRyYy1hdXRvLWltcG9ydC5qc29uJywgLy8gRGVmYXVsdCBgLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbmBcclxuICAgICAgICAgIGdsb2JhbHNQcm9wVmFsdWU6IHRydWUsIC8vIFx1ODFFQVx1NTJBOFx1OEJCRVx1N0Y2RVx1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKHsgaW1wb3J0U3R5bGU6ICdzYXNzJyB9KSxcclxuICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxyXG4gICAgICAgICAgSWNvbnNSZXNvbHZlcih7XHJcbiAgICAgICAgICAgIHByZWZpeDogJ0ljb24nLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgXSxcclxuICAgICAgfSksXHJcbiAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgIGRpcnM6IFsnLi9zcmMvY29tcG9uZW50cyddLFxyXG4gICAgICAgIGR0czogJy4vdHlwZXMvY29tcG9uZW50cy5kLnRzJywgLy8gXHU2MzA3XHU1QjlBXHU3NTFGXHU2MjEwXHU3Njg0XHU3RUM0XHU0RUY2XHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XHU3Njg0XHU4REVGXHU1Rjg0XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTZDRThcdTUxOENcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcclxuICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICBwcmVmaXg6ICdJY29uJyxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcih7IGltcG9ydFN0eWxlOiAnc2FzcycgfSksXHJcbiAgICAgICAgICBOYWl2ZVVpUmVzb2x2ZXIoKSxcclxuICAgICAgICBdLFxyXG4gICAgICB9KSxcclxuICAgICAgSWNvbnMoe1xyXG4gICAgICAgIGF1dG9JbnN0YWxsOiB0cnVlLFxyXG4gICAgICB9KSxcclxuICAgIF0sXHJcblxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcclxuICAgICAgb3BlbjogZmFsc2UsXHJcbiAgICAgIHBvcnQ6IDgwOTAsXHJcbiAgICB9LFxyXG5cclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICBleHRlcm5hbDogWydmcyddLCAvLyBcdTc4NkVcdTRGRERcdTRFMERcdTYyNTNcdTUzMDUgTm9kZS5qcyBcdTZBMjFcdTU3NTdcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfVxyXG59KVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXHByb2plY3RcXFxca2VjaGVuXFxcXGtlY2hlbi1zb2Z0d2FyZS1wY1xcXFxzY3JpcHRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RcXFxca2VjaGVuXFxcXGtlY2hlbi1zb2Z0d2FyZS1wY1xcXFxzY3JpcHRcXFxcaWNvbmZvbnQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3Byb2plY3Qva2VjaGVuL2tlY2hlbi1zb2Z0d2FyZS1wYy9zY3JpcHQvaWNvbmZvbnQudHNcIjtpbXBvcnQgZnMgZnJvbSAnbm9kZTpmcyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XHJcblxyXG5pbXBvcnQgY2hva2lkYXIgZnJvbSAnY2hva2lkYXInO1xyXG5pbXBvcnQgZWpzIGZyb20gJ2Vqcyc7XHJcblxyXG50eXBlIERlYm91bmNlRnVuY3Rpb24gPSA8VCBleHRlbmRzICguLi5hcmdzOiBhbnlbXSkgPT4gYW55PihcclxuICBmdW5jOiBULFxyXG4gIGRlbGF5PzogbnVtYmVyXHJcbikgPT4gKC4uLmFyZ3M6IFBhcmFtZXRlcnM8VD4pID0+IHZvaWQ7XHJcblxyXG5leHBvcnQgY29uc3QgZGVib3VuY2U6IERlYm91bmNlRnVuY3Rpb24gPSAoZnVuYywgZGVsYXkgPSAxMDAwKSA9PiB7XHJcbiAgbGV0IHRpbWVyOiBOb2RlSlMuVGltZW91dDtcclxuXHJcbiAgcmV0dXJuIGFzeW5jICguLi5hcmdzKSA9PiB7XHJcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XHJcbiAgICAgIHRpbWVyID0gc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgYXdhaXQgZnVuYyguLi5hcmdzKTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0sIGRlbGF5KTtcclxuICAgIH0pO1xyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBzb3VyY2VEaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnX19pY29uZm9udCcpO1xyXG5jb25zdCB0YXJnZXREaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vc3JjL2NvbXBvbmVudHMvaWNvbi1mb250LycpO1xyXG5cclxuY29uc3QgaWdub3JlZCA9IFtcclxuICAvXFwvc3JjXFwvaWNvbmZvbnRcXC9kZW1vX2luZGV4XFwuaHRtbCQvLFxyXG4gIC9cXC9zcmNcXC9pY29uZm9udFxcL2RlbW9cXC5jc3MkLyxcclxuICAvXFwvc3JjXFwvaWNvbmZvbnRcXC9pY29uZm9udFxcLmpzJC8sXHJcbiAgL1xcL3NyY1xcL2ljb25mb250XFwvaWNvbmZvbnRcXC5qc29uJC8sXHJcbiAgL1xcL3NyY1xcL2ljb25mb250XFwvaWNvbmZvbnRcXC50dGYkLyxcclxuICAvXFwvc3JjXFwvaWNvbmZvbnRcXC9pY29uZm9udFxcLndvZmYkLyxcclxuICAvXFwvc3JjXFwvaWNvbmZvbnRcXC9pY29uZm9udFxcLndvZmYyJC8sXHJcbl07XHJcblxyXG5mdW5jdGlvbiBjb3B5RmlsZShzb3VyY2VGaWxlOiBzdHJpbmcsIHRhcmdldEZpbGU6IHN0cmluZyk6IHZvaWQge1xyXG4gIC8vIFx1NjhDMFx1NjdFNVx1NkU5MFx1NjU4N1x1NEVGNlx1NjYyRlx1NTQyNlx1NUI1OFx1NTcyOFxyXG4gIGlmICghZnMuZXhpc3RzU3luYyhzb3VyY2VGaWxlKSkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKGBTb3VyY2UgZmlsZSBcIiR7c291cmNlRmlsZX1cIiBkb2VzIG5vdCBleGlzdC5gKTtcclxuICB9XHJcblxyXG4gIC8vIFx1OEJGQlx1NTNENlx1NkU5MFx1NjU4N1x1NEVGNlx1NTE4NVx1NUJCOSAoXHU0RjVDXHU0RTNBQnVmZmVyXHU1OTA0XHU3NDA2XHU0RThDXHU4RkRCXHU1MjM2XHU2NTg3XHU0RUY2KVxyXG4gIGNvbnN0IGZpbGVDb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZUZpbGUpO1xyXG5cclxuICAvLyBcdTUxOTlcdTUxNjVcdTc2RUVcdTY4MDdcdTY1ODdcdTRFRjYgKEJ1ZmZlclx1NjYyRlVpbnQ4QXJyYXlcdTc2ODRcdTVCNTBcdTdDN0JcdUZGMENcdTZFRTFcdThEQjNBcnJheUJ1ZmZlclZpZXdcdTg5ODFcdTZDNDIpXHJcbiAgZnMud3JpdGVGaWxlU3luYyh0YXJnZXRGaWxlLCBmaWxlQ29udGVudCBhcyB1bmtub3duIGFzIFVpbnQ4QXJyYXkpO1xyXG59XHJcblxyXG5jb25zdCBjc3NEZWxpbWl0ZXIgPSBbXHJcbiAgJy8qIFsnLFxyXG4gICddICovJyxcclxuXSBhcyBbc3RyaW5nLCBzdHJpbmddO1xyXG5cclxuY29uc3QganNEZWxpbWl0ZXIgPSBbXHJcbiAgJ1xcJy8qIFsnLFxyXG4gICddICovXFwnJyxcclxuXSBhcyBbc3RyaW5nLCBzdHJpbmddO1xyXG5cclxuZnVuY3Rpb24gZ2V0RWpzRGF0YSgpIHtcclxuICBjb25zdCBjc3MgPSBmcy5yZWFkRmlsZVN5bmMoXHJcbiAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnX19pY29uZm9udCcsICdpY29uZm9udC5jc3MnKSxcclxuICAgICd1dGYtOCcsXHJcbiAgKTtcclxuICBjb25zdCBpbmRleCA9IGNzcy5pbmRleE9mKCcuaWNvbi0nKTtcclxuICBjb25zdCBjb250ZW50ID0gY3NzLnNsaWNlKGluZGV4LCBjc3MubGVuZ3RoIC0gMSkucmVwbGFjZSgvXFxyP1xcbiokLywgJycpO1xyXG4gIC8vIHR5cGVzXHJcbiAgY29uc3QganNvbiA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnX19pY29uZm9udCcsICdpY29uZm9udC5qc29uJykpLnRvU3RyaW5nKCk7XHJcbiAgY29uc3QgdHlwZXNPYmplY3QgPSAoSlNPTi5wYXJzZShqc29uKS5nbHlwaHMgYXMgeyBmb250X2NsYXNzOiBzdHJpbmcgfVtdKS5tYXAoZSA9PiBgJyR7ZS5mb250X2NsYXNzfSdgKS5zb3J0KCk7XHJcbiAgY29uc3QgdHlwZXMgPSB0eXBlc09iamVjdC5qb2luKCcgfFxcbicpLnJlcGxhY2UoL1xccj9cXG4qJC8sICcnKTtcclxuICBjb25zdCBlanNEYXRhID0ge1xyXG4gICAgY29udGVudCxcclxuICAgIHR5cGVzLFxyXG4gIH07XHJcblxyXG4gIHJldHVybiBlanNEYXRhO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUZW1wbGF0ZURhdGEodGVtcGxhdGVOYW1lOiBzdHJpbmcsIFtvcGVuRGVsaW1pdGVyLCBjbG9zZURlbGltaXRlcl06IFtzdHJpbmcsIHN0cmluZ10gPSBjc3NEZWxpbWl0ZXIpIHtcclxuICBjb25zdCBlanNEYXRhID0gZ2V0RWpzRGF0YSgpO1xyXG4gIGNvbnN0IF90ZW1wbGF0ZVBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9fX3RlbXBsYXRlJywgdGVtcGxhdGVOYW1lKTtcclxuICBjb25zdCBzb3VyY2UgPSBmcy5yZWFkRmlsZVN5bmMoX3RlbXBsYXRlUGF0aCkudG9TdHJpbmcoKTtcclxuICBjb25zdCB0ZW1wbGF0ZSA9IGVqcy5jb21waWxlKHNvdXJjZSwge1xyXG4gICAgb3BlbkRlbGltaXRlcixcclxuICAgIGNsb3NlRGVsaW1pdGVyLFxyXG4gIH0pO1xyXG4gIHJldHVybiB0ZW1wbGF0ZShlanNEYXRhKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29weSgpIHtcclxuICB0cnkge1xyXG4gICAgLy8gZm9udHNcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoXHJcbiAgICAgIHBhdGgucmVzb2x2ZSh0YXJnZXREaXIsICdpY29uZm9udC5jc3MnKSxcclxuICAgICAgZ2V0VGVtcGxhdGVEYXRhKCdpY29uZm9udC5jc3MnKSxcclxuICAgICAgJ3V0Zi04JyxcclxuICAgICk7XHJcblxyXG4gICAgLy8gdHlwZXNcclxuICAgIGZzLndyaXRlRmlsZVN5bmMoXHJcbiAgICAgIHBhdGgucmVzb2x2ZSh0YXJnZXREaXIsICdpY29uZm9udC50cycpLFxyXG4gICAgICBnZXRUZW1wbGF0ZURhdGEoJ2ljb25mb250LnRzJywganNEZWxpbWl0ZXIpLFxyXG4gICAgKTtcclxuXHJcbiAgICAvLyAvLyBcdTVCNTdcdTRGNTNcclxuXHJcbiAgICBhd2FpdCBjb3B5RmlsZShcclxuICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ19faWNvbmZvbnQnLCAnaWNvbmZvbnQuanMnKSxcclxuICAgICAgcGF0aC5yZXNvbHZlKHRhcmdldERpciwgJ2ljb25mb250LmpzJyksXHJcbiAgICApO1xyXG4gIH1cclxuICBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoYCR7ZXJyb3J9YCk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVkSWNvbnMoaXNCdWlsZDogYm9vbGVhbikge1xyXG4gIGlmIChpc0J1aWxkKVxyXG4gICAgcmV0dXJuO1xyXG4gIGNvbnNvbGUubG9nKCdnZW5lcmF0ZWRJY29ucycpO1xyXG5cclxuICBjb25zdCBoYW5kbGVyID0gZGVib3VuY2UoY29weSk7XHJcblxyXG4gIGNvbnN0IHdhdGNoZXIgPSBjaG9raWRhci53YXRjaChzb3VyY2VEaXIsIHtcclxuICAgIGlnbm9yZWQsXHJcbiAgfSk7XHJcblxyXG4gIHdhdGNoZXIub24oJ2FsbCcsIGFzeW5jICh0eXBlKSA9PiB7XHJcbiAgICBpZiAodHlwZSAhPT0gJ2FkZERpcicgJiYgdHlwZSAhPT0gJ3VubGluaycgJiYgdHlwZSAhPT0gJ3VubGlua0RpcicpXHJcbiAgICAgIGhhbmRsZXIoKTtcclxuICB9KTtcclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNTLFNBQVMsZUFBZSxXQUFXO0FBRXpVLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMscUJBQXFCLHVCQUF1QjtBQUVyRCxPQUFPLGdCQUFnQjtBQUN2QixTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLGlCQUFpQjs7O0FDWitSLE9BQU8sUUFBUTtBQUN0VSxPQUFPLFVBQVU7QUFFakIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sU0FBUztBQUpoQixJQUFNLG1DQUFtQztBQVdsQyxJQUFNLFdBQTZCLENBQUMsTUFBTSxRQUFRLFFBQVM7QUFDaEUsTUFBSTtBQUVKLFNBQU8sVUFBVSxTQUFTO0FBQ3hCLGlCQUFhLEtBQUs7QUFDbEIsV0FBTyxJQUFJLFFBQWMsQ0FBQyxZQUFZO0FBQ3BDLGNBQVEsV0FBVyxZQUFZO0FBQzdCLGNBQU0sS0FBSyxHQUFHLElBQUk7QUFDbEIsZ0JBQVE7QUFBQSxNQUNWLEdBQUcsS0FBSztBQUFBLElBQ1YsQ0FBQztBQUFBLEVBQ0g7QUFDRjtBQUVBLElBQU0sWUFBWSxLQUFLLFFBQVEsa0NBQVcsWUFBWTtBQUN0RCxJQUFNLFlBQVksS0FBSyxRQUFRLGtDQUFXLDhCQUE4QjtBQUV4RSxJQUFNLFVBQVU7QUFBQSxFQUNk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
