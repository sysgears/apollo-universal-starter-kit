import * as _ from "lodash";

const settings = require("./app.json").app;

type ISettings = {
  apolloLogging: boolean,
}

const envSettings: ISettings = Object.assign(
  {},
  _.pickBy(settings, (v, k) => k !== "env"),
  _.get(settings, "env." + process.env.NODE_ENV)
) as ISettings;

export default envSettings;
