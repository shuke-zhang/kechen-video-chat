// vitest.config.ts
import { fileURLToPath as fileURLToPath2 } from "node:url";

// vite.config.ts
import { fileURLToPath, URL as URL2 } from "node:url";
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
var vite_config_default = defineConfig(({ command, mode: mode2 }) => {
  const env = loadEnv(mode2, process.cwd(), "");
  const isBuild = command === "build";
  return {
    define: {
      __DEV__: mode2 === "development",
      __PROD__: mode2 === "production",
      __APP_TITLE__: `"${env.VITE_APP_TITLE}"`,
      __API_URL__: `"${env.VITE_API_URL}"`,
      __STATIC_URL__: `"${env.VITE_API_URL}"`
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL2("./src", __vite_injected_original_import_meta_url))
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

// vitest.config.ts
import { mergeConfig, defineConfig as defineConfig2, configDefaults } from "file:///D:/project/kechen/kechen-video-chat/node_modules/.pnpm/vitest@2.1.9_@types+node@20_ca057f22a52ba33990dd3938179219cd/node_modules/vitest/dist/config.js";
var __vite_injected_original_import_meta_url2 = "file:///D:/project/kechen/kechen-video-chat/vitest.config.ts";
var mode = process.env.NODE_ENV || "development";
var viteConfigResult = vite_config_default({ mode });
var vitest_config_default = mergeConfig(
  viteConfigResult,
  defineConfig2({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      root: fileURLToPath2(new URL("./", __vite_injected_original_import_meta_url2))
    }
  })
);
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyIsICJ2aXRlLmNvbmZpZy50cyIsICJzY3JpcHQvaWNvbmZvbnQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXGtlY2hlblxcXFxrZWNoZW4tdmlkZW8tY2hhdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxrZWNoZW5cXFxca2VjaGVuLXZpZGVvLWNoYXRcXFxcdml0ZXN0LmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdC9rZWNoZW4va2VjaGVuLXZpZGVvLWNoYXQvdml0ZXN0LmNvbmZpZy50c1wiO2ltcG9ydCB0eXBlIHsgQ29uZmlnRW52IH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XHJcblxyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnO1xyXG5cclxuaW1wb3J0IHZpdGVDb25maWcgZnJvbSAnLi92aXRlLmNvbmZpZyc7XHJcblxyXG5pbXBvcnQgeyBtZXJnZUNvbmZpZywgZGVmaW5lQ29uZmlnLCBjb25maWdEZWZhdWx0cyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnO1xyXG5jb25zdCBtb2RlID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcclxuY29uc3Qgdml0ZUNvbmZpZ1Jlc3VsdCA9IHZpdGVDb25maWcoeyBtb2RlIH0gYXMgQ29uZmlnRW52KTtcclxuZXhwb3J0IGRlZmF1bHQgbWVyZ2VDb25maWcoXHJcbiAgdml0ZUNvbmZpZ1Jlc3VsdCxcclxuICBkZWZpbmVDb25maWcoe1xyXG4gICAgdGVzdDoge1xyXG4gICAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcclxuICAgICAgZXhjbHVkZTogWy4uLmNvbmZpZ0RlZmF1bHRzLmV4Y2x1ZGUsICdlMmUvKionXSxcclxuICAgICAgcm9vdDogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuLycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgfSxcclxuICB9KSxcclxuKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXGtlY2hlblxcXFxrZWNoZW4tdmlkZW8tY2hhdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxccHJvamVjdFxcXFxrZWNoZW5cXFxca2VjaGVuLXZpZGVvLWNoYXRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3Byb2plY3Qva2VjaGVuL2tlY2hlbi12aWRlby1jaGF0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJ1xyXG5pbXBvcnQgSWNvbnMgZnJvbSAndW5wbHVnaW4taWNvbnMvdml0ZSdcclxuaW1wb3J0IHsgRWxlbWVudFBsdXNSZXNvbHZlciwgTmFpdmVVaVJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5cclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZURldlRvb2xzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1kZXZ0b29scydcclxuaW1wb3J0IHsgZ2VuZXJhdGVkSWNvbnMgfSBmcm9tICcuL3NjcmlwdC9pY29uZm9udCdcclxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKVxyXG4gIGNvbnN0IGlzQnVpbGQgPSBjb21tYW5kID09PSAnYnVpbGQnXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBkZWZpbmU6IHtcclxuICAgICAgX19ERVZfXzogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyxcclxuICAgICAgX19QUk9EX186IG1vZGUgPT09ICdwcm9kdWN0aW9uJyxcclxuICAgICAgX19BUFBfVElUTEVfXzogYFwiJHtlbnYuVklURV9BUFBfVElUTEV9XCJgLFxyXG4gICAgICBfX0FQSV9VUkxfXzogYFwiJHtlbnYuVklURV9BUElfVVJMfVwiYCxcclxuICAgICAgX19TVEFUSUNfVVJMX186IGBcIiR7ZW52LlZJVEVfQVBJX1VSTH1cImAsXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICBhbGlhczoge1xyXG4gICAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIGNzczoge1xyXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcclxuICAgICAgICAgIEB1c2UgXCJAL3N0eWxlcy9nbG9iYWwuc2Nzc1wiIGFzIGdsb2JhbDtcclxuICAgICAgICAgIEB1c2UgJ0Avc3R5bGVzL3ZhcmlhYmxlcy5zY3NzJyBhcyB2YXJzO1xyXG4gICAgICAgICAgQHVzZSBcIkAvc3R5bGVzL2VsZW1lbnQvaW5kZXguc2Nzc1wiIGFzIGVsVmFzO1xyXG5cclxuICAgICAgICAgIGAsXHJcbiAgICAgICAgICBhcGk6ICdtb2Rlcm4nLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICB2dWUoKSxcclxuICAgICAgZ2VuZXJhdGVkSWNvbnMoaXNCdWlsZCksXHJcblxyXG4gICAgICB0YWlsd2luZGNzcygpLFxyXG4gICAgICB2dWVKc3goKSxcclxuICAgICAgdnVlRGV2VG9vbHMoKSxcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgaW1wb3J0czogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYSddLFxyXG4gICAgICAgIGR0czogJy4vdHlwZXMvYXV0by1pbXBvcnRzLmQudHMnLCAvLyBcdTYzMDdcdTVCOUFcdTc1MUZcdTYyMTBcdTc2ODRcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcdTc2ODRcdThERUZcdTVGODRcclxuICAgICAgICBkaXJzOiBbJy4vc3JjL2hvb2tzJywgJy4vc3JjL3V0aWxzJywgJy4vc3JjL3N0b3JlcyddLCAvLyBcdTU0NEFcdThCQzlBdXRvSW1wb3J0XHU2M0QyXHU0RUY2XHU1NzI4XHU1NEVBXHU0RTlCXHU3NkVFXHU1RjU1XHU0RTJEXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU2QTIxXHU1NzU3XHUzMDAyXHU2M0QyXHU0RUY2XHU0RjFBXHU2MjZCXHU2M0NGXHU4RkQ5XHU0RTlCXHU3NkVFXHU1RjU1XHU0RTJEXHU3Njg0XHU2NTg3XHU0RUY2XHVGRjBDXHU1RTc2XHU2ODM5XHU2MzZFXHU2NTg3XHU0RUY2XHU1MTg1XHU1QkI5XHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU1QkZDXHU1MTY1XHU4QkVEXHU1M0U1XHUzMDAyXHJcbiAgICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIFx1NzUxRlx1NjIxMCBFU0xpbnQgXHU5MTREXHU3RjZFXHVGRjBDXHU5MDdGXHU1MTREIGltcG9ydCBcdTYyQTVcdTk1MTlcclxuICAgICAgICAgIGZpbGVwYXRoOiAnLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbicsIC8vIERlZmF1bHQgYC4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb25gXHJcbiAgICAgICAgICBnbG9iYWxzUHJvcFZhbHVlOiB0cnVlLCAvLyBcdTgxRUFcdTUyQThcdThCQkVcdTdGNkVcdTUxNjhcdTVDNDBcdTUzRDhcdTkxQ0ZcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgICAgRWxlbWVudFBsdXNSZXNvbHZlcih7IGltcG9ydFN0eWxlOiAnc2FzcycgfSksXHJcbiAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcclxuICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICBwcmVmaXg6ICdJY29uJyxcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0pLFxyXG4gICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICBkaXJzOiBbJy4vc3JjL2NvbXBvbmVudHMnXSxcclxuICAgICAgICBkdHM6ICcuL3R5cGVzL2NvbXBvbmVudHMuZC50cycsIC8vIFx1NjMwN1x1NUI5QVx1NzUxRlx1NjIxMFx1NzY4NFx1N0VDNFx1NEVGNlx1NThGMFx1NjYwRVx1NjU4N1x1NEVGNlx1NzY4NFx1OERFRlx1NUY4NFxyXG4gICAgICAgIHJlc29sdmVyczogW1xyXG4gICAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU2Q0U4XHU1MThDXHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XHJcbiAgICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgICAgcHJlZml4OiAnSWNvbicsXHJcbiAgICAgICAgICB9KSxcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoeyBpbXBvcnRTdHlsZTogJ3Nhc3MnIH0pLFxyXG4gICAgICAgICAgTmFpdmVVaVJlc29sdmVyKCksXHJcbiAgICAgICAgXSxcclxuICAgICAgfSksXHJcbiAgICAgIEljb25zKHtcclxuICAgICAgICBhdXRvSW5zdGFsbDogdHJ1ZSxcclxuICAgICAgfSksXHJcbiAgICBdLFxyXG5cclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgIG9wZW46IGZhbHNlLFxyXG4gICAgICBwb3J0OiA4MDkwLFxyXG4gICAgfSxcclxuXHJcbiAgICBidWlsZDoge1xyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgZXh0ZXJuYWw6IFsnZnMnXSwgLy8gXHU3ODZFXHU0RkREXHU0RTBEXHU2MjUzXHU1MzA1IE5vZGUuanMgXHU2QTIxXHU1NzU3XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH1cclxufSlcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxwcm9qZWN0XFxcXGtlY2hlblxcXFxrZWNoZW4tdmlkZW8tY2hhdFxcXFxzY3JpcHRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHByb2plY3RcXFxca2VjaGVuXFxcXGtlY2hlbi12aWRlby1jaGF0XFxcXHNjcmlwdFxcXFxpY29uZm9udC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovcHJvamVjdC9rZWNoZW4va2VjaGVuLXZpZGVvLWNoYXQvc2NyaXB0L2ljb25mb250LnRzXCI7aW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xyXG5cclxuaW1wb3J0IGNob2tpZGFyIGZyb20gJ2Nob2tpZGFyJztcclxuaW1wb3J0IGVqcyBmcm9tICdlanMnO1xyXG5cclxudHlwZSBEZWJvdW5jZUZ1bmN0aW9uID0gPFQgZXh0ZW5kcyAoLi4uYXJnczogYW55W10pID0+IGFueT4oXHJcbiAgZnVuYzogVCxcclxuICBkZWxheT86IG51bWJlclxyXG4pID0+ICguLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+KSA9PiB2b2lkO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlYm91bmNlOiBEZWJvdW5jZUZ1bmN0aW9uID0gKGZ1bmMsIGRlbGF5ID0gMTAwMCkgPT4ge1xyXG4gIGxldCB0aW1lcjogTm9kZUpTLlRpbWVvdXQ7XHJcblxyXG4gIHJldHVybiBhc3luYyAoLi4uYXJncykgPT4ge1xyXG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xyXG4gICAgICB0aW1lciA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGF3YWl0IGZ1bmMoLi4uYXJncyk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9LCBkZWxheSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3Qgc291cmNlRGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ19faWNvbmZvbnQnKTtcclxuY29uc3QgdGFyZ2V0RGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL3NyYy9jb21wb25lbnRzL2ljb24tZm9udC8nKTtcclxuXHJcbmNvbnN0IGlnbm9yZWQgPSBbXHJcbiAgL1xcL3NyY1xcL2ljb25mb250XFwvZGVtb19pbmRleFxcLmh0bWwkLyxcclxuICAvXFwvc3JjXFwvaWNvbmZvbnRcXC9kZW1vXFwuY3NzJC8sXHJcbiAgL1xcL3NyY1xcL2ljb25mb250XFwvaWNvbmZvbnRcXC5qcyQvLFxyXG4gIC9cXC9zcmNcXC9pY29uZm9udFxcL2ljb25mb250XFwuanNvbiQvLFxyXG4gIC9cXC9zcmNcXC9pY29uZm9udFxcL2ljb25mb250XFwudHRmJC8sXHJcbiAgL1xcL3NyY1xcL2ljb25mb250XFwvaWNvbmZvbnRcXC53b2ZmJC8sXHJcbiAgL1xcL3NyY1xcL2ljb25mb250XFwvaWNvbmZvbnRcXC53b2ZmMiQvLFxyXG5dO1xyXG5cclxuZnVuY3Rpb24gY29weUZpbGUoc291cmNlRmlsZTogc3RyaW5nLCB0YXJnZXRGaWxlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAvLyBcdTY4QzBcdTY3RTVcdTZFOTBcdTY1ODdcdTRFRjZcdTY2MkZcdTU0MjZcdTVCNThcdTU3MjhcclxuICBpZiAoIWZzLmV4aXN0c1N5bmMoc291cmNlRmlsZSkpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcihgU291cmNlIGZpbGUgXCIke3NvdXJjZUZpbGV9XCIgZG9lcyBub3QgZXhpc3QuYCk7XHJcbiAgfVxyXG5cclxuICAvLyBcdThCRkJcdTUzRDZcdTZFOTBcdTY1ODdcdTRFRjZcdTUxODVcdTVCQjkgKFx1NEY1Q1x1NEUzQUJ1ZmZlclx1NTkwNFx1NzQwNlx1NEU4Q1x1OEZEQlx1NTIzNlx1NjU4N1x1NEVGNilcclxuICBjb25zdCBmaWxlQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhzb3VyY2VGaWxlKTtcclxuXHJcbiAgLy8gXHU1MTk5XHU1MTY1XHU3NkVFXHU2ODA3XHU2NTg3XHU0RUY2IChCdWZmZXJcdTY2MkZVaW50OEFycmF5XHU3Njg0XHU1QjUwXHU3QzdCXHVGRjBDXHU2RUUxXHU4REIzQXJyYXlCdWZmZXJWaWV3XHU4OTgxXHU2QzQyKVxyXG4gIGZzLndyaXRlRmlsZVN5bmModGFyZ2V0RmlsZSwgZmlsZUNvbnRlbnQgYXMgdW5rbm93biBhcyBVaW50OEFycmF5KTtcclxufVxyXG5cclxuY29uc3QgY3NzRGVsaW1pdGVyID0gW1xyXG4gICcvKiBbJyxcclxuICAnXSAqLycsXHJcbl0gYXMgW3N0cmluZywgc3RyaW5nXTtcclxuXHJcbmNvbnN0IGpzRGVsaW1pdGVyID0gW1xyXG4gICdcXCcvKiBbJyxcclxuICAnXSAqL1xcJycsXHJcbl0gYXMgW3N0cmluZywgc3RyaW5nXTtcclxuXHJcbmZ1bmN0aW9uIGdldEVqc0RhdGEoKSB7XHJcbiAgY29uc3QgY3NzID0gZnMucmVhZEZpbGVTeW5jKFxyXG4gICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ19faWNvbmZvbnQnLCAnaWNvbmZvbnQuY3NzJyksXHJcbiAgICAndXRmLTgnLFxyXG4gICk7XHJcbiAgY29uc3QgaW5kZXggPSBjc3MuaW5kZXhPZignLmljb24tJyk7XHJcbiAgY29uc3QgY29udGVudCA9IGNzcy5zbGljZShpbmRleCwgY3NzLmxlbmd0aCAtIDEpLnJlcGxhY2UoL1xccj9cXG4qJC8sICcnKTtcclxuICAvLyB0eXBlc1xyXG4gIGNvbnN0IGpzb24gPSBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ19faWNvbmZvbnQnLCAnaWNvbmZvbnQuanNvbicpKS50b1N0cmluZygpO1xyXG4gIGNvbnN0IHR5cGVzT2JqZWN0ID0gKEpTT04ucGFyc2UoanNvbikuZ2x5cGhzIGFzIHsgZm9udF9jbGFzczogc3RyaW5nIH1bXSkubWFwKGUgPT4gYCcke2UuZm9udF9jbGFzc30nYCkuc29ydCgpO1xyXG4gIGNvbnN0IHR5cGVzID0gdHlwZXNPYmplY3Quam9pbignIHxcXG4nKS5yZXBsYWNlKC9cXHI/XFxuKiQvLCAnJyk7XHJcbiAgY29uc3QgZWpzRGF0YSA9IHtcclxuICAgIGNvbnRlbnQsXHJcbiAgICB0eXBlcyxcclxuICB9O1xyXG5cclxuICByZXR1cm4gZWpzRGF0YTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGVtcGxhdGVEYXRhKHRlbXBsYXRlTmFtZTogc3RyaW5nLCBbb3BlbkRlbGltaXRlciwgY2xvc2VEZWxpbWl0ZXJdOiBbc3RyaW5nLCBzdHJpbmddID0gY3NzRGVsaW1pdGVyKSB7XHJcbiAgY29uc3QgZWpzRGF0YSA9IGdldEVqc0RhdGEoKTtcclxuICBjb25zdCBfdGVtcGxhdGVQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vX190ZW1wbGF0ZScsIHRlbXBsYXRlTmFtZSk7XHJcbiAgY29uc3Qgc291cmNlID0gZnMucmVhZEZpbGVTeW5jKF90ZW1wbGF0ZVBhdGgpLnRvU3RyaW5nKCk7XHJcbiAgY29uc3QgdGVtcGxhdGUgPSBlanMuY29tcGlsZShzb3VyY2UsIHtcclxuICAgIG9wZW5EZWxpbWl0ZXIsXHJcbiAgICBjbG9zZURlbGltaXRlcixcclxuICB9KTtcclxuICByZXR1cm4gdGVtcGxhdGUoZWpzRGF0YSk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNvcHkoKSB7XHJcbiAgdHJ5IHtcclxuICAgIC8vIGZvbnRzXHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKFxyXG4gICAgICBwYXRoLnJlc29sdmUodGFyZ2V0RGlyLCAnaWNvbmZvbnQuY3NzJyksXHJcbiAgICAgIGdldFRlbXBsYXRlRGF0YSgnaWNvbmZvbnQuY3NzJyksXHJcbiAgICAgICd1dGYtOCcsXHJcbiAgICApO1xyXG5cclxuICAgIC8vIHR5cGVzXHJcbiAgICBmcy53cml0ZUZpbGVTeW5jKFxyXG4gICAgICBwYXRoLnJlc29sdmUodGFyZ2V0RGlyLCAnaWNvbmZvbnQudHMnKSxcclxuICAgICAgZ2V0VGVtcGxhdGVEYXRhKCdpY29uZm9udC50cycsIGpzRGVsaW1pdGVyKSxcclxuICAgICk7XHJcblxyXG4gICAgLy8gLy8gXHU1QjU3XHU0RjUzXHJcblxyXG4gICAgYXdhaXQgY29weUZpbGUoXHJcbiAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdfX2ljb25mb250JywgJ2ljb25mb250LmpzJyksXHJcbiAgICAgIHBhdGgucmVzb2x2ZSh0YXJnZXREaXIsICdpY29uZm9udC5qcycpLFxyXG4gICAgKTtcclxuICB9XHJcbiAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKGAke2Vycm9yfWApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlZEljb25zKGlzQnVpbGQ6IGJvb2xlYW4pIHtcclxuICBpZiAoaXNCdWlsZClcclxuICAgIHJldHVybjtcclxuICBjb25zb2xlLmxvZygnZ2VuZXJhdGVkSWNvbnMnKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlciA9IGRlYm91bmNlKGNvcHkpO1xyXG5cclxuICBjb25zdCB3YXRjaGVyID0gY2hva2lkYXIud2F0Y2goc291cmNlRGlyLCB7XHJcbiAgICBpZ25vcmVkLFxyXG4gIH0pO1xyXG5cclxuICB3YXRjaGVyLm9uKCdhbGwnLCBhc3luYyAodHlwZSkgPT4ge1xyXG4gICAgaWYgKHR5cGUgIT09ICdhZGREaXInICYmIHR5cGUgIT09ICd1bmxpbmsnICYmIHR5cGUgIT09ICd1bmxpbmtEaXInKVxyXG4gICAgICBoYW5kbGVyKCk7XHJcbiAgfSk7XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUVBLFNBQVMsaUJBQUFBLHNCQUFxQjs7O0FDRnFRLFNBQVMsZUFBZSxPQUFBQyxZQUFXO0FBRXRVLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMscUJBQXFCLHVCQUF1QjtBQUVyRCxPQUFPLGdCQUFnQjtBQUN2QixTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLGlCQUFpQjs7O0FDWjRSLE9BQU8sUUFBUTtBQUNuVSxPQUFPLFVBQVU7QUFFakIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sU0FBUztBQUpoQixJQUFNLG1DQUFtQztBQVdsQyxJQUFNLFdBQTZCLENBQUMsTUFBTSxRQUFRLFFBQVM7QUFDaEUsTUFBSTtBQUVKLFNBQU8sVUFBVSxTQUFTO0FBQ3hCLGlCQUFhLEtBQUs7QUFDbEIsV0FBTyxJQUFJLFFBQWMsQ0FBQyxZQUFZO0FBQ3BDLGNBQVEsV0FBVyxZQUFZ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
