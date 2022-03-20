export const validarRegistroUsuario = (nombre = '', apPaterno = '', apMaterno = '', correo = '',
    contrasena = '') => {

    if (nombre.length<2){
        alert("Nombre demasiado corto, por favor ingrese 2 caracteres mínimo")
        return false;
    }

    if (apPaterno.length<2){
        alert("Apellido paterno demasiado corto, por favor ingrese 2 caracteres mínimo")
        return false;
    }

    if (apMaterno.length<2){
        alert("Apellido materno demasiado corto, por favor ingrese 2 caracteres mínimo")
        return false;
    }

    if(!correo.includes('@') || !correo.includes('.')){
        alert("Formato de correo electronico incorrecto");
        return false;
    }

    if(contrasena.toUpperCase().includes(nombre.toUpperCase(), apPaterno.toUpperCase(), apMaterno.toUpperCase())){
        alert("La contraseña no puede incluir su nombre");
        return false;
    }

    if(contrasena.toUpperCase().includes(nombre.toUpperCase(), apPaterno.toUpperCase())){
        alert("La contraseña no puede incluir su nombre");
        return false;
    }

    if(contrasena.toUpperCase().includes(nombre.toUpperCase())){
        alert("La contraseña no puede incluir su nombre");
        return false;
    }

    if(contrasena.length<8){
        alert("La contraseña debe poseer 8 caracteres mínimo");
        return false;
    }

    return true;
}