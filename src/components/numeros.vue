<template>
  <div class="row justify-center">
    <div class="col-md-8 col-sm-10 col-xs-12">
      <div class="row justify-center">
        <q-card class="col-9 ">
          <div class="q-gutter-xs q-pb-xs">
            <div class="row justify-around">
              <q-radio
                class="col-auto"
                v-model="seleccioCansoner"
                val="vermell"
                label="C. Vermell"
                color="red"

              />
              <q-radio
                class="col-auto"
                v-model="seleccioCansoner"
                val="blau"
                label="C. Blau"
                color="blau"

              />
              <!--
                  <q-radio v-model="seleccioCansoner" val="nadales" label="Nadales" color="black" @input="mostrarNumerosLlibre" />
              -->
            </div>
          </div>
        </q-card>
      </div>



      <div v-if="seleccioCansoner != ''" class="column q-gutter-sm bordered">

        <!-- resultat -->
        <div class="row justify-center">
          <transition name="shakeX" class="animated">
            <div class="col-auto bg-grey-4 text-h3 text-center rounded-borders shadow-6 q-mt-sm" >
              &nbsp;{{ inputNumero }}&nbsp;
            </div>
          </transition>
        </div>


        <!-- TECLAT NUMERIC -->
        <div class="bordered q-gutter-xs">
          <!-- Numeros -->
          <div class="row justify-center q-gutter-xs">
            <div
              class="col-auto text-center"
              v-for="(numeroFila1, index) in teclat.fila1"
              :key="'fila2'+ index"
            >
              <q-btn
                class="text-h6"
                :color="(seleccioCansoner == 'vermell') ? 'red-9' : (seleccioCansoner == 'blau') ? 'blue-10' : 'grey-9'"
                glossy
                :label="numeroFila1"
                @click="teclejar(numeroFila1)"
              />
            </div>
          </div>
          <div class="row justify-center q-gutter-xs">
            <div
              class="col-auto text-center"
              v-for="(numeroFila2, index2) in teclat.fila2"
              :key="'fila2'+ index2"
            >
              <q-btn
                class="text-h6"
                :color="(seleccioCansoner == 'vermell') ? 'red-9' : (seleccioCansoner == 'blau') ? 'blue-10' : 'grey-9'"
                glossy
                :label="numeroFila2"
                @click="teclejar(numeroFila2)"
              />
            </div>
          </div>
          <div class="col row justify-center q-gutter-xs">
            <div
              class="col-auto text-center"
              v-for="(numeroFila3, index3) in teclat.fila3"
              :key="'fila3'+ index3"
            >
              <q-btn
                class="text-h6"
                :color="(seleccioCansoner == 'vermell') ? 'red-9' : (seleccioCansoner == 'blau') ? 'blue-10' : 'grey-9'"
                glossy
                :label="numeroFila3"
                @click="teclejar(numeroFila3)"
              />
            </div>
          </div>
          <div class="row justify-center items-center q-gutter-xs">
            <div class="col-auto text-center">
              <q-btn
                class="text-h6"
                :color="(seleccioCansoner == 'vermell') ? 'red-9' : (seleccioCansoner == 'blau') ? 'blue-10' : 'grey-9'"
                glossy
                :label="0"
                @click="teclejar(0)"
              />
            </div>
            <div class="col-auto text-center">
              <q-btn
                class="text-h7"
                :color="(seleccioCansoner == 'vermell') ? 'red-9' : (seleccioCansoner == 'blau') ? 'blue-10' : 'grey-9'"
                glossy
                label="Borrar"
                @click="inputNumero=''"
              />
            </div>
          </div>
        </div>

        <!-- <q-separator /> -->

        <div class="row justify-center q-gutter-sm">
          <div class="col-auto q-mt-xs">
            <q-btn
              class="text-h6"
              color="primary"
              :disabled="inputNumero==''"
              glossy
              label="Mostrar"
              @click="mostrarCansoNumero"
            />
          </div>
        </div>
      </div>
      <!-- final TECLAT NUMERIC -->
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useCansoStore } from '../stores/example-store'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'



export default defineComponent({
  name: "componentBuscarPerNumero",

  setup() {

    const $router = useRouter()
    const $q = useQuasar()
    const $store = useCansoStore()


    onMounted(() => {
      if ($q.sessionStorage.getItem("key_seleccioCansoner"))
        seleccioCansoner.value = $q.sessionStorage.getItem( "key_seleccioCansoner" );

      // eventListener per grabar pulsacions de tecles per a nous codis de cançons
      document.addEventListener("keydown", funcEventKeydown)
    })

    onUnmounted(() => {
      guardarVariablesSessio();
      // eliminem eventListener
      document.removeEventListener("keydown", funcEventKeydown)
    })




    const seleccioCansoner = ref("")
    //numerosLlibre: [],
    const inputNumero = ref("")
    const teclat = ref( {
      fila1: [7, 8, 9],
      fila2: [4, 5, 6],
      fila3: [1, 2, 3]
    })



    const funcEventKeydown = (event) => {
      // if (event.) return

      switch( event.key ){
        case "VK_RETURN":   //windows
        case "kVK_Return":  // MAC
        case "Enter":
          console.log(`inputNumero: ${inputNumero.value}`);
          mostrarCansoNumero();
          break;

        case "VK_DELETE":   //windows
        case "kVK_ForwardDelete":  // MAC
        case "Delete":
          inputNumero.value = "";
          break;

        case "V":
        case "v":
          seleccioCansoner.value = "vermell";
          //inputNumero.value = "";
          break;

        case "B":
        case "b":
          seleccioCansoner.value = "blau";
          //inputNumero.value = "";
          break;

        // case "N":
        // case "n":
        //   $router.push({ name: "negre" });
        //   break;

        default:
          if (inputNumero.value.length < 3 && !isNaN(event.key)) inputNumero.value = inputNumero.value.concat(event.key);
          // inputNumero.value += event.key;
          console.log(`tecla ${event.key}`)
          break;
      }

    }


    const teclejar = (numero) => {
      let x = inputNumero.value;
      if (x.length < 3) inputNumero.value = x.concat(numero);
    }




    const mostrarCansoNumero = async () => {
      console.log("Estic a MOSTRAR_CANSO_NUMERO !!");

      // 1. Trobar el idCanso i l'idioma corresponent al llibre i numero seleccionats
      const objIDCansoIdioma = await $store.actObtenirIdCansoIdioma({
                        llibre: seleccioCansoner.value,
                        numero: inputNumero.value
                      });

      console.log("objIDCansoIdioma", objIDCansoIdioma)
      let {idCanso, idioma} = objIDCansoIdioma


      if (idCanso === null) {

        console.log("No existeix numero al llibre")
        $q.notify({
          message: 'La cançó amb nº ' + inputNumero.value + ' no existeix',
          icon: 'sentiment_very_dissatisfied',
          position: 'top',
          timeout: 1000
        })
        return

      } else if ( idioma === "escollir idioma") {
        $q.dialog({
            title:
              "La següent cançó te mateix cançoner i número de cançó per cada idioma. Quin idioma vols veure ?",
            //message: 'Tria idioma:',
            options: {
              type: "radio",
              model: null,
              // inline: true,
              items: [
                { label: "Català", value: "CAT", color: "secondary" },
                { label: "Castellà", value: "ES" }
              ]
            },
            cancel: false,
            stackButtons: true,
            persistent: true
          })
          .onOk( data =>   {
            idioma = data;
            $router.push({ name: "canso", query: { idCanso,  idioma } });
          })
          .onCancel(() =>  { })// console.log('>>>> Cancel')
          .onDismiss(() => { });// console.log('I am triggered on both OK and Cancel')

      } else {
        $router.push({ name: "canso", query: { idCanso,  idioma } });
      }


      guardarVariablesSessio();









      return

      // Hi ha cançons que, per cada idioma, tenen mateix cançoner i
      // numero. En aquests casos, cal preguntar quin idioma triar.

      // Mirar si al getter "getObjCansonsLlibre" existeixen les propietats
      // num_CAT i num_ES. "getObjCansonsLlibre" depen de state.llibre per lo
      // que primer haig d'actualitzar state.llibre

      this.$store.dispatch(
        "modulCansoner/actModificarLlibre",
        seleccioCansoner.value
      );
      console.log("state.llibre MODIFICAT");
      console.log("getObjCansonsLlibre", this.$store.getters["modulCansoner/getObjCansonsLlibre"])

      // Un cop actualitzat, miro si existeixen les 2 propietats de l'idioma, segons el numero:

      if (
        ! this.$store.getters["modulCansoner/getObjCansonsLlibre"][
          inputNumero.value + "_CAT"
        ] &&
        ! this.$store.getters["modulCansoner/getObjCansonsLlibre"][
          inputNumero.value + "_ES"
        ]
      ) {

        console.log("No existeix numero al llibre")
        this.$q.notify({
          message: 'La cançó amb nº ' + inputNumero.value + ' no existeix',
          icon: 'sentiment_very_dissatisfied',
          position: 'top',
          timeout: 1000
        })



      } else if (
        this.$store.getters["modulCansoner/getObjCansonsLlibre"][
          inputNumero.value + "_CAT"
        ] &&
        this.$store.getters["modulCansoner/getObjCansonsLlibre"][
          inputNumero.value + "_ES"
        ]
      ) {
        this.$q
          .dialog({
            title:
              "La següent cançó te mateix cançoner i número de cançó per cada idioma. Quin idioma vols veure ?",
            //message: 'Tria idioma:',
            options: {
              type: "radio",
              model: null,
              // inline: true,
              items: [
                { label: "Català", value: "CAT", color: "secondary" },
                { label: "Castellà", value: "ES" }
              ]
            },
            cancel: false,
            stackButtons: true,
            persistent: true
          })
          .onOk(data => {
            let idioma = data;
            this.$store.dispatch("modulCansoner/actMostrarCanso", {
              llibre: seleccioCansoner.value,
              numero_idioma: inputNumero.value + "_" + idioma
            });

            this.guardarVariablesSessio();
            $router.push({ name: "canso" });
          })
          .onCancel(() => {
            // console.log('>>>> Cancel')
          })
          .onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          });
      } else {
        //debugger
        let idioma = this.$store.getters["modulCansoner/getObjCansonsLlibre"][
          inputNumero.value + "_CAT"
        ]
          ? "CAT"
          : "ES";

        this.$store.dispatch("modulCansoner/actMostrarCanso", {
          llibre: seleccioCansoner.value,
          numero_idioma: inputNumero.value + "_" + idioma
        });

        // this.guardarVariablesSessio();
        $router.push({ name: "canso" });
      }
    }




    const guardarVariablesSessio = () => {
      // this.$q.sessionStorage.set("key_tabSeleccionat", this.tabSeleccionat);
      $q.sessionStorage.set("key_seleccioCansoner", seleccioCansoner.value);
    }








    return { seleccioCansoner, inputNumero, teclat, funcEventKeydown, teclejar, mostrarCansoNumero }
  }




});
</script>


<style>

  .shakeX-enter {
    transition: all .3s ease;
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
