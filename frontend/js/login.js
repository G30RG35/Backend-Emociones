$(document).ready(function() {
    $('#loginButton').click(function(event) {
        event.preventDefault();

        const email = $('#email').val();
        const password = $('#password').val();

        const loginData = {
            email: email,
            password: password
        };

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
    });
});
