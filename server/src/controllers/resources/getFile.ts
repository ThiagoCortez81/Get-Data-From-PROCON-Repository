/**
 * Author: Thiago Cortez
 */
import {ExecException} from "child_process";

// Dependencias
var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
const __sourceFilesDir = process.platform !== 'win32' ? "./source-files/" : require('os').homedir() + '/procon/source-files/';

// Download arquivo
var download_file_httpget = function(file_url: string, file_name: string) {
    return new Promise((resolve, reject) => {
        // Criar pasta
        var mkdir = 'mkdir -p ' + __sourceFilesDir + '/csv';
        var child = exec(mkdir, (err: ExecException, stdout: string, stderr: string) => {
            if (err) throw err;
        });

        var options = {
            host: url.parse(file_url).host,
            port: 80,
            path: url.parse(file_url).pathname
        };
        var file = fs.createWriteStream(__sourceFilesDir + file_name);

        http.get(options, function(res: any) {
            const len = parseInt(res.headers["content-range"].split("/")[1], 10);
            let cur = 0;

            res.on('data', function(data: any) {
                cur += data.length;
                console.clear();
                console.log("Downloading " + ((100 * cur) / len).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb\r");
                file.write(data);
            });

            res.on('end', function() {
                file.end();
                console.log("Aguarde, processando arquivo...");
                setTimeout(() => {
                    console.log(file_name + ' downloaded to ' + __sourceFilesDir);
                    resolve(true);
                }, 500);
            });
        });
    });
};

module.exports = download_file_httpget;