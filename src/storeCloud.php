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

    array_push($circsData, $requestBody);

    file_put_contents($storeFile, json_encode($circsData));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($_GET['action'] === 'list') {
        header('Content-Type: text/json');
        echo $circJsonString;
    }
    if ($_GET['action'] === 'getByName') {
        $circName = $_GET['name'];

        $filteredCircStrings = array_filter($circsData, function ($circJsonString) use ($circName) {
            $circ = json_decode($circJsonString);
            return ($circ->config->name === $circName);
        });

        if (count($filteredCircStrings) === 0) {
            throw new Exception('Circ not found');
        }

        if (count($filteredCircStrings) > 1) {
            throw new Exception('Multiple Circs found');
        }

        $circString = array_pop(array_reverse($filteredCircStrings));

        header('Content-Type: text/json');
        echo $circString;
    }
    if ($_GET['action'] === 'getByIndex') {
        $circIndex = $_GET['index'];

        $circString = $circsData[$circIndex];

        if ($circString === null) {
            throw new Exception('Circ not found');
        }

        header('Content-Type: text/json');
        echo $circString;
    }
}
