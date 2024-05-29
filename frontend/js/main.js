$(document).ready(function () {

    function base64UrlDecode(str) {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        let padding = '='.repeat((4 - str.length % 4) % 4);
        str += padding;
        let decodedString = atob(str);
        return JSON.parse(decodedString);
    }

    function decodeJWT(token) {
        let parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('El token JWT no es válido.');
        }
        let payload = base64UrlDecode(parts[1]);

        return payload;
    }

    let token = window.localStorage.getItem('token');
    let decodedPayload = decodeJWT(token);
    console.log(decodedPayload);

    user = decodedPayload.nombre;
    $('#user').text(user);


    $('#cerrarSesion').click(function(event) {
    event.preventDefault();
    window.location.href = 'is.html';
    window.localStorage.removeItem('token');
    });

});