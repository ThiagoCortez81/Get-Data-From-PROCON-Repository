import config from '../config.json';
import * as mysql from 'mysql';
const mongoose = require('mongoose');

export const pool = mysql.createPool(config.databaseConf.mysql);
pool.getConnection((err, connection) => {
    connection.release();
    console.log(`DB (MySQL) conectado em '${config.databaseConf.mysql.host}/${config.databaseConf.mysql.database}' com sucesso! `);
});

const mongoConnection = mongoose.connect(`mongodb://${config.databaseConf.mongo.host}/${config.databaseConf.mongo.database}`, {useNewUrlParser: true});

mongoConnection.then(() => {
        console.log(`MongoDB conectado em 'mongodb://${config.databaseConf.mongo.host}/${config.databaseConf.mongo.database}' com sucesso!`);
});
