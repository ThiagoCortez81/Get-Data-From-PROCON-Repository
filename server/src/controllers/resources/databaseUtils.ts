/**
 * Author: Thiago Cortez
 */
import {strictEqual} from "assert";

// Dependencias
let db = require('mysql');
const staticData = require('../../../config.json');
const __databaseConfig = staticData.databaseConf;

let connection = db.createConnection({
        host: __databaseConfig.host,
        user: __databaseConfig.user,
        password: __databaseConfig.password,
        database: __databaseConfig.database
    }
);

let getTableFields = (db: any, table: string) => {
    let query = `SELECT GROUP_CONCAT(COLUMN_NAME) as fields
                  FROM INFORMATION_SCHEMA.COLUMNS
                  WHERE TABLE_SCHEMA = ${db.escape(__databaseConfig.database)} AND TABLE_NAME = ${db.escape(table)} AND COLUMN_KEY <> 'PRI'`;

    return new Promise((resolve, reject) => {
        db.query(query, function (error: boolean, results: any, fields: any) {
            if (error)
                resolve(undefined);
            else
                resolve(results[0].fields.toString());
        });
    });
};

let insert = (db: any, table:string, data: Array<Array<String>>) => {
    return new Promise((resolve, reject) => {
        if (db !== null && table !== '' && table !== null && data instanceof Array && data.length > 0) {
            getTableFields(db, table)
                .then((tableFields) => {
                    let query = `INSERT INTO ${scapeToBd(table)}(${scapeToBd(tableFields.toString())}) VALUES ?`;
                    db.query(query, [data], function (error: boolean, result: any, fields: any) {
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

let select = (db: any, table: string, fields: string, condition: string) => {
    return new Promise((resolve, reject) => {
        if (db && table) {
            let query;
            if (condition !== "")
                condition = `WHERE ${condition}`;
            else
                condition = "";

            if (fields)
                query = `SELECT ${fields} FROM ${table} ${condition}`
            else
                query = `SELECT * FROM ${table} ${condition}`;

            db.query(query, function (error: boolean, result: any, fields: any) {
                resolve(result);
            })
        }
    });
};

let scapeToBd = (str: string) => {
    if (str != null)
        return str.replace('/*', '').replace('--', '').replace('*/', '');
    return str;
};

module.exports = {
    connection,
    insert,
    select
};