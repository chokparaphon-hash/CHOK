<?php
header('Content-Type: application/json; charset=utf-8');

$appsScriptUrl = 'https://script.google.com/macros/s/AKfycbxd-x_spkoYWbxpxfPgLL5glbN4CHv6di-mMsBHCxFYZNQ2JgK_yPjsfB5fQht0_hq3wQ/exec';

$raw = file_get_contents('php://input');

if (!$raw) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => 'No request body'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $appsScriptUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $raw,
    CURLOPT_HTTPHEADER => [
        'Content-Type: text/plain; charset=utf-8',
        'Content-Length: ' . strlen($raw)
    ],
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_POSTREDIR => CURL_REDIR_POST_ALL,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_CONNECTTIMEOUT => 15,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_USERAGENT => 'MIW-Order-Form/1.0'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'cURL error: ' . $error
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($httpCode < 200 || $httpCode >= 300) {
    http_response_code($httpCode ?: 500);
    echo json_encode([
        'ok' => false,
        'message' => 'Apps Script returned HTTP ' . $httpCode,
        'raw' => $response
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!$response) {
    echo json_encode([
        'ok' => true,
        'message' => 'ส่งข้อมูลสำเร็จ'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo $response;
