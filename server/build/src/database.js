"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql"));
const config_json_1 = __importDefault(require("../config.json"));
const pool = mysql.createPool(config_json_1.default.databaseConf);
pool.getConnection((err, connection) => {
    connection.release();
    console.log('DB conectado com sucesso ! ');
});
exports.default = pool;
//CONVERTIDO
