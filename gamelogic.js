//Renojan Kannan (300240070) and Karthikan Suntharesan (300240065)

let WORDS = ["apple", "pear", "banana", "orange"];
const NUMBER_OF_GUESSES = 6;
let answer = WORDS[Math.floor(Math.random() * WORDS.length)];
let gleft = NUMBER_OF_GUESSES;
let rowIndex = 0;
//checks if input string is a letter (used to check if guess contains only letters)
const isAlpha = str => /^[a-zA-Z]*$/.test(str);

/*
This function creates the 6x5 game board that Wordle will be played in
Each row is created as a div element, assigned to classname "guess row" and a variable named "row"
Each box that will contain a letter is created as a div element, assigned to classname "letter_box" and is appended to the current row
Each row is appended to the game board
*/
function createBoard() {
    let board = document.getElementById("game_board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
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

createBoard();


/*
This function will listen for keystrokes and execute helper functions based on the input
*/
document.addEventListener("keyup", (e) => {

    //if no guesses left, return
    if(gleft === 0){
        return;
    }

    //store input
    let pressedKey = String(e.key);
    
    if(pressedKey === "Backspace"){
        deleteLetter();
        return;
    }

    if(pressedKey === "Enter"){
        checkGuess();
        return;
    }

    // if(isAlpha(pressedKey) && lettersleft !== 0){
    //     insertLetter(pressedKey);
    // } else {
    //     return;
    // }

    insertLetter(pressedKey);
})

function deleteLetter(){
    return
}

function checkGuess(){
    return
}

function insertLetter(letter){
    if(lettersleft === 0){
        return
    }
    let row = document.getElementsByClassName("guess_row")[6 - guessesRemaining]
    let box = row.children[rowIndex]
    box.textContent = letter
    box.classList.add("filled_box")
    currentGuess.push(letter)
    rowIndex += 1
}

