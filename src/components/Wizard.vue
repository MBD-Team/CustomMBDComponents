<template>
  <div
    ref="stepSelectorElem"
    class="d-grid w-100"
    style="margin-top: -20px; padding-top: 20px"
    :style="{ height: 0, gridTemplateColumns: steps.map(_ => '1fr').join(' ') }"
  >
    <template v-for="(step, index) in steps.map((e, i) => ({ ...e, stepIndex: i }))">
      <div v-if="index == 0"></div>
      <hr
        v-else
        class="rounded"
        :class="getIconColor(step.stepIndex, 1)"
        style="position: relative; left: -50%; height: 8px"
        :style="`margin-block:${((isMobile ? 30 : 50) - 8) / 2}px;`"
      />
    </template>
  </div>
  <div class="d-grid w-100" :style="{ gridTemplateColumns: steps.map(_ => '1fr').join(' ') }">
    <div
      v-for="step in steps.map((e, i) => ({ ...e, stepIndex: i }))"
      :key="step.stepIndex"
      @click="currentStepIndex = maxReachedStep < step.stepIndex ? currentStepIndex : step.stepIndex"
      class="mx-1"
    >
      <div
        class="rounded-circle d-flex align-items-center justify-content-center mx-auto"
        :class="[getIconColor(step.stepIndex), iconClass]"
        :style="{
          width: isMobile ? '30px' : '50px',
          height: isMobile ? '30px' : '50px',
          fontSize: isMobile ? '1rem' : '2rem',
          filter: step.stepIndex > currentStepIndex && step.stepIndex <= maxReachedStep ? ' grayscale(50%)' : 'grayscale(0%)',
        }"
        :role="step.stepIndex <= maxReachedStep ? 'button' : ''"
      >
        <i :class="['fas', `fa-${step.iconName}`]"></i>
      </div>
      <div :class="`text-center ${showStepIndices ? '' : 'd-none'}`">
        {{ step.stepIndex + 1 }}
      </div>
      <div class="text-center">
        {{ step.title }}
      </div>
    </div>
  </div>
  <div>
    <template v-for="stepIndex in steps.map((_, i) => i)" :key="stepIndex">
      <slot :name="`step${stepIndex}`" v-if="stepIndex == currentStepIndex"></slot>
    </template>
  </div>
  <div class="d-flex justify-content-end">
    <div class="me-1">
      <Button v-if="currentStepIndex > 0" :class="backClass" @click="previous">
        {{ backText }}
      </Button>
    </div>
    <div>
      <Tooltip :tooltip="tooltipNext" direction="left">
        <Button v-if="currentStepIndex < steps.length - 1" :class="continueClass" :disabled="disableNext" @click="next">
          {{ continueText }}
        </Button>
      </Tooltip>
    </div>
    <div>
      <Tooltip :tooltip="tooltipSubmit" direction="left">
        <Button v-if="currentStepIndex == steps.length - 1 && showCompletionBtn" :class="submitClass" @click="onSubmit">{{ submitText }}</Button>
      </Tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, VNodeRef, watch, watchEffect } from 'vue';
import Button from './Button.vue';
import Tooltip from './Tooltip.vue';
const isMobile = ref(false);

new ResizeObserver(() => {
  isMobile.value = window.innerWidth < 70 * steps.value.length;
}).observe(document.body);

const emit = defineEmits(['update:currentStep']);

const props = withDefaults(
  defineProps<{
    steps: { iconName: string; title?: string }[];
    currentStep?: number;
    onNext?: () => void;
    disableNext?: boolean;
    tooltipNext?: string;
    onSubmit: () => void;
    tooltipSubmit?: string;
    showStepIndices?: boolean;
    initialStepIndex?: number;
    initialMaxReachedStep?: number;
    showCompletionBtn?: boolean;
    titleClass?: string;
    iconClass?: string;
    submitText?: string;
    submitClass?: string;
    continueText?: string;
    continueClass?: string;
    backText?: string;
    backClass?: string;
    iconBgColors?: [string, string, string];
    getIconColorFunction?: (stepIndex: number, offset: number) => string;
  }>(),
  {
    currentStep: 0,
    initialMaxReachedStep: 0,
    disableNext: false,
    showCompletionBtn: true,
    showStepIndices: false,
    iconBgColors: () => ['bg-success', 'bg-primary', 'bg-secondary'],
    initialStepIndex: 0,
    titleClass: 'bg-primary text-light text-center',
    iconClass: 'text-light',
    submitText: 'Absenden',
    submitClass: 'btn btn-primary',
    continueText: 'Weiter',
    continueClass: 'btn btn-primary',
    backText: 'Zurück',
    backClass: 'btn btn-secondary',
  }
);
const {
  steps,
  currentStep,
  showStepIndices,
  initialStepIndex,
  onNext,
  onSubmit,
  titleClass,
  iconClass,
  submitText,
  submitClass,
  continueText,
  continueClass,
  backText,
  backClass,
  iconBgColors,
  getIconColorFunction,
  initialMaxReachedStep,
} = toRefs(props);

const currentStepIndex = ref(initialStepIndex.value);
const maxReachedStep = ref(initialMaxReachedStep.value);
watch(currentStep, newCurrentStep => (currentStepIndex.value = newCurrentStep));
watch(currentStepIndex, newcurrentStepIndex => emit('update:currentStep', newcurrentStepIndex));
watchEffect(() => {
  maxReachedStep.value = Math.max(maxReachedStep.value, currentStepIndex.value);
});

const stepSelectorElem = ref<HTMLDivElement>();
function next() {
  if (onNext?.value) onNext.value();
  currentStepIndex.value++;
  setTimeout(() => stepSelectorElem.value?.scrollIntoView(), 70);
}
function previous() {
  currentStepIndex.value--;
  setTimeout(() => stepSelectorElem.value?.scrollIntoView(), 70);
}
function getIconColor(stepIndex: number, offset = 0) {
  if (getIconColorFunction?.value) {
    return getIconColorFunction.value(stepIndex, offset);
  } else {
    if (stepIndex < currentStepIndex.value + offset) {
      return iconBgColors.value[0];
    }
    if (stepIndex <= maxReachedStep.value) {
      return iconBgColors.value[1];
    }
    return iconBgColors.value[2];
  }
}
</script>

<script lang="ts">
/**
 * how to use:
 * ```html
 * <Wizard :steps="[{ iconName: 'calendar' }, { iconName: 'volleyball-ball' }]" :initialStepIndex="0" :onSubmit="() => {}">
    <template #step1>
      <div>content</div>
    </template>
    <template #step2>
      <div>content</div>
    </template>
  </Wizard>

  
 *<Wizard
    :steps="[
      { iconName: 'calendar' },
      { iconName: 'volleyball-ball' },
      { iconName: 'map-marked-alt' },
      { iconName: 'clock' },
      { iconName: 'info' },
      { iconName: 'flag-checkered' },
    ]"
    :tooltipNext="'nextButtonTooltip'"
    :disableNext="false"
    :showStepIndices="false"
    :initialStepIndex="0"
    :onSubmit="() => {}"
    :tooltipSubmit="'submitTextTooltip'"
    :submit-text="'submitText'"
    :showCompletionBtn="true"
    v-model:currentStep="number"
    :getIconColorFunction="
      (stepIndex, offset) => {
        return 'bg-primary';
      }
    "
  >
    <template
      v-for="(step, index) in [
        { content: 'test' },
        { content: 'testtets' },
        { content: 'test' },
        { content: 'testtets' },
        { content: 'test' },
        { content: 'testtets' },
      ]"
      #[`step${index}`]
    >
      <div>{{ step.content }}</div>
    </template>
  </Wizard>
 * ```
 */
export default {};
</script>
