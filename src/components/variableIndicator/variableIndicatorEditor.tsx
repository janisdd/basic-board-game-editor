import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Button, Checkbox, Form, Icon} from "semantic-ui-react";
import {
  set_varIndicator_outerCircleDiameterInPxAction,
  set_varIndicator_innerCircleDiameterInPxAction,
  set_varIndicator_numOfFieldsAction,
  set_varIndicator_innerText,
  varIndicator_reset,
  set_varIndicator_fontSizeInPxAction,
  set_varIndicator_fontNameAction,
  set_varIndicator_isBoolVarAction,
  set_varIndicator_innerTextFontSizeInPxAction
} from "../../state/reducers/variableIndicator/actions";
import {SyntheticEvent} from "react";
import {CheckboxData, ZIndexCache} from "../../types/ui";
import {VariableIndicatorDrawer} from "../../../graphics/variableIndicatorDrawer";
import * as graphics from '../../../graphics/graphicsCore'
import {PrintHelper} from "../../helpers/printHelper";
import {printVariableIndicatorBorderColor} from "../../constants";
import {getI18n} from "../../../i18n/i18nRoot";
import TooTip from '../helpers/TooTip'

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    state: rootState.variableIndicatorState,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_varIndicator_outerCircleDiameterInPxAction,
  set_varIndicator_numOfFieldsAction,
  set_varIndicator_innerCircleDiameterInPxAction,
  set_varIndicator_innerText,
  varIndicator_reset,

  set_varIndicator_isBoolVarAction,
  set_varIndicator_fontSizeInPxAction,
  set_varIndicator_fontNameAction,
  set_varIndicator_innerTextFontSizeInPxAction,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class variableIndicatorEditor extends React.Component<Props, any> {

  canvas: HTMLCanvasElement = null
  zIndexCache: ZIndexCache = {}
  renderStage: createjs.Stage = null

  componentDidMount() {
    this.renderStage = new createjs.Stage(this.canvas)
    this.zIndexCache = {}
    this.updateCanvasModel()
  }

  componentDidUpdate() {
    this.updateCanvasModel()
  }

  updateCanvasModel() {
    //clear all old
    this.renderStage.removeAllEventListeners()
    for (const item of this.renderStage.children) {
      item.removeAllEventListeners()
    }
    this.renderStage.clear()
    this.renderStage.removeAllChildren()

    this.renderStage.on('selectstart', () => {
      return false
    })
    createjs.Touch.enable(this.renderStage)


    const width = (this.renderStage.canvas as HTMLCanvasElement).width
    const height = (this.renderStage.canvas as HTMLCanvasElement).height

    graphics.drawGrid(this.renderStage, width, height, 10,
      1,
      '#dddddd', false, 0, 0)

    VariableIndicatorDrawer.drawVariableIndicator(this.renderStage,
      width,
      height,
      this.props.state.outerCircleDiameterInPx,
      this.props.state.innerCircleDiameterInPx,
      this.props.state.numOfFields,
      this.props.state.innerText,
      this.props.state.isBoolVar,
      this.props.state.fontSizeInPx,
      this.props.state.fontName,
      this.props.state.innerTextFontSizeInPx
    )

    this.renderStage.update()
  }

  render(): JSX.Element {
    return (
      <div>

        <div className="flexed">

          <Button icon className="mar-right"
                  onClick={() => {
                    PrintHelper.printVariableIndicator(
                      this.props.state.outerCircleDiameterInPx,
                      this.props.state.outerCircleDiameterInPx,
                      this.props.state.outerCircleDiameterInPx,
                      this.props.state.innerCircleDiameterInPx,
                      this.props.state.numOfFields,
                      this.props.state.innerText,
                      printVariableIndicatorBorderColor,
                      this.props.state.isBoolVar,
                      this.props.state.fontSizeInPx,
                      this.props.state.fontName,
                      this.props.state.innerTextFontSizeInPx
                    )
                  }}
          >
            <Icon name="print"/>
          </Button>

          <TooTip
            message={getI18n(this.props.langId, "Reset to defaults")}
          >
            <Button icon
                    onClick={() => {
                      this.props.varIndicator_reset();
                    }}
            >
              <Icon name="refresh"/>
            </Button>
          </TooTip>
        </div>

        <div className="flexed">
          <Form as="div" className="mar-right">

            <Form.Field>
              <Form.Field>
                <Checkbox label={getI18n(this.props.langId, "Is bool variable")} checked={this.props.state.isBoolVar}
                          onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                            this.props.set_varIndicator_isBoolVarAction(data.checked)
                          }}
                />
              </Form.Field>
            </Form.Field>

            <Form.Field>
              <label>{getI18n(this.props.langId, "Outer circle diameter in px")}</label>
              <input type="number" placeholder='500' value={this.props.state.outerCircleDiameterInPx}
                     onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                       const val = parseInt(e.currentTarget.value)
                       this.props.set_varIndicator_outerCircleDiameterInPxAction(val)
                     }}
              />
            </Form.Field>

            <Form.Field>
              <label>{getI18n(this.props.langId, "Inner circle diameter in px")}</label>
              <input type="number" placeholder='100' value={this.props.state.innerCircleDiameterInPx}
                     onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                       const val = parseInt(e.currentTarget.value)
                       this.props.set_varIndicator_innerCircleDiameterInPxAction(val)
                     }}
              />
            </Form.Field>

            <Form.Field>
              <label>{getI18n(this.props.langId, "Amount of fields")}</label>
              <input type="number" placeholder='32' value={this.props.state.numOfFields}
                     onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                       const val = parseInt(e.currentTarget.value)
                       this.props.set_varIndicator_numOfFieldsAction(val)
                     }}
              />
            </Form.Field>

            <Form.Field>
              <label>{getI18n(this.props.langId, "Inner text")}</label>
              <textarea
                placeholder='text'
                rows={3}
                value={this.props.state.innerText}
                onChange={(e: SyntheticEvent<HTMLTextAreaElement>) => {
                  this.props.set_varIndicator_innerText(e.currentTarget.value)
                }}
              ></textarea>

            </Form.Field>

            <Form.Field>
              <label>{getI18n(this.props.langId, "Font size in px")}</label>
              <input type="number"
                     value={this.props.state.fontSizeInPx}

                     onChange={(e) => {
                       const val = parseInt(e.currentTarget.value)

                       if (isNaN(val)) return

                       this.props.set_varIndicator_fontSizeInPxAction(val)
                     }}
              />
            </Form.Field>

            <Form.Field>
              <label>{getI18n(this.props.langId, "Font name")}</label>
              <input type="text"
                     value={this.props.state.fontName}
                     onChange={(e) => {
                       this.props.set_varIndicator_fontNameAction(e.currentTarget.value)
                     }}


              />
            </Form.Field>

            <Form.Field>
              <label>{getI18n(this.props.langId, "Inner text font size in px")}</label>
              <input type="number"
                     value={this.props.state.innerTextFontSizeInPx}

                     onChange={(e) => {
                       const val = parseInt(e.currentTarget.value)

                       if (isNaN(val)) return

                       this.props.set_varIndicator_innerTextFontSizeInPxAction(val)
                     }}
              />
            </Form.Field>

          </Form>

          <div>
            <canvas className="tile-canvas" ref={p => this.canvas = p} width={this.props.state.outerCircleDiameterInPx}
                    height={this.props.state.outerCircleDiameterInPx}
                    style={{maxHeight: 500, maxWidth: 500}}
            ></canvas>
          </div>

        </div>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(variableIndicatorEditor)