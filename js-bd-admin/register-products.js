// Configura toastr al inicio
toastr.options = {
  "closeButton": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "timeOut": "4000"
};


document.addEventListener("DOMContentLoaded", () => {
  const btnNuevoProducto = document.getElementById("btnNuevoProducto");
  if (btnNuevoProducto) {
    btnNuevoProducto.addEventListener("click", modalRegistrarProducto);
  }
});

async function modalRegistrarProducto() {
  try {
    const existingModal = document.getElementById("agregarProductoModal");
    if (existingModal) {
      const modal = bootstrap.Modal.getInstance(existingModal);
      if (modal) modal.hide();
      existingModal.remove();
    }

    const response = await fetch("http://127.0.0.1:8000/modals-crud/modalAddProducto.php"); // Asegúrate que esta ruta es correcta según tu estructura
    if (!response.ok) throw new Error("Error al cargar el modal");

    const html = await response.text();
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = html;
    document.body.appendChild(modalContainer);

    const nuevoModal = new bootstrap.Modal(modalContainer.querySelector("#agregarProductoModal"));
    nuevoModal.show();

    const form = document.getElementById("formularioProducto");
    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        try {
          const res = await fetch("http://127.0.0.1:8000/php-bd/register-products.php", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Error al guardar el producto");

          const resultado = await res.text();

          //alert("Producto registrado correctamente: " + resultado);

          // Aquí puedes hacer un chequeo por palabra clave si tu PHP no responde siempre igual:
          if (resultado.toLowerCase().includes("éxito") || resultado.toLowerCase().includes("registrado")) {
            toastr.success("Producto registrado correctamente 🎉", "¡Éxito!");
            cargarProductos(); // Recarga la tabla manualmente

          } else {
            toastr.warning("Respuesta inesperada: " + resultado, "Atención");
          }

          nuevoModal.hide();

          form.reset();


          // Aquí podrías actualizar una tabla con los productos si quieres evitar reload.
        } catch (error) {
          toastr.error("No se pudo registrar el producto 😞", "Error");
          console.error("Error al registrar producto:", error);
        }
      });
    }

  } catch (error) {
    console.error("Error al mostrar el modal:", error);
  }
}
