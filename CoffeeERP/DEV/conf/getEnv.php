<?php
$env = parse_ini_file(__DIR__ . '/.env');
echo json_encode([
  'OPENAI_API_KEY' => $env['OPENAI_API_KEY']
]);
