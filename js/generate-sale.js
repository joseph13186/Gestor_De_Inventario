// Configura toastr al inicio
toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "timeOut": "40000"
};



$(document).ready(function () {

    // Esto llenará el array products con la respuesta del servidor (una lista de objetos con id, name, season, description, price, etc.).
    let products = [];

    $.ajax({
        url: 'http://127.0.0.1:8000/php-bd/products-query.php',
        method: 'GET',
        success: function (data) {
            //console.log(data);  // Esto ayuda a ver lo que devuelve el servidor

            products = data;
        },
        error: function () {
            alert('No se pudieron cargar los productos desde el servidor.');
        }
    });


    // Autocompletar campos al ingresar el nombre o ID en los campos de búsqueda
    $('#new-product-id, #new-product-name').on('input', function () {
        var inputValId = $('#new-product-id').val().toLowerCase();
        var inputValName = $('#new-product-name').val().toLowerCase();

        // Buscar en la base de datos si el ID o nombre coincide
        var found = products.find(function (p) {
            return p.id_producto.toString() === inputValId || p.nombre.toLowerCase() === inputValName;
        });

        if (found) {
            // Autocompletar los campos
            if (inputValId && found.id_producto.toString() === inputValId) {
                $('#new-product-name').val(found.nombre); // Autocompletar el nombre si encontramos por ID
            } else if (inputValName && found.nombre.toLowerCase() === inputValName) {
                $('#new-product-id').val(found.id_producto); // Autocompletar el ID si encontramos por nombre
            }

            $('#new-product-season').val(found.temporada);
            $('#new-product-description').val(found.descripcion);
            $('#new-product-price').val(found.precio);
            updateTotal(); // Actualiza el total si ya se ingresó cantidad
            calcularTotalGeneralVenta();
        } else {
            // Limpiar si no hay coincidencia
            $('#new-product-season, #new-product-description, #new-product-price').val('');
            $('#new-product-total').text('');
        }
    });

    // Actualizar el total dinámicamente al ingresar la cantidad
    $('#new-product-quantity').on('input', function () {
        let value = $(this).val();


        // Eliminamos cualquier carácter no numérico o incorrecto
        value = value.replace(/[^0-9]/g, '');

        // Si el valor comienza con "0" y es más de un dígito, eliminar el primer 0
        if (value.length > 1 && value.charAt(0) === '0') {
            value = value.slice(1);
        }
        // Actualizar el campo de cantidad
        $(this).val(value);

        updateTotal();
        calcularTotalGeneralVenta();
    });

    function updateTotal() {
        
        var quantity = parseFloat($('#new-product-quantity').val());
        var price = parseFloat($('#new-product-price').val());
        if (!isNaN(quantity) && !isNaN(price)) {
            var total = quantity * price;
            $('#new-product-total').text('$' + total.toFixed(2));
        } else {
            $('#new-product-total').text('');
        }
    }

    function calcularTotalGeneralVenta() {
    let totalVenta = 0;
      $('#todos-dt tbody tr').each(function () {
        // Obtener el texto de la columna "Total" (7ª columna, índice 6)
        let totalTexto = $(this).find('td:eq(6)').text().replace('$', '').trim();
        let totalProducto = parseFloat(totalTexto);

        if (!isNaN(totalProducto)) {
            totalVenta += totalProducto;
        }
    });

    // Mostrar el total formateado
    //$('#totalVenta .total-amount').text('$' + totalVenta.toFixed(2));
    $('#totalVenta .total-amount').text('$' + totalVenta.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

}


    // Guardar la fila nueva en la tabla de manera definitiva
    $('#save-new-product').click(function () {
        var id = $('#new-product-id').val();
        var name = $('#new-product-name').val();
        var quantity = $('#new-product-quantity').val();
        var season = $('#new-product-season').val();
        var description = $('#new-product-description').val();
        var price = $('#new-product-price').val();
        var total = $('#new-product-total').text();

        if (name && quantity && price && season && description) {
            // Se agrega una nueva fila antes de la fila de ingreso
            var newRow = `<tr>
                          <td>${id}</td>
                          <td>${name}</td>
                          <td>${quantity}</td>
                          <td>${season}</td>
                          <td>${description}</td>
                          <td>$${parseFloat(price).toFixed(2)}</td>
                          <td>${total}</td>
                          <td>
                            <button class="btn btn-warning edit-product"> <i class="fa-solid fa-pencil fa-sm"></i> Editar</button>
                            <button class="btn btn-danger delete-product"> <i class="bi bi-trash-fill fa-sm">Eliminar</i> </button>
                        </td>
                        </tr>`;
            // Insertar la nueva fila y limpiar la fila de ingreso
            $('#new-product-row').after(newRow);
            $('#new-product-name, #new-product-id, #new-product-quantity, #new-product-season, #new-product-description, #new-product-price').val('');
            $('#new-product-total').text('');
        } else {
            //alert("Por favor, complete los datos del producto.");
            toastr.warning("Por favor, complete los datos del producto.", "Precaución");
        }
    });

    // Variables para almacenar los valores originales antes de editar
    var originalValues = {};

    // Editar un producto
    $(document).on('click', '.edit-product', function () {
        var row = $(this).closest('tr');

        // Guardar los valores originales de la fila
        originalValues = {
            row: row,
            id: row.find("td:eq(0)").text(),
            name: row.find("td:eq(1)").text(),
            quantity: row.find("td:eq(2)").text(),
            season: row.find("td:eq(3)").text(),
            description: row.find("td:eq(4)").text(),
            price: row.find("td:eq(5)").text().replace('$', '') // Eliminar el "$" del precio
        };

        // Rellenar los campos de edición con los valores actuales
        $("#new-product-id").val(originalValues.id);
        $("#new-product-name").val(originalValues.name);
        $("#new-product-quantity").val(originalValues.quantity);
        $("#new-product-season").val(originalValues.season);
        $("#new-product-description").val(originalValues.description);
        $("#new-product-price").val(originalValues.price);

        // Asegurarse de que el total se actualice correctamente al cambiar la cantidad
        updateTotal();
    

        // Eliminar la fila original para actualizarla después
        row.remove();
        calcularTotalGeneralVenta();

        // Mostrar el botón de "Actualizar" y "Cancelar", ocultar el de "Guardar"
        $('#save-new-product').hide();
        $('#update-product').show();
        $('#cancel-update').show();
    });

    // Actualizar el producto
    $('#update-product').click(function () {
        var id = $('#new-product-id').val();
        var name = $('#new-product-name').val();
        var quantity = $('#new-product-quantity').val();
        var season = $('#new-product-season').val();
        var description = $('#new-product-description').val();
        var price = $('#new-product-price').val();
        var total = $('#new-product-total').text();

        // Actualizar la fila con los nuevos valores
        var updatedRow = `<tr>
                          <td>${id}</td>
                          <td>${name}</td>
                          <td>${quantity}</td>
                          <td>${season}</td>
                          <td>${description}</td>
                          <td>$${parseFloat(price).toFixed(2)}</td>
                          <td>${total}</td>
                          <td>
                            <button class="btn btn-warning edit-product"> <i class="fa-solid fa-pencil fa-sm"></i> Editar</button>
                            <button class="btn btn-danger delete-product"> <i class="bi bi-trash-fill fa-sm">Eliminar</i> </button>
                    </td>
                        </tr>`;

        // Insertar la fila actualizada en la tabla
        $('#new-product-row').after(updatedRow);

        // Limpiar los campos de entrada y ocultar el botón de actualización
        $('#new-product-name, #new-product-id, #new-product-quantity, #new-product-season, #new-product-description, #new-product-price').val('');
        $('#new-product-total').text('');
        $('#update-product').hide();
        $('#cancel-update').hide();
        $('#save-new-product').show();

    });

    // Eliminar un producto
    var rowToDelete = null; // Variable para almacenar la fila a eliminar

    // Cuando se haga clic en el botón "Eliminar", mostrar el modal
    $(document).on('click', '.delete-product', function () {
        rowToDelete = $(this).closest('tr'); // Guardamos la fila a eliminar
        $('#confirmDeleteModal').modal('show'); // Mostrar el modal de confirmación
    });

    // Cuando se confirme la eliminación, eliminar la fila
    $('#confirmDeleteButton').click(function () {
        if (rowToDelete) {
            rowToDelete.remove(); // Eliminar la fila
            rowToDelete = null; // Reiniciar la variable
            $('#confirmDeleteModal').modal('hide'); // Cerrar el modal
            calcularTotalGeneralVenta();

        }
    });


    // Limpiar las filas por cualquier error de las celdas
    $('#clean-product').click(function () {
        $('#new-product-id, #new-product-name, #new-product-season,#new-product-description, #new-product-price').val('');
        $('#new-product-total').text('');
        calcularTotalGeneralVenta();
    });

    // Cancelar la edición y restaurar la fila original
    $('#cancel-update').click(function () {
        if (originalValues.row) {
            // Restaurar la fila original en la tabla
            // Restaurar la fila original en la tabla
            $('#new-product-row').after(originalValues.row);

            // Limpiar los campos de entrada
            $('#new-product-name, #new-product-id, #new-product-quantity, #new-product-season, #new-product-description, #new-product-price').val('');
            $('#new-product-total').text('');

            // Ocultar los botones de "Actualizar" y "Cancelar", mostrar "Guardar"
            $('#update-product').hide();
            $('#cancel-update').hide();
            $('#save-new-product').show();
            calcularTotalGeneralVenta();


        }

        // Limpiar los campos de entrada
        $('#new-product-name, #new-product-id, #new-product-quantity, #new-product-season, #new-product-description, #new-product-price').val('');
        $('#new-product-total').text('');

        // Ocultar los botones de "Actualizar" y "Cancelar", mostrar "Guardar"
        $('#update-product').hide();
        $('#cancel-update').hide();
        $('#save-new-product').show();
    });

});


$('#btnNuevoCompra').click(function () {
    let productos = [];

    // Iterar sobre cada fila que NO sea la fila de entrada
    $('#todos-dt tbody tr').not('#new-product-row').each(function () {
        let id = $(this).find('td:eq(0)').text().trim();
        let nombre = $(this).find('td:eq(1)').text().trim();
        let cantidad = $(this).find('td:eq(2)').text().trim();
        let temporada = $(this).find('td:eq(3)').text().trim();
        let descripcion = $(this).find('td:eq(4)').text().trim();
        let precio = $(this).find('td:eq(5)').text().replace('$', '').trim();

        if (id && nombre && cantidad && precio) {
            productos.push({
                id: id,
                nombre: nombre,
                cantidad: parseInt(cantidad),
                temporada: temporada,
                descripcion: descripcion,
                precio: parseFloat(precio)
            });
        }
    });

    if (productos.length === 0) {
        
        toastr.error("No hay productos para confirmar", "Error");

        return;
    }

    // Aquí enviamos los productos al backend 
    //console.log("Productos para confirmar:", productos);
    // Enviar por AJAX a tu PHP que procese la venta

    // 2) En cualquier otra página de la aplicación (como esta de generar ventas):
    //Recuperamos el ID con: const id_usuario = localStorage.getItem("idUsuario")
    //Esto funciona porque el localStorage es accesible 
    // desde cualquier página del mismo dominio (mismo protocolo, dominio y puerto).

const id_usuario = localStorage.getItem("idUsuario");
$.ajax({
    url: 'http://127.0.0.1:8000/php-bd/generate-sale.php',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    // 3) Lo incluimos en los datos que 
    // enviamos al servidor: 
    // data: JSON.stringify({ productos: productos, id_usuario: id_usuario })
    data: JSON.stringify({ 
        productos: productos, 
        id_usuario: id_usuario  // <-- AGREGADO
    }),
    success: function (response) {
        // Verificar si el servidor respondió con un error
        if (response.status === 'error') {
            toastr.warning(response.message, "Advertencia");
        }else if (response.status === 'validacionUsuario') {
            toastr.error(response.message, "¡Problemas con el usuario actual!");
        }
         else {
            toastr.success("Venta registrada 🛒✔", "¡Éxito!");
            //console.log("Id de generate",id_usuario)
        }
        //console.log("Respuesta del servidor:", response);
    },
    error: function(xhr, status, error) {
        console.error("Error en el servidor:", error);
    }
});


});