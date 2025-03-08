function validarFormulario(event) {
    event.preventDefault(); // Evita que el formulario se envíe

    let usuario = document.getElementById("usuario").value.trim();
    let password = document.getElementById("password").value.trim();

    if (usuario === "" || password === "") {
        alert("Por favor, completa todos los campos.");
        return false; // Evita que el formulario se procese
    }

    // Redirige después de la validación
    window.location.href = "/html/Admin/index.html"; // Asegúrate de que esta ruta sea correcta

    return false; // Asegura que el formulario no se envíe
}
