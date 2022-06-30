<template>
  <div class="crash__wrapper">
    <Leftbar/>
    <Rightbar
        v-bind:nowCoef="nowCoef"
        v-bind:gameId="gameId"
    />
  </div>
</template>

<script>
import Rightbar from "@/components/Crash/Rightbar";
import Leftbar from "@/components/Crash/Leftbar";

export default {
  components: {
    Rightbar,
    Leftbar
  },
  data() {
    return {
      connection: null,
      nowCoef: 0,
      gameId: null
    };
  },
  created() {
    const v = this
    this.connection = new WebSocket("ws://109.107.187.195:5001/")
    this.connection.onopen = function () {
      let message = {
        event: 'gameCycle'
      }
      v.connection.send(JSON.stringify(message))
    }
    this.connection.onmessage = function (event) {
      let message = JSON.parse(event.data)
      if(message.event == 'gameCycle') {
        v.nowCoef = message.mainCoef
        v.gameId = message.newGameId
      }
    }
  },
  mounted() {
    let body = document.querySelector('body')
    function resize() {
      let winHeight = window.innerHeight
      let winWidth = document.documentElement.clientWidth
      let gameInner = document.querySelector('.rightbar-game__animation')
      let allBets = document.querySelector('.leftbar-all')
      let lastxsInner = document.getElementsByClassName('rightbar-last-xs')[0]
      if (winWidth > 1024) {
        gameInner.style.width = winWidth - 400 + 'px'
        lastxsInner.style.width = gameInner.clientWidth + 'px'
        gameInner.style.height = winHeight - 315 + 'px'
        allBets.style.height = winHeight - 253 + 'px'
      } else {
        gameInner.style.height = '200px'
        gameInner.style.width = '100%'
        lastxsInner.style.width = '100%'
        allBets.style.height = winHeight - 253 + 'px'
      }
    }

    resize()
    body.onresize = function () {
      resize()
    }
  }
}
</script>

<style lang="sass">
.crash__wrapper
  display: flex
  @media screen and (max-width: 1024px)
    flex-direction: column
    width: 100%
</style>