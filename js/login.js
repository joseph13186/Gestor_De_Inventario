$(document).ready(function () {
    $("#loginForm").submit(function (event) {
        event.preventDefault(); // Evita el envío normal del formulario

        let correo = $("#correo").val();
        let password = $("#password").val();

        $.ajax({
            url: "http://127.0.0.1:8000/php/login.php", // Ajusta si tu archivo PHP está en otra ruta
            method: "POST",
            dataType: "json",
            data: {
                correo: correo,
                password: password
            },
            success: function (respuesta) {
                console.log("Respuesta completa:", respuesta);
                console.log("Nombre:", respuesta.nombre);
                // Verifica que sea un login exitoso
                if (respuesta.status === "success") {
                    if (respuesta.rol === "Administrador") {
                        localStorage.setItem("nombreUsuario", respuesta.nombre);
                        console.log("Guardado en localStorage:", localStorage.getItem("nombreUsuario"));
                        window.location.href = "/html/Admin/index.html"; // Ruta del dashboard para administradores
                    } else if (respuesta.rol === "Empleado") {
                        localStorage.setItem("nombreUsuario", respuesta.nombre);
                        window.location.href = "/html/Empleado/index.html"; // Ruta del dashboard para empleados
                    } else {
                        alert("Rol no reconocido.");
                    }
                } else {
                    alert(respuesta.message); // Muestra error desde PHP
                }
            },
            error: function () {
                alert("Error al conectar con el servidor.");
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
const nombre = localStorage.getItem("nombreUsuario");
console.log("Nombre guardado:", nombre);
document.querySelector(".user-name").textContent = nombre || "Usuario";
});


