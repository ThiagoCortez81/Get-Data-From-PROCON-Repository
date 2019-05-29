/**
 * Author: Thiago Cortez
 */
import * as fs from "fs";

// Dependencias
let csv = require('csv');
let obj = csv();
let convert = require('./convertCSVDataToArray');
let Papa = require('papaparse');
const __sourceFilesDir = "./source-files/";

let convertCSV = (filename: string) => {
    return new Promise((resolve, reject) => {
        let csvLinesStr = "";
        const file = fs.readFileSync(__sourceFilesDir + 'csv/' + filename);

        return new Promise((resolveParse) => {
            Papa.parse(file.toString(), {
                complete: (results: any) => {
                    resolveParse(convert((results.data).slice(1, results.data.length - 3), 15));
                },
                error: (err: any) => {
                    console.error(err.toString());
                }
            });
        }).then(data => {
            resolve(data);
        });
    });
};

module.exports = convertCSV;