<?php
// 📜 ctrl-chatgpt.php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL & ~E_NOTICE); // solo errores graves

try {
    // 🧩 Leer API key desde .env o variable segura
$envPath = __DIR__ . '/.env';

    if (!file_exists($envPath)) {
        throw new Exception("Archivo .env no encontrado en $envPath");
    }

    $env = parse_ini_file($envPath);
    if (!$env || empty($env['OPENAI_API_KEY'])) {
        throw new Exception("No se encontró la clave OPENAI_API_KEY en .env");
    }

    $apiKey = trim($env['OPENAI_API_KEY']);

    // 🔵 Leer los datos enviados por el cliente
    $rawInput = file_get_contents("php://input");
    $input = json_decode($rawInput, true);

    if (json_last_error() != JSON_ERROR_NONE) {
        throw new Exception("JSON inválido recibido del cliente: " . json_last_error_msg());
    }

    $model       = $input['model']        ?? 'gpt-4.1';
    $messages    = $input['messages']     ?? [];
    $temperature = $input['temperature']  ?? 0.7;

    if (empty($messages)) {
        echo json_encode(['status' => 400, 'error' => 'No se recibieron mensajes']);
        exit;
    }

    // 🧠 Llamada segura a OpenAI
    $ch = curl_init("https://api.openai.com/v1/chat/completions");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "Authorization: Bearer $apiKey"
        ],
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            'model'       => $model,
            'messages'    => $messages,
            'temperature' => $temperature
        ]),
        CURLOPT_SSL_VERIFYPEER => false
    ]);


    $response = curl_exec($ch);
    $curlErr  = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        throw new Exception("Error CURL: $curlErr");
    }

    $data = json_decode($response, true);

    if (isset($data['choices'][0]['message']['content'])) {
        echo json_encode([
            'status'   => 200,
            'response' => trim($data['choices'][0]['message']['content'])
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'status' => 500,
            'error'  => $data
        ], JSON_UNESCAPED_UNICODE);
    }

} catch (Exception $e) {
    // ⚠️ Respuesta limpia para evitar romper JSON
    echo json_encode([
        'status'  => 500,
        'message' => 'Error interno del servidor',
        'details' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}