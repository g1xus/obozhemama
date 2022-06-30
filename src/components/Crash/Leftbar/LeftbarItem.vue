<template>
  <div class="leftbar-all__el"
       v-bind:class="{'leftbar-all__el_win': leftbarItem.win, 'leftbar-all__el_loose': leftbarItem.loose}">
    <div class="leftbar-all__avatar">
      <img src="@/assets/img/avatar.svg" alt="Ava" class="leftbar-all__img">
      <div class="leftbar-all__nickname">{{ cutName() }}</div>
    </div>
    <div class="leftbar-all__summ">{{ beautifyBet() }} ₽</div>
    <div class="leftbar-all__ratio">{{ leftbarItem.coef }}</div>
    <div class="leftbar-all__prize">{{ leftbarItem.profit }}</div>
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
    cutName() {
      if(this.leftbarItem.name){
        let cuttedName = this.leftbarItem.name
        cuttedName = cuttedName.split('')
        cuttedName.forEach(function(item, i, arr) {
          if (i ==  5) {
            arr[i] = '...'
          } else if (i > 5) {
            arr[i] = ''
          }
          cuttedName = arr.join('')
        });
        return(cuttedName)
      } else {
        console.log('Ставок пока нет')
        return null
      }

    },
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

      &_win
        background-color: $bet-win-bg
        border: 2px #6337A7 solid

        .leftbar-all__ratio
          background-color: #3E5BC2

        .leftbar-all__prize
          color: #FDBB4E

      &_loose
        border: 2px transparent solid
        background-color: $bet-loose-bg

    &__avatar
      display: flex
      align-items: center
      width: 25%
      @media screen and (max-width: 450px)
        width: 30%

    &__img
      margin-right: 5px

    &__summ
      width: 25%
      text-align: center
      @media screen and (max-width: 1024px)
        text-align: left
        width: 25%

    &__ratio
      padding: 4px 12px
      text-align: center
      border-radius: 5px
      width: 20%

    &__prize
      text-align: center
      width: 25%
</style>