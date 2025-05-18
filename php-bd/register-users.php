<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");  // Asegura CORS si accedes desde tu frontend
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

require_once(__DIR__ . 'http://127.0.0.1:8000/php/conexion-bd.php');
$conexion = (new CConexion())->conexionBD();

$tipo_usuario = $_POST["usuario"] ?? '';
$nombre = $_POST["nombre"] ?? '';
$apellido = $_POST["apellido"] ?? '';
$email = $_POST["email"] ?? '';
$telefono = $_POST["telefono"] ?? '';
$edad = $_POST["edad"] ?? '';
$genero = $_POST["genero"] ?? '';
$password = $_POST["password"] ?? '';

if (
    empty($tipo_usuario) || empty($nombre) || empty($apellido) ||
    empty($email) || empty($telefono) || empty($edad) ||
    empty($genero) || empty($password)
) {
    http_response_code(400);
    echo "Datos inválidos.";
    exit;
}

try {
    if ($tipo_usuario === "Administrador") {
        $stmt = $conexion->prepare("INSERT INTO administradores (nombre, apellido, telefono, email) VALUES (:nombre, :apellido, :telefono, :email)");
    } elseif ($tipo_usuario === "Empleado") {
        $stmt = $conexion->prepare("INSERT INTO empleados (nombre, apellido, telefono, email) VALUES (:nombre, :apellido, :telefono, :email)");
    } else {
        throw new Exception("Tipo de usuario inválido.");
    }

    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':apellido', $apellido);
    $stmt->bindParam(':telefono', $telefono);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    echo "Registro exitoso";
} catch (PDOException $e) {
    http_response_code(500);
    echo "Error en base de datos: " . $e->getMessage();
}
