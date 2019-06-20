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
        db.select(db.connection, 'reclamacoes_endpoint', '', '').then(async (endpoints: Endpoints[]) => {
            let endpointCount: number = 0;
            if (endpoints)
                for (const endpoint of endpoints) {
                    endpointCount++;
                    // Baixar arquivo
                    let file_url = endpoint.url_endp_real;
                    let file_name = url.parse(file_url).pathname.split('/').pop();
                    let file_name_csv = (url.parse(file_url).pathname.split('/').pop()).substr(0, file_name.length - 3) + 'csv';

                    await getFile(file_url, file_name).then(function (success: boolean) {
                        if (success) {
                            unzip(file_name).then(function (stats: boolean) {
                                if (stats) {
                                    csvConvert(file_name_csv, file_url).then(function (dataToInsert: Array<Array<Array<String>>> | string | null) {
                                        if (dataToInsert == null) {
                                            enviarResposta("", "Dados já existem no banco.", (endpoints.length == endpointCount));
                                        } else if (typeof dataToInsert == "string") {
                                            enviarResposta("", dataToInsert, true);
                                        } else {
                                            const datasetLen = dataToInsert.length;
                                            let datasetCountInsert = 0;
                                            console.warn(`Inserindo ${datasetLen * 1000} registros, isso pode demorar um pouco!`);
                                            for (const dataIdx in dataToInsert)
                                                if (dataToInsert.hasOwnProperty(dataIdx)) {
                                                    /* Mapeando dados a serem inseridos */
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
                                                            line[13], //CNAEPrincipal
                                                            line[8], //Tipo
                                                            line[6], //strRazaoSocial
                                                            line[7], //strNomeFantasia
                                                            line[9], //NumeroCNPJ
                                                        ];
                                                    });

                                                    const dataCliente = dataToInsert[dataIdx].map(line => {
                                                        return [
                                                            line[21], //FaixaEtariaConsumidor
                                                            line[20], //SexoConsumidor
                                                            line[22] //CEPConsumidor
                                                        ];
                                                    });
                                                    /* Fim */
                                                    db.insert(db.connection, 'reclamacao', dataReclamacao, dataCliente).then((res: boolean) => {
                                                        if (!res) {
                                                            enviarResposta("", "Erro ao inserir dados no banco de dados!", (endpoints.length == endpointCount));
                                                        }

                                                        datasetCountInsert++;
                                                        if (datasetCountInsert === datasetLen) {
                                                            enviarResposta("Dados inseridos com sucesso!", "", (endpoints.length == endpointCount));
                                                        }
                                                    });
                                                }
                                        }
                                    }).catch((err: any) => {
                                        console.error("AQUI CSV CONVERT-> " + err.toString());
                                        enviarResposta("", err.toString(), true);
                                    });
                                } else {
                                    enviarResposta("", "Erro ao ler o ZIP.", true);
                                }
                            }).catch((err: any) => {
                                console.error("AQUI PENULTIMO");
                                enviarResposta("", err.toString(), true);
                            });
                        }
                    }).catch((err: any) => {
                        console.error("AQUI ULTIMO");
                        enviarResposta("", err.toString(), true);
                    });
                }
        });

        const enviarResposta = (success: string, error: string, enviaResposta: boolean) => {
            if (enviaResposta)
                if (success != "")
                    res.json({success: success})
                else
                    res.json({error: error})
        };
    }

    public selectAuditoria(endpoint: string, dataSync: string): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query('SELECT COUNT(*) AS total FROM sync_auditoria WHERE sa_endpoint_sync = ? AND sa_data_sync = ? ORDER BY sa_data_sync DESC LIMIT 0,1', [endpoint, dataSync], (error, result, fields) => {
                if (error)
                    resolve(false);
                else
                    resolve(result[0].total);
            });
        });
    }

    public salvaAuditoria(endpoint: string, dataSync: string): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('dataSync-> ' + dataSync);
            pool.query('INSERT INTO sync_auditoria(sa_data_sync, sa_endpoint_sync) VALUES (?, ?)', [dataSync, endpoint], (error, result, fields) => {
                console.error("error-> " + error);
                if (error)
                    resolve(true);
                else
                    resolve(false);
            });
        });
    }
}

const syncController = new SyncController();
export default syncController;
