const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtener los valores de usuario y contraseña ingresados por el usuario
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Cargar los datos de usuarios desde el archivo JSON
    fetch('../usersdb.json')
        .then(response => response.json())
        .then(users => {
            // Buscar el usuario en la lista de usuarios
            const user = users.find(user => user.username === username && user.password === password);
            if (user) {
                // Almacenar el nombre de usuario en localStorage
                localStorage.setItem('loggedInUser', username);

                // Mostrar mensaje de inicio de sesión exitoso
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: 'Bienvenido',
                    showConfirmButton: false,
                    timer: 1500
                });

                // Redirigir a la página principal después de un breve retraso
                setTimeout(() => {
                    window.location.href = "../pages/simulador.html";
                }, 1500);
            } else {
                // Usuario no encontrado, mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error de inicio de sesión',
                    text: 'Usuario o contraseña incorrectos',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        })
        .catch(error => {
            console.error('Error al cargar los usuarios:', error);
            // Mostrar mensaje de error en caso de problemas al cargar el archivo JSON
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la base de datos de usuarios',
                showConfirmButton: false,
                timer: 1500
            });
        });
});
