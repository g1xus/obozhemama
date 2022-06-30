<template>
  <div class="main-layout">
    <Nav
        v-bind:navGamesItems="navGamesItems"
    />
    <div class="rightside">
      <Header
          v-bind:headerLinks="headerLinks"
      />
      <div class="main">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "@/components/Main/Nav";
import Header from "@/components/Main/Header";

export default {
  components: {
    Nav,
    Header
  }}
</script>

<style  lang="sass" scoped>
@import "@/variables.sass"
.main
  display: flex
  justify-content: space-between

.rightside
  padding: 0 20px
  width: 100%
  height: 100%
  @media screen and (max-width: 1024px)
    padding: 0
.main-layout
  display: flex
  justify-content: space-between
  background-color: $main-bg
  @media screen and (max-width: 1024px)
    padding: 0 15px
</style>