/**
 * Focuses the given input element if it exists.
 *
 * @param {Ref<HTMLElement|null>} inputRef - Vue ref pointing to an input or textarea element.
 */
export const focusInput = (inputRef) => {
  if (inputRef?.value instanceof HTMLElement) {
    inputRef.value.focus();
  }
};
