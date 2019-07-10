

//http://blog.dmbcllc.com/cross-browser-javascript-copy-and-paste/
export function copyToClipboard(text: string): void {
  // standard way of copying
  const textArea = document.createElement('textarea')
  textArea.setAttribute
  ('style','width:1px;border:0;opacity:0;')
  document.body.appendChild(textArea)
  textArea.value = text
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
}