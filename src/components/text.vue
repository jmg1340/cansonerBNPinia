<template>
  <div class="row justify-center">
    <div class="col-md-8 col-sm-10 col-xs-12">
      <div class="row justify-center">
        <q-card class="col-9">
          <div class="row q-gutter-xs justify-around q-pb-xs">
            <q-checkbox v-model="seleccioCansoners" val="vermell" label="C. Vermell" color="red" class="col-auto"/>
            <q-checkbox
              v-model="seleccioCansoners"
              val="blau"
              label="C. Blau"
              color="blue-10"
              class="col-auto"
            />
            <!--
              <q-checkbox v-model="seleccioCansoners" val="nadales" label="Nadales" color="black" />
            -->
          </div>
        </q-card>
      </div>

      <div class="row justify-center q-mt-lg">
        <div class="col-sm-8 col-xs-12">
          <div class="row no-wrapq-gutter-md items-start justify-center">
            <q-input
              class="col"
              outlined
              bottom-slots
              v-model="inputText"
              label="Introduir TEXT"
              dense

              :rules="[val => !!val || 'tecleja algo...']"
              @keyup.enter="buscar"
            >
              <template v-slot:before>
                <q-icon name="help" />
              </template>

              <template v-slot:append>
                <q-icon
                  v-if="inputText !== ''"
                  name="close"
                  @click="inputText = ''"
                  class="cursor-pointer q-mr-md"
                />
              </template>
            </q-input>

            <q-btn
              class="col-sm-3 col-md-3 q-ml-sm"
              color="primary"
              glossy
              dense
              label="Buscar"
              @click="buscar"
            />
          </div>
        </div>
      </div>

      <!-- taula resultats busqueda per text -->

      <div class="row q-mx-sm text-caption">
        <div class="col">
          Cançons trobades:
          <q-chip text-color="black" color="yellow-6" dense>{{ llistaCansonsTrobades.length }}</q-chip>
        </div>
      </div>


      <q-markup-table

        dense
        bordered
        class="q-mx-sm"
        separator="cell"
      >
        <thead class="bg-grey-4 text-black">
          <tr onclick="MostrarCansoDeLaTaula">
            <th class="text-center thCansoner">C</th>
            <th class="text-center thTitol">Titol</th>
            <th class="text-center thTitol">
              <div class="row inline items-center justify-center">
                <q-icon name="volume_up" class="col" />
                <q-checkbox
                  class="col q-mr-xs"
                  v-model="nomesAudio"
                  dense
                  color="black"
                  @click.native="buscar"
                />
              </div>
            </th>
            <th class="text-center thNumero">#</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(info,index) in llistaCansonsTrobades"
            :key="`llC-${index}`"
            @click="MostrarCansoDeLaTaula(info.idCanso, info.idioma)"
          >


            <td v-if="info.llibre == 'vermell'" class="bg-red text-white text-center">V</td>
            <td v-if="info.llibre == 'blau'" class="bg-blue-10 text-white text-center">B</td>
            <td v-if="info.llibre == 'nadales'" class="bg-grey text-white text-center">N</td>

            <td class="q-px-xs tdTitol">
              <!-- <router-link :to="'{ name: \'canso\', query: { idCanso: '+info.idCanso+', llibre: '+info.llibre+',numero: '+info.numero+',idioma: '+info.idioma+' } }'"> -->


              <q-icon name="fiber_new" color="green-14" size="sm" v-if="info.estat== 'nova'" />
              {{ info.titol }}


            </td>

            <td class="text-center">
              <q-icon name="volume_up" v-if="info.audio" />
            </td>
            <td class="text-center">{{info.numero}}</td>


          </tr>
        </tbody>
      </q-markup-table>


      <q-page-sticky position="bottom-right" :offset="[10, 10]">
        <q-btn round size="md" icon="keyboard_double_arrow_up" color="primary" @click="vesAlComensament"/>
      </q-page-sticky>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useCansoStore } from '../stores/example-store'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'



export default defineComponent({
  name: "componentBuscarPerText",

  setup () {
    const $router = useRouter()
    const $q = useQuasar()
    const $store = useCansoStore()


    const seleccioCansoners = ref(["vermell", "blau"]) 
    const inputText = ref("") 
    const nomesAudio = ref(false)
    const llistaCansonsTrobades = ref([]) 



    onMounted(() => {
      if ($q.sessionStorage.getItem("key_seleccioCansoners") != undefined)
      seleccioCansoners.value = $q.sessionStorage.getItem( "key_seleccioCansoners" );

      if ($q.sessionStorage.getItem("key_inputText") != undefined)
        inputText.value = $q.sessionStorage.getItem("key_inputText");

      if ($q.sessionStorage.getItem("key_llistaCansonsTrobades"))
        llistaCansonsTrobades.value = $q.sessionStorage.getItem( "key_llistaCansonsTrobades"  );

      if ($q.sessionStorage.getItem("key_nomesAudio"))
        nomesAudio.value = $q.sessionStorage.getItem("key_nomesAudio");
    })

    onUnmounted(() => {
      guardarVariablesSessio();
    })





    const vesAlComensament = () => {
      // console.log("Estic a vesAlComensament")
      window.scrollTo(0,0);
      // location.href = "#/canso/#inici";
    }


    const MostrarCansoDeLaTaula = (idCanso, idioma) => {
      // this.$store.dispatch("modulCansoner/actMostrarCanso", {
      //   llibre: llibre,
      //   numero_idioma: numero + "_" + idioma
      // });
      $router.push({ name: "canso", query: { idCanso,  idioma } });
      // this.$router.push({ name: "canso", params: { arrProps: [ idCanso, llibre, numero, idioma ] }  }).href;
    }

    const buscar = () =>{
      llistaCansonsTrobades.value = [];
      var llistaCansons = [];
      let objCansoner = $store.objCansoner;

      // per cada llibre seleccionat
      seleccioCansoners.value.forEach(function(llibre) {
        // mirem si per cada objecte canso del cansoner
        for (let idCanso in objCansoner) {
          // mirem si per cada idioma del objecte canso
          Object.keys(objCansoner[idCanso]).forEach(function(idioma) {
            let objTemp = {};

            // si el nom del cansoner = al llibre seleccionat
            if (objCansoner[idCanso][idioma].cansoner.nom == llibre) {
              // si esta marcada la opcio 'nomesAudio'

              if (nomesAudio.value) {
                if (objCansoner[idCanso][idioma].audio != null) {
                  console.log(
                    "objCansoner[idCanso][idioma].audio = " +
                      objCansoner[idCanso][idioma].audio
                  );

                  objTemp.idCanso = idCanso;
                  objTemp.idioma = idioma;
                  objTemp.llibre = llibre;
                  objTemp.titol = objCansoner[idCanso][idioma].titol;
                  objTemp.numero = objCansoner[idCanso][idioma].cansoner.numero;
                  objTemp.audio = objCansoner[idCanso][idioma].audio;
                  objTemp.estat = objCansoner[idCanso][idioma].estat;

                  llistaCansons.push(objTemp);
                }
              } else {
                objTemp.idCanso = idCanso;
                objTemp.idioma = idioma;
                objTemp.llibre = llibre;
                objTemp.titol = objCansoner[idCanso][idioma].titol;
                objTemp.numero = objCansoner[idCanso][idioma].cansoner.numero;
                objTemp.audio = objCansoner[idCanso][idioma].audio;
                objTemp.estat = objCansoner[idCanso][idioma].estat;

                llistaCansons.push(objTemp);
              }
            }
          }, this);
        }
      }, this);

      // un cop generat el array d'objectes LLISTACANSONS amb informació dels llibres seleccionats, processem la lletra de cada canso per veure si hi ha alguna coincidencia amb el text buscat.

      /* del texte a buscar li trec els accents i el poso en minúscules */
      var inputBuscarTextSenseAccents = senseAccents(inputText.value);
      var re = new RegExp(inputBuscarTextSenseAccents);

      console.log("llistaCansons");
      console.log(llistaCansons);
      llistaCansons.forEach(function(info) {
        var titolSenseAccents = senseAccents(info.titol);
        if (re.test(titolSenseAccents)) {
          // 1er: busquem pel titol de la cançó
          llistaCansonsTrobades.value.push(info);
        } else {
          // 2on: busquem per la lletra de la cançó
          let cansoTrobada = false;
          for (let objLletra of objCansoner[info.idCanso][info.idioma].lletra) {
            for (let linia of objLletra.paragraf) {
              var paragrafSenseAccents = senseAccents(linia);

              if (re.test(paragrafSenseAccents)) {
                llistaCansonsTrobades.value.push(info);
                cansoTrobada = true;
                break;
              }
            }
            if (cansoTrobada) break;
          }
        }
      }, this);

      /* ordenem per numero de cançó */
      llistaCansonsTrobades.value.sort(function(a, b) {
        return a.numero - b.numero;
      });
    }

    const senseAccents = (s) => {
      var r = s.toLowerCase();
      //r = r.replace(new RegExp(/\s/g),"");
      r = r.replace(new RegExp(/[àáâãäå]/g), "a");
      r = r.replace(new RegExp(/[èéêë]/g), "e");
      r = r.replace(new RegExp(/[ìíîï]/g), "i");
      //r = r.replace(new RegExp(/ñ/g),"n");
      r = r.replace(new RegExp(/[òóôõö]/g), "o");
      r = r.replace(new RegExp(/[ùúûü]/g), "u");

      return r;
    }

    const guardarVariablesSessio = () => {
      $q.sessionStorage.set("key_seleccioCansoners", seleccioCansoners.value);
      $q.sessionStorage.set("key_inputText", inputText.value);
      $q.sessionStorage.set("key_llistaCansonsTrobades", llistaCansonsTrobades .value);
      $q.sessionStorage.set("key_nomesAudio", nomesAudio.value);
    }








    return {
      seleccioCansoners, inputText, nomesAudio, llistaCansonsTrobades,
      buscar, vesAlComensament, MostrarCansoDeLaTaula
    }
  }







});
</script>







<style>
.thCansoner {
  width: 10%;
}
.thTitol {
  width: 80%;
}
.thNumero {
  width: 10%;
}

.tdTitol {
  white-space: normal !important;
}

.DIVcasella {
  width: 50px;
  height: 50px;
}

.DIVred {
  background-color: red;
}
.DIVblue {
  background-color: blue;
}
.DIVgrey {
  background-color: grey;
}

.borde {
  border: 1px solid black;
}
</style>
