/**
 * Author: Thiago Cortez
 */

// Dependencias
const staticData = require('./resources/staticUtils');
global["__databaseConfig"] = staticData.databaseConf;
global["__sourceFilesDir"] = "./source-files/";
let getFile = require('./resources/getFile');
let url = require('url');
let unzip = require('./resources/zipUtils');
let csvConvert = require('./resources/csvUtils');
let db = require('./resources/databaseUtils');

// Baixar arquivo
let file_url = 'http://dados.mj.gov.br/dataset/8ff7032a-d6db-452b-89f1-d860eb6965ff/resource/d47f83d2-8a16-46ee-8dfb-813c667e2f8f/download/reclamacoes-fundamentadas-sindec-2009.zip';
let file_name = url.parse(file_url).pathname.split('/').pop();
let file_name_csv = (url.parse(file_url).pathname.split('/').pop()).substr(0, file_name.length - 3) + 'csv';
getFile(file_url, file_name).then(function (success) {
    if (success) {
        unzip(file_name).then(function (stats) {
            if (stats) {
                csvConvert(file_name_csv).then(function (dataToInsert) {
                    const datasetLen = dataToInsert.length;
                    let datasetCountInsert = 0;
                    console.warn(`Inserindo ${datasetLen*15} registros, isso pode demorar um pouco!`);
                    for (const dataIdx in dataToInsert)
                        if (dataToInsert.hasOwnProperty(dataIdx)) {
                            db.insert(db.connection, 'reclamacoesFundamentadas', dataToInsert[dataIdx]).then((res) => {
                                if (res === false) {
                                    console.error("Erro ao inserir dados no banco de dados!");
                                    process.exit(0); //cancelar tarefa
                                }

                                datasetCountInsert++;
                                if (datasetCountInsert === datasetLen) {
                                    console.log("TERMINOU");
                                    process.exit(0)
                                }
                            });
                        }
                });
            } else {
                console.error("ERROR PARSING THE ZIP");
            }
        });
    }
}).catch(err => {
    console.error(err.toString());
});