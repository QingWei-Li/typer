import { Config } from "poi";

const config: Config = {
  entry: "src/index.tsx",
  plugins: [
    {
      resolve: "@poi/plugin-pwa",
      options: {}
    }
  ]
};

export default config;
