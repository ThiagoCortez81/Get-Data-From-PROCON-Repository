/**
 * Author: Thiago Cortez
 */
import {ExecException} from "child_process";

// Dependencias
let fs = require('fs');
let url = require('url');
let http = require('http');
let exec = require('child_process').exec;
let download = require('download-file');
const __sourceFilesDir = process.platform !== 'win32' ? "./source-files/" : require('os').homedir() + '/procon/source-files/';

// Download arquivo
let download_file_httpget = function (file_url: string, file_name: string) {
    return new Promise(async (resolve, reject) => {
        // Criar pasta
        let mkdir = 'mkdir -p ' + __sourceFilesDir + '/csv';
        let child = exec(mkdir, (err: ExecException, stdout: string, stderr: string) => {
            if (err) throw err;
        });

        // await sleep(500);

        const remoteUrl = file_url;
        let options = {
            directory: __sourceFilesDir,
            filename: file_name
        };
        // let file = fs.createWriteStream(__sourceFilesDir + file_name);

        download(remoteUrl, options, function (error: any) {
            if (!error) {
                console.log("Aguarde, processando arquivo...");
                setTimeout(() => {
                    console.log(file_name + ' downloaded to ' + __sourceFilesDir);
                    resolve(true);
                }, 500);
            }
        });
    });
};

let sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports = download_file_httpget;