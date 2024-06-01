$(document).ready(function() {
    $('.form').submit(function(event) {
        event.preventDefault(); 

        const nombre = $('#name').val();
        const email = $('#email').val();
        const password = $('#password').val();

        const registroData = {
            nombre: nombre,
            email: email,
            password: password
        };

        const loginData = {
            email: email,
            password: password
        };

        console.log('Datos de registro:', registroData);

        $.ajax({
            url: 'http://localhost:3000/personas/register', 
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(registroData),
            success: function(response) {
                $.ajax({
                    url: 'http://localhost:3000/personas/login', 
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(loginData),
                    success: function(response) {
                        console.log('Login exitoso:', response);
                        window.localStorage.setItem('token', response?.token);
                        // alert('Login exitoso');
                        window.location.href = 'principal.html';
                    },
                    error: function(xhr, status, error) {
                        console.error('Error en el login:', error);
                        alert('Error en el login: ' + xhr.responseJSON.error);
                    }
                });
                // console.log('Registro exitoso:', response);
               
                // window.location.href = 'principal.html';

            },
            error: function(xhr, status, error) {
                
                console.error('Error en el registro:', error);
                alert('Error en el registro: ' + xhr.responseJSON.error);
            }
        });
    });
});