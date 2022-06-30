<template>
  <div class="rightbar-last-xs__el" v-bind:class="{blue: blue, purple: purple, gold: gold}">
    {{ (rightbarLastX.finalCoef / 100).toFixed('2') }}x
  </div>
</template>

<script>
export default {
  props: {
    rightbarLastX: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      blue: false,
      purple: false,
      gold: false
    }
  },
  watch: {
    rightbarLastX: function (newFinalCoef) {
      if (Number(newFinalCoef.finalCoef) < 200) {
        this.blue = true
        this.purple = false
        this.gold = false
      } else if (Number(newFinalCoef.finalCoef) < 1000 && (Number(newFinalCoef.finalCoef) > 199)) {
        this.purple = true
        this.blue = false
        this.gold = false
      } else {
        this.gold = true
        this.blue = false
        this.purple = false
      }
    },
  }
}
</script>

<style lang="sass" scoped>
.blue
  background-color: rgb(62, 91, 194)

.purple
  background-color: rgb(117, 62, 194)

.gold
  background-color: rgb(222, 139, 3)
</style>