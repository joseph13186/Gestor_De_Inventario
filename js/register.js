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
                window.location.href = "index.html"; // Redirección manual
            }, 500);
        });
    }

    // Si estamos en Inicio.html, mostramos los datos
    if (document.getElementById("resultNombre")) {
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

// mostrarPassword.js
function mostrarPassword() {
    const passwordInput = document.getElementById("password");
    const confirmarPasswordInput = document.getElementById("confirmarPassword");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        confirmarPasswordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

// validarPassword.js
function validarPasswordEnTiempoReal() {
    const password = document.getElementById("password").value;
    const confirmarPassword = document.getElementById("confirmarPassword").value;
    const mensajeError = document.getElementById("mensajeError");

    if (password !== confirmarPassword) {
        mensajeError.textContent = "Las contraseñas no coinciden.";
        mensajeError.style.color="red"
    } else {
        mensajeError.textContent = "Las contraseñas coinciden.";
        mensajeError.style.color="green"
        mensaje.className = "mensaje-invalido"
    }
}

// Asignar la función al evento "input" de ambos campos
document.getElementById("password").addEventListener("input", validarPasswordEnTiempoReal);
document.getElementById("confirmarPassword").addEventListener("input", validarPasswordEnTiempoReal);


// enviarFormulario.js
document.getElementById("registroForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de inmediato

    // Obtener los valores de los campos
    const password = document.getElementById("password").value;
    const confirmarPassword = document.getElementById("confirmarPassword").value;

    // Validar que las contraseñas coincidan
    if (password !== confirmarPassword) {
        alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
        return; // Detiene la ejecución si las contraseñas no coinciden
    }

    // Simular el envío exitoso del formulario
    mostrarMensajeExito();
    limpiarFormulario();
});

function mostrarMensajeExito() {
    // Crear un mensaje de éxito
    const mensajeExito = document.createElement("p");
    mensajeExito.textContent = "¡Registro exitoso!";
    mensajeExito.classList.add("mensaje-exito"); // Aplica la clase CSS

    // Agregar el mensaje al formulario
    const formulario = document.getElementById("registroForm");
    formulario.appendChild(mensajeExito);

    // Opcional: Ocultar el mensaje después de unos segundos
    setTimeout(() => {
        window.location.href = "login.html";
    }, 3000); // El mensaje desaparece después de 3 segundos
}

function limpiarFormulario() {
    // Limpiar todos los campos del formulario
    document.getElementById("registroForm").reset();
}