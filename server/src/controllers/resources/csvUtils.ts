/**
 * Author: Thiago Cortez
 */
import * as fs from "fs";
import syncController from "../syncController";
import {type} from "os";

// Dependencias
let csv = require('csv');
let obj = csv();
let convert = require('./convertCSVDataToArray');
let Papa = require('papaparse');
const __sourceFilesDir = process.platform !== 'win32' ? "./source-files/" : require('os').homedir() + '/procon/source-files/';

let convertCSV = (filename: string, file_url?: string) => {
    return new Promise((resolve, reject) => {
        const file = fs.readFileSync(__sourceFilesDir + 'csv/' + filename);
        const fileData = fs.statSync(__sourceFilesDir + 'csv/' + filename);
        const fileModificationTimeDate = new Date(fileData.mtime);
        const fileModificationTime = fileModificationTimeDate.getUTCFullYear() + '-' + fileModificationTimeDate.getUTCMonth() + "-" + fileModificationTimeDate.getUTCDate() + ' ' + fileModificationTimeDate.getUTCHours() + ':' + fileModificationTimeDate.getUTCMinutes() + ':' + fileModificationTimeDate.getUTCSeconds();

        if (file_url != undefined) {
            syncController.selectAuditoria(file_url, fileModificationTime).then((response: number | boolean) => {
                if (typeof response == "boolean" || (typeof response == "number" && response > 0))
                    resolve(null);
                else
                    doConversion(file).then(data => {
                        syncController.salvaAuditoria(file_url, fileModificationTime).then(err => {
                            if (!err)
                                resolve(data);
                            else
                                resolve("Erro ao salvar a requisição no histórico.");
                        });
                    });
            });
        } else {
            doConversion(file).then(data => {
                resolve(data);
            });
        }
    });
};

const doConversion = (file: Buffer): Promise<any> => {
    return new Promise((resolveParse) => {
        Papa.parse(file.toString(), {
            complete: (results: any) => {
                resolveParse(convert((results.data).slice(1, results.data.length - 3), 1000));
            },
            error: (err: any) => {
                console.error(err.toString());
            }
        });
    });
}

module.exports = convertCSV;
