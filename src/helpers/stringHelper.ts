

export class StringHelper {
  private constructor() {}

  //from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  public static padLeft(str: string, padString: string, targetLength: number): string {

    targetLength = targetLength>>0; //truncate if number or convert non-number to 0;

    padString = String((typeof padString !== 'undefined' ? padString : ' '));
    if (str.length >= targetLength) {
      return str
    }


    targetLength = targetLength-padString.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
    }

    return padString.slice(0,targetLength) +str;

  }
}

//from marked
export function escapeHtml(html: string, encode?: boolean): string {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
