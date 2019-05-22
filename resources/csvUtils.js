/**
 * Author: Thiago Cortez
 */

// Dependencias
var fs = require('fs');
let csv = require('csv');
let obj = csv();
let convert = require('./convertCSVDataToArray');
let Papa = require('papaparse');

let convertCSV = (filename) => {
    return new Promise((resolve, reject) => {
        let csvLinesStr = "";
        const file = fs.readFileSync(__sourceFilesDir + 'csv/' + filename);

        return new Promise((resolveParse) => {
            Papa.parse(file.toString(), {
                complete: results => {
                    resolveParse(convert((results.data).slice(1, results.data.length - 3)));
                },
                error: err => {
                    console.error(err.toString());
                }
            });
        }).then(data => {
            resolve(data);
        });
    });
};

module.exports = convertCSV;