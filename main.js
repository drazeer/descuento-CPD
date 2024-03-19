document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById('navbar');
    const loginButton = document.getElementById('login-button');
    const loggedInUser = localStorage.getItem('loggedInUser');

    // Función para mostrar el nombre del usuario en la barra de navegación
    function mostrarNombreUsuario() {
        const userGreeting = document.createElement('span');
        userGreeting.textContent = `${loggedInUser}`;

        const userGreetingLi = document.createElement('li');
        userGreetingLi.appendChild(userGreeting);

        // Heredar clases de los otros elementos li
        userGreetingLi.className = navbar.querySelector('li').className;

        navbar.appendChild(userGreetingLi);
    }

    // Función para cerrar sesión
    function cerrarSesion() {
        localStorage.removeItem('loggedInUser');
        window.location.href = "./index.html"; // Redirigir al usuario al index.html
    }

    // Verificar si el usuario está autenticado
    if (loggedInUser) {
        // Mostrar el nombre del usuario en la barra de navegación
        mostrarNombreUsuario();

        // Mostrar botón de cierre de sesión
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Cerrar Sesión';

        const logoutButtonLi = document.createElement('li');
        logoutButtonLi.appendChild(logoutButton);

        // Heredar clases de los otros elementos li
        logoutButtonLi.className = navbar.querySelector('li').className;

        navbar.appendChild(logoutButtonLi);

        // Agregar evento click al botón de cierre de sesión
        logoutButton.addEventListener('click', cerrarSesion);
    } else {
        // Ocultar secciones restringidas si el usuario no está autenticado
        document.querySelectorAll('.ingreso-datos, .results').forEach(section => {
            section.style.display = 'none';
        });
    }
});


// DATOS POR DEFECTO
let tasaAnual = 1.68;
let tasaMensual = tasaAnual / 12;
let comChequePorEfectivoDirecto = 0.04;
let comChequePorEfectivoDiferido = 0.035;
let alerta;

// FECHA HOY OPERACION
let fechaOp = new Date();
let fechaOp2 = Math.round(fechaOp / (1000 * 60 * 60 * 24));

// ARRAY GENERAL DE CHEQUES
let cheques = JSON.parse(localStorage.getItem('cheques')) || [];

// LLENAMOS INPUTS
function llenarInputs(cheque) {
    let nuevoCheque = document.createElement("div");
    nuevoCheque.setAttribute("class", "chequesclass");

    let IDinput = document.createElement("input");
    IDinput.setAttribute("type", "number");
    IDinput.setAttribute("id", "identificador" + contarCheque);
    IDinput.setAttribute("value", cheque.id);
    IDinput.setAttribute("required", "");
    nuevoCheque.appendChild(IDinput);

    let FPagoinput = document.createElement("input");
    FPagoinput.setAttribute("type", "date");
    FPagoinput.setAttribute("id", "fpagoid" + contarCheque);
    FPagoinput.setAttribute("value", cheque.fechaPago);
    FPagoinput.setAttribute("required", "");
    nuevoCheque.appendChild(FPagoinput);

    let Importeinput = document.createElement("input");
    Importeinput.setAttribute("type", "number");
    Importeinput.setAttribute("id", "importeid" + contarCheque);
    Importeinput.setAttribute("value", cheque.importe);
    Importeinput.setAttribute("required", "");
    nuevoCheque.appendChild(Importeinput);

    let btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "eliminar";
    btnEliminar.onclick = function () {
        eliminarElemento(nuevoCheque, cheque);
    };
    nuevoCheque.appendChild(btnEliminar);

    let contenedorPadre = document.getElementById("contenedorPadre");
    contenedorPadre.appendChild(nuevoCheque);
    contarCheque++;
}

function llenarInputsGuardados() {
    cheques.forEach(cheque => llenarInputs(cheque));
}

// BOTON LIMPIAR
const btnLimpiar = document.getElementById("limpiar");
btnLimpiar.addEventListener("click", limpiarResultados);
function limpiarResultados() {
    // LIMPIO LOS INPUTS DE LA PRIMERA FILA
    const primerFilaInputs = document.querySelectorAll(".chequesclass:first-child input");
    primerFilaInputs.forEach(input => input.value = "");

    // RESTABLEZCO TODO A 1 FILA
    const filasInput = document.querySelectorAll(".chequesclass:not(:first-child)");
    filasInput.forEach(fila => fila.remove());
    contarCheque = 1;

    // LIMPIO LOCAL STORAGE
    localStorage.removeItem('cheques');

    // LIMPIO HTML
    const resultadosPadre = document.getElementById("resultadospadre");
    resultadosPadre.innerHTML = "";
    const noAceptados = document.getElementById("noaceptados");
    noAceptados.innerHTML = "";
}


// CONTADOR CHEQUES
let contarCheque = 0;

// BOTON AGREGAR CHEQUE
function agregarNuevoCheque() {
    const contenedorPadre = document.getElementById("contenedorPadre");
    const nuevoCheque = document.createElement("div");
    nuevoCheque.setAttribute("class", "chequesclass");

    // Obtener el número actual de cheques
    const numeroCheques = contenedorPadre.querySelectorAll(".chequesclass").length;

    const IDinput = document.createElement("input");
    IDinput.setAttribute("type", "number");
    IDinput.setAttribute("id", "identificador" + numeroCheques);
    IDinput.setAttribute("required", "");
    nuevoCheque.appendChild(IDinput);

    const FPagoinput = document.createElement("input");
    FPagoinput.setAttribute("type", "date");
    FPagoinput.setAttribute("id", "fpagoid" + numeroCheques);
    FPagoinput.setAttribute("required", "");
    nuevoCheque.appendChild(FPagoinput);

    const Importeinput = document.createElement("input");
    Importeinput.setAttribute("type", "number");
    Importeinput.setAttribute("id", "importeid" + numeroCheques);
    Importeinput.setAttribute("required", "");
    nuevoCheque.appendChild(Importeinput);

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "eliminar";
    btnEliminar.onclick = function () {
        eliminarElemento(nuevoCheque);
    };
    nuevoCheque.appendChild(btnEliminar);

    // Agregar evento de cambio al input de importe
    Importeinput.addEventListener("input", function () {
        const importeValue = parseFloat(Importeinput.value);
        if (importeValue <= 0) {
            // Mostrar alerta utilizando SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El importe debe ser mayor que 0',
            }).then(() => {
                Importeinput.value = ""; // Limpiar el valor del input
                Importeinput.focus(); // Enfocar el input para que el usuario corrija el valor
            });
        }
    });

    // Agregar evento de cambio al input de fecha de pago
    Importeinput.addEventListener("input", function () {
        const fechaPago = new Date(FPagoinput.value);
        const fechaActual = new Date();
        const diferenciaDias = Math.ceil((fechaPago - fechaActual) / (1000 * 60 * 60 * 24));

        // Verificar si la fecha de pago está vencida (diferencia negativa)
        if (diferenciaDias < -30) {
            // Mostrar alerta utilizando SweetAlert2
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'El cheque está vencido.',
            }).then(() => {
                // Restaurar el valor por defecto del input
                Importeinput.value = ""; // Limpiar el valor del input
                FPagoinput.value = ""; // Limpiar el valor del input
                FPagoinput.focus(); // Enfocar el input para que el usuario corrija el valor
            });
        }

        // Verificar si la fecha de pago supera los 360 días
        else if (diferenciaDias > 360) {
            // Mostrar alerta utilizando SweetAlert2
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'El cheque supera los 360 días.',
            }).then(() => {
                // Restaurar el valor por defecto del input
                Importeinput.value = ""; // Limpiar el valor del input
                FPagoinput.value = ""; // Limpiar el valor del input
                FPagoinput.focus(); // Enfocar el input para que el usuario corrija el valor
            });
        }
    });

    contenedorPadre.appendChild(nuevoCheque);
}


// Agregar evento click al botón agregar
const btnagregar = document.getElementById("agregar")
btnagregar.addEventListener("click", agregarNuevoCheque);

// Agregar evento change a todos los inputs de importe al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    const importeInputs = document.querySelectorAll('input[type="number"]');
    importeInputs.forEach(input => {
        if (input.id.includes("importeid")) {
            input.addEventListener("input", function () {
                const importeValue = parseFloat(input.value);
                if (importeValue <= 0) {
                    // Mostrar alerta utilizando SweetAlert2
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'El importe debe ser mayor que 0',
                    }).then(() => {
                        input.value = ""; // Limpiar el valor del input
                        input.focus(); // Enfocar el input para que el usuario corrija el valor
                    });
                }
            });
        }
    });


});


function eliminarElemento(el) {
    el.remove();
    // Obtener el ID del cheque a eliminar
    const idEliminar = el.querySelector('input[type="number"]').value;
    // Filtrar el arreglo de cheques para eliminar el cheque con el ID correspondiente
    cheques = cheques.filter(cheque => cheque.id !== idEliminar);
    // Guardar los cheques actualizados en el localStorage
    localStorage.setItem('cheques', JSON.stringify(cheques));
}

document.addEventListener("DOMContentLoaded", function () {
    llenarInputsGuardados();
});

// BOTON CALCULAR
const btnCalc = document.getElementById("calcular");
btnCalc.addEventListener("click", () => {
    // LIMPIO EL HTML DE RESULTADOS PARA CADA NUEVA SIMULACION
    const resultadosPadre = document.getElementById("resultadospadre");
    resultadosPadre.innerHTML = "";

    const noAceptadosPadre = document.getElementById("noaceptados");
    noAceptadosPadre.innerHTML = "";
    const cheques = [];
    const classCheques = document.querySelectorAll(".chequesclass");
    
    classCheques.forEach((chequeElement, index) => {
        const inputID = chequeElement.querySelector(`input[id^="identificador"]`);
        const inputFechaPago = chequeElement.querySelector(`input[id^="fpagoid"]`);
        const inputImporte = chequeElement.querySelector(`input[id^="importeid"]`);
    
        if (!inputID.value || !inputFechaPago.value || !inputImporte.value) {
            return; // Saltar este cheque si algún campo está vacío
        }
    
        const chequeCargado = {
            id: inputID.value,
            fechaHoy: fechaOp,
            fechaHoyParsed: fechaOp2,
            fechaPago: inputFechaPago.value,
            fechaPagoDateFormat: new Date(inputFechaPago.value),
            fechaPagoParsed: Math.round(new Date(inputFechaPago.value) / (1000 * 60 * 60 * 24)),
            plazo: Math.round(new Date(inputFechaPago.value) / (1000 * 60 * 60 * 24)) + 3 - fechaOp2,
            importe: inputImporte.value,
            comChAlDia: ((inputImporte.value) - (((1 - comChequePorEfectivoDirecto) * (inputImporte.value)).toFixed(2))).toFixed(2),
            netoChAlDia: ((1 - comChequePorEfectivoDirecto) * (inputImporte.value)).toFixed(2),
            netoChequeIntereses: ((inputImporte.value) * (1 - (tasaAnual * (((Math.round((new Date(inputFechaPago.value)) / (1000 * 60 * 60 * 24))) + 3) - fechaOp2)) / 365)).toFixed(2),
            interesPuro: ((inputImporte.value) - (((inputImporte.value) * (1 - (tasaAnual * (((Math.round((new Date(inputFechaPago.value)) / (1000 * 60 * 60 * 24))) + 3) - fechaOp2)) / 365)).toFixed(2))).toFixed(2),
            comChDiferido: (comChequePorEfectivoDiferido * (inputImporte.value)).toFixed(2),
            netoChequeDif: ((((inputImporte.value) * (1 - (tasaAnual * (((Math.round((new Date(inputFechaPago.value)) / (1000 * 60 * 60 * 24))) + 3) - fechaOp2)) / 365)).toFixed(2)) - ((comChequePorEfectivoDiferido * (inputImporte.value)).toFixed(2))).toFixed(2),
        };
        cheques.push(chequeCargado);
    });
    

    // GUARDO LOS CHQUES EN EL LOCALSTORAGE
    localStorage.setItem('cheques', JSON.stringify(cheques));

    // SEPARO CHEQUES DIFERIDOS
    const chequesDiferidos = cheques.filter(
        (chequeDiferido) =>
            chequeDiferido.fechaPagoParsed > chequeDiferido.fechaHoyParsed &&
            chequeDiferido.netoChequeDif > 0
    );
    // SEPARO CHEQUES AL DIA
    const chequesAlDia = cheques.filter(
        (chequeAlDia) =>
            chequeAlDia.fechaPagoParsed <= chequeAlDia.fechaHoyParsed &&
            chequeAlDia.fechaPagoParsed >= chequeAlDia.fechaHoyParsed - 30
    );
    // SEPARO CHEQUES DEMASIADO LARGOS PARA DESCONTAR - DAN UN NETO NEGATIVO
    const chequesNegativos = cheques.filter(
        (chequeNegativo) =>
            (chequeNegativo.fechaPagoParsed > chequeNegativo.fechaHoyParsed) &&
            (chequeNegativo.netoChequeDif <= 0) &&
            (chequeNegativo.plazo <= 360)
    );

    // DONDE AGREGO AL RESULTADO HIJO
    const aceptado = document.getElementById("resultadospadre");
    const noAceptado = document.getElementById("noaceptados");

    // Textos para encabezados
    const encabezadosTextos = {
        id: "ID",
        fechaHoy: "Fecha Operación",
        fechaPago: "Fecha de Pago",
        plazo: "Plazo",
        interesPuro: "Intereses",
        importe: "Importe",
        comChDiferido: "Comision",
        netoChequeDif: "Neto",
        netoChAlDia: "Neto",
        comChAlDia: "Comision",
    };














// Función para generar una tabla con los resultados y envolverla en un contenedor
function generarTablaEnDiv(cheques, contenedor) {
    if (cheques.length === 0) {
        return;
    }

    // Crear el contenedor para la tabla
    const tablaContainer = document.createElement('div');
    tablaContainer.classList.add('containertablas');

    // Crear la tabla
    const tabla = document.createElement('table');
    tabla.setAttribute('border', '1');
    tabla.classList.add('responsive-table');

    // Crear encabezados de tabla y envolverlos en thead
    const encabezados = Object.keys(cheques[0]).filter(encabezado =>
        encabezado === 'id' ||
        encabezado === 'fechaHoy' ||
        encabezado === 'fechaPago' ||
        encabezado === 'plazo' ||
        encabezado === 'importe' ||
        (cheques === chequesDiferidos && (encabezado === 'interesPuro' || encabezado === 'comChDiferido' || encabezado === 'netoChequeDif')) ||
        (cheques === chequesAlDia && (encabezado === 'netoChAlDia' || encabezado === 'comChAlDia')) ||
        (cheques === chequesNegativos && (encabezado === 'saldo' || encabezado === 'interes' || encabezado === 'cuotas'))
    );
    const thead = document.createElement('thead');
    const encabezadosRow = document.createElement('tr');
    encabezados.forEach(encabezado => {
        const th = document.createElement('th');
        th.textContent = encabezadosTextos[encabezado]; // Utilizar el objeto encabezadosTextos para obtener el texto modificado del encabezado
        encabezadosRow.appendChild(th);
    });
    thead.appendChild(encabezadosRow);
    tabla.appendChild(thead);

    // Crear tbody para el resto de las filas
    const tbody = document.createElement('tbody');

    // Llenar tabla con los datos de los cheques
    let subtotalImporte = 0;
    let subtotalComision = 0;
    let subtotalIntereses = 0;
    let subtotalNeto = 0;

    // Llenar tabla con los datos de los cheques
    cheques.forEach(cheque => {
        const fila = document.createElement('tr');
        encabezados.forEach(encabezado => {
            const celda = document.createElement('td');

            // Manejo especial para los encabezados ID, Fecha Operación y Fecha de Pago
            if (cheques === chequesDiferidos || cheques === chequesAlDia || cheques === chequesNegativos) {
                if (encabezado === 'id') {
                    celda.setAttribute("data-label", "ID");
                } else if (encabezado === 'fechaHoy') {
                    celda.setAttribute("data-label", "Fecha Operación");
                } else if (encabezado === 'fechaPago') {
                    celda.setAttribute("data-label", "Fecha de Pago");
                } else {
                    // Establecer el atributo data-label con el nombre del encabezado
                    celda.setAttribute("data-label", encabezadosTextos[encabezado]);
                }
            } else {
                // Establecer el atributo data-label con el nombre del encabezado
                celda.setAttribute("data-label", encabezadosTextos[encabezado]);
            }

            if (encabezado === 'fechaHoy' || encabezado === 'fechaPago') {
                // Convertir la fecha al formato deseado ('DD-MM-AAAA')
                const fecha = new Date(cheque[encabezado]);
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const anio = fecha.getFullYear();
                const fechaFormateada = dia + '-' + mes + '-' + anio;
                celda.textContent = fechaFormateada;
            } else {
                const valor = parseFloat(cheque[encabezado]);
                if (['interesPuro', 'importe', 'comChDiferido', 'netoChequeDif', 'netoChAlDia', 'comChAlDia'].includes(encabezado)) {
                    // Formatear como moneda en ARS
                    celda.textContent = valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
                } else {
                    celda.textContent = Math.floor(valor); // Mostrar como número entero sin decimales
                }
                if (encabezado === 'importe') {
                    subtotalImporte += valor;
                } else if (encabezado === 'interesPuro') {
                    subtotalIntereses += valor;
                } else if (encabezado === 'comChDiferido' || encabezado === 'comChAlDia') {
                    subtotalComision += valor;
                } else if (encabezado === 'netoChequeDif' || encabezado === 'netoChAlDia') {
                    subtotalNeto += valor;
                }
            }
            fila.appendChild(celda);
        });
        tbody.appendChild(fila);
    });

    // Resto del código para formatear y llenar las celdas de la tabla...

    // Agregar tbody a la tabla
    tabla.appendChild(tbody);

    // Agregar tabla al contenedor
    tablaContainer.appendChild(tabla);

    // Agregar contenedor al contenedor especificado
    contenedor.appendChild(tablaContainer);


    
        // Agregar subtotal solo a las tablas de chequesDiferidos y chequesAlDia
        if (cheques === chequesDiferidos) {
            const filaSubtotal = document.createElement('tr');
            filaSubtotal.setAttribute("id", "subtotal");

            const celdaVacia1 = document.createElement('td');
            filaSubtotal.appendChild(celdaVacia1);

            const celdaVacia2 = document.createElement('td');
            filaSubtotal.appendChild(celdaVacia2);

            const celdaVacia3 = document.createElement('td');
            filaSubtotal.appendChild(celdaVacia3);

            const celdaVacia4 = document.createElement('td');
            filaSubtotal.appendChild(celdaVacia4);

            const celdaImporteSubtotal = document.createElement('td');
            celdaImporteSubtotal.setAttribute("data-label", "Importe Total");
            celdaImporteSubtotal.textContent = subtotalImporte.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
            filaSubtotal.appendChild(celdaImporteSubtotal);

            const celdaInteresSubtotal = document.createElement('td');
            celdaInteresSubtotal.setAttribute("data-label", "Total Intereses");
            celdaInteresSubtotal.textContent = subtotalIntereses.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
            filaSubtotal.appendChild(celdaInteresSubtotal);

            const celdaComisionSubtotal = document.createElement('td');
            celdaComisionSubtotal.setAttribute("data-label", "Total Comisiones");
            celdaComisionSubtotal.textContent = subtotalComision.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
            filaSubtotal.appendChild(celdaComisionSubtotal);

            const celdaNetoSubtotal = document.createElement('td');
            celdaNetoSubtotal.setAttribute("data-label", "Neto Opereación");
            celdaNetoSubtotal.textContent = subtotalNeto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
            filaSubtotal.appendChild(celdaNetoSubtotal);


            tbody.appendChild(filaSubtotal);
        }

        if (cheques === chequesAlDia) {
            const filaSubtotal = document.createElement('tr');
            filaSubtotal.setAttribute("id", "subtotal");

            const celdaVacia1 = document.createElement('td');
            filaSubtotal.appendChild(celdaVacia1);

            const celdaVacia2 = document.createElement('td');
            filaSubtotal.appendChild(celdaVacia2);

            const celdaVacia3 = document.createElement('td');
            filaSubtotal.appendChild(celdaVacia3);

            const celdaVacia4 = document.createElement('td');
            filaSubtotal.appendChild(celdaVacia4);

            const celdaImporteSubtotal = document.createElement('td');
            celdaImporteSubtotal.setAttribute("data-label", "Importe Total");
            celdaImporteSubtotal.textContent = subtotalImporte.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
            filaSubtotal.appendChild(celdaImporteSubtotal);

            const celdaComisionSubtotal = document.createElement('td');
            celdaComisionSubtotal.setAttribute("data-label", "Total Comisiones");
            celdaComisionSubtotal.textContent = subtotalComision.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
            filaSubtotal.appendChild(celdaComisionSubtotal);

            const celdaNetoSubtotal = document.createElement('td');
            celdaNetoSubtotal.setAttribute("data-label", "Neto Opereación");
            celdaNetoSubtotal.textContent = subtotalNeto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
            filaSubtotal.appendChild(celdaNetoSubtotal);

            tbody.appendChild(filaSubtotal);
        }

        // Agregar tbody a la tabla
        tabla.appendChild(tbody);

        // Agregar la tabla al contenedor
        tablaContainer.appendChild(tabla);

        // Agregar el contenedor al contenedor padre
        contenedor.appendChild(tablaContainer);
    }

    // Generar tabla para cheques diferidos
    generarTablaEnDiv(chequesDiferidos, aceptado);

    // Generar tabla para cheques al día
    generarTablaEnDiv(chequesAlDia, aceptado);

    // Generar tabla para chequesNegativos
    generarTablaEnDiv(chequesNegativos, noAceptado);
});
