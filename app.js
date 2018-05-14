const express = require('express');
const bodyParser = require('body-parser');
const CryptoJS = require("crypto-js");
const cors = require('cors');
const db = require('./db');
const app = express();
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies

const SECRET = "123647^&*one$two";

app.post('/generate-token/:nickname', (req, res) => {
    const nickname = req.params.nickname;
    const data = nickname + SECRET + new Date().getTime();
    const token = CryptoJS.SHA256(data).toString();

    db.addUser(nickname, token);
    res.send({token, nickname});
});

app.put('/scores/:token', (req, res) => {
    const token = req.params.token;
    const snake = req.body.snake;
    const item = req.body.item; // x, y

    let snakeItemSize = Math.abs(snake[snake.length-1].x - snake[snake.length-2].x);
    if (snakeItemSize === 0) {
        snakeItemSize = Math.abs(snake[snake.length-1].y - snake[snake.length-2].y);
    }

    const head = snake[snake.length - 1];

    if (head.x + snakeItemSize === item.x || head.y + snakeItemSize === item.y) {
        db.incPoint(token);
    }

    res.status(200).send();
});

app.get('/scores', (req, res) => {
    db.getScores().
        then((rows) => res.status(200).send(rows))
        .catch((err) => {
        });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));