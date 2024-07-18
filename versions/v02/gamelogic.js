//Renojan Kannan (300240070) and Karthikan Suntharesan (300240065)


let WORDS = [
    "Apple", "Bread", "Chair", "Dance", "Eagle", 
    "Flash", "Grace", "Happy", "Jelly", "Knack",
    "Light", "Maple", "Nerve", "Ocean", "Prime", 
    "Quiet", "Ready", "Scale", "Treat", "Usual",
    "Vivid", "Woven", "Yield", "Zebra", "Alert", 
    "Blame", "Crust", "Draft", "Event", "Field",
    "Angle", "Blaze", "Cider", "Dream", "Entry",
    "Flour", "Grape", "Hotel", "Ivory", "Jewel",
    "Knife", "Lemon", "March", "North", "Olive",
    "Pouch", "Quest", "Radio", "Shelf", "Thing",
    "Unity", "Value", "Whole", "Zephyr"
];
const NUMBER_OF_GUESSES = 6;
let answer = WORDS[Math.floor(Math.random() * WORDS.length)];
let gleft = NUMBER_OF_GUESSES;
let rowIndex = 0;
let boxNum = 0;
let gameOver = false;

//button that displays after the game is done
const newButton = document.createElement('button');
newButton.textContent = 'Play Again!';
//checks if input string is a letter (used to check if guess contains only letters)
var isAlpha = function(ch){
    return /^[A-Z]$/i.test(ch);
  }

  createBoard();


// });
/*
This function will listen for keystrokes and execute helper functions based on the input
*/
document.addEventListener("keyup", (e) => {
    
    // if (gameOver) return; // no inputs accepted if game is done

    // //rowindex is being used to track columns and not box
    // let row = document.getElementsByClassName("guess_row")[6 - gleft]
    // let box = row.children[rowIndex]

    // let pressedKey = String(e.key);
    
    // if(pressedKey === "Backspace"){
    //     box = row.children[rowIndex - 1] //sending the previous box to the function since the current pointer should be on an empty box due to insertletter
    //     deleteLetter(box);
    //     return;
    // }

    // if(pressedKey === "Enter"){
    //     checkGuess(row);
    //     return;
    // }

    // if(isAlpha(pressedKey)){
    //     insertLetter(pressedKey, box);
    // } else {
    //     return;
    // }

    let pressedKey = String(e.key);

    var request = new XMLHttpRequest();

    if(pressedKey === "Backspace"){
        request.open("DELETE", "server.php");
    }

    else {
        request.open("POST", "server.php");
    }
    
})

//reload page to play again
newButton.addEventListener('click', () => {
    location.reload();
  });

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
        row.setAttribute("id", "row "+ i);
        
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div");
            
            box.className = "letter_box";
            box.setAttribute("id", "box " + i + "-" + j);
            row.appendChild(box);
        }

        board.appendChild(row);
    }
}

function deleteLetter(box){
    if (rowIndex == 0) return; //dont do anything if no inputs
    box.textContent = ""; 
    rowIndex -= 1; //setting pointer to be at the current box with a letter which is the previous box
}

function checkGuess(row){
    if (rowIndex < 4 || row.children[4].textContent === "") return; //do nothing if boxes not filled or the last box is empty
    gleft--; //subtract a guess
    let checkIndex = 0;
    let numRight = 0;
    for(let i = 0; i < 5; i++){
        box = row.children[checkIndex]; //not using rowindex as itll mess up the other functions
        if(box.textContent === answer[i]){
            numRight++;
            box.classList.add("correct_box");
        }
        else if(answer.includes(box.textContent)) {
            box.classList.add("close_box");
        }
        else{
            box.classList.add("wrong_box");
        }
        checkIndex++;
    }

    if (numRight === 5){
        gameOver = true;
        document.getElementById("finalmsg").innerText = "You Won!";
        document.body.appendChild(newButton);

    } else if(gleft === 0) {
        gameOver = true;
        document.getElementById("finalmsg").innerText = "Word was: " + answer;
        document.body.appendChild(newButton);
    }
    
    row = document.getElementsByClassName("guess_row")[6 - gleft] // move to next row
    rowIndex = 0; //reset column counter
    

    numRight = 0; //reset the counter so that next guesses dont increment the amount correct

    
    
}

function insertLetter(letter, box){
    
    if (rowIndex ==  5) return; // stop anymore letters being added
    box.textContent = letter

    // this will send u to the next box in the row which should be empty
    rowIndex += 1 
}


