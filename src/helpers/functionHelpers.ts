import {GuidAble} from "../types/drawing";


export interface IdAble {
  readonly id: number
}

/**
 *
 * pattern for
 *   fieldShapes: state.tile.fieldShapes.map(p =>
 *    p.id !== state.selectedFieldShapeId
 *    ? p
 *    : {
 *       ...p,
 *       text: action.text
 *     })
 *
 * @param {ReadonlyArray<T extends IdAble>} array
 * @param {number} searchId
 * @param {(el: T) => T} modifier
 * @param {(el: T) => T} modifyOthers modify others
 * @returns {ReadonlyArray<T extends IdAble>}
 */
export function replaceProperty<T extends IdAble>(array: ReadonlyArray<T>, searchId: number, modifier: (el: T) => T, modifyOthers?: (el: T) => T): ReadonlyArray<T> {
  return array.map(p =>
    p.id !== searchId
      ? (modifyOthers ? modifyOthers(p) : p)
      : //{...p} //see https://github.com/Microsoft/TypeScript/issues/10727
      modifier(p)
  )
}

export function replacePropertyByGuid<T extends GuidAble>(array: ReadonlyArray<T>, searchId: string, modifier: (el: T) => T, modifyOthers?: (el: T) => T): ReadonlyArray<T> {
  return array.map(p =>
    p.guid !== searchId
      ? (modifyOthers ? modifyOthers(p) : p)
      : //{...p} //see https://github.com/Microsoft/TypeScript/issues/10727
      modifier(p)
  )
}

export const debounce = (func: any, wait: any, immediate: any) => {
  var timeout: any;
  return () => {
    const context = this
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context);
  };
};


export function delay(timeInMs: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, timeInMs)
  })
}
