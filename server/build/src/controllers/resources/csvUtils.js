"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Author: Thiago Cortez
 */
const fs = __importStar(require("fs"));
// Dependencias
let csv = require('csv');
let obj = csv();
let convert = require('./convertCSVDataToArray');
let Papa = require('papaparse');
const __sourceFilesDir = "./source-files/";
let convertCSV = (filename) => {
    return new Promise((resolve, reject) => {
        let csvLinesStr = "";
        const file = fs.readFileSync(__sourceFilesDir + 'csv/' + filename);
        return new Promise((resolveParse) => {
            Papa.parse(file.toString(), {
                complete: (results) => {
                    resolveParse(convert((results.data).slice(1, results.data.length - 3), 15));
                },
                error: (err) => {
                    console.error(err.toString());
                }
            });
        }).then(data => {
            resolve(data);
        });
    });
};
module.exports = convertCSV;
