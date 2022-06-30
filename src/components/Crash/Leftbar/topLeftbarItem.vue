<template>
  <div class="leftbar-all__el"
       v-bind:class="{'leftbar-all__el_win': leftbarItem.win, 'leftbar-all__el_loose': leftbarItem.loose}">
    <div class="leftbar-all__avatar">
      <img src="@/assets/img/avatar.svg" alt="Ava" class="leftbar-all__img">
      <div class="leftbar-all__nickname">{{leftbarItem.name}}</div>
    </div>
    <div class="leftbar-all__info">
      <div class="leftbar-all__summ">Ставка: <span>{{ beautifyBet() }} ₽</span></div>
      <div class="leftbar-all__prize">Профит: <span>{{ leftbarItem.profit }}</span></div>
      <div class="leftbar-all__ratio">Коэфф: <span>{{ leftbarItem.coef }}x</span></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    leftbarItem: {
      type: Object,
      required: true
    }
  },
  methods: {
    beautifyBet() {
      let arr = this.leftbarItem.bet.toString().split('')
      let normalBet = normalBet = arr.join('')
      if (this.leftbarItem.bet < 10) {
        normalBet = '10'
      } else if (this.leftbarItem.bet >= 10000) {
        normalBet = '10 000'
      } else if (this.leftbarItem.bet < 10000 && this.leftbarItem.bet >= 1000) {
        arr.unshift(arr[0])
        arr[1] = ' '
        normalBet = arr.join('')
      }
      return normalBet
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/variables.sass"
.leftbar
  &-all
    &__el
      width: 100%
      border-radius: 8px
      color: #fff
      padding: 5px 10px 5px 5px
      display: flex
      justify-content: space-between
      align-items: center
      margin-bottom: 6px
      box-sizing: border-box
      border: 2px transparent solid
      background-color: $bet-loose-bg

    &__avatar
      display: flex
      flex-direction: column
      text-align: center
      width: 50%
    &__info
      display: flex
      flex-direction: column
      width: 50%
    &__img
      width: 50px
      margin: 0 auto 5px auto
    &__summ, &__prize, &__ratio
      color: $text-color
      display: flex
      justify-content: space-between
      background-color: darken($input-bg, 3)
      padding: 7px 9px
      margin-bottom: 3px
      border-radius: 3px
      span
        color: rgb(223, 229, 242)
    &__ratio
      margin-bottom: 0
      span
        font-weight: 700
        color: rgb(222, 139, 3)
</style>