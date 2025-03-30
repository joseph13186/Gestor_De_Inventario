$(document).ready(function () {
    // "Base de datos" simulada con productos
    var products = [
        { id: 'A', name: 'Producto A', season: 'Verano', description: 'Descripción del producto A', price: 20 },
        { id: 'B', name: 'Producto B', season: 'Invierno', description: 'Descripción del producto B', price: 15 },
        { id: 'C', name: 'Producto C', season: 'Primavera', description: 'Descripción del producto C', price: 25 }
    ];

    // Autocompletar campos al ingresar el nombre o ID en los campos de búsqueda
    $('#new-product-id, #new-product-name').on('input', function () {
        var inputValId = $('#new-product-id').val().toLowerCase();
        var inputValName = $('#new-product-name').val().toLowerCase();

        // Buscar en la base de datos si el ID o nombre coincide
        var found = products.find(function (p) {
            return p.id.toLowerCase() === inputValId || p.name.toLowerCase() === inputValName;
        });

        if (found) {
            // Autocompletar los campos
            if (inputValId && found.id.toLowerCase() === inputValId) {
                $('#new-product-name').val(found.name); // Autocompletar el nombre si encontramos por ID
            } else if (inputValName && found.name.toLowerCase() === inputValName) {
                $('#new-product-id').val(found.id); // Autocompletar el ID si encontramos por nombre
            }

            $('#new-product-season').val(found.season);
            $('#new-product-description').val(found.description);
            $('#new-product-price').val(found.price);
            updateTotal(); // Actualiza el total si ya se ingresó cantidad
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
            alert("Por favor, complete los datos del producto.");
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
    $(document).ready(function () {
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
            }
        });
    });

    // Limpiar las filas por cualquier error de las celdas
    $('#clean-product').click(function () {
        $('#new-product-id, #new-product-name, #new-product-season, #new-product-description, #new-product-price').val('');
        $('#new-product-total').text('');
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



