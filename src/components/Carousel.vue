<template>
  <div :id="CarouselId" class="carousel slide" data-bs-ride="false" style="height: 100%" :data-bs-interval="slideInterval">
    <div class="carousel-indicators" v-if="chunk(itemArray, itemsPerPage).length > 1">
      <button type="button" :data-bs-target="`#${CarouselId}`" :data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 0"></button>
      <button
        v-for="index in Math.ceil(itemArray.length / itemsPerPage - 1)"
        :key="index"
        type="button"
        :data-bs-target="`#${CarouselId}`"
        :data-bs-slide-to="index"
        aria-current="true"
        :aria-label="`Slide ${index + 1}`"
      ></button>
    </div>
    <div class="carousel-inner">
      <div v-for="(array, index) of chunk(itemArray, itemsPerPage)" class="carouselItemGrid carousel-item" :class="{ active: index == 0 }">
        <template v-for="item of array">
          <slot :item="item"></slot>
        </template>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" :data-bs-target="`#${CarouselId}`" data-bs-slide="prev" style="background-color: black">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" :data-bs-target="`#${CarouselId}`" data-bs-slide="next" style="background-color: black">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>
<script setup lang="ts">
import { ref, toRefs } from 'vue';
import { chunk } from '../utils/chunk';

const CarouselId = 'Carousel' + (Math.random() + '').slice(2, 15);

const props = withDefaults(
  defineProps<{
    itemArray: any[];
    itemsPerPage?: number;
    indicatorColor?: string;
    slideInterval?: number | 'false';
  }>(),
  {
    itemsPerPage: 1,
    indicatorColor: 'white',
    slideInterval: 'false',
  }
);
const { itemArray } = toRefs(props);
</script>
<style lang="scss" scoped>
.carouselItemGrid.active,
.carousel-item-start,
.carousel-item-next,
.carousel-item-prev {
  display: grid;
  grid-template-columns: repeat(v-bind(itemsPerPage), 1fr);
}
[class*='carousel-control'] {
  width: 20%;
  opacity: 0;
  &:hover,
  &:focus {
    opacity: 0;
  }
}
.carousel-indicators button {
  background-color: v-bind(indicatorColor);
}
</style>
