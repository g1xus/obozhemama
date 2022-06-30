<template>
      <a href="#" class="header-links__el">{{ headerLink.title }}</a>
</template>

<script>
export default {
  props: {
    headerLink: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="sass" scoped>
.header
  &-links
    &__el
      color: #fff
      text-decoration: none
      margin-right: 20px
</style>