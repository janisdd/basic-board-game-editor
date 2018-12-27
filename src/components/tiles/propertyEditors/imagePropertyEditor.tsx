import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {Form, Icon, Button, Input, Checkbox} from 'semantic-ui-react'
import {swapZIndexInTile} from "../../../helpers/someIndexHelper";
import {FieldSymbol, ImgShape, ImgSymbol} from "../../../types/drawing";
import ImageLibrary from '../imageLibrary/imageLibrary'
import {DuplicateHelper} from "../../../helpers/duplicateHelper";
import {getI18n} from "../../../../i18n/i18nRoot";
import ToolTip from '../../helpers/ToolTip'
import IconToolTip from '../../helpers/IconToolTip'

//const css = require('./styles.styl');

export interface MyProps {

  readonly imgShape: ReadonlyArray<ImgShape>

  readonly imgSymbols: ReadonlyArray<ImgSymbol>

  readonly isChooseImgShapeImageLibraryDisplayed: boolean

  //--actions
  readonly setPropertyEditor_setSelectedImageToNull: () => void

  //set prop funcs where we have NO old value can only set when one shape is selected

  readonly setPropertyEditor_ImageX: (oldX: number, newX: number) => void
  readonly setPropertyEditor_ImageY: (oldY: number, newY: number) => void
  readonly setPropertyEditor_ImageWidth: (oldWidth: number, newWidth: number) => void
  readonly setPropertyEditor_ImageHeight: (oldHeight: number, newHeight: number) => void
  readonly setPropertyEditor_ImageRotationInDegree: (oldRotationInDegree: number, newRotationInDegree: number) => void
  readonly setPropertyEditor_ImageAbsoluteZIndex: (zIndex: number) => void
  readonly setPropertyEditor_ImageImgGuid: (oldImgGuid: string, newImgGuid: string) => void

  readonly setPropertyEditor_ImageSkewX: (oldSkewX: number, newSkewX: number) => void
  readonly setPropertyEditor_ImageSkewY: (oldSkewY: number, newSkewY: number) => void

  readonly setPropertyEditor_ImageIsMouseDisabled: (oldIsMouseDisabled: boolean, newIsMouseDisabled: boolean) => void


  readonly setEditor_IsChooseImgShapeImageLibraryDisplayed: (isDisplayed: boolean) => void
  readonly setPropertyEditor_removeImgShape: () => void
  readonly onAddImgSymbol: () => void

  readonly setPropertyEditor_ImageIsBasedOnSymbol: (oldSymbolGuid: string | null, symbolGuid: string | null) => void

  readonly onDuplicateImgs: (newImgShape: ReadonlyArray<ImgShape>) => void


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
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class imagePropertyEditor extends React.Component<Props, any> {
  render(): JSX.Element {

    const areImgShapes = this.props.imgShape.length > 1
    let isSingleImg = this.props.imgShape.length === 1

    //we need to specify an old val when we have multiple imgs to we take the first
    const singleImg: ImgShape = this.props.imgShape[0]

    const isSomeImgBasedOnSymbol =
      isSingleImg && singleImg !== null && singleImg.createdFromSymbolGuid !== null
      ||
      areImgShapes && (this.props.imgShape as ReadonlyArray<ImgShape>).some(p => p.createdFromSymbolGuid !== null)

    const isBasedOnSymbol = isSingleImg && isSomeImgBasedOnSymbol

    let imgSymbol: ImgSymbol | null = null

    if (isBasedOnSymbol) {
      const temp = this.props.imgSymbols.find(p => p.guid === singleImg.createdFromSymbolGuid)

      if (temp) {
        imgSymbol = temp
      }
    }

    const actionsButtonsContent = (
      <Form.Field>
        <div className="flex-left-right">

          <ToolTip
            message={getI18n(this.props.langId, "Deselect shape")}
          >
            <Button icon
                    onClick={() => {
                      this.props.setPropertyEditor_setSelectedImageToNull()
                    }}
            >
              <Icon name="x"/>
            </Button>
          </ToolTip>

          {
            isSingleImg && isSomeImgBasedOnSymbol === false &&
            <ToolTip
              message={getI18n(this.props.langId,
                "Adds the current shape as a new symbol and links this shape to the newly added symbol (this shape is then an instance of the symbol because the properties of the symbols are used for visuals). A little icon is displayed on the shape to indicate a symbol instance")}
            >
              <Button icon
                      onClick={() => {
                        this.props.onAddImgSymbol()
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
            isSingleImg && isSomeImgBasedOnSymbol &&
            <ToolTip
              message={getI18n(this.props.langId,
                "Detaches the shape from the connected symbol. The shape will then use its own properties again")}
            >
              <Button icon
                      onClick={() => {
                        this.props.setPropertyEditor_ImageIsBasedOnSymbol(singleImg.createdFromSymbolGuid, null)
                      }}
              >
                <Icon.Group>
                  <Icon name='clone'/>
                  <Icon name='x'/>
                </Icon.Group>
              </Button>
            </ToolTip>
          }

          {
            isBasedOnSymbol === false &&
            <ToolTip
              message={getI18n(this.props.langId, "Duplicate this shape")}
            >
              <Button icon
                      onClick={() => {

                        const imgShapes = (this.props.imgShapes as ReadonlyArray<ImgShape>)

                        const copies = DuplicateHelper.duplicateImgShapes(imgShapes,
                          this.props.amountOfShapesInTile)

                        this.props.onDuplicateImgs(copies)
                      }}
              >
                <Icon name="paste"/>
              </Button>
            </ToolTip>
          }

          {
            isBasedOnSymbol === false &&
            <Button color="red" icon
                    onClick={() => {
                      this.props.setPropertyEditor_removeImgShape()
                    }}
            >
              <Icon name="trash"/>
            </Button>
          }
        </div>
      </Form.Field>
    )

    if (areImgShapes && isSomeImgBasedOnSymbol) {
      return (
        <div>
          <Form as="div">
            {
              actionsButtonsContent
            }
          </Form>
        </div>
      )
    }

    return (
      <div>

        {
          //else enter would trigger submission and clear all
        }
        <Form as="div">

          {
            actionsButtonsContent
          }

          {
            isSingleImg &&
            <Form.Field>
              <label>{getI18n(this.props.langId, "Id")}: {singleImg.id}</label>
            </Form.Field>
          }

          {
            isBasedOnSymbol &&
            <Form.Field>
              <label>{getI18n(this.props.langId, "Name")}</label>
              <input value={imgSymbol.displayName} disabled />
            </Form.Field>
          }

          {
            isSingleImg &&
            <Form.Group widths='equal'>
              <Form.Field>
                <label>X</label>
                <input type="number"
                       value={
                         isBasedOnSymbol ? imgSymbol.x : singleImg.x
                       }
                       onChange={(e) => this.props.setPropertyEditor_ImageX(
                         isBasedOnSymbol ? imgSymbol.x : singleImg.x,
                         parseInt(e.currentTarget.value))}
                />
              </Form.Field>
              <Form.Field>
                <label>Y</label>
                <input type="number"
                       value={
                         isBasedOnSymbol ? imgSymbol.y : singleImg.y
                       }
                       onChange={(e) => this.props.setPropertyEditor_ImageY(
                         isBasedOnSymbol ? imgSymbol.y : singleImg.y,
                         parseInt(e.currentTarget.value))}
                />
              </Form.Field>
            </Form.Group>
          }


            <Form.Group widths='equal'>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Height")}
                  {
                    isBasedOnSymbol && imgSymbol.overwriteHeight &&
                    <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                  }
                </label>
                <input type="number" disabled={isBasedOnSymbol && imgSymbol.overwriteHeight}
                       value={
                         isBasedOnSymbol && imgSymbol.overwriteHeight
                           ? imgSymbol.height
                           : isSingleImg ? singleImg.height
                           : singleImg.height
                       }
                       onChange={(e) => this.props.setPropertyEditor_ImageHeight(
                         isBasedOnSymbol && imgSymbol.overwriteHeight ? imgSymbol.height : singleImg.height,
                         parseInt(e.currentTarget.value))}
                />
              </Form.Field>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Width")}
                  {
                    isBasedOnSymbol && imgSymbol.overwriteWidth &&
                    <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                  }
                </label>
                <input type="number" disabled={isBasedOnSymbol && imgSymbol.overwriteWidth}
                       value={
                         isBasedOnSymbol && imgSymbol.overwriteWidth
                           ? imgSymbol.width
                           : isSingleImg ? singleImg.width
                           : singleImg.width
                       }
                       onChange={(e) => this.props.setPropertyEditor_ImageWidth(
                         isBasedOnSymbol && imgSymbol.overwriteWidth ? imgSymbol.width : singleImg.width,
                         parseInt(e.currentTarget.value))
                       }
                />
              </Form.Field>
            </Form.Group>


            <Form.Field>
              <label>{getI18n(this.props.langId, "Rotation in degree")}
                {
                  isBasedOnSymbol && imgSymbol.overwriteRotationInDeg &&
                  <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                }
              </label>
              <Input  disabled={isBasedOnSymbol && imgSymbol.overwriteRotationInDeg}
                value={
                  isBasedOnSymbol && imgSymbol.overwriteRotationInDeg
                    ? imgSymbol.rotationInDegree
                    : isSingleImg ? singleImg.rotationInDegree
                    : singleImg.rotationInDegree
                }
                type="number"
                onChange={(e) =>
                  this.props.setPropertyEditor_ImageRotationInDegree(
                    isBasedOnSymbol && imgSymbol.overwriteRotationInDeg ? imgSymbol.rotationInDegree : singleImg.rotationInDegree,
                    parseInt(e.currentTarget.value))
                }
                label={
                  <Button icon onClick={() => {
                    this.props.setPropertyEditor_ImageRotationInDegree(
                      isBasedOnSymbol && imgSymbol.overwriteRotationInDeg ? imgSymbol.rotationInDegree : singleImg.rotationInDegree,
                      0)
                  }}>
                    <Icon name="undo"/>
                  </Button>
                }
                labelPosition='right'
              />
            </Form.Field>


            <Form.Field>
              <label>{getI18n(this.props.langId, "Image")}
                {
                  isBasedOnSymbol && imgSymbol.overwriteImage &&
                  <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                }
              </label>

              <Input labelPosition='right' type='text'>
                <input
                  readOnly
                  value={
                    isBasedOnSymbol && imgSymbol.overwriteImage
                      ? imgSymbol.imgGuid === null ? '' : imgSymbol.imgGuid
                      : singleImg.imgGuid === null ? '' : singleImg.imgGuid
                  }
                />
                <Button icon disabled={isBasedOnSymbol && imgSymbol.overwriteImage}
                        onClick={() => {
                  this.props.setEditor_IsChooseImgShapeImageLibraryDisplayed(true)
                }}>
                  <Icon name="write"/>
                </Button>
              </Input>
              <ImageLibrary
                isCreatingNewImgShape={false}
                onImageTaken={(imgSurrogate) => {
                  this.props.setPropertyEditor_ImageImgGuid(
                    isBasedOnSymbol ? imgSymbol.imgGuid : singleImg.imgGuid,
                    imgSurrogate.guid)
                  this.props.setEditor_IsChooseImgShapeImageLibraryDisplayed(false)
                }}
                isDisplayed={this.props.isChooseImgShapeImageLibraryDisplayed}
                set_isDisplayed={(isDisplayed) => {
                  this.props.setEditor_IsChooseImgShapeImageLibraryDisplayed(isDisplayed)
                }}
              />

            </Form.Field>

            <Form.Group widths='equal'>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Skew x")}
                  {
                    isBasedOnSymbol && imgSymbol.overwriteSkewX &&
                    <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                  }
                </label>
                <input type='number' disabled={isBasedOnSymbol && imgSymbol.overwriteSkewX}
                       value={
                         isBasedOnSymbol && imgSymbol.overwriteSkewX
                           ? imgSymbol.skewX
                           : singleImg.skewX
                       }
                       onChange={(e) => this.props.setPropertyEditor_ImageSkewX(
                         isBasedOnSymbol && imgSymbol.overwriteSkewX ? imgSymbol.skewX : singleImg.skewX,
                         parseInt(e.currentTarget.value))
                       }

                />
              </Form.Field>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Skew y")}
                  {
                    isBasedOnSymbol && imgSymbol.overwriteSkewY &&
                    <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol")}/>
                  }
                </label>
                <input type='number' disabled={isBasedOnSymbol && imgSymbol.overwriteSkewY}
                       value={
                         isBasedOnSymbol && imgSymbol.overwriteSkewY
                           ? imgSymbol.skewY
                           : singleImg.skewY
                       }
                       onChange={(e) => this.props.setPropertyEditor_ImageSkewY(
                         isBasedOnSymbol && imgSymbol.overwriteSkewY ? imgSymbol.skewY : singleImg.skewY,
                         parseInt(e.currentTarget.value))
                       }

                />
              </Form.Field>

            </Form.Group>



          {
            isSingleImg &&
            <Form.Field>
              <label>{getI18n(this.props.langId, "Z-index")} ({singleImg.zIndex})</label>
              <Button.Group icon>
                <Button onClick={() => {
                  swapZIndexInTile(singleImg,
                    singleImg.zIndex + 1,
                    false,
                    false,
                    this.props.amountOfShapesInTile,
                    this.props.fieldShapes,
                    this.props.lineShapes,
                    this.props.imgShapes,
                    this.props.setPropertyEditor_ImageAbsoluteZIndex
                  )
                }}
                >
                  <Icon name='angle up'/>
                </Button>
                <Button
                  onClick={() => {
                    swapZIndexInTile(singleImg,
                      singleImg.zIndex - 1,
                      false,
                      false,
                      this.props.amountOfShapesInTile,
                      this.props.fieldShapes,
                      this.props.lineShapes,
                      this.props.imgShapes,
                      this.props.setPropertyEditor_ImageAbsoluteZIndex
                    )
                  }}
                >
                  <Icon name='angle down'/>
                </Button>
                <Button
                  onClick={() => {
                    swapZIndexInTile(singleImg,
                      singleImg.zIndex + 1,
                      true,
                      false,
                      this.props.amountOfShapesInTile,
                      this.props.fieldShapes,
                      this.props.lineShapes,
                      this.props.imgShapes,
                      this.props.setPropertyEditor_ImageAbsoluteZIndex
                    )
                  }}
                >
                  <Icon name='angle double up'/>
                </Button>
                <Button
                  onClick={() => {
                    swapZIndexInTile(singleImg,
                      singleImg.zIndex - 1,
                      false,
                      true,
                      this.props.amountOfShapesInTile,
                      this.props.fieldShapes,
                      this.props.lineShapes,
                      this.props.imgShapes,
                      this.props.setPropertyEditor_ImageAbsoluteZIndex
                    )
                  }}
                >
                  <Icon name='angle double down'/>
                </Button>
              </Button.Group>
            </Form.Field>
          }
          {
            isSomeImgBasedOnSymbol === false &&
            <Form.Field>
              <Checkbox label={getI18n(this.props.langId, "Is disabled for mouse selection")}
                        checked={isBasedOnSymbol ? imgSymbol.isMouseSelectionDisabled : singleImg.isMouseSelectionDisabled}
                        onChange={(event: any, data: { checked: boolean }) => {
                          this.props.setPropertyEditor_ImageIsMouseDisabled(
                            isBasedOnSymbol ? imgSymbol.isMouseSelectionDisabled : singleImg.isMouseSelectionDisabled,
                            data.checked)
                        }}
              />

              <IconToolTip message={getI18n(this.props.langId,
                "If checked you cannot longer select the shape with a mouse click. Use the tile outline to select the shape. This is useful if you want to set the shape as background. It might be good to set the z-index to the lowest possible")}/>
            </Form.Field>
          }


        </Form>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(imagePropertyEditor)