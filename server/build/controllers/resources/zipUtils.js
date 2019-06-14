"use strict";
/**
 * Author: Thiago Cortez
 */
// Dependencias
let getAbsolute = require('path').resolve;
let unzip = require('adm-zip');
const __sourceFilesDir = process.platform !== 'win32' ? "./source-files/" : require('os').homedir() + '/procon/source-files/';
let unzipToFile = (file_name) => {
    return new Promise((resolve, reject) => {
        const zipPath = getAbsolute(__sourceFilesDir + file_name);
        const extractDir = getAbsolute(__sourceFilesDir + 'csv');
        const zip = new unzip(zipPath);
        zip.extractAllTo(extractDir, true);
        resolve(true);
    });
};
module.exports = unzipToFile;
