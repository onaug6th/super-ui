const { resolve, getComponentEntries } = require("./utils");

let buildConfig = {
  //  输出文件目录
  outputDir: resolve("lib"),
  //  webpack配置
  configureWebpack: {
    //  入口文件
    entry: getComponentEntries("src/components"),
    //  输出配置
    output: {
      //  文件名称
      filename: "[name]/index.js",
      //  构建依赖类型
      libraryTarget: "umd",
      //  依赖输出
      libraryExport: "default",
      //  依赖名称
      library: "jerri-ui"
    },
    externals: {
      vue: {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue',
      },
    }
  },
  //  样式输出
  css: {
    sourceMap: true,
    extract: {
      filename: "[name]/style.css"
    }
  },
  chainWebpack: config => {
    config.optimization.delete("splitChunks");
    config.plugins.delete("copy");
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
    config.plugins.delete("html");
    config.plugins.delete("hmr");
    config.entryPoints.delete("app");
  }
};

module.exports = buildConfig;
