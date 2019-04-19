/**
 * Author: Thiago Cortez
 */

// Dependencias
let fs = require("fs");
let AdmZip = require('adm-zip')
let unzip = require('unzip')


let unzipToFile = (file_name) => {
    fs.createReadStream( __sourceFilesDir + file_name).pipe(unzip.Extract({ path: __sourceFilesDir + 'csv' }));
};

module.exports = unzipToFile;