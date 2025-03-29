function cargarNotas() {
    let notas = JSON.parse(localStorage.getItem("notas")) || [];
    let lista = document.getElementById("listaNotas");
    lista.innerHTML = "";

    if (notas.length === 0) {
        lista.innerHTML = "<p>No hay notas guardadas.</p>";
    } else {
        notas.forEach((nota, index) => {
            let li = document.createElement("li");
            li.textContent = `Nota ${index + 1}: ${nota}`;
            lista.appendChild(li);
        });
    }
}

function regresar() {
    window.location.href = "Notas.html"; // Regresa a la página principal
}

// Cargar notas al abrir la página
cargarNotas();