import { Connector } from 'connector-js';

var client = new Connector();
var server = new Connector();

export default = {
    ClientModules: client,
    ServerMosules: server,
};
