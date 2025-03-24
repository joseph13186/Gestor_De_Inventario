document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navbarContent = document.querySelector(".navbar-content");

    menuToggle.addEventListener("click", function () {
        navbarContent.classList.toggle("active"); // Muestra u oculta los elementos de la navbar
    });
});
