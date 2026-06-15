<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$requestPath = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// Determine the script base path (where this index.php lives) and
// remove it from the request path so routing works when the app is
// deployed in a subdirectory like /backend/public
$scriptDir = trim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
if ($scriptDir !== '' && strpos($requestPath, $scriptDir) === 0) {
    $requestPath = substr($requestPath, strlen($scriptDir));
    $requestPath = trim($requestPath, '/');
}

$uri = array_values(array_filter(
    explode('/', $requestPath === '' ? '/' : $requestPath),
    fn($segment) => $segment !== ''
));

$resource = $uri[0] ?? '';
$id = $uri[1] ?? null;

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../api/controllers/ProjectController.php';
require_once __DIR__ . '/../api/controllers/MixController.php';

switch ($resource) {

    case 'projects':
        $controller = new ProjectController();

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if ($id) {
                $controller->show($id);
            } else {
                $controller->index();
            }
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->create();
        }

        // Soporte para actualizar proyecto
        if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $id) {
            $controller->update($id);
        }

        if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $id) {
            $controller->delete($id);
        }

        break;

    case 'mixes':
        $controller = new MixController();
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->index();
        }
        break;

    default:
        echo json_encode(['message' => 'API ecoladrillos_db']);
}
