const SCORES_FILE = "saved_scores.json";

let highScores;

function getHighScores() {
    return fetch(SCORES_FILE, {
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

    let highScoreList = highScores["scores"];
    for (let i = 0; i < highScoreList.length; i++) {
        scoresTable += "<tr>";
        let scoreElem = highScoreList[i];
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
    let highScoreList = highScores["scores"];
    for (let i = 0; i < highScoreList.length; i++) {
        let scoreElem = highScoreList[i];
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
    let highScoreList = highScores["scores"];
    let insertIndex = highScoreList.length - 1;
    for (let i = 0; i < highScoreList.length; i++) {
        let scoreElem = highScoreList[i];
        if (score > scoreElem["score"]) {
            insertIndex = i;
            break;
        }
    }
    // insert name and score at the correct position
    highScoreList.splice(insertIndex, 0, {name:name, score:score});
    // remove the last score
    highScoreList.splice(highScoreList.length - 1, 1);
}

function sendNewHighScore(name, score) {
    let newScore = {"name":name, "score":score};
    return fetch("new_highscore", {
        method: 'PUT',
        body: JSON.stringify(newScore),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(handleErrors);
}