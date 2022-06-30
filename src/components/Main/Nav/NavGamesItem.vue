<template>
  <router-link class="nav-games__el" :to="navGamesItem.url">
    <img :src="navGamesItem.imgPath" :alt='navGamesItem.title'/>
  </router-link>
</template>

<script>
export default {
  props: {
    navGamesItem: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="sass" scoped>
.nav
  &-games
    &__el
      margin-bottom: 15px
      img
        stroke: #231D47
        width: 35px
        height: 35px
</style>