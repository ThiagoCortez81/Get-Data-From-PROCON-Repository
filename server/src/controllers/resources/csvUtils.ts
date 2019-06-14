/**
 * Author: Thiago Cortez
 */
import * as fs from "fs";
import syncController from "../syncController";

// Dependencias
let csv = require('csv');
let obj = csv();
let convert = require('./convertCSVDataToArray');
let Papa = require('papaparse');
const __sourceFilesDir = "./source-files/";

let convertCSV = (filename: string, file_url?: string) => {
    return new Promise((resolve, reject) => {
        const file = fs.readFileSync(__sourceFilesDir + 'csv/' + filename);
        const fileData = fs.statSync(__sourceFilesDir + 'csv/' + filename);
        const fileModificationTime = fileData.mtime.toString().replace('T', ' ').replace('Z', '');

        if (file_url != undefined) {
            syncController.selectAuditoria(fileModificationTime, file_url).then(response => {
                console.log(response);
                doConversion(file).then(data => {
                    resolve(data);
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
