document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar el enlace de cerrar sesión
    const logoutLink = document.getElementById('logout-link');
    
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault(); // Evita que el enlace navegue
            
            // Limpiar el localStorage
            localStorage.removeItem('nombreUsuario');
            localStorage.removeItem('idUsuario');
            
            // Opcional: Limpiar todo el localStorage (si solo usas estos items)
            // localStorage.clear();
            
            // Redirigir al login
            window.location.href = '/html/Gerenal-Use/login.html';            
            // Opcional: Mostrar mensaje de despedida
            alert('Sesión cerrada correctamente');
        });
    }
});