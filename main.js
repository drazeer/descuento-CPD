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

//BOTON AGREGAR CHEQUE
//NUMERO DE CHEQUE
let contarCheque = 1;

const btnagregar = document.getElementById("agregar")
btnagregar.addEventListener("click", () => {
    let nuevoCheque = document.createElement("div");
    nuevoCheque.setAttribute("class", "chequesclass");

    // CREA EL INPUT DE ID
    let IDinput = document.createElement("input");
    IDinput.setAttribute("type", "number");
    IDinput.setAttribute("id", "identificador" + contarCheque);
    IDinput.setAttribute("placeholder", "Identificador");
    IDinput.setAttribute("required", "");
    nuevoCheque.appendChild(IDinput);

    // CREA EL INPUT DE FECHA DE PAGO
    let FPagoinput = document.createElement("input");
    FPagoinput.setAttribute("type", "date");
    FPagoinput.setAttribute("id", "fpagoid" + contarCheque);
    FPagoinput.setAttribute("required", "");
    nuevoCheque.appendChild(FPagoinput);

    // CREA EL INPUT DE IMPORTE
    let Importeinput = document.createElement("input");
    Importeinput.setAttribute("type", "number");
    Importeinput.setAttribute("id", "importeid" + contarCheque);
    Importeinput.setAttribute("placeholder", "Importe");
    Importeinput.setAttribute("required", "");
    nuevoCheque.appendChild(Importeinput);

    // BOTON ELIMINAR
    let btnEliminar = document.createElement("button");
    btnEliminar.setAttribute("id", "agregar");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = function () {
        eliminarElemento(nuevoCheque);
    };
    nuevoCheque.appendChild(btnEliminar);

    // AGREGAR EL CHEQUE EN EL CONTENEDOR
    let contenedorPadre = document.getElementById("contenedorPadre");
    contenedorPadre.appendChild(nuevoCheque);
    contarCheque++;

    //ELIMINA ELEMENTO
    function eliminarElemento(el) {
        let contenedorPadre = document.getElementById("contenedorPadre");
        contenedorPadre.removeChild(el);
        contarCheque--;
    }
})

// BOTON LIMPIAR
const btnLimpiar = document.getElementById("limpiar");
btnLimpiar.addEventListener("click", limpiarResultados);
function limpiarResultados() {
    // LIMPIAR INPUTS
    const inputs = document.querySelectorAll('input[type="number"], input[type="date"]');
    inputs.forEach(input => input.value = '');
    // LIMPIAR RESULTADOS
    const resultadoPadre = document.getElementById("resultadospadre");
    resultadoPadre.innerHTML = '';
    const noAceptadosPadre = document.getElementById("noaceptados");
    noAceptadosPadre.innerHTML = '';
    // LIMPIAR ARRAY
    cheques.length = 0;
    contarCheque = 1;
}


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

    //SEPARO CHEQUES DIFERIDOS
    const chequesDiferidos = cheques.filter(
        (chequeDiferido) =>
            chequeDiferido.fechaPagoParsed > chequeDiferido.fechaHoyParsed &&
            chequeDiferido.netoChequeDif > 0
    );
    //SEPARO CHEQUES AL DIA
    const chequesAlDia = cheques.filter(
        (chequeAlDia) =>
            chequeAlDia.fechaPagoParsed <= chequeAlDia.fechaHoyParsed &&
            chequeAlDia.fechaPagoParsed >= chequeAlDia.fechaHoyParsed - 30
    );
    //SEPARO CHEQUES DEMASIADO LARGOS PARA DESCONTAR - DAN UN NETO NEGATIVO
    const chequesNegativos = cheques.filter(
        (chequeNegativo) =>
            (chequeNegativo.fechaPagoParsed > chequeNegativo.fechaHoyParsed) &&
            (chequeNegativo.netoChequeDif <= 0) &&
            (chequeNegativo.plazo <= 360)
    );
    //SEPARO CHEQUES +360 DIAS - NO SON CHEQUES VALIDOS
    const chequesMas360 = cheques.filter(
        (chequesMas360) =>
            chequesMas360.fechaPagoParsed > chequesMas360.fechaHoyParsed &&
            chequesMas360.plazo > 360
    );
    //SEPARO CHEQUES VENCIDOS
    const chequesVencidos = cheques.filter(
        (chequeVencido) =>
            chequeVencido.fechaPagoParsed <= chequeVencido.fechaHoyParsed - 30
    );

    // DONDE AGREGO AL RESULTADO HIJO
    const aceptado = document.getElementById("resultadospadre")
    const noAceptado = document.getElementById("noaceptados")
    //RECORRO EL ARRAY DE CHEQUES DIFERIDOS
    const netosChDferidos = [];
    for (chequeCargado of chequesDiferidos) {
        let contenedor = document.createElement("div");
        contenedor.innerHTML = `<div class="resultadocheque">
                                <p>ID N°: ${chequeCargado.id}</p>
                                <p>Fecha de Pago: ${chequeCargado.fechaPago}</p>
                                <p>Plazo: ${chequeCargado.plazo} dias</p>
                                <p>Importe: $${chequeCargado.importe}</p>
                                <p>Intereses: $${chequeCargado.interesPuro}</p>
                                <p>Comisión: $${chequeCargado.comChDiferido}</p>
                                <p>Importe a recibir: $${chequeCargado.netoChequeDif}</p>
                                </div>`
        aceptado.append(contenedor);
    }

    //RECORRO EL ARRAY DE CHEQUES AL DIA
    const netosChAlDia = [];
    for (chequeCargado of chequesAlDia) {
        let contenedor = document.createElement("div");
        contenedor.innerHTML = `<div class="resultadocheque">
                                <p>ID N°: ${chequeCargado.id}</p>
                                <p>Fecha de Pago: ${chequeCargado.fechaPago}</p>
                                <p>Plazo: ${chequeCargado.plazo} dias</p>
                                <p>Importe: $${chequeCargado.importe}</p>
                                <p>Intereses: $0</p>
                                <p>Comisión: $${chequeCargado.comChAlDia}</p>
                                <p>Importe a recibir: $${chequeCargado.netoChAlDia}</p>
                                </div>`
        aceptado.append(contenedor);
    }

    //RECORRO EL ARRAY DE CHEQUES DEMASIADO LARGOS
    for (chequeCargado of chequesNegativos) {
        let contenedor = document.createElement("div");
        contenedor.innerHTML = `<div class="resultadocheque">
                                <p>No aceptado</p>
                                <p>ID N°: ${chequeCargado.id}</p>
                                <p>Fecha de Pago: ${chequeCargado.fechaPago}</p>
                                <p>Plazo: ${chequeCargado.plazo} dias</p>
                                <p>Importe: $${chequeCargado.importe}</p>
                                </div>`
        noAceptado.append(contenedor);
    }
    //RECORRO EL ARRAY DE CHEQUES +360 DIAS
    for (chequeCargado of chequesMas360) {
        let contenedor = document.createElement("div");
        contenedor.innerHTML = `<div class="resultadocheque">
                                <p>Mayor a 365 dias</p>
                                <p>ID N°: ${chequeCargado.id}</p>
                                <p>Fecha de Pago: ${chequeCargado.fechaPago}</p>
                                <p>Plazo: ${chequeCargado.plazo} dias</p>
                                <p>Importe: $${chequeCargado.importe}</p>
                                </div>`
        noAceptado.append(contenedor);
    }
    //RECORRO EL ARRAY DE CHEQUES VENCIDOS
    for (chequeCargado of chequesVencidos) {
        let contenedor = document.createElement("div");
        contenedor.innerHTML = `<div class="resultadocheque">
                                <p>Cheque Vencido</p>
                                <p>ID N°: ${chequeCargado.id}</p>
                                <p>Fecha de Pago: ${chequeCargado.fechaPago}</p>
                                <p>Importe: $${chequeCargado.importe}</p>
                                </div>`
        noAceptado.append(contenedor);
    }

    // SUMAMOS CHEQUES DIFERIDOS
    let totalNetoChequeDif = chequesDiferidos.reduce((total, cheque) => total + parseFloat(cheque.netoChequeDif), 0);
    const totalChDif = document.createElement("div");
    totalChDif.innerHTML = `<p>Total a recibir por el descuento de cheques DIFERIDOS: $${totalNetoChequeDif}</p>`;
    aceptado.appendChild(totalChDif);
    // SUMAMOS CHEQUES AL DIA
    let totalNetoChequeAlDia = chequesAlDia.reduce((total, cheque) => total + parseFloat(cheque.netoChAlDia), 0);
    const totalChAlDia = document.createElement("div");
    totalChAlDia.innerHTML = `<p>Total a recibir por el descuento de cheques AL DIA: $${totalNetoChequeAlDia}</p>`;
    aceptado.appendChild(totalChAlDia);
    // TOTAL DE LA OPERACION
    let totalOperacion = (totalNetoChequeDif + totalNetoChequeAlDia).toFixed(2);
    const totalFinal = document.createElement("div");
    totalFinal.innerHTML = `<p>TOTAL DE LA OPERACION: $${totalOperacion}</p>`;
    aceptado.appendChild(totalFinal);
})


