<?php
session_start();

// Initialize leaderboard if not set
if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = [];
}

// Initialize game state if not set
if (!isset($_SESSION['game'])) {
    startNewGame();
}

function startNewGame() {
    $words = ["APPLE", "BREAD", "CHAIR", "DANCE", "EAGLE", "FLASH", 
    "GRACE", "HAPPY", "JELLY", "KNACK", "LIGHT", "MAPLE", "NERVE", "OCEAN", 
    "PRIME", "QUIET", "READY", "SCALE", "TREAT", "USUAL", "VIVID", "WOVEN", 
    "YIELD", "ZEBRA", "ALERT", "BLAME", "CRUST", "DRAFT", "EVENT", "FIELD", 
    "ANGLE", "BLAZE", "CIDER", "DREAM", "ENTRY", "FLOUR", "GRAPE", "HOTEL", 
    "IVORY", "JEWEL", "KNIFE", "LEMON", "MARCH", "NORTH", "OLIVE", "POUCH", 
    "QUEST", "RADIO", "SHELF", "THING", "UNITY", "VALUE", "WHOLE", "ZEPHYR"];
    $answer = $words[array_rand($words)];
    $_SESSION['game'] = [
        'answer' => $answer,
        'guesses_left' => 6,
        'rowIndex' => 0,
        'game_over' => false,
        'current_guess' => []
    ];
}

function checkGuess($guess) {
    $answer = $_SESSION['game']['answer'];
    $result = [];
    $numRight = 0;

    for ($i = 0; $i < 5; $i++) {
        if ($guess[$i] == $answer[$i]) {
            $result[$i] = 'correct';
            $numRight++;
        } elseif (strpos($answer, $guess[$i]) !== false) {
            $result[$i] = 'close';
        } else {
            $result[$i] = 'wrong';
        }
    }

    $_SESSION['game']['guesses_left']--;
    $_SESSION['game']['rowIndex'] = 0;

    if ($numRight == 5) {
        $_SESSION['game']['game_over'] = true;
        return ['status' => 'won', 'result' => $result, 'answer' => $answer];
    } elseif ($_SESSION['game']['guesses_left'] == 0) {
        $_SESSION['game']['game_over'] = true;
        return ['status' => 'lost', 'result' => $result, 'answer' => $answer];
    }

    return ['status' => 'ongoing', 'result' => $result];
}

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['action']) && $data['action'] == 'newGame') {
            startNewGame();
            echo json_encode(['status' => 'new game started']);
        } elseif (isset($data['guess'])) {
            $response = checkGuess($data['guess']);
            echo json_encode($response);
        }
        break;
    case 'GET':
        echo json_encode($_SESSION['game']);
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        break;
}

