<template >
  <q-page class="negre text-h4">

    <div class="column  ">
      <div class="col text-right text-caption">{{seleccioCansoner}} - {{inputNumero}}</div>
    </div>

    <div class="column items-center ">
      <div class="col q-gutter-lg ">

        <img v-if="imatgeJesus" class="col q-mr-md" src="~assets/Jesus.png" style="width: 89%"/>
        <!-- <img v-if="imatgeJesus" class="col q-mr-md" src="~assets/JesusUlls.gif" style="width: 89%"/> -->

        <!-- <div class="row">
          <img class="col q-mr-md" style="height: 50px; max-width: 50px" src="~assets/www.png" />
          <div class="col">www.bonanova.cat</div>
        </div>
        <div class="row">
          <q-img class="col q-mr-md" style="height: 50px; max-width: 50px" src="~assets/insta.png" />
          <div class="col">@bonanova.cat</div>
        </div>
        <div class="row">
          <q-img class="col q-mr-md" style="height: 50px; max-width: 50px" src="~assets/twitter.png" />
          <div class="col">@bonanova.cat</div>
        </div>
        <div class="row">
          <q-img class="col q-mr-md" style="height: 50px; max-width: 75px" src="~assets/youtube.png" />
          <div class="col">canal "grup Bona Nova"</div>
        </div>-->

      </div>

    </div>

  </q-page>
</template>


<script>

import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { useCansoStore } from '../stores/example-store'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'



export default defineComponent({
  name: "negre",

  setup() {

    const $router = useRouter()
    const $q = useQuasar()
    const $store = useCansoStore()


    onMounted(() => {
      document.addEventListener("keydown", funcEventNegre)
    })

    onUnmounted(() => {
      document.removeEventListener("keydown", funcEventNegre)
    })


    const seleccioCansoner = ref("")
    const inputNumero = ref("")
    const imatgeJesus = ref(false) 


    const funcEventNegre =  (event) => {
      console.log("event.key", event.key)
      switch( event.key ){

        case "T":
        case "t":
          $router.push({ name: 'cercar' });
          break;

        case "J":
        case "j":
          imatgeJesus.value = !imatgeJesus.value
          break;

        case "N":
        case "n":
          $router.back();
          break;

        case "V":
        case "v":
          seleccioCansoner.value = "vermell";
          break;

        case "B":
        case "b":
          seleccioCansoner.value = "blau";
          break;


        case "VK_DELETE":   //windows
        case "kVK_ForwardDelete":  // MAC
        case "Delete":
          inputNumero.value = "";
          break;

        case "VK_RETURN":   //windows
        case "kVK_Return":  // MAC
        case "Enter":
          mostrarCansoNumero();
          break;

        default:
          if (inputNumero.value.length < 3 && !isNaN(event.key)) inputNumero.value = inputNumero.value.concat(event.key);
          // inputNumero.value += event.key;
          console.log(`tecla ${event.key}`)
          break;

      }

    }

    const mostrarCansoNumero = async () => {
      console.log("Estic a MOSTRAR_CANSO_NUMERO !!");

      // 1. Trobar el idCanso i l'idioma corresponent al llibre i numero seleccionats
      const objIDCansoIdioma = await $store.actObtenirIdCansoIdioma ({
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
            $router.push({ name: "cansoDesdeNegre", query: { idCanso,  idioma } });
          })
          .onCancel(() =>  { })// console.log('>>>> Cancel')
          .onDismiss(() => { });// console.log('I am triggered on both OK and Cancel')

      } else {
        $router.push({ name: "cansoDesdeNegre", query: { idCanso,  idioma } });
      }


    }




    return {
      seleccioCansoner, inputNumero, imatgeJesus,
      funcEventNegre, mostrarCansoNumero
    }
  }




})
</script>


<style lang="css" scoped>
  .negre{
    background-color: black;
    color: #222222;
    /* text-align: center; */
  }

  .borde{
    border: 1px solid red;
  }
</style>
