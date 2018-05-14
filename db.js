const sqlite3 = require('sqlite3').verbose();

function init() {
    const db = new sqlite3.Database('./snake.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
        }
        db.run('CREATE TABLE IF NOT EXISTS user(nickname text, token text, score int)');
        console.log('Connected to the chinook database.');
    });

    return db;
}


function addUser(nickname, token) {
    const db = init();
    db.run(`INSERT INTO user(nickname, token, score) VALUES(?, ?, ?)`, [nickname, token, 0], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}

function incPoint(token) {
    const db = init();
    db.run(`UPDATE user SET score = score + 1 WHERE token=?`, [token], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been updated with rowid ${this.lastID}`);
    });
}

function getScores() {
    const db = init();
    return new Promise((resolve, reject) => {
        db.all(`SELECT nickname, score from user ORDER BY score DESC LIMIT 5`, [], (err, rows) => {

            if (err) {
                reject(err);
            }

            db.close();
            resolve(rows);
        })
    });
}

module.exports = {
    addUser: addUser,
    incPoint: incPoint,
    getScores: getScores
};