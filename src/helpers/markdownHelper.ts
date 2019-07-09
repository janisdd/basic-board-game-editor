import * as markdownIt from 'markdown-it'

const mdRenderer = markdownIt({
  html: false,
  breaks: true,
  typographer: true,
  linkify: true,
})

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

export function generateMarkdownPhraseDefinitionList(phrases: string[]): string {
  return phrases.map(p => `- \`${p}\` - `).join('\n')
}
