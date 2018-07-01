import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state/index";
import {Button, Icon, Input, Label} from "semantic-ui-react";
import {
  set_world_isWorldSettingsModalDisplayed
} from "../../../state/reducers/world/actions";
import {globalMinimalZoom, globalZoomStep} from "../../../constants";
import {SyntheticEvent} from "react";
import {
  set_world_stageOffset, set_world_stageOffsetScaleCorrection,
  set_world_stageScale
} from "../../../state/reducers/world/worldSettings/actions";

import TooTip from '../../helpers/TooTip'
import {getI18n} from "../../../../i18n/i18nRoot";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    isTileEditorDisplayed: rootState.worldState.isTileEditorDisplayed,
    worldSettings: rootState.worldSettingsState,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here
  set_world_isWorldSettingsModalDisplayed,
  set_world_stageScale,
  set_world_stageOffset,
  set_world_stageOffsetScaleCorrection,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class worldEditorSettingsArea extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div className="settings-area">

        <Input labelPosition='right' placeholder='0' size="small" style={{marginRight: '0'}}>
          <Label basic>
            x
          </Label>
          <input style={{width: '80px'}}
                 type="number"
                 value={this.props.worldSettings.stageOffsetX + this.props.worldSettings.stageOffsetXScaleCorrection}

                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                   const val = parseInt(e.currentTarget.value)

                   this.props.set_world_stageOffset(val - this.props.worldSettings.stageOffsetXScaleCorrection,
                     this.props.worldSettings.stageOffsetY)
                 }}
          />
          <Button icon style={{margin: '0'}}
                  onClick={() => {
                    this.props.set_world_stageOffset(0, 0)
                  }}
          >
            <Icon name="undo"/>
          </Button>
        </Input>

        <Input labelPosition='right' placeholder='0' size="small">
          <input style={{width: '80px', borderLeft: '0', borderTopLeftRadius: '0', borderBottomLeftRadius: '0'}}
                 type="number"
                 value={this.props.worldSettings.stageOffsetY + this.props.worldSettings.stageOffsetYScaleCorrection}

                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {

                   const val = parseInt(e.currentTarget.value)
                   this.props.set_world_stageOffset(this.props.worldSettings.stageOffsetX,
                     val - this.props.worldSettings.stageOffsetYScaleCorrection
                   )
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
                 type="number" value={this.props.worldSettings.stageScaleX}
                 step={globalZoomStep.toString()} max="100" min={globalMinimalZoom.toString()}
                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                   const val = parseFloat(e.currentTarget.value)

                   const clampVal = Math.max(val, globalMinimalZoom)
                   this.props.set_world_stageScale(clampVal, clampVal)
                 }}
          />
          <Button icon
                  onClick={() => {
                    this.props.set_world_stageScale(1, 1)
                    this.props.set_world_stageOffsetScaleCorrection(0, 0)
                  }}
          >
            <Icon name="undo"/>
          </Button>
        </Input>


        <TooTip
          message={getI18n(this.props.langId, "World settings")}
        >
          <Button icon onClick={() => {

            this.props.set_world_isWorldSettingsModalDisplayed(true)

          }}>
            <Icon name="setting"/>
          </Button>
        </TooTip>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(worldEditorSettingsArea)