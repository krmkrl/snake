let highScores;

const NUM_SCORES = 10;

function getHighScores() {
    return fetch("/scores", {
    })
    .then(handleErrors)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        highScores = json;
    });
}

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function populateHighScoreTable() {
    let highScoresElem = document.getElementById("highScores");
    let scoresTable = "<table>";
    scoresTable += "<tr><th>Name</th><th>Score</th></tr>";

    for (let i = 0; i < highScores.length; i++) {
        scoresTable += "<tr>";
        let scoreElem = highScores[i];
        let name = scoreElem["name"];
        let score = scoreElem["score"];
        scoresTable += "<td>" + name + "</td>";
        scoresTable += "<td>" + score + "</td>";
        scoresTable += "</tr>";
    }

    scoresTable += "</table>";
    highScoresElem.innerHTML = scoresTable;
}

function isScoreInHighScores(score) {
    if (score == 0) {
        return false;
    }
    if (highScores.length < NUM_SCORES) {
        return true;
    }
    for (let i = 0; i < highScores.length; i++) {
        let scoreElem = highScores[i];
        let highScore = scoreElem["score"];
        if (score > highScore) {
            return true;
        }
    }
    return false;
}

function askForName() {
    let name = prompt("Congratulations!\nPlease enter your name.", "");
    if (name == null || name.length == 0) {
        name = "Anonymous";
    }
    if (name.length > 10) {
        name = name.substring(0, 10);
    }
    return name
}

function insertNewHighScore(name, score) {
    let insertIndex = highScores.length;
    for (let i = 0; i < highScores.length; i++) {
        let scoreElem = highScores[i];
        if (score > scoreElem["score"]) {
            insertIndex = i;
            break;
        }
    }
    // insert name and score at the correct position
    highScores.splice(insertIndex, 0, {name:name, score:score});
    if (highScores.length > NUM_SCORES) {
        // remove the last score
        highScores.splice(highScores.length - 1, 1);
    }
}

function sendNewHighScore(name, score) {
    let newScore = {"name":name, "score":score};
    return fetch("/score", {
        method: 'POST',
        body: JSON.stringify(newScore),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(handleErrors);
}