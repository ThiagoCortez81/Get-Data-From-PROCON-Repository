/**
 * Author: Thiago Cortez
 */

// Dependencias
var getFile = require('./resources/getFile');
var url = require('url');

// Baixar arquivo
var file_url = 'http://dados.mj.gov.br/dataset/8ff7032a-d6db-452b-89f1-d860eb6965ff/resource/d47f83d2-8a16-46ee-8dfb-813c667e2f8f/download/reclamacoes-fundamentadas-sindec-2009.zip';
var file_name = url.parse(file_url).pathname.split('/').pop();
getFile(file_url, file_name).then(function(a){
    console.log('fim');
});