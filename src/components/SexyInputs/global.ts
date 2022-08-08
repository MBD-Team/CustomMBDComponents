import { Ref, computed } from 'vue'

export function useCalcSideWidth(sideWidth: Ref<number>) {
    const inputWidth = computed(() => {
        let width = 100
        width -= sideWidth?.value || 0
        return width + '%'
    })
    const sideWidthComputed = computed(() => {
        let width = sideWidth?.value
        return width + '%'
    })
    return { inputWidth, sideWidthComputed }
}
