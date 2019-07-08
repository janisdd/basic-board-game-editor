import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import markdown from '../../helpers/markdownHelper'

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

    const content = markdown.render(this.props.markdown)

    return (
      <div id={this.props.printId} className="fh fw">
        <div className="markdown-body" dangerouslySetInnerHTML={{__html: content}} style={{fontSize: this.props.fontSizeInPx}}></div>
      </div>
    )
  }
}



