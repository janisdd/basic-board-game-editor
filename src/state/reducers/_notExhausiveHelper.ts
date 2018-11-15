/**
 * use this in the default block in a switch statement in a reducer
 *
 *
 * see https://basarat.gitbooks.io/typescript/docs/types/never.html
 * and https://stackoverflow.com/questions/39419170/how-do-i-check-that-a-switch-block-is-exhaustive-in-typescript
 * @param {never} x pass the switch variable
 * @returns {any}
 */
export function notExhaustive(x: never): any {
  // throw new Error("Didn't expect to get here");
}

export function notExhaustiveThrow(x: never): any {
  throw new Error("Didn't expect to get here... some case not matched");
}