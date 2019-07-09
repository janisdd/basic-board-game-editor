import * as markdownIt from 'markdown-it'
import {fontAwesomeMatchRegex} from "../constants";
import {notExhaustiveThrow} from "../state/reducers/_notExhausiveHelper";


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
    let cssColorOrConstant = '#4fc08d'

    if (match) {
      const args = (match[1] as string).split(' ')

      let curr = 0
      if (args.length > 0) {

        if (args[curr] === 'info') {
          cssColorOrConstant = '#4fc08d'

        } else if (args[curr] === 'warning') {
          cssColorOrConstant = '#f66'

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
  .use(require('markdown-it-deflist'))


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

const oldCodeRule = mdRenderer.renderer.rules.code_inline


mdRenderer.renderer.rules.code_inline = (tokens, idx, options, env, self) => {

  // const token = tokens[idx]

  const codeTag = oldCodeRule(tokens, idx, options, env, self)

  //handler is globally defined in index
  const withCopyBtn = `<div class="markdown-inline-code-tag-wrapper">
  ${codeTag}
</div>`

  return withCopyBtn
}


export default mdRenderer

export function generateMarkdownPhraseDefinitionList(phrases: string[], listType: CreateFieldTextExplanationListType): string {

  switch (listType) {
    case CreateFieldTextExplanationListType.list: {

      return phrases.map(p => `- \`${p}\` - `).join('\n')
    }

    case CreateFieldTextExplanationListType.definitionList: {

      return phrases.map(p => `${p}\n: todo\n`).join('\n')
    }
    default:
      notExhaustiveThrow(listType)

  }
}

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


