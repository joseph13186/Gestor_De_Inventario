<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain");

date_default_timezone_set('America/Mexico_City');
$hora = date('H');
$hora_completa = date('H:i:s');


if ($hora >= 6 && $hora < 12) {
    echo "¡Buenos días! [$hora_completa]";
} elseif ($hora >= 12 && $hora < 18) {
    echo "¡Buenas tardes! [$hora_completa]";
} else {
    echo "¡Buenas noches! [$hora_completa]";
}
?>