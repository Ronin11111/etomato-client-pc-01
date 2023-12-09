<template>
  <div>
    <header>头部</header>
    <nav>底部通栏</nav>
    <div><router-view></router-view></div>
    <footer>底部</footer>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Layout'
}
</script>

<style>

</style>
