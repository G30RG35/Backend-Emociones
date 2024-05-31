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

        console.log('Datos de registro:', registroData);

        $.ajax({
            url: 'http://localhost:3000/personas/register', 
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(registroData),
            success: function(response) {
        
                console.log('Registro exitoso:', response);
               
                window.location.href = 'principal.html';

            },
            error: function(xhr, status, error) {
                
                console.error('Error en el registro:', error);
                alert('Error en el registro: ' + xhr.responseJSON.error);
            }
        });
    });
});