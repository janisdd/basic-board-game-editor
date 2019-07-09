import * as React from "react";
import markdown from '../../helpers/markdownHelper'
import {fontAwesomeMatchRegex} from "../../constants";

export interface MyProps {
  /**
   * id used for printing
   */
  readonly printId: string

  readonly markdown: string

  readonly fontSizeInPx: number
}


export default class markdownRenderer extends React.Component<MyProps, any> {
  render(): JSX.Element {


    let markdownWithFontAwesomeIcons = this.props.markdown
    const matchResults = markdownWithFontAwesomeIcons.match(fontAwesomeMatchRegex)

    if (matchResults) {

      for (let i = 0; i < matchResults.length; i++) {
        const matchResult = matchResults[i]
        const intVal = parseInt(matchResult.substr(1), 16)
        markdownWithFontAwesomeIcons = markdownWithFontAwesomeIcons.replace(matchResult, String.fromCharCode(intVal))
      }
    }

    const content = markdown.render(markdownWithFontAwesomeIcons)

    return (
      <div id={this.props.printId} className="fh fw">
        <div className="markdown-body" dangerouslySetInnerHTML={{__html: content}} style={{fontSize: this.props.fontSizeInPx}}></div>
      </div>
    )
  }
}



