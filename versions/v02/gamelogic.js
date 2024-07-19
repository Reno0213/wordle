document.addEventListener("DOMContentLoaded", () => {
    const newGameBtn = document.getElementById("newGameBtn");
    newGameBtn.addEventListener('click', startNewGame);

    fetchGameState();

    document.addEventListener("keyup", (e) => {
        if (gameOver) return;

        // Get the current row to work on
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
            if (rowIndex === 5) { // Only allow submission if row is complete
                submitGuess(row);
            }
            return;
        }

        if (isAlpha(pressedKey)) {
            insertLetter(pressedKey.toUpperCase(), box); // Ensure uppercase input
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
            // currentGuess = data.current_guess;
            createBoard();
            if (gameOver) {
                document.getElementById("newGameBtn").style.display = "block";
                if (data.guesses_left === 0) {
                    document.getElementById("finalmsg").innerText = "Word was: " + data.answer;
                } 
                else {
                    document.getElementById("finalmsg").innerText = "You Won!";
                }
            }
        });
}

function createBoard() {
    let board = document.getElementById("game_board");
    board.innerHTML = ''; // Clear previous board if any

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
        if (data.status === 'game over') {
            return; // Prevent any action if game is already over
        }
        
        updateBoard(row, data.result);
        gleft -= 1; // Decrease guesses left
        rowIndex = 0; // Reset rowIndex for the next row

        if (data.status === 'won') {
            gameOver = true;
            //document.getElementById("finalmsg").innerText = "You Won!";
            document.getElementById("finalmsg").innerText = "You Won!";
            document.getElementById("newGameBtn").style.display = "block";
        } else if (data.status === 'lost') {
            gameOver = true;
            document.getElementById("finalmsg").innerText = "Word was: " + data.answer;
            document.getElementById("newGameBtn").style.display = "block";
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
