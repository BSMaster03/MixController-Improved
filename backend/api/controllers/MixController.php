<?php

class ProjectController {

    // ============================================================
    // GET /projects
    // ============================================================
    public function index() {
        try {
            $pdo = getConnection();
            $stmt = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error cargando proyectos", "details" => $e->getMessage()]);
        }
    }

    // ============================================================
    // GET /projects/{id}
    // ============================================================
    public function show($id) {
        try {
            $pdo = getConnection();

            $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
            $stmt->execute([$id]);
            $project = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$project) {
                http_response_code(404);
                echo json_encode(["error" => "Proyecto no encontrado"]);
                return;
            }

            echo json_encode($project);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "error" => "Error obteniendo proyecto",
                "details" => $e->getMessage()
            ]);
        }
    }

    // ============================================================
    // POST /projects
    // ============================================================
    public function create() {
        $input = json_decode(file_get_contents('php://input'), true);

        $name               = $input['name'] ?? '';
        $wall_length_m      = (float)($input['wall_length_m'] ?? 0);
        $wall_height_m      = (float)($input['wall_height_m'] ?? 0);
        $wall_thickness_m   = (float)($input['wall_thickness_m'] ?? 0);
        $brick_length_m     = (float)($input['brick_length_m'] ?? 0);
        $brick_height_m     = (float)($input['brick_height_m'] ?? 0);
        $brick_thickness_m  = (float)($input['brick_thickness_m'] ?? 0);
        $mix_preset_id      = (int)($input['mix_preset_id'] ?? 0);
        $pet_percent        = (float)($input['pet_percent'] ?? 0);
        $sand_percent       = (float)($input['sand_percent'] ?? 0);
        $cement_percent     = (float)($input['cement_percent'] ?? 0);
        $water_percent      = (float)($input['water_percent'] ?? 0);
        $bottles_per_kg_pet = (float)($input['bottles_per_kg_pet'] ?? 25);

        $pdo = getConnection();

        // Si usa preset, cargar mezcla
        if ($mix_preset_id > 0) {
            $stmt = $pdo->prepare("SELECT * FROM mix_presets WHERE id = ?");
            $stmt->execute([$mix_preset_id]);
            $mix = $stmt->fetch();

            if (!$mix) {
                http_response_code(400);
                echo json_encode(['error' => 'Mezcla no encontrada']);
                return;
            }

            $pet_percent    = (float)$mix['pet_percent'];
            $sand_percent   = (float)$mix['sand_percent'];
            $cement_percent = (float)$mix['cement_percent'];
        } else {
            if ($pet_percent <= 0 || $sand_percent <= 0 || $cement_percent <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Por favor ingrese porcentajes de mezcla válidos.']);
                return;
            }
        }

        // Validar suma 100%
        $percentSum = $pet_percent + $sand_percent + $cement_percent + $water_percent;
        if (abs($percentSum - 100) > 0.01) {
            http_response_code(400);
            echo json_encode(['error' => 'Las proporciones de la mezcla deben sumar 100.']);
            return;
        }

        // Cálculos
        $brick_volume = $brick_length_m * $brick_height_m * $brick_thickness_m;
        $wall_volume  = $wall_length_m * $wall_height_m * $wall_thickness_m;

        $total_bricks = (int)ceil($wall_volume / $brick_volume);

        $total_mix_volume_m3 = $wall_volume;
        $density_mix = 2000; // kg/m3
        $total_mass_kg = $total_mix_volume_m3 * $density_mix;

        $pet_kg    = $total_mass_kg * ($pet_percent / 100);
        $sand_kg   = $total_mass_kg * ($sand_percent / 100);
        $cement_kg = $total_mass_kg * ($cement_percent / 100);

        $bottles_needed = (int)ceil($pet_kg * $bottles_per_kg_pet);

        if ($mix_preset_id <= 0) {
            $mix_preset_id = null;
        }

        // Guardar proyecto
        $stmt = $pdo->prepare("
            INSERT INTO projects (
                name, wall_length_m, wall_height_m, wall_thickness_m,
                brick_length_m, brick_height_m, brick_thickness_m,
                mix_preset_id, bottles_per_kg_pet,
                total_bricks, total_mix_volume_m3,
                pet_kg, sand_kg, cement_kg, bottles_needed
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ");

        $stmt->execute([
            $name,
            $wall_length_m, $wall_height_m, $wall_thickness_m,
            $brick_length_m, $brick_height_m, $brick_thickness_m,
            $mix_preset_id, $bottles_per_kg_pet,
            $total_bricks, $total_mix_volume_m3,
            $pet_kg, $sand_kg, $cement_kg, $bottles_needed
        ]);

        $id = $pdo->lastInsertId();

        echo json_encode([
            'id' => $id,
            'name' => $name,
            'total_bricks' => $total_bricks,
            'total_mix_volume_m3' => $total_mix_volume_m3,
            'pet_kg' => $pet_kg,
            'sand_kg' => $sand_kg,
            'cement_kg' => $cement_kg,
            'bottles_needed' => $bottles_needed
        ]);
    }

    // ============================================================
    // DELETE /projects/{id}
    // ============================================================
    public function delete($id)
    {
        try {
            $pdo = getConnection();

            $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode([
                "message" => "Proyecto eliminado correctamente",
                "id" => $id
            ]);

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "error" => "Error eliminando proyecto",
                "details" => $e->getMessage()
            ]);
        }
    }
}
