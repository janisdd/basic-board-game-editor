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
import {CheckboxData} from "../../../types/ui";

//const css = require('./styles.styl');

export interface MyProps {

  readonly imgShape: ImgSymbol

  readonly isChooseImgShapeImageLibraryDisplayed: boolean

  //--actions
  readonly setPropertyEditor_setSelectedImageToNull: () => void

  //set prop funcs where we have NO old value can only set when one shape is selected

  readonly setPropertyEditor_ImageWidth: (oldWidth: number, newWidth: number) => void
  readonly setPropertyEditor_ImageHeight: (oldHeight: number, newHeight: number) => void
  readonly setPropertyEditor_ImageRotationInDegree: (oldRotationInDegree: number, newRotationInDegree: number) => void
  readonly setPropertyEditor_ImageImgGuid: (oldImgGuid: string, newImgGuid: string) => void

  readonly setPropertyEditor_ImageSkewX: (oldSkewX: number, newSkewX: number) => void
  readonly setPropertyEditor_ImageSkewY: (oldSkewY: number, newSkewY: number) => void

  readonly setPropertyEditor_ImageIsMouseDisabled: (oldIsMouseDisabled: boolean, newIsMouseDisabled: boolean) => void

  readonly setEditor_IsChooseImgShapeImageLibraryDisplayed: (isDisplayed: boolean) => void

  //--symbol actions
  readonly set_imgSymbol_displayName: (displayName: string) => void


  readonly set_imgSymbol_overwriteWidth: (overwrite: boolean) => void
  readonly set_imgSymbol_overwriteHeight: (overwrite: boolean) => void
  readonly set_imgSymbol_overwriteRotationInDeg: (overwrite: boolean) => void
  readonly set_imgSymbol_overwriteImage: (overwrite: boolean) => void
  readonly set_imgSymbol_overwriteSkewX: (overwrite: boolean) => void
  readonly set_imgSymbol_overwriteSkewY: (overwrite: boolean) => void
  readonly set_imgSymbol_overwriteIsDisabledForMouseSelection: (overwrite: boolean) => void

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

    const imgSymbol = this.props.imgShape

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
                          this.props.setPropertyEditor_setSelectedImageToNull()
                        }}
                >
                  <Icon name="x"/>
                </Button>
              </ToolTip>
            </div>
          </Form.Field>

          
            <Form.Field>
              <label>{getI18n(this.props.langId, "Name")}</label>
              <input value={imgSymbol.displayName}
                     onChange={(e) => this.props.set_imgSymbol_displayName(e.currentTarget.value)}
              />
            </Form.Field>
          
            <Form.Group widths='equal'>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Height")}
                  <Checkbox className="mar-left-half" checked={imgSymbol.overwriteHeight}
                            onChange={(event, data: CheckboxData) => {
                              this.props.set_imgSymbol_overwriteHeight(data.checked)
                            }}
                            label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                  />
                </label>
                <input type="number"
                       value={
                         imgSymbol.height
                       }
                       onChange={(e) => this.props.setPropertyEditor_ImageHeight(
                         imgSymbol.height,
                         parseInt(e.currentTarget.value))}
                />
              </Form.Field>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Width")}
                  <Checkbox className="mar-left-half" checked={imgSymbol.overwriteWidth}
                            onChange={(event, data: CheckboxData) => {
                              this.props.set_imgSymbol_overwriteWidth(data.checked)
                            }}
                            label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                  />
                </label>
                <input type="number"
                       value={
                         imgSymbol.width
                       }
                       onChange={(e) => this.props.setPropertyEditor_ImageWidth(
                         imgSymbol.width,
                         parseInt(e.currentTarget.value))
                       }
                />
              </Form.Field>
            </Form.Group>
          

          
            <Form.Field>
              <label>{getI18n(this.props.langId, "Rotation in degree")}
                <Checkbox className="mar-left-half" checked={imgSymbol.overwriteRotationInDeg}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_imgSymbol_overwriteRotationInDeg(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              <Input
                value={
                  imgSymbol.rotationInDegree
                }
                type="number"
                onChange={(e) =>
                  this.props.setPropertyEditor_ImageRotationInDegree(
                    imgSymbol.rotationInDegree,
                    parseInt(e.currentTarget.value))
                }
                label={
                  <Button icon onClick={() => {
                    this.props.setPropertyEditor_ImageRotationInDegree(
                      imgSymbol.rotationInDegree,
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
                <Checkbox className="mar-left-half" checked={imgSymbol.overwriteImage}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_imgSymbol_overwriteImage(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>

              <Input labelPosition='right' type='text'>
                <input
                  readOnly
                  value={
                    imgSymbol.imgGuid === null ? '' : imgSymbol.imgGuid
                  }
                />
                <Button icon onClick={() => {
                  this.props.setEditor_IsChooseImgShapeImageLibraryDisplayed(true)
                }}>
                  <Icon name="write"/>
                </Button>
              </Input>
              <ImageLibrary
                isCreatingNewImgShape={false}
                onImageTaken={(imgSurrogate) => {
                  this.props.setPropertyEditor_ImageImgGuid(
                    imgSymbol.imgGuid,
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
                  <Checkbox className="mar-left-half" checked={imgSymbol.overwriteSkewX}
                            onChange={(event, data: CheckboxData) => {
                              this.props.set_imgSymbol_overwriteSkewX(data.checked)
                            }}
                            label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                  />
                </label>
                <input type='number'
                       value={
                         imgSymbol.skewX
                       }
                       onChange={(e) => this.props.setPropertyEditor_ImageSkewX(
                         imgSymbol.skewX,
                         parseInt(e.currentTarget.value))
                       }

                />
              </Form.Field>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Skew y")}
                  <Checkbox className="mar-left-half" checked={imgSymbol.overwriteSkewY}
                            onChange={(event, data: CheckboxData) => {
                              this.props.set_imgSymbol_overwriteSkewY(data.checked)
                            }}
                            label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                  />
                </label>
                <input type='number'
                       value={
                         imgSymbol.skewY
                       }
                       onChange={(e) => this.props.setPropertyEditor_ImageSkewY(
                         imgSymbol.skewY,
                         parseInt(e.currentTarget.value))
                       }

                />
              </Form.Field>

            </Form.Group>


            <Form.Field>
              <label>{getI18n(this.props.langId, "Is disabled for mouse selection")}
                <IconToolTip message={getI18n(this.props.langId,
                  "If checked you cannot longer select the shape with a mouse click. Use the tile outline to select the shape. This is useful if you want to set the shape as background. It might be good to set the z-index to the lowest possible")}/>
                <Checkbox className="mar-left-half" checked={imgSymbol.overwriteIsDisabledForMouseSelection}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_imgSymbol_overwriteIsDisabledForMouseSelection(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              <Checkbox
                        checked={imgSymbol.isMouseSelectionDisabled}
                        onChange={(event: any, data: { checked: boolean }) => {
                          this.props.setPropertyEditor_ImageIsMouseDisabled(
                            imgSymbol.isMouseSelectionDisabled,
                            data.checked)
                        }}
              />
            </Form.Field>



        </Form>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(imagePropertyEditor)