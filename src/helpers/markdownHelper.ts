import * as markdownIt from 'markdown-it'
import {fontAwesomeMatchRegex, markdownBoxInfoColor, markdownBoxInfoWarning} from "../constants";
import {notExhaustiveThrow} from "../state/reducers/_notExhausiveHelper";
import {escapeHtml} from "./stringHelper";
import {ImgStorage} from "../externalStorage/imgStorage";


export enum CreateFieldTextExplanationListType {
  list = 'list',
  definitionList = 'definitionList'
}


/**
 * @example
 *
 * ::: new-page
 * :::
 *
 * see https://github.com/markdown-it/markdown-it-container
 * @param tokens
 * @param idx
 */
const newPageRenderer = function (tokens: any[], idx: number): string {

  if (tokens[idx].nesting === 1) { //opening tab
    return `<div class="page-break">`
  }


  return `</div>`
}


/**
 * @example
 *
 * ::: box [info/warning/css-color] [font-awesome unicode or any other string]
 * :::
 *
 * [...] is optional
 *
 * @param tokens
 * @param idx
 */
const customContainer = function (tokens: any[], idx: number): string {

  const match = tokens[idx].info.trim().match(/^box\s*(.*)$/)

  if (tokens[idx].nesting === 1) { //opening tab

    let fontAwesomeIcon = ''
    let cssColorOrConstant = markdownBoxInfoColor

    if (match) {
      const args = (match[1] as string).split(' ')

      let curr = 0
      if (args.length > 0) {

        if (args[curr] === 'info') {
          cssColorOrConstant = markdownBoxInfoColor

        } else if (args[curr] === 'warning') {
          cssColorOrConstant = markdownBoxInfoWarning

        } else {
          //default
          if (args[curr].trim()) {
            cssColorOrConstant = args[curr]
          }
        }

        cssColorOrConstant = mdRenderer.utils.escapeHtml(cssColorOrConstant.trim())
        curr++
      }

      if (args.length > 1) {
        fontAwesomeIcon = args[curr].trim()
        fontAwesomeIcon = mdRenderer.utils.escapeHtml(injectFontAwesomeIconsIfNecessary(fontAwesomeIcon))
      }
    }


    return `<div class="box${fontAwesomeIcon.length === 0 ? ' no-indicator' : ''}" style="border-left-color: ${cssColorOrConstant}; --box-indicator-color: ${cssColorOrConstant}"  data-content="${fontAwesomeIcon}">`
  }


  return `</div>`

}


export const absoluteFieldPositionInjectionAttribute = `data-url`
export const singleFieldRendererClass = 'single-field-renderer'
/**
 * @example
 *
 * ::: field (tile guid).(field id)
 * :::
 *
 * (...) is mandatory
 *
 * @param tokens
 * @param idx
 *
 * regex is a modified version of
 * @see absoluteFieldIdentifierSingle
 */
const singleFieldRenderer = function (tokens: any[], idx: number): string {


  const match = tokens[idx].info.trim().match(/^field ([\w]{8}-[\w]{4}-4[\w]{3}-[\w]{4}-[\w]{12}.[0-9]*)$/)

  if (tokens[idx].nesting === 1) { //opening tab

    if (match) {

      return `<p><img class="${singleFieldRendererClass}" alt="img of field ${escapeHtml(match[1])}" ${absoluteFieldPositionInjectionAttribute}="${escapeHtml(match[1])}" src="#" />`
    }

    return `<p><img alt="not found" src="#" />`
  }


  return `</p>`
}

export const tileGuidInjectionAttribute = `data-url`
export const singleTileRendererClass = 'single-tile-renderer'
/**
 * @example
 *
 * ::: tile (tile guid)
 * :::
 *
 * (...) is mandatory
 *
 * @param tokens
 * @param idx
 *
 * regex is a modified version of
 * @see absoluteFieldIdentifierSingle
 */
const singleTileRenderer = function (tokens: any[], idx: number): string {


  const match = tokens[idx].info.trim().match(/^tile ([\w]{8}-[\w]{4}-4[\w]{3}-[\w]{4}-[\w]{12})$/)

  if (tokens[idx].nesting === 1) { //opening tab

    if (match) {

      return `<p><img class="${singleTileRendererClass}" alt="img of tile ${escapeHtml(match[1])}" ${tileGuidInjectionAttribute}="${escapeHtml(match[1])}" src="#" />`
    }

    return `<p><img alt="not found" src="#" />`
  }


  return `</p>`
}

/**
 * @example
 *
 * ::: image (img guid)
 * :::
 *
 * (...) is mandatory
 *
 * @param tokens
 * @param idx
 *
 */
const singleImgAssetRenderer = function (tokens: any[], idx: number): string {

  const match = tokens[idx].info.trim().match(/^image ([\w]{32})$/)

  if (tokens[idx].nesting === 1) { //opening tab

    if (match) {

      const asset = ImgStorage.getImgFromGuid(match[1])

      return `<p><img class="${singleTileRendererClass}" alt="img with guid ${escapeHtml(match[1])}" src="${escapeHtml(asset.base64)}" />`
    }

    return `<p><img alt="not found" src="#" />`
  }

  return `</p>`
}

export function getImageMarkdownBlock(guid: string): string {
  return `::: image ${guid}
:::`

}

const mdRenderer = markdownIt({
  html: false,
  breaks: true,
  typographer: true,
  linkify: true,
})
  .use(require('markdown-it-container'), 'new-page', { //see https://github.com/markdown-it/markdown-it-container
    render: newPageRenderer,
    validate: function (params: string): boolean {
      const test = params.trim().match(/^new-page$/)
      return !!test
    }
  })
  .use(require('markdown-it-container'), 'box', { //see https://github.com/markdown-it/markdown-it-container
    render: customContainer,
    validate: function (params: string): boolean {
      const test = params.trim().match(/^box\s*(.*)$/)
      return !!test
    }
  })
  .use(require('markdown-it-container'), 'field', { //see https://github.com/markdown-it/markdown-it-container
    render: singleFieldRenderer,
    validate: function (params: string): boolean {
      const test = params.trim().match(/^field\s*(.*)$/)
      return !!test
    }
  })
  .use(require('markdown-it-container'), 'tile', { //see https://github.com/markdown-it/markdown-it-container
    render: singleTileRenderer,
    validate: function (params: string): boolean {
      const test = params.trim().match(/^tile\s*(.*)$/)
      return !!test
    }
  })
  .use(require('markdown-it-container'), 'image', { //see https://github.com/markdown-it/markdown-it-container
    render: singleImgAssetRenderer,
    validate: function (params: string): boolean {
      const test = params.trim().match(/^image\s*(.*)$/)
      return !!test
    }
  })
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-footnote'))

mdRenderer.renderer.rules.footnote_anchor = () => {
  return ''
}


//https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md
const oldLinkRule = function (tokens: any, idx: any, options: any, env: any, self: any): any {
  return self.renderToken(tokens, idx, options);
}

mdRenderer.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  tokens[idx].attrPush(['target', '_blank'])
  tokens[idx].attrPush(['rel', 'noopener', 'noreferrer'])
  return oldLinkRule(tokens, idx, options, env, self)
}

const oldCodeFenceRule = mdRenderer.renderer.rules.fence

mdRenderer.renderer.rules.fence = (tokens, idx, options, env, self) => {

  // const token = tokens[idx]

  const preTag = oldCodeFenceRule(tokens, idx, options, env, self)

  //handler is globally defined in index
  const withCopyBtn = `<div class="markdown-fenced-code-block-wrapper">
  ${preTag}
</div>`

  return withCopyBtn
}

export default mdRenderer


/**
 * replaces \fxxx font awesome unicode with the proper unicode \ufxxx
 * so that html can interpret it as icon
 * @param text
 */
export function injectFontAwesomeIconsIfNecessary(text: string): string {

  const matchResults = text.match(fontAwesomeMatchRegex)

  if (matchResults) {

    for (let i = 0; i < matchResults.length; i++) {
      const matchResult = matchResults[i]
      const intVal = parseInt(matchResult.substr(1), 16)
      text = text.replace(matchResult, String.fromCharCode(intVal))
    }
  }

  return text
}


