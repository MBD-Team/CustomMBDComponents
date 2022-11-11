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

export function getErrorMessage(error: { [key: string]: string | string[] } | string | undefined, fieldName: string) {
    if (!error) return ''
    if (typeof error === 'string') return error;
    const fieldError = error[fieldName];
    if (typeof fieldError === 'string') return fieldError;
    return fieldError?.join('\n') || '';
}