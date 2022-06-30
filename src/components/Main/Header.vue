<template>
  <header class="header">
    <div class="header-links">
      <img src="@/assets/img/Logo.svg" alt="" class="header__logo"/>
      <HeaderLink
          v-for="headerLink of this.$store.state.headerLinks" :key="headerLink.id"
          v-bind:headerLink="headerLink"
      />
    </div>
    <div class="header-login" v-if="!name">
      <router-link to="/login" class="header-login__auth">Авторизация</router-link>
      <router-link to="/register" class="header-login__reg">Регистрация</router-link>
    </div>
    <div class="header-profile" v-else>
      <div class="header-profile__name">{{ name }}</div>
    </div>
  </header>
</template>

<script>
import HeaderLink from "@/components/Main/Header/HeaderLink";

export default {
  components: {
    HeaderLink
  },
  data() {
    return {
      name: null
    }
  },
  async created() {
    const v = this
    const jwt = document.cookie.split('=')
    if (jwt) {
      let res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${jwt[1]}`
        }
      })
      res = await res.json()
      v.name = res.name
    }
  }

};
</script>

<style lang="sass" scoped>
.header
  padding: 22px 0
  display: flex
  justify-content: space-between
  align-items: center
  font-size: 14px
  height: 38px
  &__logo
    display: none
    @media screen and (max-width: 1024px)
      display: block
      border-radius: 4px
      margin-right: 15px

  &-links
    display: flex
    align-items: center

    &__el
      color: #fff
      text-decoration: none
      margin-right: 20px
      @media screen and (max-width: 700px)
        display: none
      @media screen and (max-width: 717px)
        margin-right: 16px

  &-login
    font-weight: bold
    display: flex
    justify-content: space-between
    align-items: center
    @media screen and (max-width: 700px)
      justify-content: flex-end
      width: 100%

    &__auth
      margin-right: 10px

    &__reg
      padding: 10px 8px
      background-color: #5A4CFF
      border-radius: 5px

    &__auth, &__reg
      color: #fff
      text-decoration: none

  &-profile
    &__name
      color: #ffffff

</style>