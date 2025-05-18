// Función que hace la solicitud AJAX para obtener los datos
function cargarProductos() {
    $.ajax({
        url: 'http://127.0.0.1:8000/php-bd/products-query-discontinued.php',  // Ruta a tu script PHP
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
                    // Aqui agregue un nuevo diseño para la parte del boton de "Reactivarlo" CLASE : MODAL-CRUD-STOCK
                    `
                    <div class="d-flex flex-column gap-2">
                        <button class="btn btn-warning  btn-editar" data-id="${registro.id_producto}"> <i class="fa-solid fa-pencil fa-sm"></i> Editar</button>
                        <button class="btn  btn-azul btn-activarlo" data-id="${registro.id_producto}"> <i class="fa-solid fa-recycle fa-sm"></i>Reactivarlo </button>
                    </div>
                    `
                ])//.draw(false);  // Añadimos la fila al DataTable
            });
            /*
                        <div class="d-flex flex-column gap-2">
                        <button class="btn btn-sm btn-primary btn-editar" data-id="${registro.id_producto}">Editar</button>
                        <button class="btn btn-warning btn-editar" data-id="${registro.id_producto}"> <i class="fa-solid fa-pencil fa-sm"></i> Editar</button>
                        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${registro.id_producto}">Eliminar</button>
                        <button class="btn btn-danger btn-eliminar" data-id="${registro.id_producto}"> <i class="bi bi-trash-fill fa-sm">Eliminar</i> </button>
                    </div>
            */

            table.draw(false); // Solo llamamos draw una vez

            // Delegación de eventos
            $('#todos-dt tbody').off('click', '.btn-editar').on('click', '.btn-editar', function () {
                const id = $(this).data('id');
                // Este solo es para saber que producto se andaba modificando
                //console.log('Editar producto', id);

                // Aquí puedes llamar a una función que abra un modal con los datos del producto
                // 1. Buscar datos del producto con ese ID
                obtenerInfoProducto(id);
            });

            $('#todos-dt tbody').off('click', '.btn-activarlo').on('click', '.btn-activarlo', function () {
                //const id = $(this).data('id');
                idProductoAReactivar = $(this).data('id');
                const modal = new bootstrap.Modal(document.getElementById('confirmReactivateModal'));
                modal.show();
            });

            $('#confirmReactivateButton').on('click', function () {
                if (idProductoAReactivar !== null) {
                    eliminarProducto(idProductoAReactivar);
                    idProductoAReactivar = null;
            
                    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmReactivateModal'));
                    modal.hide();
                }
            });
        },
        error: function (error) {
            console.log("Error al cargar los datos:", error);
        }
    });

}

// Llamamos a la función para cargar los datos cuando la página esté lista
$(document).ready(function () {
    $('#todos-dt').DataTable();  // Solo una vez
    cargarProductos();               // Carga dinámica desde PHP

});

function recargarTablas(){
    cargarProductos(); // Recarga la tabla
    cargarProductosSpring();
    cargarProductosSummer();
    cargarProductosAutumn();
    cargarProductosWinter();
    
}
