import {Logger} from "./logger";
import {browser_isSafari, tempPrintDivId} from "../constants";


export class PrintHtmlHelper {
  private constructor() {}

  /**
   * this uses the hidden @see tempPrintDivId (id) div and places the inner html inside
   * then it hides the site content div because else firefox will display he site twice in the print preview
   * after printing the site is displayed again and the @see tempPrintDivId (id) div inner html is cleared
   * and it gets hidden again
   * @param printInnerHtml the html content to print
   * @param onContentInserted can be used to e.g. do syntax highlighting when printing code or set font size for
   *  @see tempPrintDivId manually
   * @param onFinishedPrinting tempPrintDivId is cleared automatically for you
   */
  static printContent(printInnerHtml: string, onContentInserted?: () => void, onFinishedPrinting?: () => void): void {



    const tempPrintDiv = document.getElementById(tempPrintDivId)

    if (!tempPrintDiv) {
      Logger.log('could not find temp print div')
      return
    }

    tempPrintDiv.innerHTML = printInnerHtml

    if (onContentInserted) onContentInserted()


    //or use window focus event like in https://github.com/ajaxorg/ace/issues/1480#issuecomment-20201314 ??
    if (browser_isSafari()) {

      //https://www.tjvantoll.com/2012/06/15/detecting-print-requests-with-javascript/
      if (window.matchMedia) {
        const mediaQueryList = window.matchMedia('print')
        const handler = (mql:any) => {
          if (mql.matches) {
            // beforePrint();
          } else {
            tempPrintDiv.innerHTML = ''
            document.body.classList.remove('js-printing')
            mediaQueryList.removeListener(handler)

            if (onFinishedPrinting) onFinishedPrinting()
          }
        }
        mediaQueryList.addListener(handler)
      } else {
        Logger.log('browser (safari) does not support printing (window.matchMedia)')
      }

    }
    else {
      window.onafterprint = ev => {
        tempPrintDiv.innerHTML = ''
        document.body.classList.remove('js-printing')
        window.onafterprint = null
        if (onFinishedPrinting) onFinishedPrinting()
      }
    }

    //we need to hide the site (even if the temp div stretches the whole site) because
    //of ff we would get 2 pages??
    document.body.classList.add('js-printing')

    //some browsers don't block the js here so we need listeners
    window.print()

  }

  static async printContentAsync(printInnerHtml: string, onContentInserted?: () => Promise<void>, onFinishedPrinting?: () => void): Promise<void> {


    const tempPrintDiv = document.getElementById(tempPrintDivId)

    if (!tempPrintDiv) {
      Logger.log('could not find temp print div')
      return
    }

    tempPrintDiv.innerHTML = printInnerHtml

    if (onContentInserted) {
      await onContentInserted()
    }

    //or use window focus event like in https://github.com/ajaxorg/ace/issues/1480#issuecomment-20201314 ??
    if (browser_isSafari()) {

      //https://www.tjvantoll.com/2012/06/15/detecting-print-requests-with-javascript/
      if (window.matchMedia) {
        const mediaQueryList = window.matchMedia('print')
        const handler = (mql:any) => {
          if (mql.matches) {
            // beforePrint();
          } else {
            tempPrintDiv.innerHTML = ''
            document.body.classList.remove('js-printing')
            mediaQueryList.removeListener(handler)

            if (onFinishedPrinting) onFinishedPrinting()
          }
        }
        mediaQueryList.addListener(handler)
      } else {
        Logger.log('browser (safari) does not support printing (window.matchMedia)')
      }

    }
    else {
      window.onafterprint = ev => {
        tempPrintDiv.innerHTML = ''
        document.body.classList.remove('js-printing')
        window.onafterprint = null
        if (onFinishedPrinting) onFinishedPrinting()
      }
    }

    //we need to hide the site (even if the temp div stretches the whole site) because
    //of ff we would get 2 pages??
    document.body.classList.add('js-printing')

    //some browsers don't block the js here so we need listeners
    window.print()

  }
}
