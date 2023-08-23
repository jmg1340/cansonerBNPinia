<template>
  <!-- <q-scroll-area style="height: 100vh; width: 100vh;" :visible="false"> -->
  
  <div class="flex-start q-pa-md" :class="{classFonsClar: !opcions.temaFosc,
  classFonsFosc: opcions.temaFosc}">
  

    <div class="q-gutter-md">

      <!-- boto superior CATALA / CASTELLA -->

      <div class="row justify-center" v-if="arrIdiomes.length > 1">
        <q-btn-toggle
          v-model="strIdioma"
          color="brown"
          text-color="white"
          toggle-color="orange"
          toggle-text-color="black"
          push
          glossy
          :options="optionsToggle"
          @click="vesAlComensament"
        />
      </div>



      <div class="bg-brown-1 shadow-1 rounded-borders" >
        <div 
          v-for="(_idioma,index) in arrIdiomes"
          :key="`_idioma-${index}`"

          :name="_idioma" 
          class="column no-wrap flex-start"
          :class="{'bg-grey-10': opcions.temaFosc}"
          v-touch-swipe.mouse.right.left="mostrarSeguentCanso"
        >
          
          <div v-if="_idioma == strIdioma">


            <!-- CAPÇALERA I REPRODUCTOR MULTIMEDIA -->
            <div >
              <div class="row justify-between items-center">

                
                <!-- numero canço - llibre -->
                <div class="col block " >
                  <q-chip 
                    :color="(objCanso[_idioma].cansoner.nom == 'vermell') ? 'red-8' : (objCanso[_idioma].cansoner.nom == 'blau') ? 'blue-8' : 'grey-8'" 
                    text-color="white"
                    
                  >
                    <q-avatar color="black" text-color="white text-bold">
                      {{objCanso[_idioma].cansoner.numero}}
                    </q-avatar>
                    llibre {{objCanso[_idioma].cansoner.nom}}
                  </q-chip>                
                </div>

                <!-- icona cor -->
                <div class="col-auto text-center"
                  v-if="opcions.mostrarIconaFavorit == true"
                >
                  <q-icon
                    v-if="esCansoFavorita == false"
                    style= "color: #545454; font-size: 1.5rem;"
                    dense
                    name="favorite_border"
                    @click="afegirFavorits()"
                  />

                  <transition
                    name="bounce"
                  >
                    <q-icon
                      v-if="esCansoFavorita == true"
                      style= "color: #ff0000; font-size: 2rem;"
                      dense
                      name="favorite"
                      @click="treureFavorits()"
                    />
                  </transition>

                </div>

                
                <!-- icona email -->
                <div class="col text-right" >
                  
                  <q-fab color="grey-4" flat text-color="black" icon="share" direction="down" padding="xs"
                    v-if="!opcions.amagaSocialLinks" >
                          <q-fab-action 
                            color="orange-10" 
                            @click="advertenciaCorreu=true" 
                            label="Correu"
                            external-label 
                            label-position="left"
                          >
                            <q-icon name="mail" size="lg"/>
                          </q-fab-action> 
                          <q-fab-action
                            type="a"
                            color="green-8"
                            @click="compartirCanso('whatsapp')"
                            
                            label="WhatsApp"
                            external-label 
                            label-position="left"
                            data-action="share/whatsapp/share"                         
                          >
                            <q-icon name="img:WhatsApp.svg" size="lg"/>
                          </q-fab-action> 
                  </q-fab>

                </div>

              </div>

              
              
              <!-- Reproductor multimèdia -->
              <q-media-player
                type="audio"
                background-color="black"
                radius="1rem"
                :sources="objCanso[_idioma].audio"
                v-if="objCanso[_idioma].audio && !opcions.amagaReproductor"
                class="q-mx-xs"
              >
              </q-media-player>

            </div>




            <!-- ESTROFES i TORNADES -->

            <div class="q-my-md text-center" >
              
              <q-card
                v-for="(obj, indexParagraf) in objCanso[_idioma].lletra"
                :key="`Canso-${indexParagraf}`"
                id="inici"
              >
                <q-card-section class="q-my-xs" :class="{classFonsClar: !opcions.temaFosc,
                classFonsFosc: opcions.temaFosc}">
                  <p 
                    v-for="(linia, indexLinia) in obj.paragraf"
                    :key="`L-${indexLinia}`"
                    v-bind:style="{ fontSize : opcions.pfontSize + 'px', fontWeight: opcions.pbold ? 'bold' : ''}"
                    :class="{classTornadaTemaClar: obj.tipus=='tornada' && !opcions.temaFosc,
                    classTornadaTemaFosc: obj.tipus=='tornada' && opcions.temaFosc,
                    classEstrofaTemaClar: obj.tipus=='estrofa' && !opcions.temaFosc,
                    classEstrofaTemaFosc: obj.tipus=='estrofa' && opcions.temaFosc}"
                    >
                      {{ linia  }}
                  </p>
                </q-card-section>
              </q-card>
            </div>


          </div>

          
        </div>
        <!-- <div style="{margin-top: 100px}"/> -->
      </div>



      <br><br><br><br><br><br><br>

      <!-- boto inferior CATALA / CASTELLA -->
      <div class="row justify-center" v-if="arrIdiomes.length > 1">
        <q-btn-toggle
          push
          color="brown"
          text-color="white"
          toggle-color="orange"
          toggle-text-color="black"
          glossy
          v-model="strIdioma"
          :options="optionsToggle"
          @click="vesAlComensament"
        />
      </div>

    </div>
    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>




    <!-- dialeg per OPCIONS -->

    <q-dialog v-model="activarOpcionsCanso" persistent>
      <q-card style="width: 350px" class="q-px-sm q-pb-md">
        
        <div class="text-blue">
          <div class="text-h6">Opcions lletra cançó</div>
        </div>
        <q-card-section>

          <q-item dense>
            <q-item-section avatar>
              <q-icon name="format_size" />
            </q-item-section>
            <q-item-section>
              <q-slider 
                color="red"
                label
                label-always
                v-model="opcions.pfontSize"
                :min="10"
                :max="100"
                :step="1" />
            </q-item-section>
          </q-item>

          <q-item dense class="q-mt-xs">
            <q-item-section avatar>
              <q-checkbox v-model="opcions.pbold" label="Negreta" color="black" />
            </q-item-section>
          </q-item>
        </q-card-section>

        <div class="text-blue">
          <div class="text-h6" >Altres opcions</div>
        </div>
        <q-card-section>
          <!-- <q-item dense class="">
            <q-item-section avatar>
              <q-checkbox v-model="opcions.temaFosc" label="Tema fosc" color="black" />
            </q-item-section>
          </q-item>
          <q-separator color="red-8" inset /> -->
          <q-item dense class="">
            <q-item-section avatar>
              <q-checkbox v-model="opcions.amagaReproductor" label="Amaga sempre reproductor" color="black" />
            </q-item-section>
          </q-item>
          <q-separator color="red-8" inset />
          <q-item dense class="">
            <q-item-section avatar>
              <q-checkbox v-model="opcions.amagaSocialLinks" label="Amaga icona 'compartir'" color="black" />
            </q-item-section>
          </q-item>
          <q-separator color="red-8" inset />
          <q-item dense class="">          
            <q-item-section avatar>
              <q-checkbox v-model="opcions.activarCanviCanso" label="Canviar cançó al lliscar dit horitzontalment" color="black" />
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" @click="tancarOpcionsCanso" />
        </q-card-actions>
      </q-card>
    </q-dialog>





  <!-- dialeg per ADVERTENCIA CORREU -->

    <q-dialog v-model="advertenciaCorreu" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-red-10 text-white" style="width: 450px" >
        <q-card-section>
          <div class="text-h6 ">Advertència</div>
        </q-card-section>

        <q-card-section class=" bg-red-9 text-whiteq-pt-none">
          S'utilitzarà la teva app del correu. Si la teva app és GMAIL no funcionarà bé:<br/>
          1. Si la cançó te àudio, el seu enllaç no s'incorporà correctament al correu i la lletra no s'incorpora.<br/>
          2. Si la cançó no te àudio, la lletra s'incorpora tota seguida sense respectar finals de paràgraf. 
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" @click="compartirCanso('email')" />
        </q-card-actions>
      </q-card>
    </q-dialog>



  </div>

  <!-- </q-scroll-area> -->
</template>






<script>
// import VueAplayer from 'vue-aplayer'
import objNadales from "../cansoner/nadales.js"

import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';
import { useCansoStore } from '../stores/example-store'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'



export default defineComponent({
  name: 'canso',

  // components: {
  //     'a-player': VueAplayer
  // },

  
  setup () {
    const $router = useRouter()
    const $route = useRoute()
    const $q = useQuasar()
    const $store = useCansoStore()


    const strIdioma = ref($route.query.idioma)
    const optionsToggle = ref([])
    
    const advertenciaCorreu = ref(false)
    const opcions = ref({
      pfontSize: 16,
      pbold: false,
      amagaReproductor: false,
      mostrarIconaFavorit: true,
      amagaSocialLinks: false,
      temaFosc: false,
      activarCanviCanso: false,     
    })
    // llibre: $route.query.llibre,
    // numero: $route.query.numero,
    const codiCanso = ref($route.query.idCanso) 







    onMounted(() => {
      console.log("PARAMS:");
      console.log($route.query.idCanso, $route.query.idioma)
      
      if ($q.localStorage.getItem("CansonerBN_key_opcions"))
        opcions.value = $q.localStorage.getItem("CansonerBN_key_opcions");

      // strIdioma.value = this.idiomaCansoSeleccionada
      
      // this.windowHeight = window.innerHeight + 'px'

      generarOpcionsIdioma()
      // codiCanso.value = ""
      // codiCanso.value = $route.query.idCanso;
      
      document.addEventListener("keydown", funcEventTecles)

    })




    onUnmounted(() => {
      // guardem les opcions
      $q.localStorage.set("CansonerBN_key_opcions", opcions.value);
      document.removeEventListener("keydown", funcEventTecles)
    })





    const objCansoner = computed( () => {
      const objCansonerBlauVermell = $store.objCansoner
      return Object.assign(objCansonerBlauVermell, objNadales)
    })

    const objCanso = computed ( () =>{
      return objCansoner.value[codiCanso.value]
    })

    const arrIdiomes = computed( () => {
      return Object.keys(objCansoner.value[codiCanso.value])
    })

    const activarOpcionsCanso = computed( () => {
      return $store.activarOpcionsCanso
    })

    const esCansoFavorita = computed( () => {
      var arrFavorites = $store.favorites
      
      var x = false
      x = arrFavorites.some( function (obj) {
        return obj.idCanso == codiCanso.value && obj.idioma == strIdioma.value
      }, this)
      return x
    })


    const funcEventTecles = (event) => {     
      switch( event.key ){
        case "T":
        case "t":
          $router.push({ name: 'cercar' });
          break;

        case "N":
        case "n":
          $router.push({ name: "negre" });         
          break;

        case "R":
        case "r":
          opcions.value.amagaReproductor = !opcions.value.amagaReproductor;
          break;

        case "M":
        case "m":
          opcions.value.amagaSocialLinks = !opcions.value.amagaSocialLinks;
          break;

        case "O":
        case "o":
          opcions.value.mostrarIconaFavorit = !opcions.value.mostrarIconaFavorit;
          break;

        case "F":
        case "f":
          opcions.value.temaFosc = !opcions.value.temaFosc;
          break;

        case "G":
        case "g":
          opcions.value.pbold = !opcions.value.pbold;
          break;

        case "I":
        case "i":
          console.log("I apretada")
          window.scrollTo(0,65);
          // location.href = "#/canso/#inici";;         
          break;

        case "C":
        case "c":
          console.log("C apretada")
          if (arrIdiomes.value.length > 1) {
            strIdioma.value = ( strIdioma.value == "ES" ? "CAT" : "ES")
            window.scrollTo(0,65);
            // location.href = "#/canso/#inici";;         
          }
          break;
          
        case "+":
          console.log("+ apretada")
          opcions.value.pfontSize++
          break;
          
        case "-":
          console.log("- apretada")
          opcions.value.pfontSize--
          break;
      } 
    }

		const generarOpcionsIdioma =  () => {
			optionsToggle.value = []
			console.log("arrIdiomes", arrIdiomes.value);
			arrIdiomes.value.forEach( idioma => {
				optionsToggle.value.push({
					label: (idioma == "CAT") ? "CATALÀ" : "CASTELLÀ" ,
					value: idioma
				})
			},this)
      console.log("optionsToggle", optionsToggle.value);
		}




    const afegirFavorits = () => {
      let objecte = {
        idCanso : codiCanso.value,
        idioma : strIdioma.value
      }
      console.log("AFEGIR objecte: " + JSON.stringify(objecte))
      // $store.actAfegirFavorits( objecte );
      $store.favorites.push(objecte)
      // var arrFavorites = $store.favorites
      $q.localStorage.set("CansonerBN_key_favorits", $store.favorites);
      
    }




    const treureFavorits = () => {
      let objecte = {
        idCanso : codiCanso.value,
        idioma : strIdioma.value
      }
      console.log("TREURE objecte: " + JSON.stringify(objecte))

      var arrFavorites = $store.favorites
      console.log(JSON.stringify(arrFavorites))

      var index = arrFavorites.findIndex(function(obj_arr){
        return obj_arr.idCanso === objecte.idCanso && obj_arr.idioma === objecte.idioma
      })
      console.log("Index: " + index)

      // $store.actTreureFavorits( index );
      $store.favorites.splice(index, 1)
      console.log(JSON.stringify(arrFavorites))

      // var arrFavorites = $store.favorites
      $q.localStorage.set("CansonerBN_key_favorits", $store.favorites);

    }




    const compartirCanso = (socialMedia) => {
      advertenciaCorreu.value = false

      let asumpte = "Cançó \"" + objCansoner.value[codiCanso.value][strIdioma.value].titol.toUpperCase() + "\""
      let text = "" 


      /* si existeix audio, incorporem enllaç al missatge*/
      let arrAudio = objCansoner.value[codiCanso.value][strIdioma.value].audio

      if (arrAudio != null){
        text = "ÀUDIO:\n"
        text += "https://drive.google.com/open?id=" + arrAudio[0].src.substring(arrAudio[0].src.lastIndexOf("=")+1)
      }

      text += "\n\n\nLLETRA:\n\n"   // %0D%0A = return


      /* Incorporem la lletra de la canço */
      objCansoner.value[codiCanso.value][strIdioma.value].lletra.forEach( function (objEstrofa) {

        objEstrofa.paragraf.forEach( function (linia) {
          text += linia + "\n"
        })
        text += "\n\n"
      })

      // incorprem enllaços a bonanova.cat, cançoner i pregàries
      text += "\n\n"
      text += "https://cansoner.bonanova.cat \n\n"
      text += "https://bonanova.cat \n"
      text += "https://pregaries.bonanova.cat \n"




      /* Al GMAIL es trunca el contingut de text per lo que encodeURIComponent */
      // if ($q.platform.is.android) {
      //   text = encodeURIComponent(text)
      // }

      console.log("PLATAFORMA?: ", $q.platform)
      
      if ($q.platform.is.mobile) {


        switch (socialMedia){
          case "email":
            console.log("enviar a traves de EMAIL");
            location.href = "mailto:?subject=" + asumpte + "&body=" + encodeURIComponent(text)
            break
          case "whatsapp":
            console.log("enviar a traves de WHATSAPP");
            // per passar new "carriage returns" substituir els "\n" per "%0a"
            text = text.replace(/\n/g, "%0a")
            window.open("whatsapp://send?text=" + text, '_blank')
            break
        }

      } else {
 
        $q.notify({
          message: 'Funcionalitat només operativa en dispositius mòbils',
          icon: 'sentiment_very_dissatisfied',
          position: 'top',
          timeout: 2000
        })
        

      }

    }

    const tancarOpcionsCanso = () => {
      $store.activarOpcionsCanso = false
    }

    const vesAlComensament = () => {
      // console.log("Estic a vesAlComensament")
      window.scrollTo(0,65);
      // location.href = "#/canso/#inici";
    }



    const mostrarSeguentCanso = ( { evt, ...newInfo } ) => {
      console.log("*** Estic a SEGUENT_CANSO ***")

      if (opcions.value.activarCanviCanso === false ) return

      const llibre = objCanso.value[strIdioma.value].cansoner.nom
      const numero = objCanso.value[strIdioma.value].cansoner.numero


      const arrKeys = Object.keys(objCansoner.value)
      // console.log("arrKeys", arrKeys)

      // construim array [{ llibre, numero, idCanso, idioma}]
      let arrLlibNumIdIdioma = []

      arrKeys.forEach( (key) => {
        
        // if (objCansoner.value[key][strIdioma.value] && 
        //     objCansoner.value[key][strIdioma.value].cansoner.nom === llibre) {
        
        const idiomesCansoKey = Object.keys(objCansoner.value[key])
        // console.log("key", key, "idiomesCansoKey", idiomesCansoKey)

        idiomesCansoKey.forEach( function(idioma) {
          // console.log("objCansoner.value["+key+"]["+idioma+"]", objCansoner.value[key][idioma]);
          if (objCansoner.value[key][idioma].cansoner.nom === llibre) {
            arrLlibNumIdIdioma.push({ 
              // llibre: llibre, 
              numero: objCansoner.value[key][idioma].cansoner.numero,
              idCanso: key,
              idioma: idioma
            })
          }
        },this)
        
      },this)

      // ordenem array arrLlibNumIdIdioma per numero ascendent
      arrLlibNumIdIdioma.sort((a, b) => { return a.numero - b.numero; })
      console.log("arrLlibNumIdIdioma", arrLlibNumIdIdioma);

      // localitzem la posicio de la canço actual en el array
    


      const posicio = arrLlibNumIdIdioma.findIndex( obj => obj.numero === numero && obj.idCanso === codiCanso.value && obj.idioma === strIdioma.value)
      console.log("posicio", posicio);

      // Busquem la següent posicio en funcio de si es l'anterior o la propera
      if ( newInfo.direction == "left" ) {
        // si la posicio acutal no es la ultima posicio del array, mostrem la canço
        if (posicio !== arrLlibNumIdIdioma.length - 1 ) {
          const nouIdCanso = arrLlibNumIdIdioma[ posicio + 1].idCanso
          const nouIdioma = arrLlibNumIdIdioma[ posicio + 1].idioma
          console.log("nouIdCanso 'proper':", nouIdCanso);
					codiCanso.value = nouIdCanso
          strIdioma.value = nouIdioma

          // $router.replace({ name: "canso", query: { idCanso: nouIdCanso,  idioma: strIdioma.value } });
					generarOpcionsIdioma()
        }
      } else if (newInfo.direction == "right" ) {
        // si la posicio actual no es la primera posicio del array, mostrem la canço
        if (posicio !== 0 ) {
          const nouIdCanso = arrLlibNumIdIdioma[ posicio - 1].idCanso
          const nouIdioma = arrLlibNumIdIdioma[ posicio - 1].idioma
          console.log("nouIdCanso 'anterior':", nouIdCanso);
					codiCanso.value = nouIdCanso
          strIdioma.value = nouIdioma
          // $router.replace({ name: "canso", query: { idCanso: nouIdCanso,  idioma: strIdioma.value } });

					generarOpcionsIdioma()
        }
      }

      return

    }





    return {
      strIdioma, optionsToggle, advertenciaCorreu, opcions, codiCanso,
      objCansoner, objCanso, arrIdiomes, activarOpcionsCanso, esCansoFavorita,
      funcEventTecles, afegirFavorits, treureFavorits, compartirCanso, tancarOpcionsCanso, vesAlComensament, mostrarSeguentCanso
    }
  }





})
</script>


<style lang="css" scoped>
/*
  @media screen and (min-width: 100px) { 
    p{
      font-size: 1.3em !important;
    }

  }

  @media screen and (min-width: 768px) { 
    p{
      font-size: 2em !important;
    }

  }

*/

.borde {
  border: 1px solid blue;
}

.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  /* animation: bounce-in .5s reverse; */
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}


  .classTornadaTemaClar{
    color: #c10015;
  }

  .classTornadaTemaFosc{
    color: #f8c75d;
  }

  .classEstrofaTemaClar{
    color: black;
  }

  .classEstrofaTemaFosc{
    color: white;
  }

  .classFonsClar{
    background-color: white;
  }

  .classFonsFosc{
    background-color: black;
  }





</style>