module.exports = {
  presets: ["@vue/app",
  
  ["@babel/preset-env", { "modules": false }]],
  plugins: [
    [
      "import",
      {
        "libraryName": "@onaug6th/super-ui",
        style: (name) => {
          return `${name}/style.css`;
        }
      }
    ]
  ]
}
