<?php

$storeFile = __DIR__ . '/store.json';

$circJsonString = file_get_contents($storeFile);
$circsData = json_decode($circJsonString);

if (json_last_error() !== JSON_ERROR_NONE) {
    throw new Exception('Circ store corrupt');
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($_GET['action'] === 'get') {

        $circString = $circsData[array_rand($circsData)];

        if ($circString === null) {
            throw new Exception('Circ not found');
        }

        header('Content-Type: text/json');
        echo $circString;
    }
}
