// ============== ITEM B ==============
const showMiembros = data => {
    let tabla = dataBase.map(member => member['first_name'] + ' ' + member['last_name'])
    console.table(tabla)
}
// ============== ITEM C ==============
const showAlphaState = data => {
    let tablaStates = [];
    data.forEach(member => { if (!tablaStates.includes(member.state)) { tablaStates.push(member.state) } });
    // console.log(tablaStates.sort())
    return tablaStates.sort()
}
// ============== ITEM D ==============
const showMiembrosPartido = (data, partido) => {
    let tablaPartidos = [];
    tablaPartidos = dataBase.map(member => { if (member['party'] === partido) { return member['first_name'] + ' ' + member['last_name'] + " " + member['party']; } }).filter(member => member != undefined);
    console.table(tablaPartidos);
}
const showMiembrosPartido2 = (data, partido) => { dataBase.filter(member => member['party'] === partido).forEach(member => console.log(member = member['first_name'] + " " + member['last_name'] + " " + member['party'])) }
// ============== ITEM E ==============
const showMiembrosEstado = (data, estado) => {
    let tablaEstados = [];
    tablaEstados = dataBase.map(member => { if (member['state'] === estado) { return member['first_name'] + ' ' + member['last_name']; } }).filter(member => member != undefined);
    console.table(tablaEstados);
}
const showMiembrosEstado2 = (data, estado) => {
    return console.table(tablaEstados = dataBase.filter(member => member['state'] === estado).map(member => member = member['first_name'] + " " + member['last_name'] + " " + member['state']))
}





// ============== IMPRESION ==============
let body = document.querySelector('body')  // DEFINO MI BODY
let main = document.querySelector('main') // DEFINO MI MAIN
const dataBase = data['results'][0]['members'] // ACORTO LA RUTA DE MI DATA


// DEFINO MI OBJETO CON LAS ESTADISTICAS QUE QUIERO GUARDAR
let estadisticas = {
    "cantidad_De_Republicanos": 0,
    "votos_Totales_Democratas": 0,
    "cantidad_De_Democratas": 0,
    "votos_Totales_Republicanos": 0,
    "cantidad_De_Independientes": 0,
    "votosTotales_Independientes": 0,
    "cantidad_Total": 0,
    "votos_Totales": 0,
}



if (body.id === "bodyTablas") {

    const form = document.querySelector("form")
    const selectCuerpo = document.querySelector(`#statesSelect`);
    const collator = new Intl.Collator('en');


    const tabla = document.querySelector('#cabecera')
    let checkID = "name"
    let check = document.getElementById(`${checkID}`)
    let tipodeOrden = "name"
    let isChecked = true
    form.addEventListener("change", evento => handleForm(evento))
    tabla.addEventListener("click", event => {

        let target = event.target.querySelector('input');
        if (target != null) {
            target.addEventListener('change', () => {
                isChecked = target.checked
                check = target
                handleForm()
            })
        }
    })

    const tableUpdate = (data, idTabla) => {

        let tablaCuerpo = document.querySelector(`#${idTabla}`);
        let listEstados = []
        tablaCuerpo.innerHTML = '';
        data.length === 0 ? tablaCuerpo.innerHTML = `
    <tr>
        <td scope="row" colspan="5" class="fila1">
             <h2 class="text-center bg-danger p-1">NOT FOUND</h2>
        </td>
     </tr>`:
            data.forEach((member) => {
                !listEstados.includes(member.state) ? listEstados.push(member.state) : ""
                let filaNueva = document.createElement('tr');

                filaNueva.innerHTML = `
            
            <td scope="row" class="fila1"><a href="${member.url}" target="_blank">${member.last_name} ${member.middle_name ? member.middle_name : ""
                    } ${member.first_name} </a></td>
                <td>${member.party}</td>
                <td>${member.state}</td>
                <td>${member.seniority} years</td>
                <td>${member.votes_with_party_pct}%</td>
                
                `;

                tablaCuerpo.appendChild(filaNueva);
            })


    }
    tableUpdate(dataBase, 'table-body', "");


    function optionUpdate(arrayStates) {
        selectCuerpo.innerHTML = ' <option selected value="all">All</option> '
        arrayStates.forEach(state => {

            selectCuerpo.innerHTML += `<option value="${state}"> ${state} </option>`
        })
    }

    optionUpdate(showAlphaState(dataBase));

    const handleForm = () => {
        // FILTRO POR SELECT (ESTADOS)

        let select = document.querySelector('#statesSelect');

        let primerLista = filtrar(data, select.value, "estados");

        // FILTRO POR CHECKBOXES (PARTIDOS)

        // Capturar checkboxes
        let checkboxes = form.querySelectorAll("input[type='checkbox']");
        let valoresSeleccionados = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value)
        valoresSeleccionados.length === 0 ? valoresSeleccionados.push("all") : ""

        let segundaLista = filtrar(primerLista, valoresSeleccionados, "partidos");
        tableUpdate(segundaLista, 'table-body');
    }

    const filtrar = (array, condicion, tipoFiltro) => {

        if (tipoFiltro === "estados") {
            let states = showAlphaState(dataBase);
            let auxiliar = [];

            states.forEach(state => {
                if (state === condicion) {
                    auxiliar = array.results[0].members.filter((miembro) => miembro.state === condicion);
                }
                else if (condicion === "all") {
                    auxiliar = array.results[0].members.filter(miembro => miembro);
                }
            });
            return auxiliar
        }

        else if (tipoFiltro === "partidos") {
            let auxiliar = [];
            let listaDeCheck = condicion;
            let listaFiltrada1 = array;
            listaFiltrada1.forEach(miembro =>
                listaDeCheck.forEach(opcion =>
                    miembro.party === opcion && !auxiliar.includes(miembro) ? auxiliar.push(miembro) :
                        opcion === "all" ? auxiliar = listaFiltrada1 : ""))



            return auxiliar.sort(SortArray);

        }
    }

    function SortArray(x, y) {
        //    console.log(check.id)
        tipodeOrden = check.id
        if (tipodeOrden === "name") {
            let icono = document.querySelector('.opcion1')
            if (isChecked) {
                icono.className = "fa-solid fa-arrow-up-a-z opcion1";

                // console.log(isChecked)
                return collator.compare(x.last_name, y.last_name)
            } else {
                icono.className = "fa-solid fa-arrow-down-z-a opcion1";
                return collator.compare(y.last_name, x.last_name)
            }
        }
        else if (tipodeOrden === "party") {
            let icono = document.querySelector('.opcion2')
            if (isChecked) {
                icono.className = "fa-solid fa-arrow-up-a-z opcion2";
                return collator.compare(x.party, y.party);

            } else {
                icono.className = "fa-solid fa-arrow-down-z-a opcion2";
                return collator.compare(y.party, x.party);
            }

        }
        else if (tipodeOrden === "state") {
            let icono = document.querySelector('.opcion3')
            if (isChecked) {
                icono.className = "fa-solid fa-arrow-up-a-z opcion3";
                return collator.compare(x.state, y.state);

            } else {
                icono.className = "fa-solid fa-arrow-down-z-a opcion3";
                return collator.compare(y.state, x.state);
            }
        }
        else if (tipodeOrden === "seniority") {
            let icono = document.querySelector('.opcion4')
            if (isChecked) {
                icono.className = "fa-solid fa-arrow-up-1-9 opcion4";
                return x.seniority - y.seniority

            } else {
                icono.className = "fa-solid fa-arrow-down-9-1 opcion4";
                return y.seniority - x.seniority
            }
        }
        else if (tipodeOrden === "votes") {
            let icono = document.querySelector('.opcion5')
            // console.log(isChecked)
            if (isChecked) {
                icono.className = "fa-solid fa-arrow-up-1-9 opcion5";
                return x.votes_with_party_pct - y.votes_with_party_pct

            } else {
                icono.className = "fa-solid fa-arrow-down-9-1 opcion5";
                return y.votes_with_party_pct - x.votes_with_party_pct
            }
        }
    }

}

if (body.id === "bodyAttendance") {
    let tbody = document.querySelector('#tbody'); // DEFINO MI TBODY

    // -------------- PRIMER TABLA LOGICA --------------

    // CALCULO EL TOTAL E INDIVIDUALMENTE CADA PARTIDO
    dataBase.forEach(member => {
        estadisticas.cantidad_Total++;
        estadisticas.votos_Totales += member.votes_with_party_pct;

        if (member.party === "R") {
            estadisticas.cantidad_De_Republicanos++;
            estadisticas.votos_Totales_Republicanos += member.votes_with_party_pct;
        }
        else if (member.party === "D") {
            estadisticas.cantidad_De_Democratas++;
            estadisticas.votos_Totales_Democratas += member.votes_with_party_pct;
        }
        else if (member.party === "ID") {
            estadisticas.cantidad_De_Independientes++;
            estadisticas.votosTotales_Independientes += member.votes_with_party_pct;
        }

    })

    // CONSIGO TODOS LOS %
    let porcentajeD  = Math.round(estadisticas.votos_Totales_Democratas / estadisticas.cantidad_De_Democratas) ;
    let porcentajeR = Math.round(estadisticas.votos_Totales_Republicanos / estadisticas.cantidad_De_Republicanos);
    let porcentajeID = Math.round(estadisticas.votosTotales_Independientes / estadisticas.cantidad_De_Independientes);
    let porcentajeAll = Math.round(estadisticas.votos_Totales / estadisticas.cantidad_Total);
  
    dibujarTabla(dataBase, "tbody_Glance");  // DIBUJO LA TABLA

    

    // -------------- SEGUNDA Y TERCER TABLA LOGICA --------------

    // CALCULO DEL TOP
    estadisticas.cantidad_Total = estadisticas.cantidad_Total

    let porcentajeTotal = estadisticas.cantidad_Total * 0.1
    porcentajeTotal = Math.round(porcentajeTotal)
    
    console.log('total: ' + estadisticas.cantidad_Total)
    console.log('10%: ' + porcentajeTotal)

    
    // -------------- FUNCIONES GENERALES  --------------
    function dibujarTabla(arrayMiembros, tbodyID) {
        tbody = document.querySelector(`#${tbodyID}`)  // DEFINO DE FORMA DINAMICA MI TBODY
        if (tbodyID == "tbody_Glance") {
            estadisticas.cantidad_De_Independientes=== 0 ? porcentajeID = `-` : porcentajeID = `${porcentajeID}%` // EVITO EL NaN
            tbody.innerHTML = `
            <tr><td>Democrats</td> <td>${estadisticas.cantidad_De_Democratas}</td> <td>${porcentajeD}%</td></tr>
            <tr><td>Republicans</td> <td>${estadisticas.cantidad_De_Republicanos}</td> <td>${porcentajeR}%</td></tr>
            <tr><td>Independents</td> <td>${estadisticas.cantidad_De_Independientes}</td> <td>${porcentajeID}</td></tr>
            <tr><td>Total</td> <td>${estadisticas.cantidad_Total}</td> <td>${porcentajeAll}%</td></tr>
            `
        }
        
        else{

            let arrayCortadoAuxiliar = []  // CREO MI AUXILIAR   
            for (i = 0; i < porcentajeTotal; i++) {
                arrayCortadoAuxiliar.push(arrayMiembros[i]) // LE PUSHEO EL 10% DE MIS MIEMBROS
            }
            

            let vuelta = 0 // INICIO EN LA VUELTA 0
            while (arrayMiembros[porcentajeTotal-1 + vuelta].missed_votes_pct === arrayMiembros[porcentajeTotal + vuelta ].missed_votes_pct) { // COMPARO EL % DEL ULTIMO CON EL % DEL SIGUIENTE
                arrayCortadoAuxiliar.push(arrayMiembros[porcentajeTotal + vuelta]) // PUSHEO A MI ARRAY EL SIGUIENTE AL ULTIMO
                vuelta++
            }
              
            arrayCortadoAuxiliar.forEach(miembro =>{
                let votosRecibidos = (miembro.total_votes / 100) * miembro.votes_with_party_pct

                let datoAImprimir1 = Math.round(votosRecibidos)
                let datoAImprimir2 = miembro.votes_with_party_pct

                if(tbodyID == "tbody_Last_Engaged" || tbodyID == "tbody_Most_Engaged"){
                    datoAImprimir1 = miembro.missed_votes
                    datoAImprimir2 = miembro.missed_votes_pct
                } 
              
                let filaNueva = document.createElement('tr'); // CREO MI FILA
                filaNueva.innerHTML = `
                             <th><a href="${miembro.url}" target="_blank">${miembro.last_name} ${miembro.middle_name ? miembro.middle_name : ""} ${miembro.first_name} </a></th>
                             <th>${datoAImprimir1}</th>
                             <th>${datoAImprimir2}%</th>
                                     `
                tbody.appendChild(filaNueva)
            })
        }
    }
   
    
    let listaMiembros = dataBase.filter(member => member.total_votes != 0) // SUPRIMO A LOS QUE NO TUVIERON VOTOS

    // ___________ ATTENDANCE ___________

    if (main.id === "mainAttendance") {
        // ORDERNAR EL TOP LEAST
        listaMiembros = listaMiembros.sort((x, y) => y.missed_votes_pct - x.missed_votes_pct) // ORDENO MI ARRAY
        dibujarTabla(listaMiembros, 'tbody_Last_Engaged')
        
        // ORDERNAR EL TOP MOST
        listaMiembros = listaMiembros.sort((x, y) => x.missed_votes_pct - y.missed_votes_pct) // ORDENO MI ARRAY
        dibujarTabla(listaMiembros, 'tbody_Most_Engaged')
    }
    
    // ___________ LOYALTY ___________
    
    else if (main.id === "mainLoyalty") {
        // ORDERNAR EL TOP LEAST
        listaMiembros = listaMiembros.sort((x, y) => x.votes_with_party_pct - y.votes_with_party_pct) // ORDENO MI ARRAY
        dibujarTabla(listaMiembros, 'tbody_Last_Loyalty')
        
        // ORDERNAR EL TOP MOST
        listaMiembros = listaMiembros.sort((x, y) => y.votes_with_party_pct - x.votes_with_party_pct) // ORDENO MI ARRAY
        dibujarTabla(listaMiembros, 'tbody_Most_Loyalty')
    }
    
}
