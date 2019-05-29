"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const staticData = require('../../config.json');
let getFile = require('./resources/getFile');
let url = require('url');
let unzip = require('./resources/zipUtils');
let csvConvert = require('./resources/csvUtils');
let db = require('./resources/databaseUtils');
class SyncController {
    sync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            db.select(db.connection, 'reclamacoesEndpoint', '', '').then((endpoints) => {
                if (endpoints)
                    for (const endpoint of endpoints) {
                        // Baixar arquivo
                        let file_url = endpoint.urlEndp;
                        let file_name = url.parse(file_url).pathname.split('/').pop();
                        let file_name_csv = (url.parse(file_url).pathname.split('/').pop()).substr(0, file_name.length - 3) + 'csv';
                        getFile(file_url, file_name).then(function (success) {
                            if (success) {
                                unzip(file_name).then(function (stats) {
                                    if (stats) {
                                        csvConvert(file_name_csv).then(function (dataToInsert) {
                                            const datasetLen = dataToInsert.length;
                                            let datasetCountInsert = 0;
                                            console.warn(`Inserindo ${datasetLen * 15} registros, isso pode demorar um pouco!`);
                                            for (const dataIdx in dataToInsert)
                                                if (dataToInsert.hasOwnProperty(dataIdx)) {
                                                    db.insert(db.connection, 'reclamacoesFundamentadas', dataToInsert[dataIdx]).then((res) => {
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
}
const syncController = new SyncController();
exports.default = syncController;
