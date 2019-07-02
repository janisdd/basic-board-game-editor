import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {Form, Button, Icon, Input, Divider, Popup, Checkbox} from 'semantic-ui-react'
import {AnchorPoint, FieldShape, FieldSymbol, HorizontalAlign, VerticalAlign} from "../../../types/drawing";
import {swapZIndexInTile} from "../../../helpers/someIndexHelper";
import {DuplicateHelper} from "../../../helpers/duplicateHelper";
import ToolTip from '../../helpers/ToolTip'
import {getI18n, getRawI18n} from "../../../../i18n/i18nRoot";
import IconToolTip, {horizontalIconPopupOffsetInPx} from "../../helpers/IconToolTip";
import {ChromePicker} from 'react-color';
import ImageLibrary from '../imageLibrary/imageLibrary'
import EditorWrapper, {editorInstancesMap} from "../../helpers/editorWrapper";
import {Simulator} from "../../../../simulation/simulator";
import {GameUnit} from "../../../../simulation/model/executionUnit";
import {Logger} from "../../../helpers/logger";
import {CheckboxData} from "../../../types/ui";


export interface MyProps {

  readonly fieldShape: FieldSymbol

  readonly isChooseFieldShapeBackgroundImageLibraryDisplayed: boolean


  readonly setPropertyEditor_setSelectedFieldToNull: () => void

  //set prop funcs where we have NO old value can only set when one shape is selected


  // readonly setSymbol_overwrite_FieldText: (overwrite: boolean) => void
  readonly setPropertyEditor_FieldText: (newText: string) => void

  readonly setPropertyEditor_FieldWidth: (oldWidth: number, newWidth: number) => void
  readonly setPropertyEditor_FieldHeight: (oldHeight: number, newHeight: number) => void
  readonly setPropertyEditor_FieldColor: ( newColor: string) => void
  readonly setPropertyEditor_FieldBgColor: ( newBgColor: string) => void
  readonly setPropertyEditor_FieldVerticalAlign: (verticalAlign: VerticalAlign) => void
  readonly setPropertyEditor_FieldHorizontalAlign: (horizontalAlign: HorizontalAlign) => void
  readonly setPropertyEditor_FieldCmdText: (cmdText: string) => void
  readonly setPropertyEditor_FieldAbsoluteZIndex: (zIndex: number) => void
  readonly setPropertyEditor_FieldCornerRadiusInPx: (newCornerRadiusInPx: number) => void
  readonly setPropertyEditor_FieldPadding: ( newPaddingTop: number, newPaddingRight: number, newPaddingBottom: number,
                                            newPaddingLeft: number
  ) => void

  readonly setPropertyEditor_FieldBorderColor: (newColor: string) => void
  readonly setPropertyEditor_FieldBorderSizeInPx: (newBorderSizeInPx: number) => void

  readonly setPropertyEditor_FieldFontName: ( newFontName: string) => void
  readonly setPropertyEditor_FieldFontSizeInPx: (newFontSizeInPx: number) => void

  readonly setPropertyEditor_FieldIsFontBold: (newIsFontBold: boolean) => void
  readonly setPropertyEditor_FieldIsFontItalic: ( newIsFontItalic: boolean) => void

  readonly setPropertyEditor_FieldRotationInDegree: (oldRotationInDegree: number, newRotationInDegree: number) => void

  readonly setPropertyEditor_field_backgroundImgGuid: (newBackgroundImgGuid: string) => void
  readonly setEditor_IsChooseFieldShapeBackgroundImageLibraryDisplayed: (isDisplayed: boolean) => void

  readonly setPropertyEditor_FieldAnchorPoints: (anchorPoints: ReadonlyArray<AnchorPoint>) => void

  //--symbol actions
  readonly set_fieldSymbol_displayName: (displayName: string) => void


  readonly set_fieldSymbol_overwriteBackgroundImage: (overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteRotationInDeg: (overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteCornerRadius: (overwrite: boolean) => void
  readonly set_fieldSymbol_overwritePadding:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteVerticalTextAlign:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteHorizontalTextAlign:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteHeight:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteWidth:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteColor:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteBgColor:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteBorderColor:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteBorderSizeInPx:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteFontName:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteFontSizeInPx:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteFontDecoration:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteText:(overwrite: boolean) => void
  readonly set_fieldSymbol_overwriteCmdText:(overwrite: boolean) => void


}

const mapStateToProps = (rootState: RootState, props: MyProps) => {
  return {
    //test0: rootState...
    //test: props.test
    ...props,
    autoIncrementFieldTextNumbersOnDuplicate: rootState.tileEditorState.tileProps.tileSettings.autoIncrementFieldTextNumbersOnDuplicate,
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


const fieldSymbolCmdTextEditorId = 'fieldSymbolCmdTextEditorId'

class fieldSymbolPropertyEditor extends React.Component<Props, any> {

  componentWillReceiveProps(nextProps: Props) {

    //when we lost focus in the ace editor we commit the field command text
    //if we focus another field the props tab won't change only the controls values
    //thus if we have field 1 focus e.g. command text xxx and we change it to yyy
    //then focus field 2 the editor never lost focus and we don't commit the changes to field 1
    //we only display the field 2 command text
    if (nextProps.fieldShape) {
      if (Array.isArray(this.props.fieldShape) && this.props.fieldShape.length === 1) { //!isSymbol && isSingleField
        const field = this.props.fieldShape[0] as FieldShape
        if (Array.isArray(nextProps.fieldShape) && nextProps.fieldShape.length === 1) {
          const nextField = nextProps.fieldShape[0] as FieldShape
          if (field.id !== nextField.id) {
            const editor = editorInstancesMap[fieldSymbolCmdTextEditorId]
            this.props.setPropertyEditor_FieldCmdText(editor.getValue())
          }
        }
      }
    }
  }

  render(): JSX.Element {



    const fieldSymbol = this.props.fieldShape


    let connectedPointsList = ''

    return (<div>

      {//else enter would trigger submission and clear all
      }
      <Form as="div">

        <Form.Field>
          <div className="flex-left-right">
            <ToolTip
              message={getI18n(this.props.langId, "Deselect shape")}
            >
              <Button icon
                      onClick={() => {
                        this.props.setPropertyEditor_setSelectedFieldToNull()
                      }}
              >

                <Icon.Group>
                  <Icon name='square outline'/>
                  <Icon corner name='x'/>
                </Icon.Group>
              </Button>
            </ToolTip>

          </div>
        </Form.Field>


          <div>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Command text")}
                <IconToolTip
                  message={'Click to validate the code syntactically'}
                  icon="code"
                  onClick={() => {

                    const editor = editorInstancesMap[fieldSymbolCmdTextEditorId]

                    if (!editor) {
                      Logger.fatal(`could not get editor instance`)
                      return
                    }

                    // let state = AbstractMachine.createNewMachineState()
                    let unit: GameUnit
                    try {
                      unit = Simulator.compiler.parse(editor.getValue())
                    } catch (err) {
                      Logger.fatalSyntaxError(`field statements has errors: ${err}`)
                      return
                    }

                    if (unit.game_def_stats.length > 0) {
                      Logger.fatal(`field statements must not contain game setup statements`)
                    }

                    //TOOD
                    //do not execute because we might use vars that are not defined yet (TODO if we allow on the fly vars? needed for funcs)

                    // try {
                    //   for (const statement of unit.statements) {
                    //     state = AbstractMachine.executeStatement(statement, state)
                    //   }
                    // } catch (err) {
                    //   Logger.fatal(`error during statements: ${err}`)
                    //   return
                    // }

                    Logger.success('Field statements are syntactically valid')

                  }}
                >
                </IconToolTip>

                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteCmdText}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteCmdText(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />

              </label>
              <EditorWrapper
                id={fieldSymbolCmdTextEditorId}
                readony={false}
                value={fieldSymbol.cmdText || ''}
                height={'100px'}
                onLostFocus={val => {
                  this.props.setPropertyEditor_FieldCmdText(val)
                }}
              />

            </Form.Field>


          </div>

        <Form.Field>
          <label>{getI18n(this.props.langId, "Name")}</label>
          <input value={fieldSymbol.displayName}
                 onChange={(e) => this.props.set_fieldSymbol_displayName(e.currentTarget.value)}
          />
        </Form.Field>

          <Form.Group widths='equal'>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Height")}
                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteHeight}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteHeight(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              <input type="number"
                     value={fieldSymbol.height}
                     onChange={(e) => this.props.setPropertyEditor_FieldHeight(
                       fieldSymbol.height,
                       parseInt(e.currentTarget.value)
                     )}
              />
            </Form.Field>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Width")}
                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteWidth}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteWidth(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              <input type="number"
                     value={fieldSymbol.width}
                     onChange={(e) => this.props.setPropertyEditor_FieldWidth(
                       fieldSymbol.width,
                       parseInt(e.currentTarget.value)
                     )}
              />
            </Form.Field>
          </Form.Group>

          <Form.Group widths='equal'>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Color")}
                <IconToolTip message={getI18n(this.props.langId,
                  "To use transparent set the color to black (0, 0, 0) and then set alpha to 0"
                )}/>
                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteColor}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteColor(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              {/*<input type="color"*/}
              {/*value={*/}
              {/*isSymbol*/}
              {/*? fieldSymbol.color*/}
              {/*: isSingleField ? singleField.color*/}
              {/*: singleField.color*/}
              {/*}*/}
              {/*onChange={(e) => this.props.setPropertyEditor_FieldColor(*/}
              {/*isSymbol ? fieldSymbol.color : singleField.color,*/}
              {/*e.currentTarget.value)}*/}
              {/*/>*/}
              <Popup
                trigger={<div className="hoverable">
                  <Icon style={{
                    'color': 'black' //use black... if we use the selected color e.g. white this is bad/not visible...
                  }} name="paint brush"/>
                </div>}
                on="click"
                offset={horizontalIconPopupOffsetInPx}
                content={<ChromePicker
                  color={fieldSymbol.color}
                  onChangeComplete={color => {
                    this.props.setPropertyEditor_FieldColor( color.hex)
                  }}
                />}
              />

            </Form.Field>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Background color")}
                <IconToolTip message={getI18n(this.props.langId,
                  "To use transparent set the color to black (0, 0, 0) and then set alpha to 0"
                )}/>
                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteBgColor}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteBgColor(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>

              <div className="flexed-well-spaced">
                <Popup
                  trigger={<div className="hoverable">
                    <Icon style={{
                      'color': 'black'
                    }} name="paint brush"/>
                  </div>}
                  on="click"
                  offset={horizontalIconPopupOffsetInPx}
                  content={<ChromePicker
                    color={fieldSymbol.bgColor}
                    onChangeComplete={color => {
                      this.props.setPropertyEditor_FieldBgColor( color.hex)
                    }}
                  />}
                />

                <div className="hoverable">
                  <IconToolTip
                    message={getI18n(this.props.langId, "Transparent color")}
                    icon="circle outline"
                    onClick={() => {
                      this.props.setPropertyEditor_FieldBgColor( 'transparent')
                    }}
                  />
                </div>
              </div>

            </Form.Field>
          </Form.Group>

          <Form.Group widths='equal'>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Border color")}
                <IconToolTip message={getI18n(this.props.langId,
                  "To use transparent set the color to black (0, 0, 0) and then set alpha to 0"
                )}/>
                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteBorderColor}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteBorderColor(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              <Popup
                trigger={<div className="hoverable">
                  <Icon style={{
                    'color': 'black'
                  }} name="paint brush"/>
                </div>}
                on="click"
                offset={horizontalIconPopupOffsetInPx}
                content={<ChromePicker
                  color={fieldSymbol.borderColor}
                  onChangeComplete={color => {
                    this.props.setPropertyEditor_FieldBorderColor( color.hex)
                  }}
                />}
              />
            </Form.Field>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Border size in px")}
                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteBorderSizeInPx}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteBorderSizeInPx(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              <input type="number"
                     value={fieldSymbol.borderSizeInPx}

                     onChange={(e) => this.props.setPropertyEditor_FieldBorderSizeInPx(
                       parseInt(e.currentTarget.value)
                     )}
              />
            </Form.Field>
          </Form.Group>


          <Form.Group widths='equal'>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Font name")}
                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteFontName}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteFontName(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              <input type="text"
                     value={fieldSymbol.fontName}
                     onChange={(e) => this.props.setPropertyEditor_FieldFontName(
                       e.currentTarget.value
                     )}
              />
            </Form.Field>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Font size in px")}
                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteFontSizeInPx}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteFontSizeInPx(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              <input type="number"
                     value={fieldSymbol.fontSizeInPx}
                     onChange={(e) => this.props.setPropertyEditor_FieldFontSizeInPx(
                       parseInt(e.currentTarget.value)
                     )}
              />
            </Form.Field>
          </Form.Group>


          <Form.Field>
            <label>{getI18n(this.props.langId, "Text decoration")}
              <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteFontDecoration}
                        onChange={(event, data: CheckboxData) => {
                          this.props.set_fieldSymbol_overwriteFontDecoration(data.checked)
                        }}
                        label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
              />
            </label>
            <Button.Group>
              <Button
                active={fieldSymbol.isFontBold}
                icon
                onClick={() => {
                  this.props.setPropertyEditor_FieldIsFontBold(!fieldSymbol.isFontBold)
                }}
              >
                <Icon name='bold'/>
              </Button>
              <Button
                active={fieldSymbol.isFontItalic}
                icon
                onClick={() => {

                  this.props.setPropertyEditor_FieldIsFontItalic(!fieldSymbol.isFontItalic)
                }}
              >
                <Icon name='italic'/>
              </Button>
              {/*<Button*/}
              {/*active={*/}
              {/*(isSymbol*/}
              {/*? fieldSymbol.horizontalTextAlign*/}
              {/*: isSingleField ? singleField.horizontalTextAlign*/}
              {/*: singleField.horizontalTextAlign) === HorizontalAlign.right*/}
              {/*}*/}
              {/*icon*/}
              {/*onClick={() => this.props.setPropertyEditor_FieldHorizontalAlign(*/}
              {/*HorizontalAlign.right)}*/}
              {/*>*/}
              {/*<Icon name='underline'/>*/}
              {/*</Button>*/}
            </Button.Group>
          </Form.Field>

        <Form.Field>
          <label>{getI18n(this.props.langId, "Text")}
              <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteText}
                        onChange={(event, data: CheckboxData) => {
                          this.props.set_fieldSymbol_overwriteText(data.checked)
              }}
              label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
              />
          </label>
          <textarea rows={2}
                    value={fieldSymbol.text}
                    onChange={(e) => this.props.setPropertyEditor_FieldText(e.currentTarget.value)}
          />
        </Form.Field>


          <Form.Group widths='equal'>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Horizontal text align")}
                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteHorizontalTextAlign}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteHorizontalTextAlign(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              <Button.Group>
                <Button
                  active={fieldSymbol.horizontalTextAlign === HorizontalAlign.left}
                  icon
                  onClick={() => this.props.setPropertyEditor_FieldHorizontalAlign(HorizontalAlign.left)}
                >
                  <Icon name='align left'/>
                </Button>
                <Button
                  active={fieldSymbol.horizontalTextAlign === HorizontalAlign.center}
                  icon
                  onClick={() => this.props.setPropertyEditor_FieldHorizontalAlign(HorizontalAlign.center)}
                >
                  <Icon name='align center'/>
                </Button>
                <Button
                  active={ fieldSymbol.horizontalTextAlign === HorizontalAlign.right}
                  icon
                  onClick={() => this.props.setPropertyEditor_FieldHorizontalAlign(HorizontalAlign.right)}
                >
                  <Icon name='align right'/>
                </Button>
              </Button.Group>
            </Form.Field>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Vertical text align")}
                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteVerticalTextAlign}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteVerticalTextAlign(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              <Button.Group>
                <Button
                  active={fieldSymbol.verticalTextAlign === VerticalAlign.top}
                  icon
                  onClick={() => this.props.setPropertyEditor_FieldVerticalAlign(VerticalAlign.top)}
                >
                  <Icon name='caret up'/>
                </Button>
                <Button
                  active={fieldSymbol.verticalTextAlign === VerticalAlign.center}
                  icon
                  onClick={() => this.props.setPropertyEditor_FieldVerticalAlign(VerticalAlign.center)}
                >
                  <Icon name='align center'/>
                </Button>
                <Button
                  active={fieldSymbol.verticalTextAlign === VerticalAlign.bottom}
                  icon
                  onClick={() => this.props.setPropertyEditor_FieldVerticalAlign(VerticalAlign.bottom)}
                >
                  <Icon name='caret down'/>
                </Button>
              </Button.Group>
            </Form.Field>
          </Form.Group>

          <Form.Field>
            <label>{getI18n(this.props.langId, "padding (for text align)")}
              <Checkbox className="mar-left-half" checked={fieldSymbol.overwritePadding}
                        onChange={(event, data: CheckboxData) => {
                          this.props.set_fieldSymbol_overwritePadding(data.checked)
                        }}
                        label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
              />
            </label>

            <div className="padding-inputs">
              <Input type="number"
                     value={fieldSymbol.padding.left}

                     onChange={(e) => this.props.setPropertyEditor_FieldPadding(fieldSymbol.padding.top,
                       fieldSymbol.padding.right,
                       fieldSymbol.padding.bottom,
                       parseInt(e.currentTarget.value)
                     )}
              />

              <div>
                <Input type="number"
                       value={fieldSymbol.padding.top}
                       onChange={(e) => this.props.setPropertyEditor_FieldPadding(parseInt(e.currentTarget.value),
                         fieldSymbol.padding.right,
                         fieldSymbol.padding.bottom,
                         fieldSymbol.padding.left
                       )}
                />
                <br/>
                <Input type="number"
                       value={fieldSymbol.padding.bottom}
                       onChange={(e) => this.props.setPropertyEditor_FieldPadding(fieldSymbol.padding.top,
                         fieldSymbol.padding.right,
                         parseInt(e.currentTarget.value),
                         fieldSymbol.padding.left,
                       )}
                />
              </div>

              <Input type="number"
                     value={fieldSymbol.padding.right}
                     onChange={(e) => this.props.setPropertyEditor_FieldPadding(fieldSymbol.padding.top,
                       parseInt(e.currentTarget.value),
                       fieldSymbol.padding.bottom,
                       fieldSymbol.padding.left,
                     )}
              />
            </div>

          </Form.Field>


        <Form.Group widths='equal'>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Corner radius in px")}
                <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteCornerRadius}
                          onChange={(event, data: CheckboxData) => {
                            this.props.set_fieldSymbol_overwriteCornerRadius(data.checked)
                          }}
                          label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
                />
              </label>
              <input type="number"
                     value={fieldSymbol.cornerRadiusInPx}
                     onChange={(e) => this.props.setPropertyEditor_FieldCornerRadiusInPx(
                       parseInt(e.currentTarget.value)
                     )}
              />
            </Form.Field>

        </Form.Group>



          <Form.Field>
            <label>{getI18n(this.props.langId, "Rotation in degree")}
              <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteRotationInDeg}
                        onChange={(event, data: CheckboxData) => {
                          this.props.set_fieldSymbol_overwriteRotationInDeg(data.checked)
                        }}
                        label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
              />
            </label>
            <Input
              value={fieldSymbol.rotationInDegree}
              type="number"
              onChange={(e) => this.props.setPropertyEditor_FieldRotationInDegree(
                fieldSymbol.rotationInDegree,
                parseInt(e.currentTarget.value)
              )}
              label={<Button icon onClick={() => {
                this.props.setPropertyEditor_FieldRotationInDegree(fieldSymbol.rotationInDegree, 0)
              }}>
                <Icon name="undo"/>
              </Button>}
              labelPosition='right'
            />
          </Form.Field>


          <Form.Field>
            <label>{getI18n(this.props.langId, "Image")}
              <Checkbox className="mar-left-half" checked={fieldSymbol.overwriteBackgroundImage}
                        onChange={(event, data: CheckboxData) => {
                          this.props.set_fieldSymbol_overwriteBackgroundImage(data.checked)
                        }}
                        label={<label><IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used")}/></label>}
              />
            </label>

            <Input labelPosition='right' type='text'>
              <input
                readOnly
                value={fieldSymbol.backgroundImgGuid === null
                  ? ''
                  : fieldSymbol.backgroundImgGuid}
              />
              <Button icon onClick={() => {
                this.props.setEditor_IsChooseFieldShapeBackgroundImageLibraryDisplayed(true)
              }}>
                <Icon name="write"/>
              </Button>
            </Input>
            <ImageLibrary
              isCreatingNewImgShape={false}
              onImageTaken={(imgSurrogate) => {
                this.props.setPropertyEditor_field_backgroundImgGuid(imgSurrogate.guid)

                this.props.setEditor_IsChooseFieldShapeBackgroundImageLibraryDisplayed(false)
              }}
              isDisplayed={this.props.isChooseFieldShapeBackgroundImageLibraryDisplayed}
              set_isDisplayed={(isDisplayed) => {
                this.props.setEditor_IsChooseFieldShapeBackgroundImageLibraryDisplayed(isDisplayed)
              }}
            />

          </Form.Field>


        {
          // anchor points are always overwritten
          <div>
            {(fieldSymbol).anchorPoints.map((anchorPoint, index) => {
              return (<div key={index}>

                <Divider/>
                <Form.Group>
                  <Form.Field>
                    <label>{getI18n(this.props.langId, "Anchor point")} {index + 1} x in %
                      <IconToolTip message={getI18n(
                        this.props.langId,
                        "Anchor points are used to snap lines to fields. When they are snapped then they are connected"
                      )}/>
                    </label>
                    <input type="number"
                           value={anchorPoint.percentX}
                           onChange={(e) => {

                             const newPercentageX = parseInt(e.currentTarget.value)
                             const newList = fieldSymbol.anchorPoints.map((p, i) => {
                               return i !== index
                                 ? p
                                 : {
                                   ...p,
                                   percentX: newPercentageX
                                 }
                             })
                             this.props.setPropertyEditor_FieldAnchorPoints(newList)
                           }}
                    />

                  </Form.Field>
                  <Form.Field>
                    <label>{getI18n(this.props.langId, "Anchor point")} {index + 1} y in %
                      <IconToolTip message={getI18n(
                        this.props.langId,
                        "Anchor points are used to snap lines to fields. When they are snapped then they are connected"
                      )}/>
                    </label>
                    <input type="number"
                           value={anchorPoint.percentY}
                           onChange={(e) => {

                             const newPercentageY = parseInt(e.currentTarget.value)
                             const newList = fieldSymbol.anchorPoints.map((p, i) => {
                               return i !== index
                                 ? p
                                 : {
                                   ...p,
                                   percentY: newPercentageY
                                 }
                             })
                             this.props.setPropertyEditor_FieldAnchorPoints(newList)

                           }}
                    />
                  </Form.Field>

                  <Form.Field>
                    <Button color="red" icon
                            onClick={() => {
                              this.props.setPropertyEditor_FieldAnchorPoints(fieldSymbol.anchorPoints.filter(
                                ((p, i) => i !== index)))
                            }}
                    >
                      <Icon name="x"/>
                    </Button>
                  </Form.Field>

                </Form.Group>

              </div>)
            })}


            <Button icon
                    onClick={() => {

                      const newPoint: AnchorPoint = {
                        percentX: 50,
                        percentY: 50
                      }

                      this.props.setPropertyEditor_FieldAnchorPoints(fieldSymbol.anchorPoints.concat(newPoint))
                    }}
            >
              <Icon name="add"/>
            </Button>
            <Divider/>
          </div>}
      </Form>
    </div>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(fieldSymbolPropertyEditor)
