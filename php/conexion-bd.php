<?php

// Permitir solicitudes desde cualquier origen (en producción, puedes limitarlo a dominios específicos)
header("Access-Control-Allow-Origin: http://127.0.0.1:5500");  // Permite cualquier origen
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type");  // Encabezados permitidos


class CConexion{
    function conexionBD(){
        $host = "localhost";
        $dbname = "Stock-Mastery";
        $username = "postgres";
        $password = "posroot";
        try{
            # Crendenciales para generar la conexion con la DB
            $conn = new PDO ("pgsql:host=$host;dbname=$dbname", $username,$password);

            # Si todo sale bien que mande el siguiente mensaje
            //echo ("Conexión exitosa con la Base de Datos");
            return $conn; // <-- Retornamos la conexión

        }
        catch(PDOException $exp){
            echo ("No se pudo conectar a la Base de datos , $exp");
            return null;
        }
        # Como es una función tiene que regresar algo
        //return $conn;
    }
}
// Crear una instancia de la clase CConexion y ejecutar la función
//$con = new CConexion();
//$con->conexionBD();

?> 