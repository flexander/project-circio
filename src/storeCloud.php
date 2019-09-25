<?php

$storeFile = __DIR__ . '/store.json';

$circJsonString = file_get_contents($storeFile);
$circsData = json_decode($circJsonString);

if (json_last_error() !== JSON_ERROR_NONE) {
    throw new Exception('Circ store corrupt');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $requestBody = file_get_contents('php://input');
    $requestJson = json_decode($requestBody);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON');
    }

    array_push($circsData, $requestJson);

    file_put_contents($storeFile, json_encode($circsData));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($_GET['action'] === 'list') {
        header('Content-Type: text/json');
        echo $circJsonString;
    }
    if ($_GET['action'] === 'get') {
        $circName = $_GET['name'];

        $filteredCircs = array_filter($circsData, function ($circ) use ($circName) {
            return ($circ->name === $circName);
        });

        if (count($filteredCircs) === 0) {
            throw new Exception('Circ not found');
        }

        if (count($filteredCircs) > 1) {
            throw new Exception('Multiple Circs found');
        }

        $circ = $filteredCircs[0];

        header('Content-Type: text/json');
        echo $circ;
    }
}
