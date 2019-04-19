/**
 * Author: Thiago Cortez
 */

// Dependencias
let csv = require('csv');
let obj = csv();

let convertCSV = (filename) => {
    return new Promise((resolve, reject) => {
        console.log(__sourceFilesDir + 'csv/' + filename);
        obj.from.path(__sourceFilesDir + 'csv/' + filename).to.array(function (data) {
            resolve(data);
        });
    });
};

module.exports = convertCSV;