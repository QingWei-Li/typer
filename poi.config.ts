import { Config } from "poi";
const isProd = process.env.NODE_ENV === "production";

const config: Config = {
  entry: "src/index.tsx",
  output: {
    dir: "dist/static/",
    publicUrl: "/static/"
  },
  plugins: [
    {
      resolve: "@poi/plugin-pwa",
      options: {}
    }
  ]
};

export default config;
