<?php
header("Access-Control-Allow-Origin: http://127.0.0.1:5500"); // Permite Live Server
header("Content-Type: application/json"); // Fuerza JSON

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $correo = $_POST["correo"] ?? "";
    $password = $_POST["password"] ?? "";

    $correo_correcto = "admin";
    $password_correcto = "1234";

    if ($correo === $correo_correcto && $password === $password_correcto) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Credenciales incorrectas"]);
    }
}
?>
