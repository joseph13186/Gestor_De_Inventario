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
$query = "SELECT 
    pro.id_producto, 
    pro.nombre, 
    pu.nombre AS publico, 
    pro.stock,
    pro.temporada, 
    pro.descripcion, 
    pro.precio, 
    TO_CHAR(pro.fecha_registro, 'TMDay, DD \"de\" TMMonth \"de\" YYYY') AS fecha_registro,
    TO_CHAR(v.fecha_hora_venta, 'TMDay, DD \"de\" TMMonth \"de\" YYYY') AS fecha_ultima_compra,
    TO_CHAR(v.fecha_hora_venta, 'HH12:MI:SS') AS hora_ultima_compra
FROM 
    productos pro
JOIN 
    publico pu ON pro.id_publico = pu.id_publico
LEFT JOIN (
    SELECT 
        dv.id_producto,
        v.fecha_hora_venta,
		v.id_venta,  -- ¡Esta es la columna que faltaba!

        ROW_NUMBER() OVER (PARTITION BY dv.id_producto ORDER BY v.fecha_hora_venta DESC) AS rn
    FROM 
        detalle_venta dv
    JOIN 
        ventas v ON dv.id_venta = v.id_venta
) AS ultima_venta ON pro.id_producto = ultima_venta.id_producto AND ultima_venta.rn = 1
LEFT JOIN
    ventas v ON ultima_venta.id_venta = v.id_venta
WHERE activo = 'True' AND temporada = 'Verano';";


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