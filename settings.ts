import * as _ from "lodash";

const settings = require("./app.json").app;

const envSettings: any = Object.assign(
  {},
  _.pickBy(settings, (v, k) => k !== "env"),
  _.get(settings, "env." + process.env.NODE_ENV)
);

export default envSettings as any;
