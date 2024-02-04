// LOGIN
let user1 = "drazeer";
let pass1 = "123";
ingresar = false;

let loginUser = prompt("Ingresa tu Usuario");
if (loginUser == user1) {
    for (let i = 0; i < 3; i++) {
        loginPass = prompt("Ingresa tu Contraseña");
        if (loginPass == pass1) {
            alert("Bienvenido!");
            ingresar = true;
            break;
        } else {
            alert("Contraseña Incorrecta");
        }
    }
} else {
    alert("Usuario Incorrecto");
}

//INGRESO DE DATOS

let tasaAnual = 1.68;
let tasaMensual = tasaAnual / 12;
let comChequePorEfectivo1 = 0.04;
let comChequePorEfectivo2 = 0.035;

let fechaOp = new Date();
let fechaOp2 = Math.round(fechaOp / (1000 * 60 * 60 * 24));

if (ingresar) {
    let fechaPago = new Date(prompt("Ingresa la fecha de pago AAAA/MM/DD"));
    let fechaPago2 = Math.round(fechaPago / (1000 * 60 * 60 * 24));
    let fechaPago48hs = fechaPago2 + 3;
    let plazo = fechaPago48hs - fechaOp2;

    function chequeDia() {
        let importe = parseFloat(prompt("Ingresa el importe del cheque"));
        let importe2 = (1 - comChequePorEfectivo1) * importe;
        let interesChequePorEfectivo = importe - importe2;
        console.log("La fecha de hoy es: " + fechaOp);
        console.log("La fecha de pago del Cheque es: " + fechaPago);
        console.log("Importe del Cheque: $" + importe);
        console.log(
            "La comision por descuento es de: $" + interesChequePorEfectivo
        );
        console.log("El importe a recibir por el descuento es de: $" + importe2);
    }

    function chequeDiferido() {
        let importe = parseFloat(prompt("Ingresa el importe del cheque"));
        let neto1 = importe * (1 - (tasaAnual * plazo) / 365);
        let interesPuro = importe - neto1;
        let importe2 = (1 - comChequePorEfectivo2) * importe;
        let interesChequePorEfectivo = importe - importe2;
        let netoFinal = neto1 - interesChequePorEfectivo;
        console.log("La fecha de hoy es: " + fechaOp);
        console.log("La fecha de pago del Cheque es: " + fechaPago);
        console.log("Importe del Cheque: $" + importe);
        console.log("El plazo dela operacion es: " + plazo + " días");
        console.log("Los intereses por el descuento son: $" + interesPuro);
        console.log(
            "La comision por descuento es de: $" + interesChequePorEfectivo
        );
        console.log("El importe a recibir por el descuento es de: $" + netoFinal);
    }

    if (fechaPago2 <= fechaOp2 - 30) {
        alert("El cheque esta vencido! No se puede descontar");
    } else if (fechaPago2 <= fechaOp2 && fechaPago2 >= fechaOp2 - 30) {
        alert("Esta descontando un cheque al día!");
        chequeDia();
    } else {
        chequeDiferido();
    }
}
