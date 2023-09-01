<template>
  <div class="progress rounded-0" style="position: relative; height: 20px; background-color: none">
    <div
      :class="progressColor"
      class="progress-bar-striped progress-bar-animated"
      role="progressbar"
      :style="{ width: (progress / maxValue) * 100 + '%' }"
    ></div>
    <div
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      :style="{
        '--ticks': ticks,
        '--tick-width': tickWidth + 'px',
        '--tick-color': tickColor,
        '--ticks-secondary': secondaryTicks,
        '--tick-secondary-color': tickSecondaryColor,
      }"
      class="ticks"
    ></div>
  </div>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    progress: number;
    maxValue: number;
    ticks?: number;
    secondaryTicks?: number;
    tickWidth?: number;
    tickColor?: string;
    tickSecondaryColor?: string;
    progressColor?: string;
  }>(),
  {
    ticks: 20,
    secondaryTicks: 0,
    tickWidth: 2,
    tickColor: '#00000066',
    tickSecondaryColor: '#00000022',
    progressColor: 'bg-info',
  }
);
</script>
<style lang="scss" scoped>
.ticks {
  background: repeating-linear-gradient(
      90deg,
      #00000000,
      #00000000 calc(calc(calc(100% + var(--tick-width)) / var(--ticks)) - var(--tick-width)),
      var(--tick-color) calc(calc(calc(100% + var(--tick-width)) / var(--ticks)) - var(--tick-width)),
      var(--tick-color) calc(calc(100% + var(--tick-width)) / var(--ticks))
    ),
    repeating-linear-gradient(
      90deg,
      #00000000,
      #00000000 calc(calc(calc(100% + var(--tick-width)) / var(--ticks-secondary)) - var(--tick-width)),
      var(--tick-secondary-color) calc(calc(calc(100% + var(--tick-width)) / var(--ticks-secondary)) - var(--tick-width)),
      var(--tick-secondary-color) calc(calc(100% + var(--tick-width)) / var(--ticks-secondary))
    );
}
</style>
<script lang="ts">
/**
 * how to use:
 * ```html
 * 
 *  <ProgressBar
      :progress="20"
      :max-value="100"
    ></ProgressBar>

 *   <ProgressBar
      :progress="20"
      :max-value="100"
      :secondary-ticks="25"
      :tick-width="2"
      tickColor="#aaee00ee"
      tickSecondaryColor="#eeaaee"
      progressColor="bg-danger"
    ></ProgressBar>
 * ```
 */
export default {};
</script>
