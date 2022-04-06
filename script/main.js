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
let body = document.querySelector('body')
let main = document.querySelector('main')
const dataBase = data['results'][0]['members']

let estadisticas = {
    "Number_Of_Democrats": 0,
    "Total_Votes_Democrats": 0,
    "Number_Of_Republicans": 0,
    "Total_Votes_Republicans": 0,
    "Number_Of_Independent": 0,
    "Total_Votes_Independent": 0,
    "Number_Total": 0,
    "Total_Votes": 0,
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
        if(target != null){
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
    let tbody = document.querySelector('#tbody')

    // -------------- PRIMER TABLA LOGICA --------------
    // CALCULO EL TOTAL E INDIVIDUALMENTE CADA PARTIDO
    
    dataBase.forEach(member => {
        estadisticas.Number_Total++;
        estadisticas.Total_Votes += member.votes_with_party_pct;
        if (member.party === "R") {
            estadisticas.Number_Of_Republicans++;
            estadisticas.Total_Votes_Republicans += member.votes_with_party_pct;
        }
        else if (member.party === "D") {
            estadisticas.Number_Of_Democrats++;
            estadisticas.Total_Votes_Democrats += member.votes_with_party_pct;
        }
        else if (member.party === "ID") {
            estadisticas.Number_Of_Independent++;
            estadisticas.Total_Votes_Independent += member.votes_with_party_pct;
        }

    })
    let porcentajeR = Math.round(calcularPorcentajePartidos('R'))  //SACO % DE LOS REPUBLICANOS
    let porcentajeD = Math.round(calcularPorcentajePartidos('D'))  //SACO % DE LOS DEMOCRATAS
    let porcentajeID = Math.round(calcularPorcentajePartidos('ID'))  //SACO % DE LOS INDEPENDIENTES    
    let porcentajeAll = Math.round(calcularPorcentajePartidos('ALL')) // HAGO UN PROMEDIO DE LOS 3 %
    dibujarTabla(dataBase, "tbody_Glance")  // DIBUJO LA TABLA




    // -------------- SEGUNDA Y TERCER TABLA LOGICA --------------

    // CALCULO DEL TOP
    console.log('total: ' + estadisticas.Number_Total)
    let porcentajeTotal = estadisticas.Number_Total * 0.1
    console.log('10%: ' + porcentajeTotal)


    // ___________ ATTENDANCE ___________
    
    let tipoTop = ""
    let topData = dataBase.filter(member => member.total_votes != 0)
    if(main.id === "mainAttendance"){
        console.log("hola")
        
        // ORDERNAR EL TOP LEAST
        tipoTop = "Least_Missed"
        topData = topData.sort(ordernarTOP)
        dibujarTabla(topData, 'tbody_Last_Engaged')

        // ORDERNAR EL TOP MOST
        tipoTop = "Most_Missed"
        topData = topData.sort(ordernarTOP)
        dibujarTabla(topData, 'tbody_Most_Engaged')

    }


    // ___________ LOYALTY ___________

   else if(main.id === "mainLoyalty"){
     // ORDERNAR EL TOP LEAST
     console.log("chau")

     tipoTop = "Least_Voted"
     topData = topData.sort(ordernarTOP)
     dibujarTabla(topData, 'tbody_Last_Loyalty')
 
     // ORDERNAR EL TOP MOST
     tipoTop = "Most_Voted"
     topData = topData.sort(ordernarTOP)
     dibujarTabla(topData, 'tbody_Most_Loyalty')
    }



    // -------------- FUNCIONES GENERALES  --------------
    function dibujarTabla(arrayMiembros, tbodyID) {
        tbody = document.querySelector(`#${tbodyID}`)
        console.log(tbody)
        if (tbodyID == "tbody_Glance") {
            estadisticas.Number_Of_Independent === 0 ? porcentajeID = `-` : porcentajeID = `${porcentajeID}%`

            tbody.innerHTML = `
            <tr><td>Democrats</td> <td>${estadisticas.Number_Of_Democrats}</td> <td>${porcentajeD}%</td></tr>
            <tr><td>Republicans</td> <td>${estadisticas.Number_Of_Republicans}</td> <td>${porcentajeR}%</td></tr>
            <tr><td>Independents</td> <td>${estadisticas.Number_Of_Independent}</td> <td>${porcentajeID}</td></tr>
            <tr><td>Total</td> <td>${estadisticas.Number_Total}</td> <td>${porcentajeAll}%</td></tr>
             `
        }
   
        else if (tbodyID == "tbody_Last_Engaged" || tbodyID == "tbody_Most_Engaged") {
            
            porcentajeTotal = Math.round(porcentajeTotal)
            while (arrayMiembros[porcentajeTotal].missed_votes_pct == arrayMiembros[porcentajeTotal+1].missed_votes_pct) {
                
                porcentajeTotal ++
            }
            
            for (i = 0; i <= porcentajeTotal; i++) {
                let filaNueva = document.createElement('tr');
                filaNueva.innerHTML = `
                             <th><a href="${arrayMiembros[i].url}">${arrayMiembros[i].first_name}
                                ${arrayMiembros[i].last_name}
                                </a></th>
                             <th>${arrayMiembros[i].missed_votes}</th>
                             <th>${arrayMiembros[i].missed_votes_pct}%</th>
                                     `
                tbody.appendChild(filaNueva)
            }

        }

        else if (tbodyID == "tbody_Last_Loyalty" || tbodyID == "tbody_Most_Loyalty") {
            porcentajeTotal = Math.round(porcentajeTotal)
            while (arrayMiembros[porcentajeTotal].votes_with_party_pct == arrayMiembros[porcentajeTotal+1].votes_with_party_pct) {
                
                porcentajeTotal ++
            }
            for (i = 0; i < porcentajeTotal; i++) {
                console.log(arrayMiembros[i].first_name + " " + arrayMiembros[i].votes_with_party_pct)
                let filaNueva = document.createElement('tr');
                let votosRecibidos =  (arrayMiembros[i].total_votes / 100) * arrayMiembros[i].votes_with_party_pct
                filaNueva.innerHTML = `
                             <th><a href="${arrayMiembros[i].url}">${arrayMiembros[i].first_name}
                                ${arrayMiembros[i].last_name}
                                </a></th>
                             <th>${Math.round(votosRecibidos)}</th>
                             <th>${arrayMiembros[i].votes_with_party_pct}%</th>
                                     `
                tbody.appendChild(filaNueva)
            }
        }
    }

    function calcularPorcentajePartidos(partido) {
        let resultado
        return partido === "R" ? resultado = estadisticas.Total_Votes_Republicans / estadisticas.Number_Of_Republicans :
            partido === "D" ? resultado = estadisticas.Total_Votes_Democrats / estadisticas.Number_Of_Democrats :
                partido === "ID" ? resultado = estadisticas.Total_Votes_Independent / estadisticas.Number_Of_Independent :
                    partido === "ALL" ? resultado = estadisticas.Total_Votes / estadisticas.Number_Total : ""
    }

    function ordernarTOP(x, y) {
        if (tipoTop === "Least_Missed") {
            return y.missed_votes_pct - x.missed_votes_pct
        }
        if (tipoTop === "Most_Missed") {
            return x.missed_votes_pct - y.missed_votes_pct
        }
        if (tipoTop === "Least_Voted") {
            return x.votes_with_party_pct - y.votes_with_party_pct
        }
        if (tipoTop === "Most_Voted") {
            return y.votes_with_party_pct - x.votes_with_party_pct
        }
    }



}
