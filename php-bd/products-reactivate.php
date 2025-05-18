<?php
/* 
Estamos utilizando PDO (PHP Data Objects), 
que es una manera moderna y flexible 
de conectarse a bases de datos. En PDO:
Se usan marcadores nombrados como :
id en la consulta SQL.
Luego se vinculan los valores usando bindParam(':id', $id).
*/

require_once(__DIR__ . '/../php/conexion-bd.php');

// Crear instancia de conexión
/*Estoy creando un objeto que me conecte
a la base de datos, y guardo esa conexión 
en $conn para usarla*/
$conexion = new CConexion();

/*
Eso es normal y necesario, porque la clase CConexion no se conecta sola. 
Solo dice cómo conectarse. 
Uno decides cuándo conectarte con esta línea:
*/
$conn = $conexion->conexionBD();

$id = $_GET['id']; // <-- este es el valor que se recibe, por ejemplo 30

if (!$id) {
    die("No se recibió el ID.");
}

/*
Un marcador de posición (como :id) es una etiqueta 
en la consulta SQL donde luego 
se insertará un valor de forma segura.

Aquí, :id no es el valor real aún. 
Es solo una etiqueta que será reemplazada 
automáticamente por PDO, una vez que uses bindParam.
 */
// 1. Verificar si el producto tiene ventas relacionadas
$sqlCheck = "SELECT COUNT(*) FROM detalle_venta WHERE id_producto = :id";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bindParam(':id', $id, PDO::PARAM_INT);
$stmtCheck->execute();
$totalRelaciones = $stmtCheck->fetchColumn();

// Hagamos la siguiente con eliminar



/* 
Con bindParam(':id', $id), le decimos a PDO:
"Reemplaza :id con el valor que está en $id (o sea, 30)".
*/
    // 2. Activar el producto
    $sqlActive  = "UPDATE productos SET activo = TRUE WHERE id_producto = :id";
    $stmtActive = $conn->prepare($sqlActive);
    $stmtActive->bindParam(':id', $id, PDO::PARAM_INT);

    if ($stmtActive->execute()) {
    echo json_encode([
        'status' => 'success',
        'message' => [
        ['type' => 'warning', 'text' => 'Después de 6 meses, la descontinuación será definitiva.'],
        ['type' => 'info', 'text' => 'Acción recomendada: Actualice el stock según la necesidad.'],
        ['type' => 'success', 'text' => 'Reactivación exitosa: El producto volverá a estar disponible.']

        ]
    ]);
    }

 else {
        echo json_encode([
            'status' => 'error',
            'message' => 'El producto tiene una venta.'
        ]);
        echo json_encode([
            'status' => 'error',
            'message' => 'Error al intentar reactivar el producto.'
        ]);
    }

?>
