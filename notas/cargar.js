function cargarNotas() {
    let notas = JSON.parse(localStorage.getItem("notas")) || [];
    let lista = document.getElementById("listaNotas");
    lista.innerHTML = "";

    if (notas.length === 0) {
        lista.innerHTML = "<p>No hay notas guardadas.</p>";
    } else {
        notas.forEach((notaObj, index) => {
            let li = document.createElement("li");
            li.innerHTML = `<strong>${notaObj.titulo}</strong>: ${notaObj.nota}`;
            lista.appendChild(li);
        });
    }
}

function regresar() {
    window.location.href = "Notas.html";
}

// Cargar notas al abrir la página
cargarNotas();