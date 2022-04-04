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

const form = document.querySelector("form")
const selectCuerpo = document.querySelector(`#statesSelect`);
const collator = new Intl.Collator('en');
const dataBase = data['results'][0]['members']


const tabla = document.querySelector('#cabecera')
let checkID = "name"
let check = document.getElementById(`${checkID}`)
let tipodeOrden = "name"
let isChecked = true
form.addEventListener("change", evento => handleForm(evento))
tabla.addEventListener("click", event => {

    let target = event.target.querySelector('input');
    target.addEventListener('change', () => {
        isChecked = target.checked
        check = target
        handleForm()


    })

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

    // console.log(listEstados)
    // optionUpdate(listEstados)   


}
tableUpdate(dataBase, 'table-body', "");


function optionUpdate(arrayStates) {
    //    console.log(arrayStates)
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

        //  console.log(auxiliar)   
        // optionUpdate(showAlphaState(auxiliar))   

        return auxiliar.sort(SortArray);

    }
}

// const asignarOrden = (tipoComparacion) => {
//     check = document.getElementById(`${tipoComparacion.id}`)
//     // console.log(check)
//     handleForm()
// }

function SortArray(x, y) {
    //    console.log(check.id)
    if (check.id === "name") {
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
    else if (check.id === "party") {
        let icono = document.querySelector('.opcion2')
        if (isChecked) {
            icono.className = "fa-solid fa-arrow-up-a-z opcion2";
            return collator.compare(x.party, y.party);

        } else {
            icono.className = "fa-solid fa-arrow-down-z-a opcion2";
            return collator.compare(y.party, x.party);
        }

    }
    else if (check.id === "state") {
        let icono = document.querySelector('.opcion3')
        if (isChecked) {
            icono.className = "fa-solid fa-arrow-up-a-z opcion3";
            return collator.compare(x.state, y.state);

        } else {
            icono.className = "fa-solid fa-arrow-down-z-a opcion3";
            return collator.compare(y.state, x.state);
        }
    }
    else if (check.id === "seniority") {
        let icono = document.querySelector('.opcion4')
        if (isChecked) {
            icono.className = "fa-solid fa-arrow-up-1-9 opcion4";
            return x.seniority - y.seniority

        } else {
            icono.className = "fa-solid fa-arrow-down-9-1 opcion4";
            return y.seniority - x.seniority
        }
    }
    else if (check.id === "votes") {
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


