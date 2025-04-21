// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function () {

    // Obtiene el formulario de inicio de sesión y el elemento donde se mostrará el mensaje de error
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Agrega un evento al formulario para manejar el envío de datos
    loginForm.addEventListener('submit', function (event) {
        // Evita que el formulario se envíe y recargue la página
        event.preventDefault();

        // Obtiene los valores ingresados en los campos de usuario y contraseña
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Verifica si el usuario y la contraseña son correctos
        if (username === "operador" && password === "1234") {
            // Almacena el rol del usuario en sessionStorage para mantener la sesión activa
            sessionStorage.setItem('userRole', 'operador');
            // Redirige a la página de selección de tareas
            window.location.href = "/tareas/seleccionx";
        } else {
            // Muestra un mensaje de error si las credenciales son incorrectas
            errorMessage.textContent = "Usuario o contraseña incorrectos";
            errorMessage.style.display = "block";
        }
    });
});
