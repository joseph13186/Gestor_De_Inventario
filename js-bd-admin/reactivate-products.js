function eliminarProducto(id) {
    $.ajax({
        url: `http://127.0.0.1:8000/php-bd/products-reactivate.php?id=${id}`,
        type: 'GET',
        success: function (response) {
            try {
                const res = JSON.parse(response); // Convertimos la respuesta a objeto

                // Si 'message' es un arreglo (múltiples mensajes)
                if (Array.isArray(res.message)) {
                    res.message.forEach(msg => {
                        toastr[msg.type](msg.text, "Atención", {
                            positionClass: "toast-top-left",
                            timeOut: 10000,
                            closeButton: true,
                            progressBar: true
                            
                        });
                         
                    });
                    recargarTablas();
                } else {
                    // Mensaje único (por compatibilidad)
                    toastr[res.status === 'success' ? 'success' : 'warning'](res.message, "Mensaje");
                     recargarTablas();
                }
            } catch (e) {
                console.error("Error al parsear respuesta:", e);
                toastr.error("Error inesperado. Intenta de nuevo.");
            }
        },
        error: function (error) {
            console.error("Error al eliminar producto:", error);
            toastr.error("Error de red al intentar eliminar el producto.");
        }
    });
}

function recargarTablas() {
    cargarProductos(); // Recarga la tabla
    cargarProductosSpring();
    cargarProductosSummer();
    cargarProductosAutumn();
    cargarProductosWinter();

}
