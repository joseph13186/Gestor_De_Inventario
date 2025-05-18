// Función que hace la solicitud AJAX para obtener los datos
function cargarProductosAntiguos() {
    $.ajax({
        url: 'http://127.0.0.1:8000/php-bd/products-query-promotions.php',  // Ruta a tu script PHP
        type: 'GET',  // Método GET
        dataType: 'json',  // Esperamos que nos devuelvan datos en formato JSON
        success: function (data) {
            // Limpiamos la tabla antes de cargar nuevos datos
            var table = $('#todos-dt').DataTable();
            table.clear();

            // Recorremos los datos recibidos y los insertamos en la tabla
            data.forEach(function (registro) {
                table.row.add([
                    registro.id_producto,
                    registro.nombre,
                    registro.publico,
                    registro.stock,
                    registro.temporada,
                    registro.descripcion,
                    `$${parseFloat(registro.precio).toFixed(2)}`,
                    registro.fecha_registro,
                    registro.fecha_ultima_compra,
                    registro.hora_ultima_compra,
                ])//.draw(false);  // Añadimos la fila al DataTable
            });

            table.draw(false); // Solo llamamos draw una vez

        },
        error: function (error) {
            console.log("Error al cargar los datos:", error);
        }
    });


}

// Llamamos a la función para cargar los datos cuando la página esté lista
$(document).ready(function () {
    $('#todos-dt').DataTable();  // Solo una vez
    cargarProductosAntiguos();               // Carga dinámica desde PHP

});

