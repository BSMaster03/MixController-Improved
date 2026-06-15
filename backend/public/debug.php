<?php

header("Content-Type: application/json");

// Muestra todo lo que llega por POST
echo json_encode([
    "POST" => $_POST,
    "RAW" => json_decode(file_get_contents("php://input"), true),
    "FILES" => $_FILES,
    "SERVER" => $_SERVER
], JSON_PRETTY_PRINT);
