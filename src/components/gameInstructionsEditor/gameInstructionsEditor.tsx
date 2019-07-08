import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import EditorActionsBar from './editorActionsBar'
import {Icon} from "semantic-ui-react";
import EditorWrapper from "../helpers/editorWrapper";
import PreviewActionsBar from './previewActionsBar'
import MarkdownRenderer from './markdownRenderer'
import {
  set_gie_markdown,
  set_gie_verticalGripperPositionInPercentage
} from "../../state/reducers/gameInstructionsEditor/actions";

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    markdown: rootState.gameInstructionsEditorState.markdown,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_gie_markdown,
  set_gie_verticalGripperPositionInPercentage,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


const gripperWidthInPx = 3
const gameInstructionsEditorId = 'gameInstructionsEditorId'

const gameInstructionsEditorPrintId = 'gameInstructionsEditorPrintId'

class GameInstructionsEditor extends React.Component<Props, any> {
  render(): JSX.Element {


    const leftSideOffset = `calc(100% - (50% - ${gripperWidthInPx}px))`
    const gripperOffset = `calc(50% - ${gripperWidthInPx}px)`
    const rightSideOffset = `calc(50% - ${gripperWidthInPx}px)`

    return (
      <div className="game-instructions-site flexed">

        <div className="fh left-side panel" style={{right: leftSideOffset}}>


          <div className="panel-header">

            <div>
              <Icon className="mar-left-half" name="write"/>
              <span>
                Editor
              </span>

              <a className="mar-left" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">
                <Icon name="external alternate" />
                Markdown help
              </a>
            </div>

            <EditorActionsBar
            />
          </div>

          <div className="panel-content">

            <EditorWrapper id={gameInstructionsEditorId}
                           value={this.props.markdown}
                           height="100%"
                           readony={false}
                           mode="markdown"
                           onLostFocus={(val) => {
                             this.props.set_gie_markdown(val)
                           }}
                           onDestroyed={(val) => {
                             this.props.set_gie_markdown(val)
                           }}
                           throttleTimeInMs={500}
            />

          </div>

        </div>

        <div className="vertical-gripper" style={{width: gripperWidthInPx, left: gripperOffset}}></div>

        <div className="fh right-side panel" style={{left: rightSideOffset}}>

          <div className="panel-header">

            <div>
              <Icon className="mar-left-half" name="align left"/>
              <span>
                Preview
              </span>

            </div>

            <PreviewActionsBar/>
          </div>

          <div className="panel-content">

            <MarkdownRenderer
              printId={gameInstructionsEditorPrintId}
              markdown={this.props.markdown}
              fontSizeInPx={12}
            />

          </div>

        </div>


      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameInstructionsEditor)
