<?php
// Permitir solicitudes desde tu frontend
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Si es una solicitud de verificación preflight (OPTIONS), responde sin procesar más
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once(__DIR__ . '/../php/conexion-bd.php');
$pdo = (new CConexion())->conexionBD();

// Leer datos JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// A. GET → Consultar producto
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['productos']) && is_array($data['productos'])) {
    $productos = $data['productos'];
    $totalVenta = 0;

    try {
        $pdo->beginTransaction();

        // Calcular total
        foreach ($productos as $p) {
            $totalVenta += floatval($p['precio']) * intval($p['cantidad']);
        }

        // Insertar cabecera
        $stmt = $pdo->prepare("INSERT INTO ventas (id_usuario, total_venta) VALUES (?, ?) RETURNING id_venta");
        $stmt->execute([1, $totalVenta]); // ID de usuario fijo
        $id_venta = $stmt->fetchColumn();

        // Procesar cada producto
        foreach ($productos as $p) {
            $id_producto = intval($p['id']);
            $cantidad = intval($p['cantidad']);
            $precio = floatval($p['precio']);
            $subtotal = $cantidad * $precio;

            // Verificar stock
            $stmt = $pdo->prepare("SELECT nombre,stock FROM productos WHERE id_producto = ?");
            $stmt->execute([$id_producto]);
            $producto = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$producto || $producto['stock'] < $cantidad) {
                //throw new Exception("Stock insuficiente para el producto ID $id_producto");
                $response = [
                    'status' => 'error',
                    'message' => 'El producto "' . $producto['nombre'] .'" no tiene stock suficiente. <br>
                    Stock actual : ' . $producto['stock']
                    
                ];
                echo json_encode($response);
                exit; // <--- Detiene el script aquí

            }

            // Insertar detalle
            $stmt = $pdo->prepare("INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$id_venta, $id_producto, $cantidad, $precio, $subtotal]);

            // Actualizar stock
            $stmt = $pdo->prepare("UPDATE productos SET stock = stock - ? WHERE id_producto = ?");
            $stmt->execute([$cantidad, $id_producto]);
        }

        $pdo->commit();
        echo json_encode(["success" => true, "message" => "Venta registrada correctamente", "id_venta" => $id_venta]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al registrar venta", "error" => $e->getMessage()]);
    }
    exit;
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No se recibió el arreglo de productos correctamente."]);
    exit;
}