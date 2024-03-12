//DATOS POR DEFECTO
let tasaAnual = 1.68;
let tasaMensual = tasaAnual / 12;
let comChequePorEfectivoDirecto = 0.04;
let comChequePorEfectivoDiferido = 0.035;
let alerta;

// FECHA HOY OPERACION
let fechaOp = new Date();
let fechaOp2 = Math.round(fechaOp / (1000 * 60 * 60 * 24));

// ARRAY GENERAL DE CHEQUES
const cheques = [];
// FORMATO CHEQUE
const chequeObjeto = {
    id: "",
    fechaHoy: "",
    fechaHoyParsed: "",
    fechaPago: "",
    fechaPagoDateFormat: "",
    fechaPagoParsed: "",
    plazo: "",
    importe: "",
    netoChAlDia: "",
    comChAlDia: "",
    netoChequeIntereses: "",
    interesPuro: "",
    comChDiferido: "",
    netoChequeDif: "",
}

//BOTON LIMPIAR
const btnReset = document.getElementById("reset")
btnReset.addEventListener("click", () => {
    const classCheques = document.querySelectorAll(".chequesclass");
    const numCheques = classCheques.length;
    for (let i = 0; i < numCheques; i++) {
        let inputID = document.getElementById(`identificador${i}`);
        inputID.value = "";
        cheques.length = 0;
    }
    console.log(cheques);
})

//BOTON CALCULAR
const btnCalc = document.getElementById("input");
btnCalc.addEventListener("click", () => {
    const classCheques = document.querySelectorAll(".chequesclass");
    const numCheques = classCheques.length;
    for (let i = 0; i < numCheques; i++) {
        const inputID = document.getElementById(`identificador${i}`);
        const inputFechaPago = document.getElementById(`fpagoid${i}`);
        const inputImporte = document.getElementById(`importeid${i}`);
        const chequeCargado = {
            id: inputID.value,
            fechaHoy: fechaOp,
            fechaHoyParsed: fechaOp2,
            fechaPago: inputFechaPago.value,
            fechaPagoDateFormat: new Date(inputFechaPago.value),
            fechaPagoParsed: Math.round((new Date(inputFechaPago.value)) / (1000 * 60 * 60 * 24)),
            plazo: ((Math.round((new Date(inputFechaPago.value)) / (1000 * 60 * 60 * 24))) + 3) - fechaOp2,
            importe: inputImporte.value,
            netoChAlDia: ((1 - comChequePorEfectivoDirecto) * (inputImporte.value)).toFixed(2),
            comChAlDia: ((inputImporte.value) - (((1 - comChequePorEfectivoDirecto) * (inputImporte.value)).toFixed(2))).toFixed(2),
            netoChequeIntereses: ((inputImporte.value) * (1 - (tasaAnual * (((Math.round((new Date(inputFechaPago.value)) / (1000 * 60 * 60 * 24))) + 3) - fechaOp2)) / 365)).toFixed(2),
            interesPuro: ((inputImporte.value) - (((inputImporte.value) * (1 - (tasaAnual * (((Math.round((new Date(inputFechaPago.value)) / (1000 * 60 * 60 * 24))) + 3) - fechaOp2)) / 365)).toFixed(2))).toFixed(2),
            comChDiferido: (comChequePorEfectivoDiferido * (inputImporte.value)).toFixed(2),
            netoChequeDif: ((((inputImporte.value) * (1 - (tasaAnual * (((Math.round((new Date(inputFechaPago.value)) / (1000 * 60 * 60 * 24))) + 3) - fechaOp2)) / 365)).toFixed(2)) - ((comChequePorEfectivoDiferido * (inputImporte.value)).toFixed(2))).toFixed(2),
        };
        cheques.push(chequeCargado);
    }
    console.log(cheques);
    //SEPARO CHEQUES DIFERIDOS
    const chequesDiferidos = cheques.filter(
        (chequeDiferido) =>
            chequeDiferido.fechaPagoParsed > chequeDiferido.fechaHoyParsed &&
            chequeDiferido.netoChequeDif > 0
    );
    console.log("Listado de cheques DIFERIDOS");
    console.log(chequesDiferidos);
    //SEPARO CHEQUES AL DIA
    const chequesAlDia = cheques.filter(
        (chequeAlDia) =>
            chequeAlDia.fechaPagoParsed <= chequeAlDia.fechaHoyParsed &&
            chequeAlDia.fechaPagoParsed >= chequeAlDia.fechaHoyParsed - 30
    );
    console.log("Listado de cheques AL DIA");
    console.log(chequesAlDia);
    //SEPARO CHEQUES DEMASIADO LARGOS PARA DESCONTAR - DAN UN NETO NEGATIVO
    const chequesNegativos = cheques.filter(
        (chequeNegativo) =>
            chequeNegativo.fechaPagoParsed > chequeNegativo.fechaHoyParsed &&
            chequeNegativo.netoChequeDif <= 0 &&
            chequeNegativo.plazo <= 360
    );
    console.log("Listado de cheques DEMASIADO LARGOS PARA DESCONTAR");
    console.log(chequesNegativos);
    //SEPARO CHEQUES +360 DIAS - NO SON CHEQUES VALIDOS
    const chequesMas360 = cheques.filter(
        (chequesMas360) =>
            chequesMas360.fechaPagoParsed > chequesMas360.fechaHoyParsed &&
            chequesMas360.plazo > 360
    );
    console.log("Listado de cheques que exceden los 360 DIAS");
    console.log(chequesMas360);
    //SEPARO CHEQUES VENCIDOS
    const chequesVencidos = cheques.filter(
        (chequeVencido) =>
            chequeVencido.fechaPagoParsed <= chequeVencido.fechaHoyParsed - 30
    );
    console.log("Listado de cheques VENCIDOS");
    console.log(chequesVencidos);

    //RECORRO EL ARRAY DE CHEQUES DIFERIDOS
    const netosChDferidos = [];
const agregado = document.getElementById("resultados")
for (chequeCargado of chequesDiferidos) {
    let contenedor =  document.createElement("div");
    contenedor.innerHTML = `<h3>Identificador: ${chequeCargado.id}</h3>
                            <p>Fecha de Pago: ${chequeCargado.fechaPago}</p>
                            <p>Plazo: ${chequeCargado.plazo} dias</p>
                            <p>Importe: $${chequeCargado.importe}</p>
                            <p>Intereses: $${chequeCargado.interesPuro}</p>
                            <p>Comisión: $${chequeCargado.comChDiferido}</p>
                            <p>Importe a recibir: $${chequeCargado.netoChequeDif}</p>`
    agregado.append(contenedor);
}
    // SUMO EL TOTAL POR CHEQUES DIFERIDOS
    let totalNetosChDferidos = netosChDferidos.reduce((a, b) => a + b, 0);
    console.log(
        "El total a recibir por el descuento de cheques DIFERIDOS es de: $" +
        totalNetosChDferidos
    );


    //RECORRO EL ARRAY DE CHEQUES AL DIA
    const netosChAlDia = [];
    for (chequeCargado of chequesAlDia) {
        let contenedor =  document.createElement("div");
        contenedor.innerHTML = `<h3>Identificador: ${chequeCargado.id}</h3>
                                <p>Fecha de Pago: ${chequeCargado.fechaPago}</p>
                                <p>Plazo: ${chequeCargado.plazo} dias</p>
                                <p>Importe: $${chequeCargado.importe}</p>
                                <p>Intereses: $0</p>
                                <p>Comisión: $${chequeCargado.comChAlDia}</p>
                                <p>Importe a recibir: $${chequeCargado.netoChAlDia}</p>`
        agregado.append(contenedor);
    }
    // SUMO EL TOTAL POR CHEQUES AL DIA
    let totalNetosChDAlDia = netosChAlDia.reduce((a, b) => a + b, 0);
    console.log(
        "El total a recibir por el descuento de cheques AL DIA es de: $" +
        totalNetosChDAlDia
    );

    //RECORRO EL ARRAY DE CHEQUES DEMASIADO LARGOS
    for (chequeCargado of chequesNegativos) {
        let contenedor =  document.createElement("div");
        contenedor.innerHTML = `<h3>Cheques no aceptados:</h3>
                                <h3>Identificador: ${chequeCargado.id}</h3>
                                <p>Fecha de Pago: ${chequeCargado.fechaPago}</p>
                                <p>Plazo: ${chequeCargado.plazo} dias</p>
                                <p>Importe: $${chequeCargado.importe}</p>`
        agregado.append(contenedor);
    }
    //RECORRO EL ARRAY DE CHEQUES +360 DIAS
    for (chequeCargado of chequesMas360) {
        let contenedor =  document.createElement("div");
        contenedor.innerHTML = `<h3>Los cheques superan los 360 dias</h3>
                                <h3>Identificador: ${chequeCargado.id}</h3>
                                <p>Fecha de Pago: ${chequeCargado.fechaPago}</p>
                                <p>Plazo: ${chequeCargado.plazo} dias</p>
                                <p>Importe: $${chequeCargado.importe}</p>`
        agregado.append(contenedor);
    }
    //RECORRO EL ARRAY DE CHEQUES VENCIDOS
    for (chequeCargado of chequesVencidos) {
        let contenedor =  document.createElement("div");
        contenedor.innerHTML = `<h3>Los cheques se encuentran Vencidos</h3>
                                <h3>Identificador: ${chequeCargado.id}</h3>
                                <p>Fecha de Pago: ${chequeCargado.fechaPago}</p>
                                <p>Importe: $${chequeCargado.importe}</p>`
        agregado.append(contenedor);
    }
})



