/**
 * Author: Thiago Cortez
 */

// Dependencias
let getAbsolute = require('path').resolve;
let unzip = require('node-stream-zip');

let unzipToFile = (file_name) => {
    return new Promise((resolve, reject) => {
        const csvFileName = file_name.substr(0, file_name.length - 3) + 'csv';
        const zipPath = getAbsolute(__sourceFilesDir + file_name);
        const extractDir = getAbsolute(__sourceFilesDir + 'csv') + '/' + csvFileName;

        const zip = new unzip({
            file: zipPath,
            storeEntries: true
        });

        zip.on('ready', () => {
            zip.extract(csvFileName, extractDir, err => {
                zip.close();
                resolve(!err);
            });
        });
    });
};

module.exports = unzipToFile;