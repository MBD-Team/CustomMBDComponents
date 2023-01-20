<template>
  <h2 class="p-2 w-100" :class="titleClass" v-if="title">{{ title }}</h2>
  <div class="d-grid w-100" :style="{ gridTemplateColumns: steps.map(_ => '1fr').join(' ') }">
    <div
      v-for="step in steps.map((e, i) => ({ ...e, stepIndex: i }))"
      :key="step.stepIndex"
      @click="currentStepIndex = maxReachedStep < step.stepIndex ? currentStepIndex : step.stepIndex"
      class="mx-1"
    >
      <hr
        v-if="step.stepIndex > 0"
        class="rounded"
        :class="getIconColor(step.stepIndex, 1)"
        style="position: relative; top: 46px; left: -50%; z-index: -1; height: 8px"
      />
      <div
        class="rounded-circle d-flex align-items-center justify-content-center mx-auto"
        :class="[getIconColor(step.stepIndex), iconClass]"
        :style="{
          width: '50px',
          height: '50px',
          marginTop: step.stepIndex == 0 ? '40px' : 'auto',
          filter: step.stepIndex > currentStepIndex && step.stepIndex <= maxReachedStep ? ' grayscale(50%)' : 'grayscale(0%)',
        }"
        :role="step.stepIndex <= maxReachedStep ? 'button' : ''"
      >
        <i :class="`fas fa-${step.iconName} fa-2x`"></i>
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
      <Button v-if="currentStepIndex > 0" :class="backClass" @click="currentStepIndex--">
        {{ backText }}
      </Button>
    </div>
    <div>
      <Tooltip :tooltip="tooltipNext" direction="left">
        <Button
          v-if="currentStepIndex < steps.length - 1"
          :class="continueClass"
          :disabled="disableNext"
          @click="
            () => {
              if (onNext) onNext();
              currentStepIndex++;
            }
          "
        >
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
import { ref, toRefs, watch, watchEffect } from 'vue';
import Button from './Button.vue';
import Tooltip from './Tooltip.vue';

const emit = defineEmits(['update:currentStep']);

const props = withDefaults(
  defineProps<{
    steps: { iconName: string; title?: string }[];
    currentStep?: number;
    title?: string;
    onNext?: () => void;
    disableNext?: boolean;
    tooltipNext?: string;
    onSubmit: () => void;
    tooltipSubmit?: string;
    showStepIndices?: boolean;
    initialStepIndex?: number;
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
  title,
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
} = toRefs(props);

const currentStepIndex = ref(initialStepIndex.value);
const maxReachedStep = ref(0);
watch(currentStep, newCurrentStep => (currentStepIndex.value = newCurrentStep));
watch(currentStepIndex, newcurrentStepIndex => emit('update:currentStep', newcurrentStepIndex));
watchEffect(() => {
  maxReachedStep.value = Math.max(maxReachedStep.value, currentStepIndex.value);
});
function getIconColor(stepIndex: number, offset = 0) {
  if (getIconColorFunction?.value) {
    getIconColorFunction.value(stepIndex, offset);
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
