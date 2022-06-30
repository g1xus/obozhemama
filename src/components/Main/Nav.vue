<template>
  <nav class="nav">
    <div class="nav__logo">
      <img src="@/assets/img/Logo.svg" alt=""/>
    </div>
    <div class="nav-games">
      <NavGamesItem
          v-for="navGamesItem of this.$store.state.navGamesItems" :key="navGamesItem.id"
          v-bind:navGamesItem="navGamesItem"
      />
    </div>
  </nav>
</template>

<script>
import NavGamesItem from "@/components/Main/Nav/NavGamesItem";
export default {
  props: ['navGamesItems'],
  components: {NavGamesItem}
};
</script>

<style lang="sass" scoped>
@import "@/variables.sass"
.nav
  background-color: $secondary-bg
  width: 75px
  height: 100vh
  text-align: center
  @media screen and (max-width: 1024px)
    display: none
  &__logo
    img
      margin-top: 20px
      margin-bottom: 40px
      width: 40px
      height: 40px
      border-radius: 7px
      box-shadow: 0px 0px 12px rgba(90, 76, 255, 0.5)
      background: none

  &-games
    display: flex
    flex-direction: column
    &__el
      margin-bottom: 15px
      img
        stroke: #231D47
        width: 35px
        height: 35px
</style>