const mysql = require('mysql');
const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const connectionName = process.env.INSTANCE_CONNECTION_NAME || 'tranzactions';
const dbUser = process.env.SQL_USER || 'root';
const dbPassword = process.env.SQL_PASSWORD || 'iot-automation';
const dbName = process.env.SQL_NAME || 'iot_db';

const mysqlConfig = {
    connectionLimit: 1,
    user: dbUser,
    password: dbPassword,
    database: dbName,
};

if (process.env.NODE_ENV == 'production') {
    mysqlConfig.socketPath = '/cloudsql/cloud-project-iot-mapa:europe-west1:iot-automation';
}
let mysqlPool;


function getRandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

function generateNewKey(res) {
    let key = '';
    let len = 32;
    while (len > 0) {
        if (len == 24 || len == 20 || len == 16 || len == 12)
            key += '-';
        key += alphabet[getRandomNumber(alphabet.length)];
        len -= 1;
    }
    mysqlPool.query("INSERT INTO `Keys` VALUES('" + key + "', '" + getDateTime() + "', '" + getDateTime() + "')", (err, result) => {
        if (err)
            res.status(500).send('Cheia ' + key + ' NU a fost introdusa.');
        else
            res.status(201).send('Cheia ' + key + ' a fost introdusa.');
    });
}

exports.createKey = (req, res) => {
    if (!mysqlPool) {
        mysqlPool = mysql.createPool(mysqlConfig);
    }
    mysqlPool.query('SELECT 1 FROM `Keys` WHERE `key` NOT IN (SELECT keyid FROM Users)', (err, result) => {
        if (err)
            res.status(500).send('Eroare' + err);
        else {
            if (result.length < 5)
                generateNewKey(res);
            else {
                res.status(200).send('Sunt ' + result.length + ' chei nefolosite. Nu se vor genera noi chei');
            }
        }
    });
};