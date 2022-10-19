// Rename to babel.config.js to enable (disables SWC)

/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  presets: ["next/babel"],
  plugins: [
    // [
    //   "babel-plugin-styled-components",
    //   {
    //     cssProp: true,
    //     ssr: true,
    //     meaninglessFileNames: ["index", "styles"],
    //   },

    // ],
    ["babel-plugin-styled-components", styledConfig],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
  ],
};
