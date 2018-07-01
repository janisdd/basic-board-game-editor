import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state/index";
import {Button, Icon, Input, Label} from "semantic-ui-react";
import {
  set_editor_isTileEditorSettingsModalDisplayed,
  set_editor_stageOffsetScaleCorrection,
  setEditor_showGrid,
  setEditor_stageOffset,
  setEditor_stageScale
} from "../../../state/reducers/tileEditor/actions";
import {globalMinimalZoom, globalZoomStep} from "../../../constants";
import {SyntheticEvent} from "react";
import {getI18n} from "../../../../i18n/i18nRoot";
import ToolTip from '../../helpers/TooTip'

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    editorState: rootState.tileEditorState,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here
  set_editor_isTileEditorSettingsModalDisplayed,
  set_editor_stageOffsetScaleCorrection,
  setEditor_stageScale,
  setEditor_stageOffset,
  setEditor_showGrid,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class tileEditorSettingsArea extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div className="settings-area">

        <ToolTip
          message={getI18n(this.props.langId, "Show grid")}
        >
          <div
            className={[this.props.editorState.showGrid ? 'toggled-colored clickable' : 'clickable', 'vertical-centered'].join(' ')}
            onClick={() => {
              this.props.setEditor_showGrid(!this.props.editorState.showGrid)
            }}
          >
            <Icon style={{fontSize: '1.5em'}}  name="th" />
          </div>
        </ToolTip>

        <Input labelPosition='right' placeholder='0' size="small" style={{marginRight: '0'}}>
          <Label basic>
            x
          </Label>
          <input style={{width: '80px'}}
                 type="number"
                 value={this.props.editorState.stageOffsetX + this.props.editorState.stageOffsetXScaleCorrection}
                 step={this.props.editorState.snapToGrid ? this.props.editorState.gridSizeInPx : 1}
                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {

                   const val = parseInt(e.currentTarget.value)
                   this.props.setEditor_stageOffset(val - this.props.editorState.stageOffsetXScaleCorrection,
                     this.props.editorState.stageOffsetY)
                 }}
          />
          <Button icon style={{margin: '0'}}
                  onClick={() => {
                    this.props.setEditor_stageOffset(0, 0)
                    //this.props.set_editor_stageOffsetScaleCorrection(0, 0)
                  }}
          >
            <Icon name="undo"/>
          </Button>
        </Input>

        <Input labelPosition='right' placeholder='0' size="small">
          <input style={{width: '80px', borderLeft: '0', borderTopLeftRadius: '0', borderBottomLeftRadius: '0'}}
                 step={this.props.editorState.snapToGrid ? this.props.editorState.gridSizeInPx : 1}
                 type="number"
                 value={this.props.editorState.stageOffsetY + this.props.editorState.stageOffsetYScaleCorrection}
                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {

                   const val = parseInt(e.currentTarget.value)
                   this.props.setEditor_stageOffset(this.props.editorState.stageOffsetX,
                     val - this.props.editorState.stageOffsetYScaleCorrection)
                 }}
          />
          <Label basic>
            y
          </Label>
        </Input>


        <Input labelPosition='right' placeholder='1' size="small">
          <Label basic>
            {
              getI18n(this.props.langId, "Zoom")
            }
          </Label>
          <input style={{width: '75px'}}
                 type="number" value={this.props.editorState.stageScaleX}
                 step={globalZoomStep.toString()} max="100" min={globalMinimalZoom.toString()}
                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                   const val = parseFloat(e.currentTarget.value)

                   const clampVal = Math.max(val, globalMinimalZoom)
                   this.props.setEditor_stageScale(clampVal, clampVal)
                 }}
          />
          <Button icon
                  onClick={() => {
                    this.props.setEditor_stageScale(1, 1)
                    this.props.set_editor_stageOffsetScaleCorrection(0, 0)
                  }}
          >
            <Icon name="undo"/>
          </Button>
        </Input>

        <Button icon onClick={() => {
          this.props.set_editor_isTileEditorSettingsModalDisplayed(true)
        }}>
          <Icon name="setting"/>
        </Button>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(tileEditorSettingsArea)