import { defineStore } from 'pinia';
import xxx from '../cansoner/cansoner.js'

export const useCansoStore = defineStore('canso', {
  state: () => ({
    objCansoner: cansoner,
  
    idCanso: null,
    idioma: null,
    llibre: null,

    activarOpcionsCanso: false,

    favorites: [
      // {idCanso: "4", idioma: "ES"},
      // {idCanso: "20", idioma: "ES"},
      // {idCanso: "15", idioma: "ES"},
      // {idCanso: "7", idioma: "ES"},
      // {idCanso: "30", idioma: "ES"},
    ]

  }),




  getters: {
    getArrKeysCansoner: ( state ) => {
      console.log("state.objCansoner", state.objCansoner)
      return Object.keys(state.objCansoner)
    },

    getObjCansonsLlibre: ( state ) => {

      let obj = {}
    
      for (let idCanso in state.objCansoner) {
        Object.keys(state.objCansoner[idCanso]).forEach( function(idioma, index, array) {
          if ( state.objCansoner[idCanso][idioma].cansoner.nom == state.llibre ) {
            
            // Al haver cançons que tenen mateix mateix numero i mateix cansoner, la següent expressio
            // ja no em serveix, ja que no poden haver propietats duplicades. Nomes agafaria una de les 2 cançons (la última)
            
            // obj[state.objCansoner[idCanso][idioma].cansoner.numero] = {idCanso, idioma}
          
            let propietat = state.objCansoner[idCanso][idioma].cansoner.numero + "_" + idioma
            obj[propietat] = {idCanso, idioma}
    
    
          }
        })	
      }
    
      return obj
    
    }







  },
  actions: {

    /**
     * Retorna el id de la cançó i l'idioma.
     * Components on s'executa: "numeros.vue"
     * 
     * @param {*} context 
     * @param {string} payload.llibre - llibre triat
     * @param {number} payload.numero - numero teclejat
     * @return {id}  - Id de la cançó
     */
    actObtenirIdCansoIdioma (payload) {
      console.log("payload", payload);

      const arrKeys = this.getArrKeysCansoner	// array de keys del cansoner
      const objCansoner = this.objCansoner
      let objIdCansoIdiomaTrobats = {idCanso: null, idioma: null}
      
      arrKeys.forEach( (key) => {
        
        const arrIdiomes = Object.keys( objCansoner[key] )	// array d'idiomes que te la cançó
        // console.log(arrIdiomes);
        const arrIdiomesTrobats = arrIdiomes.filter ( (idioma) => {
          // console.log(objCansoner[key][idioma]);
          return objCansoner[key][idioma].cansoner.numero === parseInt(payload.numero) && 
                objCansoner[key][idioma].cansoner.nom === payload.llibre
        })
        
        // if ( arrIdiomesTrobats.length > 0 ) {
        // 	console.log("CANÇÓ TROBADA:")
        // 	console.log(objCansoner[key])
        // }

        switch (arrIdiomesTrobats.length){
          case 0:  // no s'ha trobat la cançó
            break
          case 1: // s'ha trobat la cançó en un unic llibre i per tant, en un unic idioma
            objIdCansoIdiomaTrobats = { idCanso: key, idioma: arrIdiomesTrobats[0] }
            break
          case 2: // s'ha trobat la cançó en 2 llibres i, per tant en 2 idiomes. L'usuari haurà de triar quin idioma vol
            objIdCansoIdiomaTrobats = { idCanso: key, idioma: "escollir idioma"}
        }
      })

      return objIdCansoIdiomaTrobats

    },



    // MUTATIONS (VUEX) ARA ALS ACTIONS (PINIA)

    mutModificarLlibre (llibre) {
      this.llibre = llibre
    },
    
    mutModificarIdCanso (idCanso) {
      console.log("MUT idCanso: " + idCanso)
      this.idCanso = idCanso
    },
    
    mutModificarIdioma (idioma) {
      console.log("MUT idioma: " + idioma)
      this.idioma = idioma
    },
    
    
    
    
    
    actSubstituirFavorits (arr) {
      this.favorites = arr
    },
    
    actAfegirFavorits (obj) {
      this.favorites.push( obj )
    },
    
    actTreureFavorits (index) {
      this.favorites.splice(index, 1)
    }
    





  },
});
