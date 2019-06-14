"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencias
let db = require('mysql');
const staticData = require('../../../config.json');
const __databaseConfig = staticData.databaseConf;
let connection = db.createConnection({
    host: __databaseConfig.host,
    user: __databaseConfig.user,
    password: __databaseConfig.password,
    database: __databaseConfig.database
});
let getTableFields = (db, table) => {
    let query = `SELECT GROUP_CONCAT(COLUMN_NAME) as fields
                  FROM INFORMATION_SCHEMA.COLUMNS
                  WHERE TABLE_SCHEMA = ${db.escape(__databaseConfig.database)} AND TABLE_NAME = ${db.escape(table)} AND COLUMN_KEY <> 'PRI'`;
    return new Promise((resolve, reject) => {
        db.query(query, function (error, results, fields) {
            if (error)
                resolve(undefined);
            else
                resolve(results[0].fields.toString());
        });
    });
};
let insert = (db, table, data, dataCliente, dataConsumidorReclamacao) => {
    return new Promise((resolve, reject) => {
        if (db !== null && table !== '' && table !== null && data instanceof Array && data.length > 0) {
            getTableFields(db, table)
                .then((tableFields) => {
                let query = `INSERT INTO ${scapeToBd(table)}(${scapeToBd(tableFields.toString())}) VALUES ?`;
                db.query(query, [data], function (error, result, fields) {
                    if (error) {
                        console.log(data);
                        console.log('Erro ao inserir no banco: ' + error);
                        process.exit(0);
                        resolve(false);
                    }
                    else {
                        if (dataCliente != undefined && dataConsumidorReclamacao != undefined) {
                            let firstInsertIdReclamacao = result.insertId; // Capturando primeiro ID inserido na operação
                            let lastInsertIdReclamacao = firstInsertIdReclamacao + (result.affectedRows - 1);
                            let newDataCliente = [];
                            for (let line of dataCliente) {
                                line[line.length] = firstInsertIdReclamacao;
                                firstInsertIdReclamacao++;
                                newDataCliente.push(line);
                                if (firstInsertIdReclamacao > lastInsertIdReclamacao)
                                    break;
                            }
                            let queryCliente = `INSERT INTO consumidor (consumidor_faixa_etaria, consumidor_sexo, consumidor_cep, reclamacao_id) VALUES ?`;
                            db.query(queryCliente, [newDataCliente], function (error, result2, fields) {
                                if (!error)
                                    resolve(true);
                                else
                                    resolve(false);
                            });
                        }
                        else
                            resolve(true);
                    }
                });
            }).catch(err => {
                console.error(err.toString());
            });
        }
        else
            resolve(false);
    });
};
let select = (db, table, fields, condition) => {
    return new Promise((resolve, reject) => {
        if (db && table) {
            let query;
            if (condition !== "")
                condition = `WHERE ${condition}`;
            else
                condition = "";
            if (fields)
                query = `SELECT ${fields} FROM ${table} ${condition}`;
            else
                query = `SELECT * FROM ${table} ${condition}`;
            db.query(query, function (error, result, fields) {
                resolve(result);
            });
        }
    });
};
let scapeToBd = (str) => {
    if (str != null)
        return str.replace('/*', '').replace('--', '').replace('*/', '');
    return str;
};
module.exports = {
    connection,
    insert,
    select
};
