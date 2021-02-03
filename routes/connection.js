var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "akshara",
    password: "@Mm@8960"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SHOW databases", (err, res) => {
        if (err) throw (err);
        rs = res;
        console.log(res);
    })
    con.query("use rvcms", (err, res) => {
        if (err) throw (err);
        console.log(res);
    })
});

module.exports = con;