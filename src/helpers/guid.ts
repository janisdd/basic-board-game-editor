/**
 * from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * @returns {string}
 */
export function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const guidRegex = /[\w]{8}-[\w]{4}-4[\w]{3}-[\w]{4}-[\w]{12}/i

/**
 * checks if the given text could be a guid
 * @param text
 */
export function isGuid(text: string): boolean {
  return text.match(guidRegex) !== null
}