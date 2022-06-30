<template>
  <div id="app">
    <component :is="layout">
      <router-view/>
    </component>
  </div>
</template>

<script>
import MainLayout from "@/layouts/MainLayout";
import EmptyLayout from "@/layouts/EmptyLayout";
export default {
  computed:{
    layout() {
      return (this.$route.meta.layout || 'main') + '-layout'
    }
  },
  components:{
    MainLayout, EmptyLayout
  },
  metaInfo: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  }
}

</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap')
@import "@/variables.sass"
body
  font-family: Montserrat, sans-serif
  margin: 0
  padding: 0
html
  background-color: $main-bg


</style>
