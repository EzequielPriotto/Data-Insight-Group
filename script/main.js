// ============== ITEM B ==============
const showMiembros = data => {
    let tabla = data.results[0]['members'].map(member =>member['first_name']+ ' ' + member['last_name'])
    console.table(tabla)
}
// ============== ITEM C ==============
const showAlphaState = data => {   
    let tablaStates = [];
    data.results[0].members.forEach( member => {if(!tablaStates.includes(member.state)){tablaStates.push(member.state)}});
    console.table(tablaStates.sort())  
}
// ============== ITEM D ==============
const showMiembrosPartido = (data, partido) => {
    let tablaPartidos = [];
    tablaPartidos = data.results[0]['members'].map(member =>{ if (member['party'] === partido){ return member['first_name'] + ' ' + member['last_name'] + " " + member['party'];}}).filter(member => member != undefined);
    console.table(tablaPartidos);
}
const showMiembrosPartido2 = (data, partido) => { data.results[0]['members'].filter(member => member['party'] === partido).forEach(member => console.log(member = member['first_name'] + " " + member['last_name'] + " " + member['party']))}
// ============== ITEM E ==============
const showMiembrosEstado = (data, estado) => {
    let tablaEstados = [];
    tablaEstados = data.results[0]['members'].map(member =>{ if (member['state'] === estado){ return member['first_name'] + ' ' + member['last_name'];}}).filter(member => member != undefined);
    console.table(tablaEstados);
}
const showMiembrosEstado2 = (data, estado) => { return console.table(tablaEstados = data.results[0]['members'].filter(member => member['state'] === estado).map(member => member = member['first_name'] + " " + member['last_name'] + " " + member['state'] ))
}





// ============== IMPRESION ==============

const form = document.querySelector("form")
const collator = new Intl.Collator('en');
const selectCuerpo = document.querySelector(`#states`);
const tabla = document.querySelector('#cabecera')
// const check = document.querySelector('#check')
let tipodeOrden = "name"
form.addEventListener("change", evento => handleForm(evento))
tabla.addEventListener("click", event => asignarOrden(event.target))
// check.addEventListener('change', () =>{
//     console.log('manuelita')
// })


const tableUpdate = (data, idTabla, condicion) => {  
    
    let tablaCuerpo = document.querySelector(`#${idTabla}`);
    tablaCuerpo.innerHTML = '';
    if(condicion === ""){
        data['results'][0]['members'].forEach((member) =>{
            let filaNueva = document.createElement('tr');
            
            filaNueva.innerHTML = `
            
            <td scope="row" class="fila1"><a href="${member.url}" target="_blank">${member.first_name} ${
                    member.middle_name ? member.middle_name : ""
                } ${member.last_name} </a></td>
                <td>${member.party}</td>
                <td>${member.state}</td>
                <td>${member.seniority} years</td>
                <td>${member.votes_with_party_pct}%</td>
                
                `;
                
                tablaCuerpo.appendChild(filaNueva);
            })
        }
    else if(condicion === "filtrado"){
        data.forEach((member) =>{
            let filaNueva = document.createElement('tr');
            
            filaNueva.innerHTML = `
           
            <td scope="row" class="fila1"><a href="${member.url}" target="_blank rel="noopener noreferrer" ">${member.first_name} ${
                member.middle_name ? member.middle_name : ""
            } ${member.last_name} </a></td>
            <td>${member.party}</td>
            <td>${member.state}</td>
            <td>${member.seniority} years</td>
            <td>${member.votes_with_party_pct}%</td>
            
            `;
            
            
            tablaCuerpo.appendChild(filaNueva);
        })
    }
    
        
}
tableUpdate(data, 'table-body', "");


const optionUpdate = (data, idSelect, condicion) =>{
   let auxiliar = [];
   if(condicion === "inicio"){
       data.results[0].members.forEach( member => {
           if(!auxiliar.includes(member.state)){
               auxiliar.push(member.state);      
        }});
    auxiliar.sort();
    // console.log(auxiliar)
    auxiliar.forEach(state => {
        let filaNueva = document.createElement('option');
        filaNueva.setAttribute("value",state);
        // filaNueva.value = state;           OTRA MANERA DE ESCRIBIRLO
        filaNueva.innerHTML = `${state}`;
        selectCuerpo.appendChild(filaNueva);
    })
}
   else if(condicion === "data"){
    data.results[0].members.forEach( member => {
        if(!auxiliar.includes(member.state)){
            auxiliar.push(member.state)         
        }});
    auxiliar.sort();
    // console.log(auxiliar)
    
}
return auxiliar

}
optionUpdate(data, 'states', "inicio"); 

const handleForm = () =>{
    // FILTRO POR SELECT (ESTADOS)
    
    let select = document.querySelector('select');

    let primerLista = filtrar(data, select.value, "estados");
      
    // FILTRO POR CHECKBOXES (PARTIDOS)

    // Capturar checkboxes
    let checkboxes = form.querySelectorAll("input[type='checkbox']");
    let valoresSeleccionados = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value)  
    valoresSeleccionados.length === 0 ?  valoresSeleccionados.push("all") : ""

    let segundaLista = filtrar(primerLista, valoresSeleccionados, "partidos");
    tableUpdate(segundaLista, 'table-body', "filtrado");
}

const filtrar = (array, condicion, tipoFiltro) => {    
   
    if(tipoFiltro === "estados"){
        let states = optionUpdate(data, 'states', "data");
        let auxiliar = [];
       
        states.forEach(state => {
            if(state === condicion){
                auxiliar = array.results[0].members.filter((miembro) =>miembro.state === condicion);
            }    
            else if(condicion === "all"){
                auxiliar =  array.results[0].members.filter(miembro => miembro);
            }});
        return auxiliar
    }
    
    else if (tipoFiltro === "partidos"){
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

const asignarOrden = (tipoComparacion) => {
    Array.from(document.getElementsByClassName("THactivado")).forEach(th => th.classList.remove("THactivado"))
    if(tipoComparacion.id === "name"){
        tipoComparacion.classList.add("THactivado")
        tipodeOrden = "name"
        handleForm()
    }
    else if(tipoComparacion.id === "party"){
        tipoComparacion.classList.add("THactivado")
        tipodeOrden = "party"
        handleForm()
    }
    else if(tipoComparacion.id === "state"){
        tipoComparacion.classList.add("THactivado")
        tipodeOrden = "state"
        handleForm()
    }
    else if(tipoComparacion.id === "seniority"){
        tipoComparacion.classList.add("THactivado")
        tipodeOrden = "seniority"
        handleForm()
    }
    else if(tipoComparacion.id === "votes"){
        tipoComparacion.classList.add("THactivado")
        tipodeOrden = "votes"
        handleForm()
    }  
}

function SortArray(x, y){
    if(tipodeOrden === "name"){
        return collator.compare(x.last_name, y.last_name);
    }   
    else if(tipodeOrden === "party"){
        return collator.compare(x.party, y.party);
    }   
    else if(tipodeOrden === "state"){
        return collator.compare(x.state, y.state);
    }   
    else if(tipodeOrden === "seniority"){
        return y.seniority - x.seniority
    }   
    else if(tipodeOrden === "votes"){
        return y.votes_with_party_pct - x.votes_with_party_pct ;
    }   
}