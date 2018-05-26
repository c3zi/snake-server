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
    const snakeLength = snake.length - 1;

    if (snake[snakeLength].x !== item.x || snake[snakeLength].y !== item.y) {
        res.status(409).send();
    }

    const diffX = snake[snakeLength-1].x - snake[snakeLength-2].x;
    const diffY = snake[snakeLength-1].y - snake[snakeLength-2].y;
    let direction = null;

    if (diffX > 0) {
        direction = 'right';
    } else if (diffX < 0) {
        direction = 'left';
    } else if (diffY > 0) {
        direction = 'down';
    } else {
        direction = 'up';
    }

    snake.forEach(function(value, index) {
        let x = value.x;
        let y = value.y;
        const movement = ((snakeLength - index - 1) * 15);
        if (direction === 'right') {
            x = value.x + movement;
        } else if (direction === 'left') {
            x = value.x - movement;
        } else if (direction === 'down') {
            y = value.y + movement;
        } else {
            y = value.y - movement;
        }
    });

    db.incPoint(token);
    res.status(200).send();
});

app.get('/scores', (req, res) => {
    db.getScores().
        then((rows) => res.status(200).send(rows))
        .catch((err) => {
        });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));