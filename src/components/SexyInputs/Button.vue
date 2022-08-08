<template>
  <button v-bind="$attrs"><slot></slot></button>
</template>
<script>
export default {
  inheritAttrs: false,
};
</script>
<style scoped lang="scss">
button {
  height: 2.5rem;
  width: 100%;
  background: white;
  color: black;
  font-size: 1.5rem;
  border-color: black;
  border-width: 1px;
  border-radius: 0.5rem;
  transition: all 0.25s ease-out;
  &:hover {
    @media (pointer: fine) {
      filter: brightness(95%);
    }
  }
  &:active {
    @media (pointer: fine) {
      filter: brightness(85%);
    }
    @media (pointer: coarse) {
      filter: brightness(85%);
    }
  }
}
</style>
