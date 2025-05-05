<?php
# Este archivo tiene 2 secciones claramente separadas
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

require_once(__DIR__ . '/../php/conexion-bd.php');
$pdo = (new CConexion())->conexionBD();


function validarProducto($nombre, $descripcion, $precio, $stock, $temporada, $id_publico) {
    $errores = [];

    if (empty(trim($nombre))) {
        $errores[] = "El nombre no puede estar vacío.";
    }

    if (empty(trim($descripcion))) {
        $errores[] = "La descripción no puede estar vacía.";
    }

    if (!is_numeric($precio) || $precio <= 0) {
        $errores[] = "El precio debe ser un número mayor que cero.";
    }

    if (!is_numeric($stock) || $stock < 0) {
        $errores[] = "El stock debe ser un número mayor o igual a cero.";
    }

    $temporadas_validas = ['Primavera', 'Verano', 'Otoño', 'Invierno'];
    if (!in_array($temporada, $temporadas_validas)) {
        $errores[] = "La temporada no es válida.";
    }

    $publicos_validos = [1, 2, 3]; // 1 = Hombres, 2 = Mujeres, 3 = Niños
    if (!in_array((int)$id_publico, $publicos_validos)) {
        $errores[] = "El público seleccionado no es válido.";
    }

    return $errores;
}


// A. GET → Consultar producto
//Maneja la consulta GET (para obtener un producto por ID).

// Lee el id desde la URL.
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $id = $_GET['id'];
    // Hace una consulta SELECT al producto.
    $stmt = $pdo->prepare("SELECT * FROM productos WHERE id_producto = ?");
    $stmt->execute([$id]);

    //Devuelve los datos como JSON.
    $producto = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($producto) {
        echo json_encode($producto);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Producto no encontrado"]);
    }
    exit;
}

// B. Maneja la consulta POST (para manejar el UPDATE ).

// Recibe los datos enviados por AJAX.
if (isset($_POST['id'],$_POST['nombre'], $_POST['descripcion'], $_POST['precio'], $_POST['stock'], $_POST['temporada'], $_POST['id_publico'])) {
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $precio = $_POST['precio'];
    $stock = $_POST['stock'];
    $temporada = $_POST['temporada'];
    $id_publico = $_POST['id_publico'];

    // Validamos los datos antes de hacer el update 
    $errores = validarProducto($nombre, $descripcion, $precio, $stock, $temporada, $id_publico);

    if (count($errores) > 0) {
        http_response_code(400);
        echo json_encode(["status" => "error", "errores" => $errores]);
        exit;
    }

    // Ejecuta un UPDATE en la tabla.
    $stmt = $pdo->prepare("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, temporada = ?, id_publico = ? WHERE id_producto = ?");
    
    // Devuelve una respuesta JSON que JavaScript puede entender.
    if ($stmt->execute([$nombre, $descripcion, $precio, $stock, $temporada, $id_publico, $id])) {
        echo json_encode(["status" => "ok"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error al actualizar"]);
    }
} else {
    http_response_code(400);
    echo "Faltan datos";
}
