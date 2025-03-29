// Mostrar el modal al hacer clic en el botón "Notas"
document.getElementById("btnNotas").onclick = function () {
    document.getElementById("modalNotas").style.display = "block";
};

// Cerrar el modal cuando se hace clic en la "X"
document.querySelector(".close").onclick = function () {
    document.getElementById("modalNotas").style.display = "none";
};

// Guardar la nota en LocalStorage
function guardarNota() {
    let nota = document.getElementById("nota").value.trim();
    if (nota === "") {
        alert("La nota no puede estar vacía");
        return;
    }

    // Obtener notas previas y agregar la nueva
    let notas = JSON.parse(localStorage.getItem("notas")) || [];
    notas.push(nota);
    localStorage.setItem("notas", JSON.stringify(notas));

    alert("Nota guardada correctamente");
    document.getElementById("nota").value = ""; // Limpiar el campo
}

// Ir a la página de ver notas
function verNotas() {
    window.location.href = "verNotas.html"; // Redirige a la otra página
}