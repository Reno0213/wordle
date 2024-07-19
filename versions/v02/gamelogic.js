document.addEventListener("DOMContentLoaded", () => {
    const newGameBtn = document.getElementById("newGameBtn");
    newGameBtn.addEventListener('click', startNewGame);

    fetchGameState();

    document.addEventListener("keyup", (e) => {
        if (gameOver) return;

        let row = document.getElementsByClassName("guess_row")[6 - gleft];
        let box = row.children[rowIndex];

        let pressedKey = String(e.key);

        if (pressedKey === "Backspace") {
            if (rowIndex > 0) {
                box = row.children[--rowIndex];
                deleteLetter(box);
            }
            return;
        }

        if (pressedKey === "Enter") {
            if (rowIndex === 5) {
                submitGuess(row);
            }
            return;
        }

        if (isAlpha(pressedKey)) {
            insertLetter(pressedKey.toUpperCase(), box);
        }
    });
});

function fetchGameState() {
    fetch('game.php')
        .then(response => response.json())
        .then(data => {
            answer = data.answer;
            gleft = data.guesses_left;
            rowIndex = data.rowIndex;
            gameOver = data.game_over;
            createBoard();

            if (gameOver) {
                document.getElementById("newGameBtn").style.display = "block";
                document.getElementById("finalmsg").innerText = data.guesses_left === 0 ? "Word was: " + data.answer : "You Won!";
                if (data.guesses_left > 0) {
                    updateLeaderboard(data.answer, 6 - data.guesses_left);
                }
            }
        });
}

function createBoard() {
    let board = document.getElementById("game_board");
    board.innerHTML = '';

    for (let i = 0; i < 6; i++) {
        let row = document.createElement("div");
        row.className = "guess_row";

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div");
            box.className = "letter_box";
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function startNewGame() {
    fetch('game.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'newGame' }),
    })
    .then(response => response.json())
    .then(data => {
        location.reload();
    });
}

function submitGuess(row) {
    let guess = Array.from(row.children).map(box => box.textContent).join('');

    fetch('game.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess: guess }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'game over') return;
        
        updateBoard(row, data.result);
        gleft -= 1;
        rowIndex = 0;

        if (data.status === 'won' || data.status === 'lost') {
            gameOver = true;
            document.getElementById("finalmsg").innerText = data.status === 'won' ? "You Won!" : "Word was: " + data.answer;
            document.getElementById("newGameBtn").style.display = "block";
            if (data.status === 'won') {
                updateLeaderboard(data.answer, 6 - gleft);
            }
        }
    });
}

function updateBoard(row, result) {
    for (let i = 0; i < result.length; i++) {
        let box = row.children[i];
        if (result[i] === 'correct') {
            box.classList.add("correct_box");
        } else if (result[i] === 'close') {
            box.classList.add("close_box");
        } 
        else {
            box.classList.add("wrong_box");
        }
    }
}

function deleteLetter(box) {
    box.textContent = "";
}

function insertLetter(letter, box) {
    if (rowIndex < 5) {
        box.textContent = letter;
        rowIndex += 1;
    }
}

var isAlpha = function(ch) {
    return /^[A-Z]$/i.test(ch);
}

function updateLeaderboard(answer, guesses) {
    fetch('leaderboard.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answer, guesses: guesses }),
    })
    .then(response => response.json())
    .then(data => {
        fetchLeaderboard();
    });
}

function fetchLeaderboard() {
    fetch('leaderboard.php')
        .then(response => response.json())
        .then(data => {
            let leaderboardDiv = document.getElementById("leaderboard");
            leaderboardDiv.innerHTML = "<div class='leaderboard-header'><div>Word</div><div>Guesses</div></div>";
            data.leaderboard.forEach((entry, index) => {
                let entryDiv = document.createElement("div");
                entryDiv.className = "leaderboard-entry";
                entryDiv.innerHTML = `<div>${entry.answer}</div><div>${entry.guesses}</div>`;
                leaderboardDiv.appendChild(entryDiv);
            });
        });
}
