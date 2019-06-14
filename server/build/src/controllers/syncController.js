"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const staticData = require('../../config.json');
const database_1 = __importDefault(require("../database"));
let getFile = require('./resources/getFile');
let url = require('url');
let unzip = require('./resources/zipUtils');
let csvConvert = require('./resources/csvUtils');
let db = require('./resources/databaseUtils');
class SyncController {
    sync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            db.select(db.connection, 'reclamacoes_endpoint', '', '').then((endpoints) => {
                if (endpoints)
                    for (const endpoint of endpoints) {
                        // Baixar arquivo
                        let file_url = endpoint.url_endp;
                        let file_name = url.parse(file_url).pathname.split('/').pop();
                        let file_name_csv = (url.parse(file_url).pathname.split('/').pop()).substr(0, file_name.length - 3) + 'csv';
                        getFile(file_url, file_name).then(function (success) {
                            if (success) {
                                unzip(file_name).then(function (stats) {
                                    if (stats) {
                                        csvConvert(file_name_csv, file_url).then(function (dataToInsert) {
                                            const datasetLen = dataToInsert.length;
                                            let datasetCountInsert = 0;
                                            console.warn(`Inserindo ${datasetLen * 15} registros, isso pode demorar um pouco!`);
                                            for (const dataIdx in dataToInsert)
                                                if (dataToInsert.hasOwnProperty(dataIdx)) {
                                                    const dataReclamacao = dataToInsert[dataIdx].map(line => {
                                                        // Mapeando array de inserção de reclamação
                                                        return [
                                                            line[1],
                                                            line[2],
                                                            line[4],
                                                            line[5],
                                                            line[0],
                                                            line[15],
                                                            line[16],
                                                            line[17],
                                                            line[18],
                                                            line[19],
                                                            line[13] //CNAEPrincipal
                                                        ];
                                                    });
                                                    /* Outros dados a serem inseridos */
                                                    const dataCliente = dataToInsert[dataIdx].map(line => {
                                                        return [
                                                            line[21],
                                                            line[20],
                                                            line[22] //CEPConsumidor
                                                        ];
                                                    });
                                                    const dataConsumidorReclamacao = dataToInsert[dataIdx].map(line => {
                                                        return [
                                                            line[9],
                                                            line[8],
                                                            line[22] //Verificar como pegar id da reclamação ou consumidor (talvez adicionar no tempo de execução do db.insert)
                                                        ];
                                                    });
                                                    /* Fim */
                                                    db.insert(db.connection, 'reclamacao', dataReclamacao, dataCliente, dataConsumidorReclamacao).then((res) => {
                                                        if (!res) {
                                                            enviarResposta("", "Erro ao inserir dados no banco de dados!");
                                                        }
                                                        datasetCountInsert++;
                                                        if (datasetCountInsert === datasetLen) {
                                                            enviarResposta("Dados inseridos com sucesso!", "");
                                                        }
                                                    });
                                                }
                                        }).catch((err) => {
                                            console.error("AQUI CSV CONVERT");
                                            enviarResposta("", err.toString());
                                        });
                                    }
                                    else {
                                        enviarResposta("", "Erro ao ler o ZIP.");
                                    }
                                }).catch((err) => {
                                    console.error("AQUI PENULTIMO");
                                    enviarResposta("", err.toString());
                                });
                            }
                        }).catch((err) => {
                            console.error("AQUI ULTIMO");
                            enviarResposta("", err.toString());
                        });
                    }
            });
            const enviarResposta = (success, error) => {
                if (success != "")
                    res.json({ success: success });
                else
                    res.json({ error: error });
            };
        });
    }
    selectAuditoria(dataSync, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database_1.default.query('SELECT COUNT(*) AS qtd FROM sync_auditoria WHERE sa_data_sync = ? AND sa_endpoint_sync = ?', [dataSync, endpoint], (error, result, fields) => {
                    if (error)
                        resolve(false);
                    else
                        resolve(result[0]);
                });
            }).then(response => {
                console.log(response);
            });
        });
    }
}
const syncController = new SyncController();
exports.default = syncController;
