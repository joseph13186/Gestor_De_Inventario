$(document).ready(function () {
    $("#loginForm").submit(function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

        let correo = $("#correo").val();
        let password = $("#password").val();

        $.ajax({
            // Corremos el servicio php desde la carpeta principal del proyectp
            // y ademas debemos de especifcar la carpeta donde se encuentra los archivos php
            url: "http://127.0.0.1:8000/php/login.php", // Archivo PHP que procesa el login
            method: "POST",
            data: { correo: correo, password: password },
            success: function (respuesta) {
                // La respuesta ya es un objeto JSON, no es necesario hacer JSON.parse
                if (respuesta.status === "success") {
                    window.location.href = "/html/Admin/index.html"; // Redirige si el login es correcto
                } else {
                    alert(respuesta.message); // Muestra el mensaje de error devuelto desde PHP
                }
            },
            error: function () {
                alert("Error en la solicitud.");
                console.log(correo, password); // Verifica que se están obteniendo correctamente
            }
        });
    });
});
