<?php
session_start();

// Initialize leaderboard if not present
if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = [];
}

// Function to compare scores
function compareScores($a, $b) {
    return $a['guesses'] - $b['guesses'];
}

// Function to update the leaderboard
function updateLeaderboard($answer, $guesses) {
    $entry = ['answer' => $answer, 'guesses' => $guesses];
    $_SESSION['leaderboard'][] = $entry;
    usort($_SESSION['leaderboard'], 'compareScores');
    if (count($_SESSION['leaderboard']) > 10) {
        array_pop($_SESSION['leaderboard']);
    }
}

// Handle leaderboard update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['answer']) && isset($data['guesses'])) {
        updateLeaderboard($data['answer'], $data['guesses']);
        echo json_encode(['status' => 'leaderboard updated']);
        exit;
    }
}

// Handle leaderboard fetch
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['leaderboard' => $_SESSION['leaderboard']]);
    exit;
}