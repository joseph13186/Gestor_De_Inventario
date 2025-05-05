function eliminarProducto(id) {
    $.ajax({
        url: `http://127.0.0.1:8000/php-bd/products-delete.php?id=${id}`,
        type: 'GET', // o 'POST', según cómo lo manejes
        success: function (response) {
            toastr.error("Producto eliminado correctamente 🗑", "¡Éxito!", {
                "positionClass": "toast-bottom-left",
                "timeOut": "4000",
                "closeButton": true,
                "progressBar": true
              });            //alert("Producto eliminado correctamente");
            
              recargarTablas();
        },
        error: function (error) {
            console.error("Error al eliminar producto:", error);
            toastr.error("Ocurrió un error al intentar eliminar el producto : ", error);
            //alert("Ocurrió un error al intentar eliminar el producto.");
        }
    });
}
function recargarTablas(){
    cargarProductos(); // Recarga la tabla
    cargarProductosSpring();
    cargarProductosSummer();
    cargarProductosAutumn();
    cargarProductosWinter();
    
}
