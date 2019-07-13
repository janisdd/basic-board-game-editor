import * as React from "react";
import {SyntheticEvent} from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Button, Checkbox, Form, Icon} from "semantic-ui-react";
import {
  set_varIndicator_drawQrCode,
  set_varIndicator_fontNameAction,
  set_varIndicator_fontSizeInPxAction,
  set_varIndicator_innerCircleDiameterInPxAction,
  set_varIndicator_innerText,
  set_varIndicator_isBoolVarAction,
  set_varIndicator_numOfFieldsAction,
  set_varIndicator_outerCircleDiameterInPxAction,
  varIndicator_reset
} from "../../state/reducers/variableIndicator/actions";
import {CheckboxData, ZIndexCache} from "../../types/ui";
import {VariableIndicatorDrawer} from "../../../graphics/variableIndicatorDrawer";
import * as graphics from '../../../graphics/graphicsCore'
import {PrintHelper} from "../../helpers/printHelper";
import {
  exportPngImagesBgColor, fontAwesomeSolidIconsFontFileLink, fontAwesomeLink,
  printVariableIndicatorBorderColor,
  printVariableIndicatorStrokeThickness, fontAwesomeRegularIconsFontFileLink
} from "../../constants";
import {getI18n} from "../../../i18n/i18nRoot";
import ToolTip from '../helpers/ToolTip'
import IconToolTip from '../helpers/IconToolTip';

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    state: rootState.variableIndicatorState,
    worldSettings: rootState.worldSettingsState,
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

  set_varIndicator_drawQrCode,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class variableIndicatorEditor extends React.Component<Props, any> {

  canvas: HTMLCanvasElement = null
  zIndexCache: ZIndexCache = {}
  renderStage: createjs.Stage = null

  async componentDidMount() {
    this.renderStage = new createjs.Stage(this.canvas)
    this.zIndexCache = {}
    await this.updateCanvasModel()
  }

  async componentDidUpdate() {
    await this.updateCanvasModel()
  }

  async updateCanvasModel() {
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

    await VariableIndicatorDrawer.drawVariableIndicator(this.renderStage,
      width,
      height,
      this.props.state.outerCircleDiameterInPx,
      this.props.state.innerCircleDiameterInPx,
      this.props.state.numOfFields,
      this.props.state.innerText,
      this.props.state.isBoolVar,
      this.props.state.fontSizeInPx,
      this.props.state.fontName,
      printVariableIndicatorStrokeThickness,
      exportPngImagesBgColor,
      this.props.state.drawQrCode,
      1, //the editor is only a preview... we only scale when printing/exporting
    )

    this.renderStage.update()
  }

  async exportVarIndicatorAs(format: 'svg' | 'png') {

    await PrintHelper.exportVariableIndicator(
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
      printVariableIndicatorStrokeThickness,
      exportPngImagesBgColor,
      this.props.state.drawQrCode,
      this.props.worldSettings.printAndExportScale,
      format
    )

  }

  render(): JSX.Element {
    return (
      <div style={{padding: '0 1em'}}>

        <div className="flexed" style={{marginBottom: '1em'}}>

          <Button icon className="mar-right"
                  onClick={async () => {
                    await PrintHelper.printVariableIndicator(
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
                      printVariableIndicatorStrokeThickness,
                      exportPngImagesBgColor,
                      this.props.state.drawQrCode,
                      this.props.worldSettings.printAndExportScale,
                    )
                  }}
          >
            <Icon name="print"/>
          </Button>


          <ToolTip
            message={getI18n(this.props.langId, "Export as svg (experimental). If you used icons you need to download the font awesome font file and place it in the same folder as the svg. For not filled (regular) icons you will need the file 'fa-regular-400.woff', for the filled (solid) icons you need the file 'fa-solid-900.woff'. Use the buttons in the world editor next to the svg download button.")}>
            <Button icon onClick={() => {

              this.exportVarIndicatorAs('svg')

            }}>
              <Icon.Group>
                <Icon name='upload'/>
                <Icon corner name='code'/>
              </Icon.Group>
            </Button>
          </ToolTip>

          <ToolTip
            message={getI18n(this.props.langId, "Export as png (experimental), the world tile size is used")}>
            <Button icon className="mar-right" onClick={() => {

              this.exportVarIndicatorAs('png')

            }}>
              <Icon.Group>
                <Icon name='upload'/>
                <Icon corner name='image'/>
              </Icon.Group>
            </Button>
          </ToolTip>


          <ToolTip
            message={getI18n(this.props.langId, "Reset to defaults")}
          >
            <Button icon
                    onClick={() => {
                      this.props.varIndicator_reset();
                    }}
            >
              <Icon name="undo"/>
            </Button>
          </ToolTip>
        </div>

        <div className="flexed">
          <Form as="div" className="mar-right">

            <Form.Field>
              <Form.Field>

                <Form.Field>
                  <Checkbox label={getI18n(this.props.langId, "Draw Qr code")} checked={this.props.state.drawQrCode}
                            onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                              this.props.set_varIndicator_drawQrCode(data.checked)
                            }}
                  />
                </Form.Field>

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
              <label>{getI18n(this.props.langId, "Number of fields")}
                <IconToolTip
                  message={getI18n(this.props.langId, "If your variable has a range of e.g. 11 then you need to input 11 * 2 + 2 = 24 because we can have 1 to 11, -1 to -11, 0 and -12")}
                />
              </label>
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

          </Form>

          <div style={{position: 'relative'}}>
            <canvas className="tile-canvas" ref={p => this.canvas = p} width={this.props.state.outerCircleDiameterInPx}
                    height={this.props.state.outerCircleDiameterInPx}
                    style={{maxHeight: 1000, maxWidth: 1000}}
            ></canvas>
          </div>

        </div>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(variableIndicatorEditor)
