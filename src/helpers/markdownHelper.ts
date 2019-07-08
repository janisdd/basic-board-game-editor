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

export default mdRenderer
