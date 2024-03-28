// LOGIN
document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.getElementById('navbar');
    const loggedInUser = localStorage.getItem('loggedInUser');
    function mostrarNombreUsuario() {
        const userGreeting = document.createElement('span');
        userGreeting.textContent = `${loggedInUser}`;
        const userGreetingLi = document.createElement('li');
        userGreetingLi.appendChild(userGreeting);
        userGreetingLi.className = navbar.querySelector('li').className;
        navbar.appendChild(userGreetingLi);
    }
    // CERRAR SESION
    function cerrarSesion() {
        localStorage.removeItem('loggedInUser');
        window.location.href = "./index.html";
    }
    // SESION ACTIVA
    if (loggedInUser) {
        mostrarNombreUsuario();
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Cerrar Sesión';
        const logoutButtonLi = document.createElement('li');
        logoutButtonLi.appendChild(logoutButton);
        logoutButtonLi.className = navbar.querySelector('li').className;
        navbar.appendChild(logoutButtonLi);
        logoutButton.addEventListener('click', cerrarSesion);
    } else {
        document.querySelectorAll('.ingreso-datos, .results').forEach(section => {
            section.style.display = 'none';
            window.location.href = "./index.html";
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
    IDinput.setAttribute("readonly", "");
    nuevoCheque.appendChild(IDinput);

    let BancoInput = document.createElement("input");
    BancoInput.setAttribute("type", "text");
    BancoInput.setAttribute("id", "bancoid" + contarCheque);
    BancoInput.setAttribute("value", cheque.banco);
    BancoInput.setAttribute("required", "");
    BancoInput.setAttribute("autocomplete", "off");
    BancoInput.setAttribute("readonly", "");
    nuevoCheque.appendChild(BancoInput);

    let FPagoinput = document.createElement("input");
    FPagoinput.setAttribute("type", "date");
    FPagoinput.setAttribute("id", "fpagoid" + contarCheque);
    FPagoinput.setAttribute("value", cheque.fechaPago);
    FPagoinput.setAttribute("required", "");
    FPagoinput.setAttribute("readonly", "");
    nuevoCheque.appendChild(FPagoinput);

    let Importeinput = document.createElement("input");
    Importeinput.setAttribute("type", "number");
    Importeinput.setAttribute("id", "importeid" + contarCheque);
    Importeinput.setAttribute("value", cheque.importe);
    Importeinput.setAttribute("required", "");
    Importeinput.setAttribute("readonly", "");
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

const btnLimpiar = document.getElementById("limpiar");
btnLimpiar.addEventListener("click", limpiarResultados);

function limpiarResultados() {
    // RESTABLEZCO TODO A 0 FILAS
    const filasInput = document.querySelectorAll(".chequesclass");
    filasInput.forEach(fila => fila.remove());
    contarCheque = 0;
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
let numeroCheques;

// BOTON AGREGAR CHEQUE
function agregarNuevoCheque() {
    const contenedorPadre = document.getElementById("contenedorPadre");
    const nuevoCheque = document.createElement("div");
    nuevoCheque.setAttribute("class", "chequesclass");

    numeroCheques = contenedorPadre.querySelectorAll(".chequesclass").length;

    const IDContainer = document.createElement("div");
    IDContainer.setAttribute("class", "input-container");
    const IDinput = document.createElement("input");
    IDinput.setAttribute("class", "id-input");
    IDinput.setAttribute("type", "number");
    IDinput.setAttribute("id", "identificador" + numeroCheques);
    IDinput.setAttribute("required", "");
    IDinput.setAttribute("placeholder", "Identificador");
    IDContainer.appendChild(IDinput);
    nuevoCheque.appendChild(IDContainer);

    const BusquedaBancoContainer = document.createElement("div");
    BusquedaBancoContainer.setAttribute("class", "busqueda-container");
    const BusquedaBancoInputContainer = document.createElement("div");
    BusquedaBancoInputContainer.setAttribute("class", "input-container");
    const BusquedaBanco = document.createElement("input");
    BusquedaBanco.setAttribute("class", "busqueda-banco");
    BusquedaBanco.setAttribute("type", "text");
    BusquedaBanco.setAttribute("id", "bancoid" + numeroCheques);
    BusquedaBanco.setAttribute("placeholder", "Buscar banco");
    BusquedaBanco.setAttribute("autocomplete", "off");
    BusquedaBancoInputContainer.appendChild(BusquedaBanco);
    BusquedaBancoContainer.appendChild(BusquedaBancoInputContainer);

    const ListaResultadosContainer = document.createElement("div");
    ListaResultadosContainer.setAttribute("class", "input-container");

    const ListaResultados = document.createElement("ul");
    ListaResultados.setAttribute("id", "listaResultados" + numeroCheques);
    ListaResultados.setAttribute("class", "lista-resultados");
    ListaResultadosContainer.appendChild(ListaResultados);
    BusquedaBancoContainer.appendChild(ListaResultadosContainer);

    nuevoCheque.appendChild(BusquedaBancoContainer);

    // lLLAMO AL JSON
    fetch('bancosdb.json')
        .then(response => response.json())
        .then(data => {
            const bancos = data;
            BusquedaBanco.addEventListener("input", function () {
                const busqueda = BusquedaBanco.value;
                actualizarListaBancos(busqueda, ListaResultados, bancos, BusquedaBanco);
            });
        })
        .catch(error => {
            console.error('Error al cargar los bancos:', error);
        });

    const FPagoContainer = document.createElement("div");
    FPagoContainer.setAttribute("class", "input-container");
    const FPagoinput = document.createElement("input");
    FPagoinput.setAttribute("type", "date");
    FPagoinput.setAttribute("id", "fpagoid" + numeroCheques);
    FPagoinput.setAttribute("required", "");
    FPagoContainer.appendChild(FPagoinput);
    nuevoCheque.appendChild(FPagoContainer);

    const ImporteContainer = document.createElement("div");
    ImporteContainer.setAttribute("class", "input-container");
    const Importeinput = document.createElement("input");
    Importeinput.setAttribute("type", "number");
    Importeinput.setAttribute("id", "importeid" + numeroCheques);
    Importeinput.setAttribute("required", "");
    Importeinput.setAttribute("placeholder", "Importe");
    ImporteContainer.appendChild(Importeinput);
    nuevoCheque.appendChild(ImporteContainer);

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "eliminar";
    btnEliminar.onclick = function () {
        eliminarElemento(nuevoCheque);
    };
    nuevoCheque.appendChild(btnEliminar);

    // CONTROL DE DATOS INGRESADOS Y SWEETALERTS
    Importeinput.addEventListener("input", function () {
        const importeValue = parseFloat(Importeinput.value);
        if (importeValue <= 0) {
            Swal.fire({
                icon: 'error',
                showConfirmButton: false,
                timer: 1000,
                title: 'Error',
                text: 'El importe debe ser mayor que 0',
            }).then(() => {
                Importeinput.value = "";
                Importeinput.focus();
            });
        }
    });

    FPagoinput.addEventListener("blur", function () {
        const fechaPago = new Date(FPagoinput.value);
        const fechaActual = new Date();
        const diferenciaDias = Math.ceil((fechaPago - fechaActual) / (1000 * 60 * 60 * 24));
        // CHEQUE VENCIDO
        if (diferenciaDias < -30) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'El cheque está vencido.',
            }).then(() => {
                FPagoinput.value = "";
                FPagoinput.focus();
            });
        }
        // CHEQUE + 360 DIAS
        else if (diferenciaDias > 360) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'El cheque supera los 360 días.',
            }).then(() => {
                FPagoinput.value = "";
                FPagoinput.focus();
            });
        }
    });

    contenedorPadre.appendChild(nuevoCheque);
}


// FILTRO Y BUSQUEDA DE BANCOS
let typingTimer;
const doneTypingInterval = 500;

function actualizarListaBancos(busqueda, listaResultados, bancos, BusquedaBanco) {
    listaResultados.innerHTML = "";
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        const resultados = bancos.filter(banco => {
            return banco.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                banco.alias.toLowerCase().includes(busqueda.toLowerCase());
        });
        if (resultados.length === 0) {
            const listItem = document.createElement("li");
            listItem.textContent = "Otra Entidad";
            listItem.setAttribute("data-value", "Otra Entidad");
            listItem.addEventListener("click", function () {
                const selectBanco = document.getElementById("identificador" + numeroCheques);
                BusquedaBanco.value = this.getAttribute("data-value");
                listaResultados.innerHTML = "";
            });
            listaResultados.appendChild(listItem);
            Swal.fire({
                icon: 'info',
                showConfirmButton: false,
                timer: 1000,
                title: 'Seleccione un Banco de la Lista',
                text: 'Si no lo encuentra, seleccione "Otra Entidad".',
            });
        } else {
            resultados.forEach(banco => {
                const listItem = document.createElement("li");
                listItem.textContent = banco.alias;
                listItem.setAttribute("data-value", banco.alias);
                listItem.addEventListener("click", function () {
                    const selectBanco = document.getElementById("identificador" + numeroCheques);
                    BusquedaBanco.value = this.getAttribute("data-value");
                    listaResultados.innerHTML = "";
                });
                listaResultados.appendChild(listItem);
            });
        }
    }, doneTypingInterval);
}


// BOTON AGREGAR
const btnagregar = document.getElementById("agregar")
btnagregar.addEventListener("click", agregarNuevoCheque);

function eliminarElemento(el) {
    el.remove();
    const idEliminar = el.querySelector('input[type="number"]').value;
    cheques = cheques.filter(cheque => cheque.id !== idEliminar);
    localStorage.setItem('cheques', JSON.stringify(cheques));
}
document.addEventListener("DOMContentLoaded", function () {
    llenarInputsGuardados();
});




// BOTON CALCULAR
const btnCalc = document.getElementById("calcular");
btnCalc.addEventListener("click", () => {
    // CONTROL DE CAMPOS VACIOS Y SWEETALERTS
    const inputsVacios = document.querySelectorAll('.chequesclass input:invalid');
    if (inputsVacios.length > 0) {
        const primerInputVacio = inputsVacios[0];
        Swal.fire({
            icon: 'error',
            showConfirmButton: false,
            timer: 1000,
            title: 'Oops...',
            text: 'Por favor complete todos los campos antes de simular.',
        });
        primerInputVacio.focus();
        return;
    }


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
        const inputBanco = chequeElement.querySelector(`input[id^="bancoid"]`);

        if (!inputID.value || !inputFechaPago.value || !inputImporte.value) {
            return;
        }

        function calcularFechaParseada(fecha) {
            return Math.round(new Date(fecha) / (1000 * 60 * 60 * 24));
        }
        function calcularComChAlDia(importe) {
            return ((importe) - (((1 - comChequePorEfectivoDirecto) * (importe)).toFixed(2))).toFixed(2);
        }
        function calcularNetoChAlDia(importe) {
            return ((1 - comChequePorEfectivoDirecto) * (importe)).toFixed(2);
        }
        function calcularNetoChequeIntereses(importe, fechaPago) {
            return ((importe) * (1 - (tasaAnual * (((Math.round((new Date(fechaPago)) / (1000 * 60 * 60 * 24))) + 3) - fechaOp2)) / 365)).toFixed(2);
        }
        function calcularInteresPuro(importe, fechaPago) {
            return ((importe) - (((importe) * (1 - (tasaAnual * (((Math.round((new Date(fechaPago)) / (1000 * 60 * 60 * 24))) + 3) - fechaOp2)) / 365)).toFixed(2))).toFixed(2);
        }
        function calcularComChDiferido(importe) {
            return (comChequePorEfectivoDiferido * (importe)).toFixed(2);
        }
        function calcularNetoChequeDif(importe, fechaPago) {
            return ((((importe) * (1 - (tasaAnual * (((Math.round((new Date(fechaPago)) / (1000 * 60 * 60 * 24))) + 3) - fechaOp2)) / 365)).toFixed(2)) - ((comChequePorEfectivoDiferido * (importe)).toFixed(2))).toFixed(2);
        }

        // OBJETO CHEQUE
        const chequeCargado = {
            id: inputID.value,
            fechaHoy: fechaOp,
            fechaHoyParsed: fechaOp2,
            fechaPago: inputFechaPago.value,
            fechaPagoDateFormat: new Date(inputFechaPago.value),
            fechaPagoParsed: calcularFechaParseada(inputFechaPago.value),
            plazo: calcularFechaParseada(inputFechaPago.value) + 3 - fechaOp2,
            importe: inputImporte.value,
            banco: inputBanco.value,
            comChAlDia: calcularComChAlDia(inputImporte.value),
            netoChAlDia: calcularNetoChAlDia(inputImporte.value),
            netoChequeIntereses: calcularNetoChequeIntereses(inputImporte.value, inputFechaPago.value),
            interesPuro: calcularInteresPuro(inputImporte.value, inputFechaPago.value),
            comChDiferido: calcularComChDiferido(inputImporte.value),
            netoChequeDif: calcularNetoChequeDif(inputImporte.value, inputFechaPago.value),
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

    // ENCABEZADOS DE TABLA
    const encabezadosTextos = {
        id: "ID",
        fechaHoy: "Fecha Operación",
        fechaPago: "Fecha de Pago",
        banco: "Banco",
        plazo: "Plazo",
        interesPuro: "Intereses",
        importe: "Importe",
        comChDiferido: "Comision",
        netoChequeDif: "Neto",
        netoChAlDia: "Neto",
        comChAlDia: "Comision",
    };

    // GENERO TABLA
    function generarTablaEnDiv(cheques, contenedor) {
        if (cheques.length === 0) {
            return;
        }

        const tablaContainer = document.createElement('div');
        tablaContainer.classList.add('containertablas');

        const tituloTabla = document.createElement('h3');
        tituloTabla.textContent = determinarTituloTabla(cheques);
        tituloTabla.setAttribute("class", "results-h3");
        tablaContainer.appendChild(tituloTabla);

        const tabla = document.createElement('table');
        tabla.setAttribute('border', '1');
        tabla.classList.add('responsive-table');

        const encabezados = Object.keys(cheques[0]).filter(encabezado =>
            encabezado === 'id' ||
            encabezado === 'banco' ||
            encabezado === 'fechaHoy' ||
            encabezado === 'fechaPago' ||
            encabezado === 'plazo' ||
            encabezado === 'importe' ||
            (cheques === chequesDiferidos && (encabezado === 'interesPuro' || encabezado === 'comChDiferido' || encabezado === 'netoChequeDif')) ||
            (cheques === chequesAlDia && (encabezado === 'netoChAlDia' || encabezado === 'comChAlDia')) ||
            (cheques === chequesNegativos && (encabezado === 'saldo' || encabezado === 'interes'))
        );

        const thead = document.createElement('thead');
        const encabezadosRow = document.createElement('tr');

        const thID = document.createElement('th');
        thID.textContent = obtenerTextoEncabezado('id');
        encabezadosRow.appendChild(thID);

        const thBanco = document.createElement('th');
        thBanco.textContent = obtenerTextoEncabezado('banco');
        encabezadosRow.appendChild(thBanco);

        encabezados.forEach(encabezado => {
            if (encabezado !== 'id' && encabezado !== 'banco') {
                const th = document.createElement('th');
                th.textContent = obtenerTextoEncabezado(encabezado);
                encabezadosRow.appendChild(th);
            }
        });
        thead.appendChild(encabezadosRow);
        tabla.appendChild(thead);

        function obtenerTextoEncabezado(encabezado) {
            return encabezadosTextos[encabezado] || encabezado;
        }

        const tbody = document.createElement('tbody');
        let subtotalImporte = 0;
        let subtotalComision = 0;
        let subtotalIntereses = 0;
        let subtotalNeto = 0;

        cheques.forEach(cheque => {
            const fila = document.createElement('tr');

            const celdaID = document.createElement('td');
            celdaID.textContent = cheque['id'];
            celdaID.setAttribute("data-label", "ID");
            fila.appendChild(celdaID);

            const celdaBanco = document.createElement('td');
            celdaBanco.textContent = cheque['banco'];
            celdaBanco.setAttribute("data-label", "Banco");
            fila.appendChild(celdaBanco);

            encabezados.forEach(encabezado => {
                if (encabezado !== 'id' && encabezado !== 'banco') {
                    const celda = document.createElement('td');

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

                    celda.setAttribute("data-label", encabezadosTextos[encabezado]);
                    fila.appendChild(celda);
                }
            });

            tbody.appendChild(fila);
        });

        tabla.appendChild(tbody);
        tablaContainer.appendChild(tabla);
        contenedor.appendChild(tablaContainer);

        // SUBTOTALES
        if (cheques === chequesDiferidos) {
            const filaSubtotal = document.createElement('tr');
            filaSubtotal.setAttribute("id", "subtotal");

            const celdasVacias = Array.from({ length: 5 }, () => document.createElement('td'));
            celdasVacias.forEach(celda => filaSubtotal.appendChild(celda));

            const celdaImporteSubtotal = crearCeldaSubtotal("Importe Total", subtotalImporte);
            filaSubtotal.appendChild(celdaImporteSubtotal);

            const celdaInteresSubtotal = crearCeldaSubtotal("Total Intereses", subtotalIntereses);
            filaSubtotal.appendChild(celdaInteresSubtotal);

            const celdaComisionSubtotal = crearCeldaSubtotal("Total Comisiones", subtotalComision);
            filaSubtotal.appendChild(celdaComisionSubtotal);

            const celdaNetoSubtotal = crearCeldaSubtotal("Neto Operación", subtotalNeto, "subtotal-chddif");
            filaSubtotal.appendChild(celdaNetoSubtotal);

            tbody.appendChild(filaSubtotal);
        }

        function crearCeldaSubtotal(label, valor, id = "") {
            const celda = document.createElement('td');
            celda.setAttribute("data-label", label);
            celda.textContent = valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
            if (id) {
                celda.setAttribute("id", id);
            }
            return celda;
        }

        if (cheques === chequesAlDia) {
            const filaSubtotal = document.createElement('tr');
            filaSubtotal.setAttribute("id", "subtotal");

            for (let i = 0; i < 5; i++) {
                filaSubtotal.appendChild(document.createElement('td'));
            }

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
            celdaNetoSubtotal.setAttribute("id", "subtotal-chdia");
            celdaNetoSubtotal.textContent = subtotalNeto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
            filaSubtotal.appendChild(celdaNetoSubtotal);

            tbody.appendChild(filaSubtotal);
        }

        tabla.appendChild(tbody);
        tablaContainer.appendChild(tabla);
        contenedor.appendChild(tablaContainer);
    }

    function determinarTituloTabla(cheques) {
        if (cheques === chequesDiferidos) {
            return "Cheques Diferidos";
        } else if (cheques === chequesAlDia) {
            return "Cheques al Día";
        } else if (cheques === chequesNegativos) {
            return "Cheques No Aceptados";
        }
    }

    generarTablaEnDiv(chequesDiferidos, aceptado);
    generarTablaEnDiv(chequesAlDia, aceptado);
    generarTablaEnDiv(chequesNegativos, noAceptado);



    // TOTALES GENERALES
    const totalChequesDifTd = document.querySelector('#subtotal-chddif');
    const totalChequesDifText = totalChequesDifTd ? totalChequesDifTd.textContent.trim() : '0';
    const cleanNumberStringDif = totalChequesDifText.replace(/[^\d.,]+/g, '');
    const cleanNumberDif = parseFloat(cleanNumberStringDif.replace(/\./g, '').replace(',', '.'));
    const totalChequesDif = isNaN(cleanNumberDif) ? 0 : cleanNumberDif;

    const totalChequesAlDiaTd = document.querySelector('#subtotal-chdia');
    const totalChequesAlDiaText = totalChequesAlDiaTd ? totalChequesAlDiaTd.textContent.trim() : '0';
    const cleanNumberStringAlDia = totalChequesAlDiaText.replace(/[^\d.,]+/g, '');
    const cleanNumberAlDia = parseFloat(cleanNumberStringAlDia.replace(/\./g, '').replace(',', '.'));
    const totalChequesAlDia = isNaN(cleanNumberAlDia) ? 0 : cleanNumberAlDia;

    //TOTAL FINAL
    const totalOperacion = totalChequesDif + totalChequesAlDia;
    const contenedorResultado = document.getElementById("resultadospadre");
    const TotalFinal = document.createElement("h4");
    TotalFinal.textContent = "Total de la Operacion: " + totalOperacion.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    contenedorResultado.appendChild(TotalFinal);
});
