<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");  // Asegura CORS si accedes desde tu frontend
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Incluye el archivo de conexión
require_once(__DIR__ . '/../php/conexion-bd.php');

//http://127.0.0.1:8000/php/conexion-bd.php


$conexion = new CConexion();
$conn = $conexion->conexionBD(); // Este método no está devolviendo nada ahora mismo

if ($conn) {
    // Define los rangos de fechas
    $hoy = date('Y-m-d');
    $inicioSemanaActual = date('Y-m-d', strtotime('monday this week'));
    $inicioSemanaPasada = date('Y-m-d', strtotime('monday last week'));
    $finSemanaPasada = date('Y-m-d', strtotime('sunday last week'));

// Realizamos la consulta para la semana actual
 $stmtActual = $conn->prepare("
        SELECT 
            pro.id_producto, 
            pro.nombre, 
            pu.nombre AS publico, 
            pro.stock,
            pro.temporada, 
            pro.descripcion, 
            TO_CHAR(pro.fecha_registro, 'TMDay, DD \"de\" TMMonth \"de\" YYYY') AS fecha_registro,
            TO_CHAR(v.fecha_hora_venta, 'TMDay, DD \"de\" TMMonth \"de\" YYYY') AS fecha_ultima_compra,
            TO_CHAR(v.fecha_hora_venta, 'HH12:MI:SS AM') AS hora_ultima_compra,
            pro.precio,
            dv.cantidad,
            dv.subtotal
        FROM productos pro
        JOIN publico pu ON pro.id_publico = pu.id_publico
        JOIN detalle_venta dv ON pro.id_producto = dv.id_producto
        JOIN ventas v ON dv.id_venta = v.id_venta
        WHERE v.fecha_hora_venta BETWEEN :inicioSemana AND :hoy
        
    ");

 $stmtActual->execute([
        ':inicioSemana' => $inicioSemanaActual,
        ':hoy' => $hoy
    ]);

// Recuperamos todos los resultados en un array
$productosActual = $stmtActual->fetchAll(PDO::FETCH_ASSOC);


    // Consulta para semana pasada
    $stmtPasada = $conn->prepare("
        SELECT 
              pro.id_producto, 
            pro.nombre, 
            pu.nombre AS publico, 
            pro.stock,
            pro.temporada, 
            pro.descripcion, 
            TO_CHAR(pro.fecha_registro, 'TMDay, DD \"de\" TMMonth \"de\" YYYY') AS fecha_registro,
            TO_CHAR(v.fecha_hora_venta, 'TMDay, DD \"de\" TMMonth \"de\" YYYY') AS fecha_ultima_compra,
            TO_CHAR(v.fecha_hora_venta, 'HH12:MI:SS AM') AS hora_ultima_compra,
            pro.precio,
            dv.cantidad,
            dv.subtotal
        FROM productos pro
        JOIN publico pu ON pro.id_publico = pu.id_publico
        JOIN detalle_venta dv ON pro.id_producto = dv.id_producto
        JOIN ventas v ON dv.id_venta = v.id_venta
        WHERE v.fecha_hora_venta BETWEEN :inicioPasada AND :finPasada
        AND activo = 'True'");

 $stmtPasada->execute([
        ':inicioPasada' => $inicioSemanaPasada,
        ':finPasada' => $finSemanaPasada
    ]);

// Recuperamos todos los resultados en un array
    $productosPasada = $stmtPasada->fetchAll(PDO::FETCH_ASSOC);


    // Enviar como un objeto con 2 listas
    echo json_encode([
        "semanaActual" => $productosActual,
        "semanaPasada" => $productosPasada
    ]);


}else{
    echo json_encode(["error" => "No se pudo conectar a la base de datos"]);
}
// Enviamos los resultados como un JSON

?>