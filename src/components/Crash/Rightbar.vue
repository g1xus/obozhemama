<template>
  <div class="rightbar">
    <div class="rightbar-top">
      <img src="@/assets/img/crash-logo.svg" alt="" class="rightbar__logo">
      <div class="rightbar-control">
        <div class="rightbar-control__el rightbar-control__sound">
          <img src="../../assets/img/sound.svg" alt="Звук">
        </div>
        <div class="rightbar-control__el rightbar-control__music">
          <img src="../../assets/img/music.svg" alt="Музыка">
        </div>
        <div class="rightbar-control__el rightbar-control__faq">
          <img src="../../assets/img/question.svg" alt="Вопрос">
          <span class="rightbar-control__text">Как играть?</span>
        </div>
        <div class="rightbar-control__el rightbar-control__wallet">
          <img src="../../assets/img/wallet.svg" alt="Кошелёк">
          <span class="rightbar-control__text rightbar-control__wallet_text">
            {{`${balance} ₽`}}
          </span>
        </div>
      </div>
    </div>
    <div class="rightbar-game">
      <div class="rightbar-game__last-xs">
        <div class="rightbar-last-xs__top" v-bind:class="{ 'rightbar-last-xs__top_active': isXsOpened }">
          <img src="@/assets/img/purple-time.svg" alt="Время" class="rightbar-last-xs__img">
          <h2 class="rightbar-last-xs__title">История раундов</h2>
          <div class="rightbar-last-xs__close" v-on:click="isXsOpened = !isXsOpened"></div>
        </div>
        <div class="rightbar-last-xs" v-bind:class="{ 'rightbar-last-xs_active': isXsOpened }">
          <RigbarLastX
              v-for="rightbarLastX of validLastXs" :key="rightbarLastX.id"
              v-bind:rightbarLastX="rightbarLastX"
          />
          <div class="rightbar-last-xs__open" v-on:click="isXsOpened = !isXsOpened"
               v-bind:class="{ 'rightbar-last-xs__open_active': isXsOpened }"></div>
        </div>
      </div>
      <div class="rightbar-game__animation">
        <span class="rightbar-game__coef" ref="currentCoef">x{{nowCoef}}</span>
      </div>
      <div class="rightbar-buttons">
        <RightbarInput :nowCoef="nowCoef" v-on:getBalance="getBalance"/>
        <RightbarInput :nowCoef="nowCoef" v-on:getBalance="getBalance"/>
      </div>
    </div>
  </div>
</template>

<script>
import RigbarLastX from "@/components/Crash/Righbar/RigbarLastX";
import RightbarInput from "@/components/Crash/Righbar/RightbarForm";
import {mapGetters} from "vuex";
export default {
  props: ["nowCoef", "gameId"],
  computed: mapGetters(['validLastXs']),
  components: { RightbarInput, RigbarLastX },
  data() {
    return {
      isXsOpened: false,
      balance: 0
    };
  },
  async created() {
    this.getBalance()
  },
  methods: {
    async getBalance() {
      const jwt = document.cookie.split('=')
      let res = await fetch('http://185.173.39.122:/api/auth/profile', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${jwt[1]}`
        }
      })
      res = await res.json()
      this.balance = res.balance
    }
  }
};

</script>

<style lang="sass" scoped>
@import "@/variables.sass"
.rightbar
  color: #fff
  width: 100%
  &__logo
    display: block
    @media screen and (min-width: 1024px)
      display: none
  &-top
    @media screen and (max-width: 1024px)
      display: flex
      justify-content: space-between
      flex-direction: row
      margin-bottom: 10px
      align-items: center
  &-control
    display: flex
    align-items: center
    justify-content: flex-end
    margin-bottom: 16px
    @media screen and (max-width: 1024px)
      width: auto
      margin-bottom: 10px
    &__el
      display: flex
      align-items: center
      padding: 6px
      background-color: $button-bg
      border-radius: 7px
      border: 2px solid $secondary-bg
      font-size: 14px

      img
        height: 15px
        width: 15px

    &__sound
      margin-right: 3px

    &__music
      margin-right: 6px

    &__faq
      margin-right: 3px

    &__faq, &__wallet
      img
        margin-right: 3px

  &-game
    position: relative

    &__last-xs
      position: relative

    &__animation
      background-color: #221A41
      margin-bottom: 10px
      display: flex
      align-items: center
      font-family: Montserrat
      font-weight: 800
      font-size: 40px
    &__coef
      width: 200px
      margin: 0 auto
  &-last-xs
    display: flex
    overflow-x: hidden
    width: 1000px
    height: 41px
    align-items: center

    &:after
      content: ''
      width: 228px
      height: 32px
      background-image: url(../../assets/img/Shadow.svg)
      position: absolute
      right: 0
      top: -2px

    &_active
      flex-wrap: wrap
      padding: 10px 10px 3px 10px
      box-sizing: border-box
      overflow: visible
      z-index: 100000
      height: auto
      position: absolute
      background-color: #282150
      border-radius: 0 0 13px 13px
      border-top: 1px solid #282828

      &:after
        display: none
    &__el
      margin-right: 5px
      margin-bottom: 7px
      font-size: 12px
      font-weight: 500
      display: flex
      justify-content: center
      align-items: center
      height: 24px
      border-radius: 5px
      min-width: 58px

    &__top
      position: relative
      background-color: #221B45
      padding: 0 10px
      height: 40px
      border-radius: 13px 13px 0 0
      display: none
      border-bottom: 1px solid #2f245c
      align-items: center

      &_active
        display: flex

    &__img
      height: 23px
      margin-right: 5px

    &__open
      background: url(../../assets/img/time.svg) center center no-repeat $button-bg
      top: 0
      right: 0
      z-index: 100

      &_active
        display: none

    &__close
      background: url(../../assets/img/close.svg) center center no-repeat rgba(222, 139, 3, 0.15)
      top: 4px
      right: 6px

    &__open, &__close
      content: ''
      height: 28px
      width: 28px
      border: 2px #100C1F solid
      border-radius: 8px
      position: absolute
      cursor: pointer

    &__title
      font-size: 16px
      text-transform: uppercase

  &-buttons
    display: flex
    justify-content: space-between
    @media screen and (max-width: 1024px)
      flex-direction: column
</style>
