<?php
function getConnection() {

    $host = "sql100.infinityfree.com";   // Host de MySQL
    $db   = "if0_41711763_mibase";       // Nombre de tu base
    $user = "if0_41711763";              // Usuario MySQL
    $pass = "QaUFoetxe0DX";          // Contraseña MySQL
    $charset = "utf8mb4";

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    return new PDO($dsn, $user, $pass, $options);
}

