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
  set_gie_isMarkdownHelpModalDisplayed,
  set_gie_markdown,
  set_gie_verticalGripperPositionOffsetInPx
} from "../../state/reducers/gameInstructionsEditor/actions";
import IconToolTip from "../helpers/IconToolTip";
import {getI18n} from "../../../i18n/i18nRoot";
import ActionResultCopyModal from './actionResultCopyModal'
import GameInstructionsEditorSettingsModal from './gameInstructionsEditorSettingsModal'
import IEditSession = AceAjax.IEditSession;
import MarkdownHelpModal from './markdownHelpModal'
import _ = require("lodash");
import {injectFieldImgsIntoMarkdown, injectTileImgsIntoMarkdown} from "../../helpers/gameInstructionsHelper";

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    markdown: rootState.gameInstructionsEditorState.markdown,
    previewFontSize: rootState.gameInstructionsEditorState.previewFontSize,
    editorFontSize: rootState.gameInstructionsEditorState.editorFontSize,
    verticalGripperPositionOffsetInPx: rootState.gameInstructionsEditorState.verticalGripperPositionOffsetInPx,

    worldSettings: rootState.worldSettingsState,
    allPossibleTiles: rootState.tileLibraryState.possibleTiles,
    fieldSymbols: rootState.fieldSymbolState.present,
    imgSymbols: rootState.imgSymbolState.present,
    lineSymbols: rootState.lineSymbolState.present,

    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_gie_markdown,
  set_gie_verticalGripperPositionOffsetInPx,
  set_gie_isMarkdownHelpModalDisplayed,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


const gripperWidthInPx = 5
export const gameInstructionsEditorId = 'gameInstructionsEditorId'

export const gameInstructionsEditorPrintId = 'gameInstructionsEditorPrintId'

export let gameInstructionsEditorAceSession: IEditSession | null = null


class GameInstructionsEditor extends React.Component<Props, any> {

  gripperDownPoint: { x: number, y: number } | null = null
  gripperDownDeltaX = 0


  onMouseMoveThrottled = _.throttle((newX: number) => {
    if (!this.gripperDownPoint) return

    const deltaX = newX - this.gripperDownPoint.x
    this.props.set_gie_verticalGripperPositionOffsetInPx(this.gripperDownDeltaX + deltaX)
  }, 100)


  async onMarkdownChanged(val: string, rerenderFieldAndTileImgs: boolean) {
    this.props.set_gie_markdown(val)


    if (!rerenderFieldAndTileImgs) return

    await injectFieldImgsIntoMarkdown(`#${gameInstructionsEditorPrintId}`,
      this.props.markdown,
      this.props.allPossibleTiles,
      this.props.fieldSymbols,
      this.props.worldSettings,
      document
    )

    await injectTileImgsIntoMarkdown(`#${gameInstructionsEditorPrintId}`,
      this.props.markdown,
      this.props.allPossibleTiles,
      this.props.fieldSymbols,
      this.props.imgSymbols,
      this.props.lineSymbols,
      this.props.worldSettings,
      document
    )

  }

  render(): JSX.Element {

    if (!gameInstructionsEditorAceSession) {
      gameInstructionsEditorAceSession = ace.createEditSession(this.props.markdown, `ace/mode/markdown` as any)
    }

    //normally we need to take into account the gripper size but margin is handling this
    const leftSideOffset = `calc(50% - ${this.props.verticalGripperPositionOffsetInPx}px)`
    const gripperOffset = `calc(50% - 2px + ${this.props.verticalGripperPositionOffsetInPx}px)`
    const rightSideOffset = `calc(50% + ${this.props.verticalGripperPositionOffsetInPx}px)`

    return (
      <div className="game-instructions-site flexed"
           onMouseUp={() => {
             this.gripperDownPoint = null
           }}
        // onMouseLeave={() => {
        //   this.gripperDownPoint = null
        // }}
           onMouseMove={(e) => this.onMouseMoveThrottled(e.clientX)}
      >

        <ActionResultCopyModal/>

        <GameInstructionsEditorSettingsModal/>

        <MarkdownHelpModal/>

        <div className="fh left-side panel" style={{right: leftSideOffset}}>


          <div className="panel-header">

            <div>
              <Icon className="mar-left-half" name="write"/>
              <span>
                {getI18n(this.props.langId, "Editor")}
              </span>

              <IconToolTip
                message={getI18n(this.props.langId, "The editor uses markdown syntax. The editor content is part of the world and is also exported when you export the world. Click to get more information about markdown and the supported syntax.")}
                onClick={() => {
                  this.props.set_gie_isMarkdownHelpModalDisplayed(true)
                }}
              />

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
                             this.onMarkdownChanged(val, true)
                           }}
                           onDestroyed={(val) => {
                             this.onMarkdownChanged(val, false)
                           }}
                           throttleTimeInMs={500}
                           fontSize={this.props.editorFontSize}
                           editSession={gameInstructionsEditorAceSession}
            />

          </div>

        </div>

        <div className="vertical-gripper" style={{width: gripperWidthInPx, left: gripperOffset}}
             onMouseDown={(e) => {
               this.gripperDownPoint = {
                 x: e.clientX,
                 y: e.clientY
               }
               this.gripperDownDeltaX = this.props.verticalGripperPositionOffsetInPx
             }}
        ></div>

        <div className="fh right-side panel" style={{left: rightSideOffset}}>

          <div className="panel-header">

            <div>
              <Icon className="mar-left-half" name="align left"/>
              <span>
                {getI18n(this.props.langId, "Preview")}
              </span>

            </div>

            <PreviewActionsBar printDivId={gameInstructionsEditorPrintId}
            />
          </div>

          <div className="panel-content">

            <MarkdownRenderer
              printId={gameInstructionsEditorPrintId}
              markdown={this.props.markdown}
              fontSizeInPx={this.props.previewFontSize}
            />

          </div>

        </div>


      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameInstructionsEditor)
