import {Endpoints} from "../models/Endpoints";

const staticData: any = require('../../config.json');
import {Request, Response} from 'express';
import pool from "../database";

let getFile = require('./resources/getFile');
let url = require('url');
let unzip = require('./resources/zipUtils');
let csvConvert = require('./resources/csvUtils');
let db = require('./resources/databaseUtils');

class SyncController {
    public async sync(req: Request, res: Response) {
        db.select(db.connection, 'reclamacoes_endpoint', '', '').then((endpoints: Endpoints[]) => {
            if (endpoints)
                for (const endpoint of endpoints) {
                    // Baixar arquivo
                    let file_url = endpoint.url_endp;
                    let file_name = url.parse(file_url).pathname.split('/').pop();
                    let file_name_csv = (url.parse(file_url).pathname.split('/').pop()).substr(0, file_name.length - 3) + 'csv';

                    getFile(file_url, file_name).then(function (success: boolean) {
                        if (success) {
                            unzip(file_name).then(function (stats: boolean) {
                                if (stats) {
                                    csvConvert(file_name_csv, file_url).then(function (dataToInsert: Array<Array<Array<String>>>) {
                                        const datasetLen = dataToInsert.length;
                                        let datasetCountInsert = 0;
                                        console.warn(`Inserindo ${datasetLen * 15} registros, isso pode demorar um pouco!`);
                                        for (const dataIdx in dataToInsert)
                                            if (dataToInsert.hasOwnProperty(dataIdx)) {
                                                const dataReclamacao = dataToInsert[dataIdx].map(line => {
                                                    // Mapeando array de inserção de reclamação
                                                    return [
                                                        line[1], //DataArquivamento
                                                        line[2], //DataAbertura
                                                        line[4], //regiao
                                                        line[5], //UF
                                                        line[0], //anocalendario
                                                        line[15], //Atendida
                                                        line[16], //CodigoAssunto
                                                        line[17], //DescricaoAssunto
                                                        line[18], //CodigoProblema
                                                        line[19], //DescricaoProblema
                                                        line[13] //CNAEPrincipal
                                                    ];
                                                });

                                                /* Outros dados a serem inseridos */
                                                const dataCliente = dataToInsert[dataIdx].map(line => {
                                                    return [
                                                        line[21], //FaixaEtariaConsumidor
                                                        line[20], //SexoConsumidor
                                                        line[22] //CEPConsumidor
                                                    ];
                                                });

                                                const dataConsumidorReclamacao = dataToInsert[dataIdx].map(line => {
                                                    return [
                                                        line[9], //NumeroCNPJ
                                                        line[8], //Tipo
                                                        line[22] //Verificar como pegar id da reclamação ou consumidor (talvez adicionar no tempo de execução do db.insert)
                                                    ];
                                                });
                                                /* Fim */
                                                db.insert(db.connection, 'reclamacao', dataReclamacao, dataCliente, dataConsumidorReclamacao).then((res: boolean) => {
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

    public async selectAuditoria(dataSync: string, endpoint: string): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query('SELECT COUNT(*) AS qtd FROM sync_auditoria WHERE sa_data_sync = ? AND sa_endpoint_sync = ?', [dataSync, endpoint], (error, result, fields) => {
                if (error)
                    resolve(false);
                else
                    resolve(result[0]);
            });
        }).then(response => {
console.log(response);
        });
    }
}

const syncController = new SyncController();
export default syncController;
