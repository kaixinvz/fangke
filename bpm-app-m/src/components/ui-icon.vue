<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#icon-${icon}`"></use>
  </svg>
</template>
<script>
  /*
   * ui-header
   * @module components/button
   * @desc  图标 
   * @param {string} [icon] - 图标 
   *
   * @example
   * <ui-icon  icon="xxx">按钮</ui-icon>
   **/
  export default {
    props: ['icon'],
  }

</script>
<style scoped lang="less">
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

</style>
