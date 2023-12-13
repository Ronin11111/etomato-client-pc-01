<template>
    <div class="xtx-bread-item">
      <RouterLink v-if="to" :to='to'><slot></slot></RouterLink>
      <span v-else><slot></slot></span>
    </div>
</template>

<script>
export default {
  name: 'XtxBreadItem',
  props: {
    // 父级导航name
    to: {
      type: [Object, String],
      default: '/'
    }
  }
}
</script>

<style>

</style>
