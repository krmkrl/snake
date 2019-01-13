let gameCanvas = document.getElementById("snakeCanvas");
let ctx = gameCanvas.getContext("2d");

let score = 0;
let gameStarted = false;
let gameOver = false;
let changingDirection = false;

let endAudio = new Audio('end.mp3');
let eatAudio = new Audio('eat.mp3');

document.addEventListener("keydown", keyPressed)
setupImageKeysEventListeners();

getHighScores()
    .then(populateHighScoreTable)
    .catch(error => console.error('Error:', error));

let snake = new Snake();
let food = new Food();

resetGame();

function setupImageKeysEventListeners() {
    let imageKeys = {
        ".imageKeyUp": "ArrowUp",
        ".imageKeyDown": "ArrowDown",
        ".imageKeyLeft": "ArrowLeft",
        ".imageKeyRight": "ArrowRight",
    }

    for (const imageKey of Object.keys(imageKeys)) {
        $(imageKey).mousedown((event) => {
            event.key = imageKeys[imageKey];
            keyPressed(event);
        });
        $(imageKey).click((event) => {
            event.preventDefault();
        });
    }
}

function keyPressed(event) {
    if (gameOver) {
        resetGame();
        return;
    }
    if (!gameStarted) {
        gameStarted = true;
        mainLoop();
        return;
    }
    if (changingDirection) {
        return;
    }
    changingDirection = true;

    const keyPressed = event.key;

    if (keyPressed === "ArrowUp" && !snake.goingDown()) {
        snake.goUp();
    }
    if (keyPressed === "ArrowDown" && !snake.goingUp()) {
        snake.goDown();
    }
    if (keyPressed === "ArrowLeft" && !snake.goingRight()) {
        snake.goLeft();
    }
    if (keyPressed === "ArrowRight" && !snake.goingLeft()) {
        snake.goRight();
    }
}

function resetGame() {
    gameOver = false;
    gameStarted = false;
    score = 0;
    document.getElementById('score').innerHTML = score.toString();
    snake.clear();
    food.clear();
    clearCanvas();
    snake.createSnake();
    snake.draw();
    food.createFood();
    food.draw();
}

function mainLoop() {
    setTimeout(gameStep, GAME_SPEED);
}

function gameStep() {
    let eatenFood = snake.advance();
    if (snake.crashed()) {
        handleGameOver();
        return;
    }
    if (eatenFood != null) {
        eatAudio.play();
        setScoreAndGrowth(eatenFood);
        food.removeFood(eatenFood);
        createNewFood(eatenFood);
    }
    clearCanvas();
    food.draw();
    snake.draw();
    changingDirection = false;

    mainLoop();
}

function handleGameOver() {
    gameOver = true;
    endAudio.play();
    getHighScores()
        .then(() => {
            if (isScoreInHighScores(score)) {
                let name = askForName();
                insertNewHighScore(name, score);
                return sendNewHighScore(name, score);
            }
        })
        .then(populateHighScoreTable)
        .catch(error => console.error('Error:', error));
}

function setScoreAndGrowth(eatenFood) {
    let growth = snake.getGrowth();
    if (eatenFood.type == FoodType.SUPER) {
        score += SUPERFOOD_SCORE;
        growth += SUPERFOOD_SCORE;
    } else if (eatenFood.type == FoodType.GOLDEN) {
        score += GOLDENFOOD_SCORE;
        growth += GOLDENFOOD_SCORE;
    } else {
        score += FOOD_SCORE;
        growth += FOOD_SCORE;
    }
    $('#score').html(score.toString());
    snake.setGrowth(growth - 1);
}

function createNewFood(eatenFood) {
    if (eatenFood.type == FoodType.GOLDEN && hasSpaceLeftForFood(GOLDENFOOD_MULTIPLIER)) {
        for (let i = 0; i < GOLDENFOOD_MULTIPLIER; i++) {
            food.createFood();
        }
    } else if (food.size() == 0) {
        food.createFood();
    }
}

function hasSpaceLeftForFood(num) {
    let gameWidth = parseInt(gameCanvas.width);
    let gameHeight = parseInt(gameCanvas.height);
    let numItemsOnGame = snake.size() + food.size();
    let totalElems = (gameWidth / ELEM_SIZE) * (gameHeight / ELEM_SIZE);
    let freeElems = totalElems - numItemsOnGame;
    return freeElems >= num;
}

function clearCanvas() {
    let style = document.defaultView.getComputedStyle(gameCanvas, null);
    ctx.fillStyle = style.getPropertyValue('background-color');
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}