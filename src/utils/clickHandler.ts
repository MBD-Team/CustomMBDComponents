import { Ref } from 'vue';

let singleClickTimer: any;
export function handleClick(singleClick: Ref<boolean>, singleClickFunction?: () => void, doubleClickFunction?: () => void, delay: number = 1000) {
  singleClick.value = !singleClick.value;
  if (!singleClickTimer) {
    singleClickTimer = setTimeout(() => {
      if (singleClickFunction) singleClickFunction();
      singleClick.value = false;
      singleClickTimer = null;
    }, delay);
  } else {
    if (doubleClickFunction) doubleClickFunction();
    clearTimeout(singleClickTimer);
    singleClickTimer = null;
  }
}
