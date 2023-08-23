<template>
  <q-page class="flex-start">
    <div class="row justify-center">
      <div class="col-md-8 col-sm-10 col-xs-12">


        <q-tabs
          class="text-grey-4 bg-grey-7 q-mt-md q-ma-xs rounded-borders"
          align="justify"
          v-model="tabSeleccionat"
          indicator-color="amber-10"
          inline-label
          narrow-indicator
          active-color="white"
          active-bg-color="grey-9"
          dense
        >
          <q-tab name="nadales" label="NADALES" icon="list" class="borde" v-if="nadalesSiNo"/>
          <q-tab name="numero" label="Numero" icon="search" class="borde" />
          <q-tab name="text" label="Text" icon="search" class="borde" />
          <q-tab name="favorits" class="borde">
            <q-icon name="favorite" color="red"  style="font-size: 1.5em;" class="text-bold q-mr-sm"/>
            Favorits
          </q-tab>
        </q-tabs>

        <q-tab-panels v-model="tabSeleccionat" @click="guardarVariablesSessio">
          <q-tab-panel name="numero" class="clPane">
            <cmpNumeros />
          </q-tab-panel>

          <q-tab-panel name="text" class="clPane">
            <cmpText />
          </q-tab-panel>

          <q-tab-panel name="favorits" class="clPane">
            <cmpFavorits />
          </q-tab-panel>

          <q-tab-panel name="nadales" class="clPane">
            <cmpNadales />
          </q-tab-panel>
        </q-tab-panels>


      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useCansoStore } from '../stores/example-store'
import { useQuasar } from 'quasar'


import cmpNumeros from "../components/numeros.vue";
import cmpText from "../components/text.vue";
import cmpFavorits from "../components/favorits.vue"
import cmpNadales from "../components/Nadales.vue"

export default defineComponent({
  name: "PageIndex",
  components: { cmpNumeros, cmpText, cmpFavorits, cmpNadales },

  setup() {
    const $store = useCansoStore()
    const $q = useQuasar()

    onMounted(() => {
      if ($q.sessionStorage.getItem("key_tabSeleccionat"))
        tabSeleccionat.value = $q.sessionStorage.getItem( "key_tabSeleccionat" );
    
      if ($q.localStorage.getItem("CansonerBN_key_favorits"))
        // $store.dispatch("modulCansoner/actSubstituirFavorits", $q.localStorage.getItem("CansonerBN_key_favorits") );
        $store.favorites = $q.localStorage.getItem("CansonerBN_key_favorits") 
        
    
      const dataActual = new Date()
      let mesActual = dataActual.getMonth() + 1
      let diaActual = dataActual.getDate()
    
      if ( (mesActual === 12 && diaActual >= 15) || (mesActual === 1 && diaActual <= 6))
        nadalesSiNo.value = true
    }) 
    
    
    const tabSeleccionat = ref(null)
    const nadalesSiNo = ref(false) 


    const guardarVariablesSessio = () => {
      $q.sessionStorage.set("key_tabSeleccionat", tabSeleccionat.value);
    }



    return{
      tabSeleccionat,
      nadalesSiNo,
      guardarVariablesSessio
    }
  },


});
</script>


<style>
  .borde {
    border: 1px solid darkgray
  }
</style>