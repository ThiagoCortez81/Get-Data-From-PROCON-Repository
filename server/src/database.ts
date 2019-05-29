import * as mysql from 'mysql';

import config from '../config.json';

const pool = mysql.createPool(config.databaseConf);

pool.getConnection((err, connection) => {
    connection.release();
    console.log('DB conectado com sucesso ! ');
});

export default pool;

//CONVERTIDO