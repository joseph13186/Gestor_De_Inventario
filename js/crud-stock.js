$(document).ready(function() {
    // Abrir modal para agregar producto
    $('#btnNuevoProducto').click(function() {
        $('#modalTitle').text('Nuevo Producto');
        $('#productId').val('');
        $('#productName').val('');
        $('#productPrice').val('');
        document.getElementById('productModal').showModal(); // Usamos el método showModal para abrir el modal
    });

    // Guardar producto
    $('#productForm').submit(function(e) {
        e.preventDefault(); // Prevenir recarga de página
        const name = $('#productName').val();
        const price = $('#productPrice').val();

        // Generar un nuevo ID único para el producto
        const newId = Date.now();

        // Crear la fila HTML para el nuevo producto
        const html = `
            <tr id="producto-${newId}">
                <td class="nombre">${name}</td>
                <td class="precio">${price}</td>
                <td>
                    <button onclick="editarProducto(${newId})">Editar</button>
                    <button onclick="eliminarProducto(${newId})">Eliminar</button>
                </td>
            </tr>`;

        // Agregar el nuevo producto a la tabla
        $('#tablaProductos').append(html);

        // Cerrar el modal después de guardar
        document.getElementById('productModal').close();
    });
});

// Función para eliminar el producto
function eliminarProducto(id) {
    $(`#producto-${id}`).remove();
}
