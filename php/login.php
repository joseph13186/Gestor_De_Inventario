<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500"); 
header("Access-Control-Allow-Methods: GET,POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once(__DIR__ . '/conexion-bd.php');
$conexion = (new CConexion())->conexionBD();

$correo = $_POST['correo'] ?? '';
$password = $_POST['password'] ?? '';

if (empty($correo) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Correo y contraseña son requeridos"]);
    exit;
}

try {
    $stmt = $conexion->prepare("SELECT * FROM usuarios WHERE email = :correo");
    $stmt->bindParam(':correo', $correo);
    $stmt->execute();

    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

   if ($usuario && $usuario["activo"]) {
    // Verificación de contraseña
    if ($password === $usuario["hash_contrasena"]) {

        $nombre = "";

        if ($usuario["rol"] === "Administrador" && $usuario["id_administrador"]) {
            // Obtener nombre del administrador
            $stmtNombre = $conexion->prepare("SELECT nombre FROM administradores WHERE id_administrador = :id");
            $stmtNombre->bindParam(":id", $usuario["id_administrador"], PDO::PARAM_INT);
            $stmtNombre->execute();
            $fila = $stmtNombre->fetch(PDO::FETCH_ASSOC);
            $nombre = $fila["nombre"] ?? "";
        } elseif ($usuario["rol"] === "Empleado" && $usuario["id_empleado"]) {
            // Obtener nombre del empleado
            $stmtNombre = $conexion->prepare("SELECT nombre FROM empleados WHERE id_empleado = :id");
            $stmtNombre->bindParam(":id", $usuario["id_empleado"], PDO::PARAM_INT);
            $stmtNombre->execute();
            $fila = $stmtNombre->fetch(PDO::FETCH_ASSOC);
            $nombre = $fila["nombre"] ?? "";
        }

        echo json_encode([
            "status" => "success",
            "message" => "Inicio de sesión correcto",
            "rol" => $usuario["rol"],
            "nombre" => $nombre,
            "id_usuario" => $usuario["id_usuario"] // Regresa bien el id

        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Contraseña incorrecta"]);
    }
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado o inactivo"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error de base de datos: " . $e->getMessage()]);
}
?>
