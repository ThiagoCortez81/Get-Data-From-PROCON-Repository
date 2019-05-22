/**
 * Author: Thiago Cortez
 */

// Dependencias
let db = require('mysql');

let connection = db.createConnection({
        host: __databaseConfig.host,
        user: __databaseConfig.user,
        password: __databaseConfig.password,
        database: __databaseConfig.database
    }
);

let getTableFields = (db, table) => {
    let query = `SELECT GROUP_CONCAT(COLUMN_NAME) as fields
                  FROM INFORMATION_SCHEMA.COLUMNS
                  WHERE TABLE_SCHEMA = ${db.escape(__databaseConfig.database)} AND TABLE_NAME = ${db.escape(table)} AND COLUMN_KEY <> 'PRI'`;

    return new Promise((resolve, reject) => {
        db.query(query, function (error, results, fields) {
            if (error)
                resolve(null);
            else
                resolve(results[0].fields);
        });
    });
};

let insert = (db, table, data) => {
    return new Promise((resolve, reject) => {
        if (db !== null && table !== '' && table !== null && data instanceof Array && data.length > 0) {
            getTableFields(db, table)
                .then((tableFields) => {
                    let query = `INSERT INTO ${scapeToBd(table)}(${scapeToBd(tableFields)}) VALUES ?`;
                    db.query(query, [data], function (error, result, fields) {
                        if (error) {
                            console.log(data);
                            console.log('Erro ao inserir no banco: ' + error);
                            process.exit(0);
                            resolve(false);
                        } else
                            resolve(true);
                    });
                }).catch(err => {
                console.error(err.toString());
            })
        } else
            resolve(false);
    })
};

let scapeToBd = (str) => {
    if (str != null)
        return str.replace('/*', '').replace('--', '').replace('*/', '');
    return str;
};

module.exports = {
    connection,
    insert
};