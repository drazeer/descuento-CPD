// FORMULA PARA CONVERTIR FECHA
// var ingresoDesordenada = prompt("Ingresa la fecha de pago DD/MM/AAAA");
// console.log(ingresoDesordenada)

// const fechaOrdenada = [];
// function ordenarfecha(ingresoDesordenada) {
//     let dia = ingresoDesordenada.substr(0, 2);
//     let mes = ingresoDesordenada.substr(3, 2);
//     let anio = ingresoDesordenada.substr(6, 4);
//     let resultado = anio+"/"+mes+"/"+dia;
//     fechaOrdenada.push(resultado)
//     return fechaOrdenada
// }
// ordenarfecha(ingresoDesordenada);

// console.log(fechaOrdenada[0]);

// fechaOperacion = new Date(fechaOrdenada[0]);
// console.log(fechaOperacion);

//LOGIN
let user1 = "drazeer";
let pass1 = "123";
ingresar = false;

let loginUser = prompt("Ingresa tu Usuario");
if (loginUser == user1) {
    for (let i = 0; i < 3; i++) {
        loginPass = prompt("Ingresa tu Contraseña, tiene 3 intentos");
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

//DATOS POR DEFECTO
let tasaAnual = 1.68;
let tasaMensual = tasaAnual / 12;
let comChequePorEfectivoDirecto = 0.04;
let comChequePorEfectivoDiferido = 0.035;
let alerta;

// FECHA HOY OPERACION
let fechaOp = new Date();
let fechaOp2 = Math.round(fechaOp / (1000 * 60 * 60 * 24));

// FORMATO CHEQUES
const cheques = [];
// FUNCION CONSTRUCTORA CHEQUES
class Cheque {
    constructor(id, fechaHoy, fechaHoyParsed, fechaPago, fechaPagoDateFormat, fechaPagoParsed, plazo, importe, netoChAlDia, comChAlDia, netoChequeIntereses, interesPuro, comChDiferido, netoChequeDif) {
        this.id = id;
        this.fechaHoy = fechaHoy;
        this.fechaHoyParsed = fechaHoyParsed;
        this.fechaPago = fechaPago;
        this.fechaPagoDateFormat = fechaPagoDateFormat;
        this.fechaPagoParsed = fechaPagoParsed;
        this.plazo = plazo;
        this.importe = importe;
        this.netoChAlDia = netoChAlDia;
        this.comChAlDia = comChAlDia;
        this.netoChequeIntereses = netoChequeIntereses;
        this.interesPuro = interesPuro;
        this.comChDiferido = comChDiferido;
        this.netoChequeDif = netoChequeDif;
    }
}
// CHEQUE DE EJEMPLO
cheques.push(new Cheque(
    id = 0,
    fechaHoy = fechaOp,
    fechaHoyParsed = fechaOp2,
    fechaPago = "2025/01/01",
    fechaPagoDateFormat = "Wed Jan 01 2025 00:00:00 GMT-0300 (hora estándar de Argentina)",
    fechaPagoParsed = 20089, //al dia 19773 // a fecha 20089
    plazo = (fechaPagoParsed + 3) - fechaHoyParsed,
    importe = 1000,
    netoChAlDia = (1 - comChequePorEfectivoDirecto) * importe,
    comChAlDia = importe - netoChAlDia,
    netoChequeIntereses = importe * (1 - (tasaAnual * plazo) / 365),
    interesPuro = importe - netoChequeIntereses,
    comChDiferido = comChequePorEfectivoDiferido * importe,
    netoChequeDif = netoChequeIntereses - comChDiferido,
));
//BLUCLE PARA IGRESO DE CHEQUES
if (ingresar) {
    let nuevoCheque = prompt("Desea ingresar un nuevo Cheque? \nIngrese NO para finalizar.");
    while (nuevoCheque !== "NO") {
        cheques.push(new Cheque(
            this.id = parseInt(prompt("Ingrese el ID")),
            this.fechaHoy = fechaOp,
            this.fechaHoyParsed = fechaOp2,
            this.fechaPago = prompt("Ingrese la fecha de pago del cheque AAAA/MM/DD"),
            this.fechaPagoDateFormat = new Date(fechaPago),
            this.fechaPagoParsed = Math.round(fechaPagoDateFormat / (1000 * 60 * 60 * 24)),
            this.plazo = (fechaPagoParsed + 3) - fechaHoyParsed,
            this.importe = parseFloat(prompt("Ingrese el importe del Cheque")),
            this.netoChAlDia = (1 - comChequePorEfectivoDirecto) * importe,
            this.comChAlDia = importe - netoChAlDia,
            this.netoChequeIntereses = importe * (1 - (tasaAnual * plazo) / 365),
            this.interesPuro = importe - netoChequeIntereses,
            this.comChDiferido = comChequePorEfectivoDiferido * importe,
            this.netoChequeDif = netoChequeIntereses - comChDiferido,
        )),
            //CONDICION DE SALIDA DEL BUCLE
            nuevoCheque = prompt("Desea ingresar un nuevo Cheque? \nIngrese NO para finalizar.");
    }
} else {
    alert("Los datos ingresados no son válidos");
}


//SEPARO CHEQUES DIFERIDOS
const chequesDiferidos = cheques.filter(chequeDiferido => ((chequeDiferido.fechaPagoParsed > chequeDiferido.fechaHoyParsed) && (chequeDiferido.netoChequeDif > 0)));
console.log("Listado de cheques DIFERIDOS");
console.log(chequesDiferidos);
//SEPARO CHEQUES AL DIA
const chequesAlDia = cheques.filter(chequeAlDia => ((chequeAlDia.fechaPagoParsed <= chequeAlDia.fechaHoyParsed) && (chequeAlDia.fechaPagoParsed >= (chequeAlDia.fechaHoyParsed - 30))));
console.log("Listado de cheques AL DIA");
console.log(chequesAlDia);
//SEPARO CHEQUES DEMASIADO LARGOS PARA DESCONTAR - DAN UN NETO NEGATIVO
const chequesNegativos = cheques.filter(chequeNegativo => ((chequeNegativo.fechaPagoParsed > chequeNegativo.fechaHoyParsed) && (chequeNegativo.netoChequeDif <= 0) && (chequeNegativo.plazo <= 360)));
console.log("Listado de cheques DEMASIADO LARGOS PARA DESCONTAR");
console.log(chequesNegativos);
//SEPARO CHEQUES +360 DIAS - NO SON CHEQUES VALIDOS
const chequesMas360 = cheques.filter(chequesMas360 => ((chequesMas360.fechaPagoParsed > chequesMas360.fechaHoyParsed) && (chequesMas360.plazo > 360)));
console.log("Listado de cheques que exceden los 360 DIAS");
console.log(chequesMas360);
//SEPARO CHEQUES VENCIDOS
const chequesVencidos = cheques.filter(chequeVencido => ((chequeVencido.fechaPagoParsed <= (chequeVencido.fechaHoyParsed - 30))));
console.log("Listado de cheques VENCIDOS");
console.log(chequesVencidos);


//RECORRO EL ARRAY DE CHEQUES DIFERIDOS
const netosChDferidos = [];
console.log("Cheques DIFERIDOS: " + chequesDiferidos.length);
for (i = 0; i < chequesDiferidos.length; i++) {
    console.log("Descuento del cheque con ID: " + chequesDiferidos[i]["id"] +
        "\nLa fecha de hoy es: " + fechaOp +
        "\nLa fecha de pago del Cheque es: " + chequesDiferidos[i]["fechaPagoDateFormat"] +
        "\nEl plazo de la operacion es de: " + chequesDiferidos[i]["plazo"] + " días" +
        "\nImporte del Cheque: $" + chequesDiferidos[i]["importe"] +
        "\nLos intereses por el descuento son: $" + chequesDiferidos[i]["interesPuro"] +
        "\nLa comision por descuento es de: $" + chequesDiferidos[i]["comChDiferido"] +
        "\nEl importe a recibir por el descuento es de: $" + chequesDiferidos[i]["netoChequeDif"])
    netosChDferidos.push(chequesDiferidos[i]["netoChequeDif"])
}
// SUMO EL TOTAL POR CHEQUES DIFERIDOS
let totalNetosChDferidos = netosChDferidos.reduce((a, b) => a + b, 0);
console.log("El total a recibir por el descuento de cheques DIFERIDOS es de: $" + totalNetosChDferidos);


//RECORRO EL ARRAY DE CHEQUES AL DIA
const netosChAlDia = [];
console.log("Cheques AL DIA: " + chequesAlDia.length);
for (i = 0; i < chequesAlDia.length; i++) {
    console.log("Descuento del cheque con ID: " + chequesAlDia[i]["id"] +
        "\nLa fecha de hoy es: " + fechaOp +
        "\nLa fecha de pago del Cheque es: " + chequesAlDia[i]["fechaPagoDateFormat"] +
        "\nImporte del Cheque: $" + chequesAlDia[i]["importe"] +
        "\nLa comision por descuento es de: $" + chequesAlDia[i]["comChAlDia"] +
        "\nEl importe a recibir por el descuento es de: $" + chequesAlDia[i]["netoChAlDia"])
    netosChAlDia.push(chequesAlDia[i]["netoChAlDia"])
}
// SUMO EL TOTAL POR CHEQUES AL DIA
let totalNetosChDAlDia = netosChAlDia.reduce((a, b) => a + b, 0);
console.log("El total a recibir por el descuento de cheques AL DIA es de: $" + totalNetosChDAlDia);


//RECORRO EL ARRAY DE CHEQUES DEMASIADO LARGOS
console.log("Cheques demasiado largos para ser descontados: " + chequesNegativos.length);
for (i = 0; i < chequesNegativos.length; i++) {
    console.log("Cheque con ID: " + chequesNegativos[i]["id"]);
}
//RECORRO EL ARRAY DE CHEQUES +360 DIAS
console.log("Cheques que exceden los 360 DIAS: " + chequesMas360.length);
for (i = 0; i < chequesMas360.length; i++) {
    console.log("Cheque con ID: " + chequesMas360[i]["id"] +
        "\nEl plazo de la operacion es de: " + chequesMas360[i]["plazo"] + " días")
}

let totalFinal = totalNetosChDferidos + totalNetosChDAlDia;
console.log("El TOTAL A RECIBR ES DE: $" + totalFinal);