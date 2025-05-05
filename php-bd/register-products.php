<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");  // Asegura CORS si accedes desde tu frontend
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Incluye el archivo de conexión
require_once(__DIR__ . '/../php/conexion-bd.php');
$conexion = (new CConexion())->conexionBD(); // <- Esto es lo que faltaba


// Recibir datos del formulario
$nombre = $_POST["nombre"] ?? '';
$descripcion = $_POST["descripcion"] ?? '';
$precio = $_POST["precio"] ?? 0.0;
$stock = $_POST["stock"] ?? 0;
$temporada = $_POST["temporada"] ?? '';
$id_publico = $_POST["id_publico"] ?? 0;


// Validar datos
if (empty($nombre) || empty($descripcion) || empty($precio) || !is_numeric($stock) || empty($temporada) || !is_numeric($id_publico)) {
    http_response_code(400);
    echo "Datos inválidos.";
    exit;
}

// Preparar y ejecutar el INSERT
try {
    $stmt = $conexion->prepare("INSERT INTO productos (nombre, descripcion ,precio, stock ,temporada,id_publico) VALUES (:nombre, :descripcion, :precio,:stock,:temporada,:id_publico)");
    $stmt->bindParam(':nombre', $nombre);
    $stmt->bindParam(':descripcion', $descripcion, PDO::PARAM_INT);
    $stmt->bindParam(':precio', $precio, PDO::PARAM_STR);
    $stmt->bindParam(':stock', $stock, PDO::PARAM_STR);    
    $stmt->bindParam(':temporada', $temporada, PDO::PARAM_STR);
    $stmt->bindParam(':id_publico', $id_publico, PDO::PARAM_INT);

    $stmt->execute();

    echo "Producto registrado con éxito.";
} catch (PDOException $e) {
    http_response_code(500);
    echo "Error al registrar el producto: " . $e->getMessage();
}

?>