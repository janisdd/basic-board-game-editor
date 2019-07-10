import * as React from "react";
import markdown, {injectFontAwesomeIconsIfNecessary} from '../../helpers/markdownHelper'
import {fontAwesomeMatchRegex} from "../../constants";
import {parseAllFieldAbsolutePositions, parseFieldAbsolutePosition} from "../../helpers/worldTilesHelper";
import {WorldUnitAsImgBlobStorage} from "../../externalStorage/WorldUnitAsImgBlobStorage";

export interface MyProps {
  /**
   * id used for printing
   */
  readonly printId: string

  readonly markdown: string

  readonly fontSizeInPx: number
}


export default class markdownRenderer extends React.Component<MyProps, any> {
  render() {


    let markdownWithFontAwesomeIcons = injectFontAwesomeIconsIfNecessary(this.props.markdown)

    const content = markdown.render(markdownWithFontAwesomeIcons)

    return (
      <div id={this.props.printId} className="fh fw">
        <div className="markdown-body" dangerouslySetInnerHTML={{__html: content}} style={{fontSize: this.props.fontSizeInPx}}></div>
      </div>
    )
  }
}



