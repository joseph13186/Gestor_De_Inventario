document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("registroForm");

    if (formulario) {
        formulario.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Validar contraseñas
            const password = document.getElementById("password").value;
            const confirmarPassword = document.getElementById("confirmarPassword").value;
            if (password !== confirmarPassword) {
                alert("Las contraseñas no coinciden.");
                return;
            }

            // Guardar datos básicos en localStorage
            const datos = {
                nombre: document.getElementById("nombre").value,
                apellidos: document.getElementById("apellido").value,
                email: document.getElementById("email").value,
                edad: document.getElementById("edad").value,
                genero: document.getElementById("genero").value
            };
            localStorage.setItem("formData", JSON.stringify(datos));

            // Enviar a backend PHP
            const formData = new FormData(formulario);
            try {
                const res = await fetch("http://127.0.0.1:8000/php-bd/register-users.php", {
                    method: "POST",
                    body: formData,
                });

                const resultado = await res.text();

                if (resultado.toLowerCase().includes("éxito") || resultado.toLowerCase().includes("registrado")) {
                    toastr.success("Usuario registrado correctamente 🎉", "¡Éxito!");
                    formulario.reset();
                    // Redirigir tras éxito si quieres
                } else {
                    toastr.warning("Respuesta inesperada: " + resultado, "Atención");
                }

            } catch (error) {
                toastr.error("No se pudo registrar el usuario 😞", "Error");
                console.error(error);
            }
        });
    }

    // Mostrar datos si estamos en la pantalla correcta
    if (document.getElementById("resultNombre")) {
        mostrarDatos();
    }
});

function mostrarPassword() {
    const passwordInput = document.getElementById("password");
    const confirmarPasswordInput = document.getElementById("confirmarPassword");
    const mostrar = passwordInput.type === "password";
    passwordInput.type = mostrar ? "text" : "password";
    if (confirmarPasswordInput) confirmarPasswordInput.type = mostrar ? "text" : "password";
}
