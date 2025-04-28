<?php
// Verano
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");  // Asegura CORS si accedes desde tu frontend
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Incluye el archivo de conexión
require_once(__DIR__ . '/../php/conexion-bd.php');

//http://127.0.0.1:8000/php/conexion-bd.php


$conexion = new CConexion();
$conn = $conexion->conexionBD(); // Este método no está devolviendo nada ahora mismo

if ($conn) {
// Realizamos la consulta para obtener los datos de la base de datos
$query = "SELECT id_producto, nombre, stock,temporada, descripcion, precio,fecha_registro,fecha_ultima_compra,hora_ultima_compra FROM Productos
WHERE temporada='Invierno'";

$stmt = $conn->prepare($query);
$stmt->execute();

// Recuperamos todos los resultados en un array
$productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($productos);


}else{
    echo json_encode(["error" => "No se pudo conectar a la base de datos"]);
}
// Enviamos los resultados como un JSON



?>