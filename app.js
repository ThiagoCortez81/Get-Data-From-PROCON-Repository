/**
 * Author: Thiago Cortez
 */

// Dependencias
global["__sourceFilesDir"] = "./source-files/";
var getFile = require('./resources/getFile');
var url = require('url');
var unzip = require('./resources/zipUtils');
var csvConvert = require('./resources/csvUtils');

// Baixar arquivo
var file_url = 'http://dados.mj.gov.br/dataset/8ff7032a-d6db-452b-89f1-d860eb6965ff/resource/d47f83d2-8a16-46ee-8dfb-813c667e2f8f/download/reclamacoes-fundamentadas-sindec-2009.zip';
var file_name = url.parse(file_url).pathname.split('/').pop();
var file_name_csv = (url.parse(file_url).pathname.split('/').pop()).substr(0, file_name.length - 3) + 'csv';
getFile(file_url, file_name).then(function (success) {
    if (success) {
        unzip(file_name).then(function (stats) {
            if (stats) {
                csvConvert(file_name_csv).then(function (data) {
                    console.log(data);
                });
            }
        });
    }

    //Termina processo
    // process.exit(0);
});