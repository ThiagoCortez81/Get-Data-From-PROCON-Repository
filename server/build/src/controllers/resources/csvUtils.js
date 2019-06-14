"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Author: Thiago Cortez
 */
const fs = __importStar(require("fs"));
const syncController_1 = __importDefault(require("../syncController"));
// Dependencias
let csv = require('csv');
let obj = csv();
let convert = require('./convertCSVDataToArray');
let Papa = require('papaparse');
const __sourceFilesDir = "./source-files/";
let convertCSV = (filename, file_url) => {
    return new Promise((resolve, reject) => {
        const file = fs.readFileSync(__sourceFilesDir + 'csv/' + filename);
        const fileData = fs.statSync(__sourceFilesDir + 'csv/' + filename);
        const fileModificationTime = fileData.mtime.toString().replace('T', ' ').replace('Z', '');
        if (file_url != undefined) {
            syncController_1.default.selectAuditoria(fileModificationTime, file_url).then(response => {
                console.log(response);
                doConversion(file).then(data => {
                    resolve(data);
                });
            });
        }
        else {
            doConversion(file).then(data => {
                resolve(data);
            });
        }
    });
};
const doConversion = (file) => {
    return new Promise((resolveParse) => {
        Papa.parse(file.toString(), {
            complete: (results) => {
                resolveParse(convert((results.data).slice(1, results.data.length - 3), 1000));
            },
            error: (err) => {
                console.error(err.toString());
            }
        });
    });
};
module.exports = convertCSV;
