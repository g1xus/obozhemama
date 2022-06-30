<template>
  <div class="leftbar">
    <img src="@/assets/img/crash-logo.svg" alt="" class="leftbar__logo">
    <div class="leftbar-bets">
      <div class="leftbar-buttons">
        <div class="leftbar-buttons__bg"></div>
        <div class="leftbar-buttons__el" v-bind:class="{'leftbar-buttons__el_active': pinTarget=='all'}" v-on:click="allBets">Все</div>
        <div class="leftbar-buttons__el" v-bind:class="{'leftbar-buttons__el_active': pinTarget=='my'}" v-on:click="myBets">Мои</div>
        <div class="leftbar-buttons__el" v-bind:class="{'leftbar-buttons__el_active': pinTarget=='top'}" v-on:click="topBets">Топ</div>
      </div>
      <div class="leftbar-stats" v-if="pinTarget=='all'">
        <p class="leftbar-stats__text">
          Всего ставок: <br> <span class="leftbar-stats__count">{{ leftbarItemsCount }}</span>
        </p>
        <div class="leftbar-stats__prev" v-on:click="prevBets" v-bind:class="{'leftbar-stats__prev_active': isPrev }">
          Пред. раунд
        </div>
      </div>
      <div class="leftbar-all" v-if="pinTarget == 'all'">

        <LeftbarItem
            v-for="leftbarItem of validLeftbarItems" :key="leftbarItem.id"
            v-bind:leftbarItem="leftbarItem"
        />

      </div>
      <div class="leftbar-my" ref="my">

        <myLeftbarItem
            v-for="leftbarItem of myLeftbarItems" :key="leftbarItem.id"
            v-bind:leftbarItem="leftbarItem"
        />

      </div>
      <div class="leftbar-top" ref="top">

        <topLeftbarItem
            v-for="leftbarItem of topLeftbarItems" :key="leftbarItem.id"
            v-bind:leftbarItem="leftbarItem"
        />

      </div>
    </div>
  </div>
</template>

<script>
import LeftbarItem from "@/components/Crash/Leftbar/LeftbarItem";
import myLeftbarItem from "@/components/Crash/Leftbar/myLeftbarItem";
import topLeftbarItem from "@/components/Crash/Leftbar/topLeftbarItem";
import {mapActions, mapGetters} from "vuex";

export default {
  computed: mapGetters(['validLeftbarItems', 'myLeftbarItems','topLeftbarItems', 'leftbarItemsCount']),
  components: {LeftbarItem,myLeftbarItem, topLeftbarItem},

  data() {
    return {
      connection: null,
      gameId: null,
      gameFinal: null,
      isPrev: false,
      pinTarget: 'all'
    };
  },
  mounted() {
    let body = document.querySelector('body')
    body.onresize = function () {
      this.onResize()
    }
  },
  methods: {
    ...mapActions([
      'GET_BETS_FROM_API', 'GET_PREVBETS_FROM_API', 'GET_MYBETS_FROM_API','GET_TOPBETS_FROM_API', 'RESET_BETS'
    ]),
    onResize() {
      const v = this
      if (v.pinTarget == 'my') {
        let winHeight = window.innerHeight
        let winWidth = document.documentElement.clientWidth
        if (winWidth > 1024) {
          this.$refs.my.style.height = winHeight - 185 + 'px'
        } else {
          this.$refs.my.style.height = winHeight - 185 + 'px'
        }
      }
    },
    prevBets() {
      const v = this
      v.isPrev = !v.isPrev
      if (v.isPrev) {
        v.RESET_BETS()
        v.GET_PREVBETS_FROM_API()
      } else {
        v.RESET_BETS()
        v.GET_BETS_FROM_API(v.gameId)
      }
    },
    myBets() {
      const v = this
      v.pinTarget = 'my'
      let bg = document.getElementsByClassName('leftbar-buttons__bg')[0]
      bg.style.marginLeft = '32%'
      this.$refs.my.style.display = 'block'
      this.$refs.top.style.display = 'none'
      this.onResize()
      v.GET_MYBETS_FROM_API()
    },
    allBets() {
      const v = this
      v.pinTarget = 'all'
      this.$refs.my.style.display = 'none'
      this.$refs.top.style.display = 'none'
      let bg = document.getElementsByClassName('leftbar-buttons__bg')[0]
      bg.style.marginLeft = '0'
      v.GET_BETS_FROM_API(v.gameId)
    },
    topBets() {
      const v = this
      v.pinTarget = 'top'
      this.$refs.my.style.display = 'none'
      this.$refs.top.style.display = 'block'
      let bg = document.getElementsByClassName('leftbar-buttons__bg')[0]
      bg.style.marginLeft = '65%'
      v.GET_TOPBETS_FROM_API()
    }
  },
  created() {
    const v = this
    this.connection = new WebSocket("ws://localhost:5001/")
    this.connection.onmessage = function (event) {
      let message = JSON.parse(event.data)
      if (message.event == 'getNowBets') {
        v.gameId = message.newGameId
        v.gameFinal = message.gameFinal
        if (v.gameFinal === true) {
          v.RESET_BETS()
          v.GET_BETS_FROM_API(v.gameId)
        }
      }
    }
    this.connection.onopen = function () {
      const message = {
        event: 'getNowBets'
      }
      v.connection.send(JSON.stringify(message))
    }


  },
};
</script>

<style lang="sass" scoped>
@import "@/variables.sass"
.leftbar
  width: 300px
  margin-right: 10px
  font-size: 12px
  @media screen and (max-width: 1024px)
    order: 2
    width: 100%

  &-all, &-my
    overflow-y: scroll
    scrollbar-width: none
    -ms-overflow-style: none
    &::-webkit-scrollbar
      width: 0px
      background: transparent
  &-my
    display: none
  &__logo
    margin-bottom: 22px
    @media screen and (max-width: 1024px)
      display: none

  &-buttons
    width: 100%
    display: flex
    justify-content: space-around
    background-color: $secondary-bg
    position: relative
    border-radius: 8px
    margin-bottom: 8px
    font-size: 14px

    &__el
      color: $text-color
      padding: 10px 0
      width: 100px
      text-align: center
      z-index: 1
      cursor: pointer
      transition-duration: 0.3s


      &_active
        color: #fff

    &__bg
      position: absolute
      top: 0
      left: 0
      width: 33%
      height: 29px
      background-color: $button-bg
      border-radius: 10px
      z-index: 1
      border: 4px $secondary-bg solid
      transition-duration: 0.3s

  &-stats
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 10px

    &__text
      color: #727385

    &__count
      margin-top: 3px
      display: block
      color: #fff
      font-size: 16px
      font-weight: 700

    &__prev
      color: #fff
      padding: 5px
      background-color: $button-bg
      border: 3px $secondary-bg solid
      border-radius: 8px
      cursor: pointer
      @media screen and (max-width: 1024px)
        font-size: 14px
        padding: 7px

      &_active
        color: rgb(245, 78, 118)
</style>