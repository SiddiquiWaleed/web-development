let config = require('./../config')
let mysql = require('mysql')

let conn = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.dbName
})

conn.connect()

module.exports = conn