document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("registroForm");

    if (formulario) {
        formulario.addEventListener("submit", function (event) {
            event.preventDefault(); // Evita el envío predeterminado

            // Capturar valores del formulario
            const datos = {
                nombre: document.getElementById("Nombre").value,
                apellidos: document.getElementById("Apellidos").value,
                email: document.getElementById("email").value,
                edad: document.getElementById("edad").value,
                genero: document.getElementById("genero").value,
                mensaje: document.getElementById("mensaje").value
            };

            // Guardar en localStorage
            localStorage.setItem("formData", JSON.stringify(datos));

            // Asegurarse de que los datos se guardan antes de redirigir
            setTimeout(() => {
                window.location.href = "login.html"; // Redirección manual
            }, 500);
        });
    }

    // Si estamos en Inicio.html, mostramos los datos
    if (document.getElementById("resultNombre","resultEmail")) {
        mostrarDatos();
    }
});

function mostrarDatos() {
    const datos = JSON.parse(localStorage.getItem("formData"));

    if (datos) {
        document.getElementById("resultNombre").innerText = datos.nombre || "No disponible";
        document.getElementById("resultApellidos").innerText = datos.apellidos || "No disponible";
        document.getElementById("resultEmail").innerText = datos.email || "No disponible";
        document.getElementById("resultEdad").innerText = datos.edad || "No disponible";
        document.getElementById("resultGenero").innerText = datos.genero || "No disponible";
        document.getElementById("resultMensaje").innerText = datos.mensaje || "No disponible";
    } else {
        console.warn("No hay datos guardados en localStorage.");
    }

}


document.querySelectorAll('.vertical-menu > ul > li > a').forEach(menuItem => {
    menuItem.addEventListener('click', function(event) {
        event.preventDefault();
        const parentLi = menuItem.parentElement;
        parentLi.classList.toggle('open'); // Alterna la clase 'open' para mostrar/ocultar el submenú
    });
});


