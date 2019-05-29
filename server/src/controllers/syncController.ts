import {Endpoints} from "../models/Endpoints";

const staticData: any = require('../../config.json');
import {Request, Response} from 'express';

let getFile = require('./resources/getFile');
let url = require('url');
let unzip = require('./resources/zipUtils');
let csvConvert = require('./resources/csvUtils');
let db = require('./resources/databaseUtils');

class SyncController {
    public async sync(req: Request, res: Response) {
        db.select(db.connection, 'reclamacoesEndpoint', '', '').then((endpoints: Endpoints[]) => {
            if (endpoints)
                for (const endpoint of endpoints) {
                    // Baixar arquivo
                    let file_url = endpoint.urlEndp;
                    let file_name = url.parse(file_url).pathname.split('/').pop();
                    let file_name_csv = (url.parse(file_url).pathname.split('/').pop()).substr(0, file_name.length - 3) + 'csv';

                    getFile(file_url, file_name).then(function (success: boolean) {
                        if (success) {
                            unzip(file_name).then(function (stats: boolean) {
                                if (stats) {
                                    csvConvert(file_name_csv).then(function (dataToInsert: Array<Array<Array<String>>>) {
                                        const datasetLen = dataToInsert.length;
                                        let datasetCountInsert = 0;
                                        console.warn(`Inserindo ${datasetLen * 15} registros, isso pode demorar um pouco!`);
                                        for (const dataIdx in dataToInsert)
                                            if (dataToInsert.hasOwnProperty(dataIdx)) {
                                                db.insert(db.connection, 'reclamacoesFundamentadas', dataToInsert[dataIdx]).then((res: boolean) => {
                                                    if (!res) {
                                                        enviarResposta("", "Erro ao inserir dados no banco de dados!");
                                                    }

                                                    datasetCountInsert++;
                                                    if (datasetCountInsert === datasetLen) {
                                                        enviarResposta("Dados inseridos com sucesso!", "");
                                                    }
                                                });
                                            }
                                    }).catch((err: any) => {
                                        console.error("AQUI CSV CONVERT");
                                        enviarResposta("", err.toString());
                                    });
                                } else {
                                    enviarResposta("", "Erro ao ler o ZIP.");
                                }
                            }).catch((err: any) => {
                                console.error("AQUI PENULTIMO");
                                enviarResposta("", err.toString());
                            });
                        }
                    }).catch((err: any) => {
                        console.error("AQUI ULTIMO");
                        enviarResposta("", err.toString());
                    });
                }
        });

        const enviarResposta = (success: string, error: string) => {
            if (success != "")
                res.json({success: success})
            else
                res.json({error: error})
        };
    }
}

const syncController = new SyncController();
export default syncController;
