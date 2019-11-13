import { Config } from "poi";

const config: Config = {
  entry: "src/index.tsx",
  output: {
    dir: "dist/static/",
    publicUrl: "/static/",
    html: {
      filename: "../index.html"
    }
  },
  plugins: [
    {
      resolve: "@poi/plugin-pwa",
      options: {}
    }
  ]
};

export default config;
