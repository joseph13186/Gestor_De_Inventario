function guardarNota() {
    let titulo = document.getElementById("titulo").value.trim();
    let nota = document.getElementById("nota").value.trim();

    if (titulo === "" || nota === "") {
        alert("Por favor, completa el título y la nota.");
        return;
    }

    // Guardar en LocalStorage como un array de objetos
    let notas = JSON.parse(localStorage.getItem("notas")) || [];
    notas.push({ titulo, nota });
    localStorage.setItem("notas", JSON.stringify(notas));

    alert("Nota guardada correctamente");
    document.getElementById("titulo").value = ""; 
    document.getElementById("nota").value = ""; 
}

function verNotas() {
    window.location.href = "notes.html";
}