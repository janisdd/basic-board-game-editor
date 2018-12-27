import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {Form, Divider, Button, Icon, Checkbox, Popup, Radio} from 'semantic-ui-react'
import {swapZIndexInTile} from "../../../helpers/someIndexHelper";
import {getNiceBezierCurveBetween} from "../../../helpers/interactionHelper";
import {
  BezierPoint, CurveMode,
  LineShape,
  LineSymbol,
  PlainPoint
} from "../../../types/drawing";
import {DuplicateHelper} from "../../../helpers/duplicateHelper";
import {getI18n} from "../../../../i18n/i18nRoot";
import ToolTip from '../../helpers/ToolTip'
import IconToolTip, {horizontalIconPopupOffsetInPx} from "../../helpers/IconToolTip";
import {ChromePicker} from "react-color";
import {MajorLineDirection} from "../../../types/world";
import {CheckboxData} from "../../../types/ui";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string

  readonly lineShape: LineSymbol

  //--actions
  readonly setPropertyEditor_setSelectedLineToNull: () => void

  //set prop funcs where we have NO old value can only set when one shape is selected

  readonly setPropertyEditor_LineColor: (oldColor: string, newColor: string) => void
  readonly setPropertyEditor_LineThicknessInPx: (oldThicknessInPx: number, newThicknessInPx: number) => void
  readonly setPropertyEditor_LineDashArray: (oldDashArray: number[], newDashArray: number[]) => void
  readonly setPropertyEditor_LineHasStartArrow: (oldHasStartArrow: boolean, newHasStartArrow: boolean) => void
  readonly setPropertyEditor_LineHasEndArrow: (oldHasEndArrow: boolean, newHasEndArrow: boolean) => void
  readonly setPropertyEditor_LineArrowHeight: (oldArrowHeight: number, newArrowHeight: number) => void
  readonly setPropertyEditor_LineArrowWidth: (oldArrowWidth: number, newArrowWidth: number) => void

  readonly onDuplicateLines: (newLineShapes: ReadonlyArray<LineShape>) => void

  //--symbol actions

  readonly set_lineSymbol_displayName: (displayName: string) => void

  readonly set_lineSymbol_overwriteColor: (overwrite: boolean) => void
  readonly set_lineSymbol_overwriteThicknessInPx: (overwrite: boolean) => void
  readonly set_lineSymbol_overwriteGapsInPx: (overwrite: boolean) => void
  readonly set_lineSymbol_overwriteHasStartArrow: (overwrite: boolean) => void
  readonly set_lineSymbol_overwriteHasEndArrow: (overwrite: boolean) => void
  readonly set_lineSymbol_overwriteArrowWidth: (overwrite: boolean) => void
  readonly set_lineSymbol_overwriteArrowHeight: (overwrite: boolean) => void

}

const mapStateToProps = (rootState: RootState, props: MyProps) => {
  return {
    //test0: rootState...
    //test: props.test
    ...props,
    fieldShapes: rootState.tileEditorFieldShapesState.present,
    amountOfShapesInTile: rootState.tileEditorLineShapeState.present.length + rootState.tileEditorImgShapesState.present.length + rootState.tileEditorFieldShapesState.present.length,
    lineShapes: rootState.tileEditorLineShapeState.present,
    imgShapes: rootState.tileEditorImgShapesState.present,
    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class linePropertyEditor extends React.Component<Props, any> {
  render(): JSX.Element {

    const lineSymbol = this.props.lineShape

    return (
      <div>

        {
          //else enter would trigger submission and clear all
        }
        <Form as="div">


          <Form.Field>
            <div className="flex-left-right">
              <ToolTip
                message={getI18n(this.props.langId, "Deselect shape")}
              >
                <Button icon
                        onClick={() => {
                          this.props.setPropertyEditor_setSelectedLineToNull()
                        }}
                >
                  <Icon name="x"/>
                </Button>
              </ToolTip>


              {/*<ToolTip*/}
              {/*message={getI18n(this.props.langId, "Duplicate this shape")}*/}
              {/*>*/}
              {/*<Button icon*/}
              {/*onClick={() => {*/}

              {/*const lineShapes = (this.props.lineShape as ReadonlyArray<LineShape>)*/}
              {/*const copies = DuplicateHelper.duplicateLineShapes(lineShapes,*/}
              {/*this.props.amountOfShapesInTile)*/}

              {/*this.props.onDuplicateLines(copies)*/}
              {/*}}*/}
              {/*>*/}
              {/*<Icon name="paste"/>*/}
              {/*</Button>*/}
              {/*</ToolTip>*/}

              {/*<Button color="red" icon*/}
              {/*onClick={() => {*/}
              {/*this.props.setPropertyEditor_removeLineShape()*/}
              {/*}}*/}
              {/*>*/}
              {/*<Icon name="trash"/>*/}
              {/*</Button>*/}

            </div>
          </Form.Field>


          <Form.Field>
            <label>{getI18n(this.props.langId, "Name")}</label>
            <input value={lineSymbol.displayName}
                   onChange={(e) => this.props.set_lineSymbol_displayName(e.currentTarget.value)}
            />
          </Form.Field>


          <Form.Group widths='equal'>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Color")}
                <IconToolTip
                  message={getI18n(this.props.langId, "To use transparent set the color to black (0, 0, 0) and then set alpha to 0")}/>

                <Checkbox className="mar-left-half" checked={lineSymbol.overwriteColor}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_lineSymbol_overwriteColor(data.checked)
                          }}
                          label={<label>{getI18n(this.props.langId, "Overwrite")}</label>}
                />

              </label>
              <Popup
                trigger={
                  <div className="hoverable">
                    <Icon style={{
                      'color':
                        'black' //use black... if we use the selected color e.g. white this is bad/not visible...
                    }} name="paint brush"/>
                  </div>
                }
                on="click"
                offset={horizontalIconPopupOffsetInPx}
                content={
                  <ChromePicker
                    color={
                      lineSymbol.color
                    }
                    onChangeComplete={color => {
                      this.props.setPropertyEditor_LineColor(
                        lineSymbol.color,
                        color.hex)
                    }}
                  />
                }
              />
            </Form.Field>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Thickness in px")}
                <Checkbox className="mar-left-half" checked={lineSymbol.overwriteThicknessInPx}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_lineSymbol_overwriteThicknessInPx(data.checked)
                          }}
                          label={<label>{getI18n(this.props.langId, "Overwrite")}</label>}
                />
              </label>
              <input type="number"
                     value={
                       lineSymbol.lineThicknessInPx
                     }
                     onChange={(e) => this.props.setPropertyEditor_LineThicknessInPx(
                       lineSymbol.lineThicknessInPx,
                       parseInt(e.currentTarget.value))}
              />
            </Form.Field>

            <Form.Field>
              <label>{getI18n(this.props.langId, "Gaps in px")}
                <Checkbox className="mar-left-half" checked={lineSymbol.overwriteGapsInPx}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_lineSymbol_overwriteGapsInPx(data.checked)
                          }}
                          label={<label>{getI18n(this.props.langId, "Overwrite")}</label>}
                />
              </label>
              <input type="number"
                     value={
                       lineSymbol.dashArray[0]
                     }
                     onChange={(e) => this.props.setPropertyEditor_LineDashArray(
                       (lineSymbol.dashArray) as number[],
                       [parseInt(e.currentTarget.value)])}
              />
            </Form.Field>

          </Form.Group>

          <Form.Group widths='equal'>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Start arrow")}
                <Checkbox className="mar-left-half" checked={lineSymbol.overwriteHasStartArrow}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_lineSymbol_overwriteHasStartArrow(data.checked)
                          }}
                          label={<label>{getI18n(this.props.langId, "Overwrite")}</label>}
                />
              </label>
              <Checkbox
                checked={lineSymbol.hasStartArrow}
                onChange={(event: any, data: { checked: boolean }) => {
                  this.props.setPropertyEditor_LineHasStartArrow(
                    lineSymbol.hasStartArrow,
                    data.checked)
                }}
              />
            </Form.Field>
            <Form.Field>
              <label>{getI18n(this.props.langId, "End arrow")}
                <Checkbox className="mar-left-half" checked={lineSymbol.overwriteHasEndArrow}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_lineSymbol_overwriteHasEndArrow(data.checked)
                          }}
                          label={<label>{getI18n(this.props.langId, "Overwrite")}</label>}
                />
              </label>
              <Checkbox
                checked={lineSymbol.hasEndArrow}
                onChange={(event: any, data: { checked: boolean }) => {
                  this.props.setPropertyEditor_LineHasEndArrow(
                    lineSymbol.hasEndArrow,
                    data.checked)
                }}
              />
            </Form.Field>
          </Form.Group>

          <Form.Group widths='equal'>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Arrow width")}
                <Checkbox className="mar-left-half" checked={lineSymbol.overwriteArrowWidth}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_lineSymbol_overwriteArrowWidth(data.checked)
                          }}
                          label={<label>{getI18n(this.props.langId, "Overwrite")}</label>}
                />
              </label>
              <input type="number" min="1"
                     value={
                       lineSymbol.arrowWidth
                     }
                     onChange={(e) => this.props.setPropertyEditor_LineArrowWidth(
                       lineSymbol.arrowWidth,
                       parseInt(e.currentTarget.value))}
              />

            </Form.Field>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Arrow height")}
                <Checkbox className="mar-left-half" checked={lineSymbol.overwriteArrowHeight}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_lineSymbol_overwriteArrowHeight(data.checked)
                          }}
                          label={<label>{getI18n(this.props.langId, "Overwrite")}</label>}
                />
              </label>
              <input type="number" min="1"
                     value={
                       lineSymbol.arrowHeight
                     }
                     onChange={(e) => this.props.setPropertyEditor_LineArrowHeight(
                       lineSymbol.arrowHeight,
                       parseInt(e.currentTarget.value))}
              />
            </Form.Field>
          </Form.Group>


        </Form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(linePropertyEditor)