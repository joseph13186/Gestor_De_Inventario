$(document).ready(function () {
    $("#loginForm").submit(function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

        var usuario = $("#usuario").val();
        var password = $("#password").val();

        $.ajax({
            url: "/api/login", // Reemplaza con la URL de tu backend
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ usuario: usuario, password: password }),
            success: function (response) {
                if (response.success) {
                    window.location.href = "index.html"; // Redirige al dashboard
                } else {
                    alert("Usuario o contraseña incorrectos");
                }
            },
            error: function () {
                alert("Hubo un error al conectar con el servidor");
            }
        });
    });
});

