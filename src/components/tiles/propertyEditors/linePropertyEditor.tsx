import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {Form, Divider, Button, Icon, Checkbox, Popup, Radio} from 'semantic-ui-react'
import {swapZIndexInTile} from "../../../helpers/someIndexHelper";
import {getNiceBezierCurveBetween} from "../../../helpers/interactionHelper";
import {
  BezierPoint, CurveMode, FieldSymbol,
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

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string

  readonly lineShape: ReadonlyArray<LineShape>

  readonly lineSymbols: ReadonlyArray<LineSymbol>

  //--actions
  readonly setPropertyEditor_setSelectedLineToNull: () => void

  //set prop funcs where we have NO old value can only set when one shape is selected

  readonly setPropertyEditor_LineColor: (oldColor: string, newColor: string) => void
  readonly setPropertyEditor_LineThicknessInPx: (oldThicknessInPx: number, newThicknessInPx: number) => void
  readonly setPropertyEditor_LineDashArray: (oldDashArray: number[], newDashArray: number[]) => void
  readonly setPropertyEditor_LineHasStartArrow: (oldHasStartArrow: boolean, newHasStartArrow: boolean) => void
  readonly setPropertyEditor_LineHasEndArrow: (oldHasEndArrow: boolean, newHasEndArrow: boolean) => void
  readonly setPropertyEditor_LineAbsoluteZIndex: (zIndex: number) => void
  readonly setPropertyEditor_LineArrowHeight: (oldArrowHeight: number, newArrowHeight: number) => void
  readonly setPropertyEditor_LineArrowWidth: (oldArrowWidth: number, newArrowWidth: number) => void


  readonly setLinePointNewPos: (oldPointId: number, newPointPos: PlainPoint, canSetFieldAnchorPoints: boolean) => void

  readonly setLinePointCurveMode: (bezierPointId: number, newCurveMode: CurveMode) => void

  readonly setPropertyEditor_addPointToLineShape: (bezierPoint: BezierPoint) => void
  readonly removePointFromLineShape: (pointId: number) => void
  readonly setPropertyEditor_removeLineShape: () => void

  readonly onAddLineSymbol: () => void

  readonly setPropertyEditor_LineIsBasedOnSymbol: (oldSymbolGuid: string | null, symbolGuid: string | null) => void

  readonly onDuplicateLines: (newLineShapes: ReadonlyArray<LineShape>) => void

  //--symbol actions

  readonly set_lineSymbol_displayName: (displayName: string) => void

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

    const areLineShapes = Array.isArray(this.props.lineShape)
    let isSingleLine = false

    if (areLineShapes) {
      isSingleLine = this.props.lineShape.length === 1
    }

    //we need to specify an old val when we have multiple fields to we take the first
    const singleLine: LineShape | null = this.props.lineShape[0]

    const isSomeLineBasedOnSymbol =
      isSingleLine && singleLine !== null && singleLine.createdFromSymbolGuid !== null
      ||
      areLineShapes && (this.props.lineShape as ReadonlyArray<LineShape>).some(p => p.createdFromSymbolGuid !== null)

    const isBasedOnSymbol = isSingleLine && isSomeLineBasedOnSymbol

    let lineSymbol: LineSymbol | null = null

    if (isBasedOnSymbol) {
      const temp = this.props.lineSymbols.find(p => p.guid === singleLine.createdFromSymbolGuid)

      if (temp) {
        lineSymbol = temp
      }
    }

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

              {
                isSingleLine && isSomeLineBasedOnSymbol === false &&
                <ToolTip
                  message={getI18n(this.props.langId,
                    "Adds the current shape as a new symbol and links this shape to the newly added symbol (this shape is then an instance of the symbol because the properties of the symbols are used for visuals). A little icon is displayed on the shape to indicate a symbol instance")}
                >
                  <Button icon
                          onClick={() => {
                            this.props.onAddLineSymbol()
                          }}
                  >
                    <Icon.Group>
                      <Icon name='clone'/>
                      <Icon corner name='asterisk'/>
                    </Icon.Group>
                  </Button>
                </ToolTip>
              }
              {
                isSingleLine && isSomeLineBasedOnSymbol &&
                <ToolTip
                  message={getI18n(this.props.langId,
                    "Detaches the shape from the connected symbol. The shape will then use its own properties again")}
                >
                  <Button icon
                          onClick={() => {
                            this.props.setPropertyEditor_LineIsBasedOnSymbol(singleLine.createdFromSymbolGuid, null)
                          }}
                  >
                    <Icon.Group>
                      <Icon name='clone'/>
                      <Icon name='x'/>
                    </Icon.Group>
                  </Button>
                </ToolTip>
              }

              <ToolTip
                message={getI18n(this.props.langId, "Duplicate this shape")}
              >
                <Button icon
                        onClick={() => {

                          const lineShapes = (this.props.lineShape as ReadonlyArray<LineShape>)
                          const copies = DuplicateHelper.duplicateLineShapes(lineShapes,
                            this.props.amountOfShapesInTile)

                          this.props.onDuplicateLines(copies)
                        }}
                >
                  <Icon name="paste"/>
                </Button>
              </ToolTip>


              <Button color="red" icon
                      onClick={() => {
                        this.props.setPropertyEditor_removeLineShape()
                      }}
              >
                <Icon name="trash"/>
              </Button>

            </div>
          </Form.Field>


          {
            //if this field is based on a symbol... we cannot change this
            isSingleLine &&
            <Form.Field>
              <label>{getI18n(this.props.langId, "Id")}: {singleLine.id}</label>
              <div>

              </div>
            </Form.Field>
          }

          {
            isBasedOnSymbol &&
            <Form.Field>
              <label>{getI18n(this.props.langId, "Name")}</label>
              <input value={lineSymbol.displayName}
                     onChange={(e) => this.props.set_lineSymbol_displayName(e.currentTarget.value)}
              />
            </Form.Field>
          }

          {
            //if this field is based on a symbol... we cannot change this
            isSomeLineBasedOnSymbol === false &&
            <Form.Group widths='equal'>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Color")}
                  <IconToolTip
                    message={getI18n(this.props.langId, "To use transparent set the color to black (0, 0, 0) and then set alpha to 0")}/>

                  {
                    isBasedOnSymbol && lineSymbol.overwriteColor &&
                    <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                  }
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
                        isBasedOnSymbol && lineSymbol.overwriteColor
                          ? lineSymbol.color
                          : isSingleLine ? singleLine.color
                          : singleLine.color
                      }
                      onChangeComplete={color => {

                        if (isBasedOnSymbol && lineSymbol.overwriteColor) return

                        this.props.setPropertyEditor_LineColor(
                          isBasedOnSymbol && lineSymbol.overwriteColor ? lineSymbol.color : singleLine.color,
                          color.hex)
                      }}
                    />
                  }
                />
              </Form.Field>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Thickness in px")}
                  {
                    isBasedOnSymbol && lineSymbol.overwriteThicknessInPx &&
                    <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                  }
                </label>
                <input type="number"
                       value={
                         isBasedOnSymbol && lineSymbol.overwriteThicknessInPx
                           ? lineSymbol.lineThicknessInPx
                           : isSingleLine ? singleLine.lineThicknessInPx
                           : singleLine.lineThicknessInPx
                       }
                       onChange={(e) => this.props.setPropertyEditor_LineThicknessInPx(
                         isBasedOnSymbol && lineSymbol.overwriteThicknessInPx ? lineSymbol.lineThicknessInPx : singleLine.lineThicknessInPx,
                         parseInt(e.currentTarget.value))}
                />
              </Form.Field>

              <Form.Field>
                <label>{getI18n(this.props.langId, "Gaps in px")}
                  {
                    isBasedOnSymbol && lineSymbol.overwriteGapsInPx &&
                    <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                  }
                </label>
                <input type="number"
                       value={
                         isBasedOnSymbol && lineSymbol.overwriteGapsInPx
                           ? lineSymbol.dashArray[0]
                           : isSingleLine ? singleLine.dashArray[0]
                           : singleLine.dashArray[0]
                       }
                       onChange={(e) => this.props.setPropertyEditor_LineDashArray(
                         (isBasedOnSymbol && lineSymbol.overwriteGapsInPx ? lineSymbol.dashArray : singleLine.dashArray) as number[],
                         [parseInt(e.currentTarget.value)])}
                />
              </Form.Field>

            </Form.Group>
          }

          {
            isSingleLine &&
            <Form.Group widths='equal'>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Start point")} x</label>
                <input type="number"
                       value={singleLine.startPoint.x}
                       onChange={(e) => this.props.setLinePointNewPos(
                         singleLine.startPoint.id,
                         {x: parseInt(e.currentTarget.value), y: singleLine.startPoint.y}, true)
                       }
                />

              </Form.Field>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Start point")} y</label>
                <input type="number"
                       value={singleLine.startPoint.y}
                       onChange={(e) => this.props.setLinePointNewPos(
                         singleLine.startPoint.id,
                         {x: singleLine.startPoint.x, y: parseInt(e.currentTarget.value)}, true)
                       }
                />
              </Form.Field>
            </Form.Group>
          }

          {
            //if this field is based on a symbol... we cannot change this
            isSomeLineBasedOnSymbol === false &&
            <Form.Group widths='equal'>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Start arrow")}
                  {
                    isBasedOnSymbol && lineSymbol.overwriteHasStartArrow &&
                    <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                  }
                </label>
                <Checkbox
                  checked={isBasedOnSymbol && lineSymbol.overwriteHasStartArrow ? lineSymbol.hasStartArrow : singleLine.hasStartArrow}
                  onChange={(event: any, data: { checked: boolean }) => {
                    this.props.setPropertyEditor_LineHasStartArrow(
                      isBasedOnSymbol && lineSymbol.overwriteHasStartArrow ? lineSymbol.hasStartArrow : singleLine.hasStartArrow,
                      data.checked)
                  }}
                />
              </Form.Field>
              <Form.Field>
                <label>{getI18n(this.props.langId, "End arrow")}
                  {
                    isBasedOnSymbol && lineSymbol.overwriteHasEndArrow &&
                    <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                  }
                </label>
                <Checkbox
                  checked={isBasedOnSymbol && lineSymbol.overwriteHasEndArrow ? lineSymbol.hasEndArrow : singleLine.hasEndArrow}
                  onChange={(event: any, data: { checked: boolean }) => {
                    this.props.setPropertyEditor_LineHasEndArrow(
                      isBasedOnSymbol && lineSymbol.overwriteHasEndArrow ? lineSymbol.hasEndArrow : singleLine.hasEndArrow,
                      data.checked)
                  }}
                />
              </Form.Field>
            </Form.Group>
          }


          {
            isSingleLine &&
            <Form.Field>
              <label>{getI18n(this.props.langId, "Z-index")} ({singleLine.zIndex})</label>
              <Button.Group icon>
                <Button onClick={() => {
                  swapZIndexInTile(singleLine,
                    singleLine.zIndex + 1,
                    false,
                    false,
                    this.props.amountOfShapesInTile,
                    this.props.fieldShapes,
                    this.props.lineShapes,
                    this.props.imgShapes,
                    this.props.setPropertyEditor_LineAbsoluteZIndex
                  )
                }}
                >
                  <Icon name='angle up'/>
                </Button>
                <Button
                  onClick={() => {
                    swapZIndexInTile(singleLine,
                      singleLine.zIndex - 1,
                      false,
                      false,
                      this.props.amountOfShapesInTile,
                      this.props.fieldShapes,
                      this.props.lineShapes,
                      this.props.imgShapes,
                      this.props.setPropertyEditor_LineAbsoluteZIndex
                    )
                  }}
                >
                  <Icon name='angle down'/>
                </Button>
                <Button
                  onClick={() => {
                    swapZIndexInTile(singleLine,
                      singleLine.zIndex + 1,
                      true,
                      false,
                      this.props.amountOfShapesInTile,
                      this.props.fieldShapes,
                      this.props.lineShapes,
                      this.props.imgShapes,
                      this.props.setPropertyEditor_LineAbsoluteZIndex
                    )
                  }}
                >
                  <Icon name='angle double up'/>
                </Button>
                <Button
                  onClick={() => {
                    swapZIndexInTile(singleLine,
                      singleLine.zIndex - 1,
                      false,
                      true,
                      this.props.amountOfShapesInTile,
                      this.props.fieldShapes,
                      this.props.lineShapes,
                      this.props.imgShapes,
                      this.props.setPropertyEditor_LineAbsoluteZIndex
                    )
                  }}
                >
                  <Icon name='angle double down'/>
                </Button>
              </Button.Group>
            </Form.Field>
          }

          {
            //if this field is based on a symbol... we cannot change this
            isSomeLineBasedOnSymbol === false &&
            <Form.Group widths='equal'>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Arrow width")}
                  {
                    isBasedOnSymbol && lineSymbol.overwriteArrowWidth &&
                    <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                  }
                </label>
                <input type="number" min="1"
                       value={
                         isBasedOnSymbol && lineSymbol.overwriteArrowWidth
                           ? lineSymbol.arrowWidth
                           : isSingleLine ? singleLine.arrowWidth
                           : singleLine.arrowWidth
                       }
                       onChange={(e) => this.props.setPropertyEditor_LineArrowWidth(
                         isBasedOnSymbol && lineSymbol.overwriteArrowWidth ? lineSymbol.arrowWidth : singleLine.arrowWidth,
                         parseInt(e.currentTarget.value))}
                />

              </Form.Field>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Arrow height")}
                  {
                    isBasedOnSymbol && lineSymbol.overwriteArrowHeight &&
                    <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                  }
                </label>
                <input type="number" min="1"
                       value={
                         isBasedOnSymbol && lineSymbol.overwriteArrowHeight
                           ? lineSymbol.arrowHeight
                           : isSingleLine ? singleLine.arrowHeight
                           : singleLine.arrowHeight
                       }
                       onChange={(e) => this.props.setPropertyEditor_LineArrowHeight(
                         isBasedOnSymbol && lineSymbol.overwriteArrowHeight ? lineSymbol.arrowHeight : singleLine.arrowHeight,
                         parseInt(e.currentTarget.value))}
                />
              </Form.Field>
            </Form.Group>
          }

          {
            isSingleLine &&
            singleLine.points.map((p, index) => {
              return (
                <div key={p.id}>

                  <Divider/>
                  {
                    index > 0 &&
                    <Form.Field>
                      <Button color="red" icon
                              onClick={() => {
                                this.props.removePointFromLineShape(p.id)
                              }}
                      >
                        <Icon name="trash"/>
                      </Button>
                    </Form.Field>
                  }

                  <Form.Group>
                    <Form.Field>
                      <label>{getI18n(this.props.langId, "Point")} {index + 1} x</label>
                      <input type="number"
                             value={p.x}
                             onChange={(e) => this.props.setLinePointNewPos(p.id,
                               {x: parseInt(e.currentTarget.value), y: p.y}, true)
                             }
                      />

                    </Form.Field>
                    <Form.Field>
                      <label>{getI18n(this.props.langId, "Point")} {index + 1} y</label>
                      <input type="number"
                             value={p.y}
                             onChange={(e) => this.props.setLinePointNewPos(p.id,
                               {x: p.x, y: parseInt(e.currentTarget.value)}, true)
                             }
                      />
                    </Form.Field>
                  </Form.Group>

                  <Form.Field>
                    <label>{getI18n(this.props.langId, "Curve mode")}</label>
                    <Radio
                      className="mar-right-half"
                      label={getI18n(this.props.langId, "Smooth")}
                      name={'curveModeGroup' + p.id}
                      value={CurveMode.smooth}
                      checked={p.curveMode === CurveMode.smooth}
                      onChange={(event: any, data: { checked: boolean }) => {
                        this.props.setLinePointCurveMode(p.id, CurveMode.smooth)
                      }}
                    />
                    <Radio
                      className="mar-right-half"
                      label={getI18n(this.props.langId, "Free")}
                      name={'curveModeGroup' + p.id}
                      value={CurveMode.free}
                      checked={p.curveMode === CurveMode.free}
                      onChange={(event: any, data: { checked: boolean }) => {
                        this.props.setLinePointCurveMode(p.id, CurveMode.free)
                      }}
                    />
                    <Radio
                      label={getI18n(this.props.langId, "Linear")}
                      name={'curveModeGroup' + p.id}
                      value={CurveMode.linear}
                      checked={p.curveMode === CurveMode.linear}
                      onChange={(event: any, data: { checked: boolean }) => {
                        this.props.setLinePointCurveMode(p.id, CurveMode.linear)
                      }}
                    />
                  </Form.Field>

                  <Form.Group widths="equal">
                    {
                      //control point 1
                    }
                    <Form.Field>
                      <label>{getI18n(this.props.langId, "Control point")} 1 x</label>
                      <input type="number"
                             value={p.cp1.x}
                             onChange={(e) => this.props.setLinePointNewPos(p.cp1.id,
                               {x: parseInt(e.currentTarget.value), y: p.cp1.y}, true)
                             }
                      />

                    </Form.Field>
                    <Form.Field>
                      <label>{getI18n(this.props.langId, "Control point")} 1 x</label>
                      <input type="number"
                             value={p.cp1.y}
                             onChange={(e) => this.props.setLinePointNewPos(p.cp1.id,
                               {x: p.cp1.x, y: parseInt(e.currentTarget.value)}, true)
                             }
                      />
                    </Form.Field>

                    {
                      //control point 2
                    }
                    <Form.Field>
                      <label>{getI18n(this.props.langId, "Control point")} 2 x</label>
                      <input type="number"
                             value={p.cp2.x}
                             onChange={(e) => this.props.setLinePointNewPos(p.cp2.id,
                               {x: parseInt(e.currentTarget.value), y: p.cp2.y}, true)
                             }
                      />

                    </Form.Field>
                    <Form.Field>
                      <label>{getI18n(this.props.langId, "Control point")} 2 x</label>
                      <input type="number"
                             value={p.cp2.y}
                             onChange={(e) => this.props.setLinePointNewPos(p.cp2.id,
                               {x: p.cp2.x, y: parseInt(e.currentTarget.value)}, true)
                             }
                      />
                    </Form.Field>

                  </Form.Group>


                </div>
              )
            })
          }

          {
            isSingleLine &&
            <Button icon
                    onClick={() => {
                      const beforePoint = singleLine.points[singleLine.points.length - 1]
                      const point = getNiceBezierCurveBetween(beforePoint,
                        {x: beforePoint.x + 50, y: beforePoint.y + 50},
                        MajorLineDirection.topToBottom
                      )
                      this.props.setPropertyEditor_addPointToLineShape(point)

                    }}
            >
              <Icon name="add"/>
            </Button>
          }


        </Form>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(linePropertyEditor)