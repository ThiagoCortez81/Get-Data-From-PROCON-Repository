/**
 * Author: Thiago Cortez
 */

// Dependencias
let fs = require("fs");
let AdmZip = require('adm-zip')
let unzip = require('unzip')


let unzipToFile = (file_name) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(__sourceFilesDir + file_name).pipe(unzip.Extract({path: __sourceFilesDir + 'csv'}));
        resolve(true);
    });
};

module.exports = unzipToFile;