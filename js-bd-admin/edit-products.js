 // 1. Buscar datos del producto con ese ID

function obtenerInfoProducto(id){
 // A. Cargar datos al abrir el modal
 $.ajax({
    url: `http://127.0.0.1:8000/php-bd/products-update.php?id=${id}`,
    type: 'GET',
    dataType: 'json',
    success: function (producto) {
        // 2. Rellenar el formulario con los datos actuales -> los que se muestran en la tabla vaya
        $('#edit-id_producto').val(producto.id_producto);
        $('#edit-nombre').val(producto.nombre);
        $('#edit-descripcion').val(producto.descripcion);
        $('#edit-precio').val(producto.precio);
        $('#edit-stock').val(producto.stock);
        $('#edit-temporada').val(producto.temporada);
        $('#edit-id_publico').val(producto.id_publico);


        // 3. Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
        modal.show();
    },
    error: function () {
        alert('Error al obtener los datos del producto.');
    }
});

}

// Evento submit para guardar cambios al editar
$(document).ready(function () {
    // B. Enviar datos al servidor para actualizar
    $('#form-edit-producto').on('submit', function (e) {
        e.preventDefault(); // evita que recargue la página

        // Captura los datos del formulario.
        const productoEditado = {
            id: $('#edit-id_producto').val(),
            nombre: $('#edit-nombre').val(),
            descripcion: $('#edit-descripcion').val(),
            precio: $('#edit-precio').val(),
            stock: $('#edit-stock').val(),
            temporada: $('#edit-temporada').val(),
            id_publico: $('#edit-id_publico').val()
            // Agrega más campos si también los vas a actualizar
        };

        //Los manda por el metodo POST a products-update.php.
        $.ajax({
            url: 'http://127.0.0.1:8000/php-bd/products-update.php',
            type: 'POST',
            data: productoEditado,
            success: function (respuestaServidor) {

                //Espera una respuesta tipo { status: "ok" }.
                if (respuestaServidor.status === "ok") {
                    toastr.success("Producto editado ✍", "¡Éxito!");
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
                    modal.hide();
                    recargarTablas(); // Recarga las tablas
                } else {
                    alert("Error al actualizar: " + respuesta);
                }
            },
            error: function (xhr) {
                alert("Error al actualizar producto.");
                console.log(xhr.responseText);
            }
        });
    });
});