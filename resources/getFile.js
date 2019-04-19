/**
 * Author: Thiago Cortez
 */

// Dependencias
var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

// App variáveis
var DOWNLOAD_DIR = './source-files/';

// Download arquivo
var download_file_httpget = function(file_url, file_name) {
    return new Promise((resolve, reject) => {
        // Criar pasta
        var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
        var child = exec(mkdir, function(err, stdout, stderr) {
            if (err) throw err;
        });

        var options = {
            host: url.parse(file_url).host,
            port: 80,
            path: url.parse(file_url).pathname
        };
        var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

        http.get(options, function(res) {
            res.on('data', function(data) {
                    file.write(data);
                }).on('end', function() {
                    file.end();
                    console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
                    resolve();
            });
        });
    });
};

module.exports = download_file_httpget;