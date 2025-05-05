
// Función que hace la solicitud AJAX para obtener los datos
//Verano
function cargarProductosSummer() {
    $.ajax({
        url: 'http://127.0.0.1:8000/php-bd/products-query-summer.php',  // Ruta a tu script PHP
        type: 'GET',  // Método GET
        dataType: 'json',  // Esperamos que nos devuelvan datos en formato JSON
        success: function(data) {
            // Limpiamos la tabla antes de cargar nuevos datos
            var table = $('#verano-dt').DataTable();
            table.clear();

            // Recorremos los datos recibidos y los insertamos en la tabla
            data.forEach(function(registro) {
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
                    `
                    <div class="d-flex flex-column gap-2">
                        <button class="btn btn-warning  btn-editar" data-id="${registro.id_producto}"> <i class="fa-solid fa-pencil fa-sm"></i> Editar</button>
                        <button class="btn btn-danger btn-eliminar" data-id="${registro.id_producto}"> <i class="bi bi-trash-fill fa-sm">Eliminar</i> </button>
                    </div>
                    `
                ])//.draw(false);  // Añadimos la fila al DataTable
            });
            table.draw(false); // Solo llamamos draw una vez

            // Delegación de eventos
            $('#verano-dt tbody').off('click', '.btn-editar').on('click', '.btn-editar', function () {
                const id = $(this).data('id');
                // Aquí puedes llamar a una función que abra un modal con los datos del producto
                // 1. Buscar datos del producto con ese ID
                obtenerInfoProducto(id);
            });

            $('#verano-dt tbody').off('click', '.btn-eliminar').on('click', '.btn-eliminar', function () {
                idProductoAEliminar = $(this).data('id');
                const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
                modal.show();
            });

            $('#confirmDeleteButton').on('click', function () {
                if (idProductoAEliminar !== null) {
                    eliminarProducto(idProductoAEliminar);
                    idProductoAEliminar = null;
            
                    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
                    modal.hide();
                }
            });

        },
        error: function(error) {
            console.log("Error al cargar los datos:", error);
        }
    });
}

// Llamamos a la función para cargar los datos cuando la página esté lista
$(document).ready(function() {
    $('#verano-dt').DataTable();  // Solo una vez
    cargarProductosSummer();               // Carga dinámica desde PHP
});
