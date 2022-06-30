<template>
  <form class="rightbar-buttons__el" @submit.prevent>
    <div class="rightbar-buttons__top">
      <div class="rightbar-options">
        <div class="rightbar-options__el" v-on:click="autoBet">
          <div class="rightbar-options__checkbox" v-bind:class="{ 'rightbar-options__checked': isAutoBet }"></div>
          <span class="rightbar-options__text">Авто ставка</span>
        </div>
        <div class="rightbar-options__el" v-on:click="isAutoCashout = !isAutoCashout">
          <div class="rightbar-options__checkbox" v-bind:class="{ 'rightbar-options__checked': isAutoCashout }"></div>
          <span class="rightbar-options__text">Авто вывод</span>
        </div>
      </div>
      <div class="rightbar-options__wrapper">
        <input type="text" class="rightbar-options__max" size="6" v-model=autoCashout
               v-on:focusout="autoCashoutValidate">
        <div class="rightbar-options__input-display">
          <div class="rightbar-bottom__input-display_x">x</div>
          <div class="rightbar-bottom__input-display_cashout" maxlength="5">{{ autoCashout }}</div>
        </div>
      </div>
    </div>
    <div class="rightbar-bottom">
      <div class="rightbar-bottom__options">
        <div class="rightbar-bottom__top">
          <div class="rightbar-bottom__sign" v-on:click="betValidate('-10')">
            <img src="@/assets/img/minus.svg" alt="Минус">
          </div>
          <div class="rightbar-bottom__wrapper">
            <input type="text" class="rightbar-bottom__input" v-model=bet v-on:focusout="betValidate" maxlength="10">
            <div class="rightbar-bottom__input-display">
              <div class="rightbar-bottom__input-display_bet">{{ bet }}</div>
              <div>₽</div>
            </div>
          </div>
          <div class="rightbar-bottom__sign" v-on:click="betValidate('+10')">
            <img src="@/assets/img/plus.svg" alt="Плюс">
          </div>
        </div>
        <div class="rightbar-bottom__bottom">
          <div class="rightbar-bottom__multiplier" v-on:click="betValidate('+50')">+50</div>
          <div class="rightbar-bottom__multiplier" v-on:click="betValidate('+100')">+100</div>
          <div class="rightbar-bottom__multiplier" v-on:click="betValidate('/2')">÷2</div>
          <div class="rightbar-bottom__multiplier" v-on:click="betValidate('x2')">x2</div>
        </div>
      </div>
      <button
          class="rightbar-bottom__button"
          type="submit"
          v-on:click="onSubmit"
          v-bind:class="{ 'rightbar-bottom__button_active': betButtonPressed }"
          v-if="!betButtonPressed"
      >СТАВКА</button>
      <button
          class="rightbar-bottom__button"
          type="submit"
          v-on:click="betClaim"
          v-bind:class="{ 'rightbar-bottom__button_claim': betButtonPressed }"
          v-else-if="claimable"
      ><span>
        {{ (Number(nowCoef) * numberBet()).toFixed('2')}}
      </span>
        ЗАБРАТЬ</button>
      <button
          class="rightbar-bottom__button"
          type="submit"
          v-on:click="betCancel"
          v-bind:class="{ 'rightbar-bottom__button_active': betButtonPressed }"
          v-else-if="betButtonPressed && !claimable"
      >ОТМЕНА</button>

    </div>
  </form>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  props: ["nowCoef"],
  data() {
    return {
      autoCashout: '2.00',
      bet: 10,
      isAutoBet: false,
      isAutoCashout: false,
      connection: null,
      gameId: null,
      gameFinalObj: {
        gameFinal: null
      },
      gameFinal: null,
      betButton: false,
      betButtonPressed: false,
      claimable: false,
      res: null,
      claimRes: null,
      betClaimed: null
    }
  },
  created() {
    this.connection = new WebSocket("ws://185.173.39.122:5001/")
    const v = this
    this.connection.onopen = function () {
      const message = {
        event: 'getNowBets'
      }
      v.connection.send(JSON.stringify(message))
    }
    this.connection.onmessage = function (event) {
      let message = JSON.parse(event.data)
      if (message.event == 'getNowBets') {
        v.$emit('getBalance')
        v.gameFinalObj.gameFinal = message.gameFinal
        v.gameFinal = message.gameFinal
        v.gameId = message.newGameId
        if(v.betButtonPressed && v.gameFinal === false && !v.betClaimed) {
          v.claimable = true
        } else if(v.claimable == true && v.gameFinal === 'Crash') {
          v.claimable = false
          v.betButtonPressed = false
        } else if(v.gameFinal === false) {
          v.betClaimed = false
        }
        if(v.gameFinal === 'Crash') {
          v.GET_LASTXS_FROM_API()
          if(v.isAutoBet) {
            v.betButtonPressed = true
            v.onSubmit()
          }
        }
        v.GET_BETS_FROM_API(v.gameId)
        v.GET_LASTXS_FROM_API()
      }

    }
  },
  methods: {
    ...mapActions([
      'GET_BETS_FROM_API', 'GET_LASTXS_FROM_API'
    ]),
    autoBet() {
      const v = this
      v.isAutoBet = !v.isAutoBet
      if(v.isAutoBet) {
        v.onSubmit()
        v.betButtonPressed = true
      } else {
        v.betCancel()
        v.betButtonPressed = false
      }
    },
    numberBet() {
      let arr = this.bet.toString().split('')
      if (arr[1] == ' ') {
        arr[1] = ''
        this.bet = arr.join('')
      } else if (arr[2] == ' ') {
        arr[2] = ''
        this.bet = arr.join('')
      }
      this.bet = Number(this.bet)
      return this.bet
    },
    async betCancel() {
      const v = this
      v.isAutoBet = false
      v.betButtonPressed = !v.betButtonPressed
      if(v.gameFinal === true)
      {
        const jwt = document.cookie.split('=')
        await fetch('http://185.173.39.122:5000/api/auth/delBet', {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${jwt[1]}`
          },
          body: JSON.stringify({
            betId: v.res.betId,
            bet: v.bet
          })
        })
      } else {
        v.res = ''
      }
      let message = {
        event: 'getNowBets'
      }
      v.connection.send(JSON.stringify(message))
    },
    async betClaim() {
      const v = this
      v.claimable = false
      if(!v.isAutoBet) {
        v.betButtonPressed = false
      }
      v.betClaimed = true
      const jwt = document.cookie.split('=')
      v.claimRes = await fetch('http://185.173.39.122:5000/api/auth/claimBet', {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${jwt[1]}`
        },
        body: JSON.stringify({
          betId: v.res.betId,
          nowCoef: v.nowCoef,
          bet: v.bet
        })
      })
      let message = {
        event: 'getNowBets'
      }
      v.connection.send(JSON.stringify(message))
    },
    async onSubmit() {
      const v = this
      const jwt = document.cookie.split('=')
      v.betButtonPressed = true
      if (v.gameFinal === false || v.gameFinal === 'Crash') {
        Object.defineProperty(v.gameFinalObj, 'gameFinal', {
          set: async function (newValue) {
            if (newValue === true  && v.betButton == false && v.betButtonPressed == true) {
              message = {
                event: 'getNowBets'
              }
              await v.connection.send(JSON.stringify(message))
              v.betButton = true
              v.res = await fetch('http://185.173.39.122:5000/api/auth/newBet', {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json',
                  'Authorization': `Bearer ${jwt[1]}`
                },
                body: JSON.stringify({
                  bet: v.bet,
                  autoCashout: v.autoCashout,
                  gameId: v.gameId
                })
              })
              v.res = await v.res.json()
              let message = {
                event: 'getNowBets'
              }
              v.connection.send(JSON.stringify(message))
            }
          }
        })
      } else if(v.gameFinal === true && v.betButton == false && v.betButtonPressed == true){
        v.res = await fetch('http://185.173.39.122:5000/api/auth/newBet', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${jwt[1]}`
          },
          body: JSON.stringify({
            bet: v.bet,
            autoCashout: this.autoCashout,
            gameId: this.gameId
          })
        })

        v.res = await v.res.json()
        console.log(v.res.betId)
        let message = {
          event: 'getNowBets'
        }
        v.connection.send(JSON.stringify(message))
      }
      v.betButton = false
    },
    betValidate(sign) {
      let arr = this.bet.toString().split('')
      if (arr[1] == ' ') {
        arr[1] = ''
        this.bet = arr.join('')
      } else if (arr[2] == ' ') {
        arr[2] = ''
        this.bet = arr.join('')
      }
      if (arr.indexOf('.') > -1) {
        console.log(arr)
        this.bet = Number(this.bet).toFixed('2')
      }

      if (sign == '+50') {
        this.bet = Number(this.bet) + 50
        this.bet = this.bet.toString()

      } else if (sign == '+100') {
        this.bet = Number(this.bet) + 100
        this.bet = this.bet.toString()

      } else if (sign == '/2') {
        this.bet = Number(this.bet) / 2
        this.bet = this.bet.toString()

      } else if (sign == 'x2') {
        this.bet = Number(this.bet) * 2
        this.bet = this.bet.toString()

      } else if (sign == '-10') {
        this.bet = Number(this.bet) - 10
        this.bet = this.bet.toString()

      } else if (sign == '+10') {
        this.bet = Number(this.bet) + 10
        this.bet = this.bet.toString()

      }
      arr = this.bet.toString().split('')
      if (this.bet < 10) {
        this.bet = 10
      } else if (this.bet >= 10000) {
        this.bet = '10 000'
      } else if (this.bet < 10000 && this.bet >= 1000) {
        arr.unshift(arr[0])
        arr[1] = ' '
        this.bet = arr.join('')
      }
    },
    autoCashoutValidate() {
      if (Number(this.autoCashout) > 100) {
        this.autoCashout = 100
      } else if (Number(this.autoCashout) < 1) {
        this.autoCashout = 1.01
      }
      this.autoCashout = Number(this.autoCashout).toFixed('2')
    }
  },
  watch: {
    bet: function (newBet) {
      this.bet = newBet.toString().replace(/[^.' '\d]/g, '')
      let arr = this.bet.toString().split('')
      if (arr[1] == ' ') {
        arr[1] = ''
        this.bet = arr.join('')
      } else if (arr[2] == ' ') {
        arr[2] = ''
        this.bet = arr.join('')
      }
      arr = this.bet.toString().split('')
      arr.forEach(function (item, i, arr) {
        let bet = Number(arr.join(''))

        if (arr[i - 3] == '.') {
          arr.pop()
        }
        if (bet >= 100000) {
          arr.pop()
        }
      });
      this.bet = arr.join('')
      arr = this.bet.toString().split('')
      if (this.bet < 10000 && this.bet >= 1000) {
        arr.unshift(arr[0])
        arr[1] = ' '
        this.bet = arr.join('')
      } else if (this.bet >= 10000 && this.bet < 100000) {
        arr.unshift(arr[1])
        arr.unshift(arr[1])
        arr[3] = ''
        arr[2] = ' '
        this.bet = arr.join('')
      }
    },
    autoCashout: function (newAutoCashout) {
      this.autoCashout = newAutoCashout.replace(/[^.\d]/g, '')
      let arr = this.autoCashout.toString().split('')
      arr.forEach(function (item, i, arr) {
        let autoCashout = Number(arr.join(''))
        if (arr[i - 3] == '.') {
          arr.pop()
        }
        if (autoCashout >= 1000) {
          arr.splice(3, 1)
        }
      });
      this.autoCashout = arr.join('')
    },
    nowCoef: function (newNowCoef) {
      if(this.isAutoCashout==true && this.betButtonPressed==true) {
        if(Number(newNowCoef) == Number(this.autoCashout)) {
          this.betClaim()
        }
      }
    }
  }

}
</script>
<style lang="sass" scoped>
@import "@/variables.sass"
.rightbar
  &-buttons
    &__el
      width: 50%
      border-radius: 9px
      background-color: $button-bg
      @media screen and (max-width: 1024px)
        width: 100%
        margin-bottom: 10px

      &:first-child
        margin-right: 10px

    &__top
      display: flex
      justify-content: space-between
      padding: 5px 8px

  &-options
    display: flex
    justify-content: space-between

    &__checked
      &:after
        display: block
        content: ""
        border-radius: 7px
        width: 18px
        height: 18px
        background: url(../../../assets/img/check.svg) center center no-repeat

    &__el
      display: flex
      justify-content: space-between
      align-items: center
      margin-right: 9px
      font-size: 12px
      font-weight: 500
      cursor: pointer

    &__checkbox
      width: 18px
      height: 18px
      background-color: $checkbox-bg
      border: 3px $input-bg solid
      margin-right: 5px
      border-radius: 8px
      position: relative

    &__wrapper
      position: relative
      display: flex
      justify-content: center
      position: relative

    &__max
      background-color: $input-bg
      width: 100px
      z-index: 1000
      @media screen and (max-width: 1090px) and (min-width: 1024px)
        width: 69px

    &__max, &__input-display
      text-align: center
      font-family: Montserrat, sans-serif
      font-size: 12px
      font-weight: 600
      color: #fff
      border: none
      outline: none
      padding: 5px 0
      border-radius: 8px

    &__input-display
      display: flex
      position: absolute

  &-bottom
    background-color: #282150
    border-radius: 9px
    padding: 8px
    display: flex
    justify-content: space-between

    &__options
      width: 50%
      margin-right: 10px
      background-color: $input-bg
      padding: 5px
      border-radius: 10px
      position: relative

      &::after
        content: ''
        width: 100%
        height: 1px
        background-color: #27204D
        position: absolute
        top: 50%
        left: 0

    &__top
      display: flex
      justify-content: space-between
      align-items: center
      margin-bottom: 11px

    &__bottom
      display: flex
      justify-content: space-between

    &__button
      font-family: Montserrat, sans-serif
      width: 50%
      border-radius: 12px
      border: none
      background: linear-gradient(263.87deg, rgb(148, 78, 245) 0%, rgb(92, 36, 252) 100%)
      color: #fff
      font-size: 16px
      font-weight: 800
      &_active
        background: linear-gradient(263.87deg, rgb(245, 78, 118) 0%, rgb(252, 36, 75) 100%)
      &_claim
        background: linear-gradient(263.87deg, rgb(253, 187, 78) 0%, rgb(245, 103, 25) 100%)
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center
        span
          margin-bottom: 5px
      &:hover
        cursor: pointer

    &__top
      display: flex
      justify-content: space-between

    &__input
      position: relative
      z-index: 10000
      width: 100%

    &__input, &__input-display
      font-family: Montserrat, sans-serif
      background: none
      border: none
      outline: none
      color: #fff
      text-align: center
      font-size: 16px
      font-weight: 700

    &__input-display
      display: flex
      position: absolute
      top: 1px

      &_bet
        opacity: 0
        margin-right: 16px

      &_cashout
        opacity: 0
        z-index: -1000

      &_x
        margin-right: 10px
        color: #948ac5
        z-index: 1001

    &__wrapper
      position: relative
      display: flex
      justify-content: center

    &__sign
      border-radius: 8px
      height: 26px
      width: 26px
      background-color: #231D47
      display: flex
      align-items: center
      justify-content: center
      cursor: pointer

    &__multiplier
      background-color: $button-bg
      color: $text-color
      font-weight: 600
      width: 25%
      margin-right: 5px
      font-size: 12px
      border-radius: 5px
      line-height: 26px
      display: flex
      align-items: center
      justify-content: center
      cursor: pointer

      &:last-child
        margin-right: 0
</style>