
Vue.createApp({
  //CREAR Y USAR LAS "VARIABLES"
  data() {
    return {
      inicializacion: {
        houseOrSenate: "",
        init: {
          method: "GET",
          headers: {
            "X-API-KEY": 'mKap1p5z4xvXwUvzYl5bsOvTb18eVTnL9ySMo1da'
          }
        },
        URLAPI: ""
      },
      dataBaseDinamica: [],
      condicionesFiltro: {
        state: "All",
        partys: [],
      },
      listadoEstados: [],
      listaFiltrada: [],
      listaFiltrada2: [],
      listaFiltradaOrdenada: [],
      estadisticas: {
        conteo: {
          cantidad_De_Republicanos: 0,
          votos_Totales_Democratas: 0,
          cantidad_De_Democratas: 0,
          votos_Totales_Republicanos: 0,
          cantidad_De_Independientes: 0,
          votosTotales_Independientes: 0,
          cantidad_Total: 0,
          votos_Totales: 0,
          porcentajeR: 0,
          porcentajeD: 0,
          porcentajeID: 0,
        },
        porcentajeTotal: 0,
        diezPorcientoArray: 0,
        listaMiembrosAttendanceB: [],
        listaMiembrosAttendanceT: [],
        listaMiembrosLoyaltyB: [],
        listaMiembrosLoyaltyT: [],

      },
      auxiliar: [],
      isChecked: false,
      tipodeOrden: "name"
    }
  },

  //SOLO SE EJECUTA ESTE CODIGO CUANDO SE INICIA POR PRIMERA VEZ EL JS
  created() {
    let html = document.querySelector('html');
    html.id === "senate" ? this.inicializacion.houseOrSenate = "Senate" : html.id === "house" ? this.inicializacion.houseOrSenate = "House" : ""
    let loader = document.querySelector('.spinnerContainer');
    if (html.id != "index") {
      loader.classList.add('loaderActivado')
      html.style.overflowY = "hidden"
      html.style.overflowX = "hidden"

    }
    this.inicializacion.URLAPI = `https://api.propublica.org/congress/v1/113/${this.inicializacion.houseOrSenate}/members.json`
    fetch(this.inicializacion.URLAPI, this.inicializacion.init)
      .then(respuesta => respuesta.json())
      .then(data => {
        this.dataBaseDinamica = data.results[0].members
        this.auxiliar = this.dataBaseDinamica
        this.listaFiltrada = this.dataBaseDinamica
        this.listaFiltradaOrdenada = this.listaFiltrada
        html.style.overflowY = "auto"
        loader.classList.remove('loaderActivado')
        loader.classList.add('loaderDesactivado')
        this.listadoEstados = this.crearListadoEstados();

        this.contadorEstadisticas()
        this.tablasAttendanceDown()
      })

  },

  //EN TODO MOMENTO SE ESTA EJECUTANDO LO QUE ESTE DENTRO DEL COMPUTED
  computed: {

    filtroDinamico: function () {
      this.condicionesFiltro.partys.length === 0 ? this.condicionesFiltro.partys.push("all") : ""
      this.condicionesFiltro.partys.length === 2 ? this.condicionesFiltro.partys = this.condicionesFiltro.partys.filter(partido => partido != "all") : ""
      this.listaFiltrada = this.dataBaseDinamica;
      // FILTRO POR ESTADOS
      this.listadoEstados.forEach(estado => {

        if (this.condicionesFiltro.state == estado) {
          this.listaFiltrada = this.listaFiltrada.filter(miembro => miembro.state === estado)
        }
        else if (this.condicionesFiltro.state != "" || this.condicionesFiltro.state === "All") {
          this.listaFiltrada = this.listaFiltrada.filter(miembro => miembro)

        }
      })

      // FILTRO POR PARTIDO

      this.listaFiltrada2 = []
      this.listaFiltrada.forEach(miembro =>
        this.condicionesFiltro.partys.forEach(opcion =>
          miembro.party === opcion && !this.listaFiltrada2.includes(miembro) ? this.listaFiltrada2.push(miembro) :
            opcion === "all" ? this.listaFiltrada2 = this.listaFiltrada : ""))
      this.ordenar(this.listaFiltrada2)
    },

  },

  // SE EJECUTA LA FUNCION SOLO CUANDO SE LA LLAMA
  methods: {
    crearListadoEstados: function () {
      let listadoStates = [];
      this.dataBaseDinamica.forEach(member => { if (!listadoStates.includes(member.state)) { listadoStates.push(member.state) } });
      return listadoStates.sort()
    },

    contadorEstadisticas: function () {

      this.auxiliar.forEach(member => {
        this.estadisticas.conteo.cantidad_Total++;
        this.estadisticas.conteo.votos_Totales += member.votes_with_party_pct;

        if (member.party === "R") {
          this.estadisticas.conteo.cantidad_De_Republicanos++;
          this.estadisticas.conteo.votos_Totales_Republicanos += member.votes_with_party_pct;
        }
        else if (member.party === "D") {
          this.estadisticas.conteo.cantidad_De_Democratas++;
          this.estadisticas.conteo.votos_Totales_Democratas += member.votes_with_party_pct;
        }
        else if (member.party === "ID") {
          this.estadisticas.conteo.cantidad_De_Independientes++;
          this.estadisticas.conteo.votosTotales_Independientes += member.votes_with_party_pct;
        }
      })
      this.estadisticas.conteo.porcentajeD = Math.round(this.estadisticas.conteo.votos_Totales_Democratas / this.estadisticas.conteo.cantidad_De_Democratas)
      this.estadisticas.conteo.porcentajeR = Math.round(this.estadisticas.conteo.votos_Totales_Republicanos / this.estadisticas.conteo.cantidad_De_Republicanos)
      if (this.estadisticas.conteo.cantidad_De_Independientes == 0) {
        this.estadisticas.conteo.porcentajeID = 0
      }
      else {
        this.estadisticas.conteo.porcentajeID = Math.round(this.estadisticas.conteo.votos_Totales_Independientes / this.estadisticas.conteo.cantidad_De_Independientes)
      }
      this.estadisticas.conteo.porcentajeTotal = Math.round(this.estadisticas.conteo.votos_Totales / this.estadisticas.conteo.cantidad_Total)
    },

    tablasAttendanceDown: function () {
      this.estadisticas.diezPorcientoArray = Math.floor(this.estadisticas.conteo.cantidad_Total * 0.1)

      let listaMiembros = this.dataBaseDinamica.filter(member => member.total_votes != 0) // SUPRIMO A LOS QUE NO TUVIERON VOTOS

      this.estadisticas.listaMiembrosAttendanceB = listaMiembros.sort((x, y) => y.missed_votes_pct - x.missed_votes_pct)
      this.estadisticas.listaMiembrosAttendanceB = this.integrarIguales(this.estadisticas.listaMiembrosAttendanceB)

      this.estadisticas.listaMiembrosAttendanceT = listaMiembros.sort((x, y) => x.missed_votes_pct - y.missed_votes_pct)
      this.estadisticas.listaMiembrosAttendanceT = this.integrarIguales(this.estadisticas.listaMiembrosAttendanceT)

      this.estadisticas.listaMiembrosLoyaltyB = listaMiembros.sort((x, y) => x.votes_with_party_pct - y.votes_with_party_pct)
      this.estadisticas.listaMiembrosLoyaltyB = this.integrarIguales(this.estadisticas.listaMiembrosLoyaltyB)

      this.estadisticas.listaMiembrosLoyaltyT = listaMiembros.sort((x, y) => y.votes_with_party_pct - x.votes_with_party_pct)
      this.estadisticas.listaMiembrosLoyaltyT = this.integrarIguales(this.estadisticas.listaMiembrosLoyaltyT)

    },
    integrarIguales: function (arrayMiembros) {
      let vuelta = 0 // INICIO EN LA VUELTA 0
      let arrayCortado = arrayMiembros.slice(0, this.estadisticas.diezPorcientoArray)
      while (arrayMiembros[this.estadisticas.diezPorcientoArray - 1 + vuelta].missed_votes_pct === arrayMiembros[this.estadisticas.diezPorcientoArray + vuelta].missed_votes_pct) { // COMPARO EL % DEL ULTIMO CON EL % DEL SIGUIENTE
        arrayCortado.push(arrayMiembros[this.estadisticas.diezPorcientoArray + vuelta]) // PUSHEO A MI ARRAY EL SIGUIENTE AL ULTIMO
        vuelta++
      }
      return arrayCortado
    },
    ordenar(arrayFiltrado) {
      const collator = new Intl.Collator('en');

      if (this.tipodeOrden === "name") {
        let icono = document.querySelector('.opcion1') != undefined? document.querySelector('.opcion1') : ""
        if (this.isChecked) {
          icono.className = "fa-solid fa-arrow-up-a-z opcion1";
          this.listaFiltradaOrdenada = arrayFiltrado.sort((x, y) => collator.compare(x.last_name, y.last_name))

        } else {
          icono.className = "fa-solid fa-arrow-down-z-a opcion1";
          this.listaFiltradaOrdenada = arrayFiltrado.sort((x, y) => collator.compare(y.last_name, x.last_name))

        }
      }
      else if (this.tipodeOrden === "party") {
        let icono = document.querySelector('.opcion1') != undefined? document.querySelector('.opcion1') : ""
        if (this.isChecked) {
          icono.className = "fa-solid fa-arrow-up-a-z opcion2";
          this.listaFiltradaOrdenada = arrayFiltrado.sort((x, y) => collator.compare(x.party, y.party))

        } else {
          icono.className = "fa-solid fa-arrow-down-z-a opcion2";
          this.listaFiltradaOrdenada = arrayFiltrado.sort((x, y) => collator.compare(y.party, x.party))

        }
      }
      else if (this.tipodeOrden === "state") {
        let icono = document.querySelector('.opcion1') != undefined? document.querySelector('.opcion1') : ""
        if (this.isChecked) {
          icono.className = "fa-solid fa-arrow-up-a-z opcion3";
          this.listaFiltradaOrdenada = arrayFiltrado.sort((x, y) => collator.compare(x.state, y.state))

        } else {
          icono.className = "fa-solid fa-arrow-down-z-a opcion3";
          this.listaFiltradaOrdenada = arrayFiltrado.sort((x, y) => collator.compare(y.state, x.state))

        }
      }
      else if (this.tipodeOrden === "seniority") {
        let icono = document.querySelector('.opcion1') != undefined? document.querySelector('.opcion1') : ""
        if (this.isChecked) {
          icono.className = "fa-solid fa-arrow-up-a-z opcion4";
          this.listaFiltradaOrdenada = arrayFiltrado.sort((x, y) => x.seniority - y.seniority)

        } else {
          icono.className = "fa-solid fa-arrow-down-z-a opcion4";
          this.listaFiltradaOrdenada = arrayFiltrado.sort((x, y) => y.seniority - x.seniority)

        }
      }
      else if (this.tipodeOrden === "votes") {
        let icono = document.querySelector('.opcion1') != undefined? document.querySelector('.opcion1') : ""
        if (this.isChecked) {
          icono.className = "fa-solid fa-arrow-up-a-z opcion5";
          this.listaFiltradaOrdenada = arrayFiltrado.sort((x, y) => x.votes_with_party_pct - y.votes_with_party_pct)

        } else {
          icono.className = "fa-solid fa-arrow-down-z-a opcion5";
          this.listaFiltradaOrdenada = arrayFiltrado.sort((x, y) => y.votes_with_party_pct - x.votes_with_party_pct)

        }
      }


    },
    escucharClick(e) {
      this.isChecked = e.target.checked
      this.tipodeOrden = e.target.id
      this.ordenar(this.listaFiltrada2)

    }
  },

}).mount('#app')
