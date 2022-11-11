let singleClickTimer: any;
export function handleClick(
  singleClickFunction?: () => void,
  doubleClickFunction?: () => void,
  singleClick: { singleClick: boolean } = { singleClick: false },
  delay: number = 200
) {
  singleClick.singleClick = !singleClick.singleClick;
  if (!singleClickTimer) {
    singleClickTimer = setTimeout(() => {
      if (singleClickFunction) singleClickFunction();
      singleClick.singleClick = false;
      singleClickTimer = null;
    }, delay);
  } else {
    if (doubleClickFunction) doubleClickFunction();
    clearTimeout(singleClickTimer);
    singleClickTimer = null;
  }
}
