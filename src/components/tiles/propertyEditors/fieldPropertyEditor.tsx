import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {Form, Button, Icon, Input, Divider, Popup} from 'semantic-ui-react'
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
import SymbolLibrary from "../symbolModalLibrary/symbolLibrary";


export interface MyProps {

  readonly fieldShape: ReadonlyArray<FieldShape>

  readonly fieldSymbols: ReadonlyArray<FieldSymbol>

  readonly isChooseFieldShapeBackgroundImageLibraryDisplayed: boolean


  readonly setPropertyEditor_setSelectedFieldToNull: () => void

  //set prop funcs where we have NO old value can only set when one shape is selected

  readonly setPropertyEditor_FieldText: (oldText: string, newText: string) => void
  readonly setPropertyEditor_FieldX: (oldX: number, newX: number) => void
  readonly setPropertyEditor_FieldY: (oldY: number, newY: number) => void
  readonly setPropertyEditor_FieldWidth: (oldWidth: number, newWidth: number) => void
  readonly setPropertyEditor_FieldHeight: (oldHeight: number, newHeight: number) => void
  readonly setPropertyEditor_FieldColor: (oldColor: string, newColor: string) => void
  readonly setPropertyEditor_FieldBgColor: (oldBgColor: string, newBgColor: string) => void
  readonly setPropertyEditor_FieldVerticalAlign: (verticalAlign: VerticalAlign) => void
  readonly setPropertyEditor_FieldHorizontalAlign: (horizontalAlign: HorizontalAlign) => void
  readonly setPropertyEditor_FieldCmdText: (cmdText: string) => void
  readonly setPropertyEditor_FieldAbsoluteZIndex: (zIndex: number) => void
  readonly setPropertyEditor_FieldCornerRadiusInPx: (oldCornerRadiusInPx: number, newCornerRadiusInPx: number) => void
  readonly setPropertyEditor_FieldPadding: (oldPaddingTop: number, oldPaddingRight: number, oldPaddingBottom: number,
                                            oldPaddingLeft: number, newPaddingTop: number, newPaddingRight: number, newPaddingBottom: number,
                                            newPaddingLeft: number
  ) => void

  readonly setPropertyEditor_FieldBorderColor: (oldColor: string, newColor: string) => void
  readonly setPropertyEditor_FieldBorderSizeInPx: (oldBorderSizeInPx: number, newBorderSizeInPx: number) => void

  readonly setPropertyEditor_FieldFontName: (oldFontName: string, newFontName: string) => void
  readonly setPropertyEditor_FieldFontSizeInPx: (oldFontSizeInPx: number, newFontSizeInPx: number) => void

  readonly setPropertyEditor_FieldIsFontBold: (oldIsFontBold: boolean, newIsFontBold: boolean) => void
  readonly setPropertyEditor_FieldIsFontItalic: (oldIsFontItalic: boolean, newIsFontItalic: boolean) => void

  readonly setPropertyEditor_FieldRotationInDegree: (oldRotationInDegree: number, newRotationInDegree: number) => void

  readonly setPropertyEditor_field_backgroundImgGuid: (
    oldBackgroundImgGuid: string, newBackgroundImgGuid: string) => void
  readonly setEditor_IsChooseFieldShapeBackgroundImageLibraryDisplayed: (isDisplayed: boolean) => void

  readonly setPropertyEditor_FieldConnectedLinesThroughAnchors: (
    lineId: number, connectedLinesThroughAnchors: ReadonlyArray<number> | null) => void

  readonly setPropertyEditor_FieldAnchorPoints: (anchorPoints: ReadonlyArray<AnchorPoint>) => void
  readonly setPropertyEditor_removeFieldShape: () => void
  readonly onAddFieldSymbol: () => void

  readonly setPropertyEditor_FieldIsBasedOnSymbol: (oldSymbolGuid: string | null, symbolGuid: string | null) => void

  /**
   * called when a shape is duplicated, the newly added shape (props are already set)
   * we need to pass all because the parent can not add one after another because the same render loop...
   */
  readonly onDuplicateFields: (newFieldShape: ReadonlyArray<FieldShape>) => void

  readonly setTileEditorSelectingNextField: (
    isSelectingNextField: boolean, sourceForSelectingNextField: FieldShape | null) => void

  //--symbol actions

  /**
   * when we click on the overwrite arrow we want to open the symbol from which we inherit the settings
   */
  readonly onGotoSymbol: (symbol: FieldSymbol) => void

  readonly set_isSymbolLibraryModalDisplayed: () => void

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


const fieldCmdTextEditorId = 'fieldCmdTextEditorId'

class fieldPropertyEditor extends React.Component<Props, any> {

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
            const editor = editorInstancesMap[fieldCmdTextEditorId]

            if (editor) {
              this.props.setPropertyEditor_FieldCmdText(editor.getValue())
            }
          }
        }
      }
    }
  }

  render(): JSX.Element {


    const areFieldShapes = this.props.fieldShape.length > 1
    let isSingleField = this.props.fieldShape.length === 1

    //we need to specify an old val when we have multiple fields to we take the first
    const singleField: FieldShape = this.props.fieldShape[0]

    const isSomeFieldBasedOnSymbol = isSingleField && singleField !== null && singleField.createdFromSymbolGuid !== null || areFieldShapes && this.props.fieldShape.some(
      p => p.createdFromSymbolGuid !== null)

    let connectedPointsList = ''

    if (isSingleField) {
      let points: number[] = []
      for (const key in singleField.connectedLinesThroughAnchorPoints) {
        const list = singleField.connectedLinesThroughAnchorPoints[key]
        points = points.concat(list)
      }
      connectedPointsList = points.join(', ')
    }

    const isBasedOnSymbol = isSingleField && isSomeFieldBasedOnSymbol

    let fieldSymbol: FieldSymbol | null = null

    if (isBasedOnSymbol) {
      const temp = this.props.fieldSymbols.find(p => p.guid === singleField.createdFromSymbolGuid)

      if (temp) {
        fieldSymbol = temp
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
                      this.props.setPropertyEditor_setSelectedFieldToNull()
                    }}
            >

              <Icon name="remove"/>
            </Button>
          </ToolTip>

          {isSingleField && isSomeFieldBasedOnSymbol === false && <ToolTip
            message={getI18n(
              this.props.langId,
              "Adds the current shape as a new symbol and links this shape to the newly added symbol (this shape is then an instance of the symbol because the properties of the symbols are used for visuals). A little icon is displayed on the shape to indicate a symbol instance"
            )}
          >
            <Button icon
                    onClick={() => {
                      this.props.onAddFieldSymbol()
                    }}
            >
              <Icon.Group>
                <Icon name='clone'/>
                <Icon corner name='asterisk'/>
              </Icon.Group>
            </Button>
          </ToolTip>}

          {isSingleField && isSomeFieldBasedOnSymbol === false && <ToolTip
            message={getI18n(
              this.props.langId,
              "Attaches the shape to a symbol. The shape will then use the symbol properties"
            )}
          >
            <Button icon
                    onClick={() => {
                      this.props.set_isSymbolLibraryModalDisplayed()
                    }}
            >
              <Icon.Group>
                <Icon name='clone'/>
                <Icon corner name='arrow down'/>
              </Icon.Group>
            </Button>
          </ToolTip>}

          {isSingleField && isSomeFieldBasedOnSymbol && <ToolTip
            message={getI18n(
              this.props.langId,
              "Detaches the shape from the connected symbol. The shape will then use its own properties again"
            )}
          >
            <Button icon
                    onClick={() => {
                      this.props.setPropertyEditor_FieldIsBasedOnSymbol(singleField.createdFromSymbolGuid, null)
                    }}
            >
              <Icon.Group>
                <Icon name='clone'/>
                <Icon name='remove'/>
              </Icon.Group>
            </Button>
          </ToolTip>}

          <Button.Group>
            <ToolTip
              message={getRawI18n(
                this.props.langId,
                "Copy this shape and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) for all selected shapes from left to right. Shortcut <div class='keys'>ctrl+d</div>, <div class='keys'>cmd+d</div>"
              )}
            >
              <Button icon
                      onClick={() => {

                        const fieldShapes = (this.props.fieldShape as ReadonlyArray<FieldShape>)
                        const copies = DuplicateHelper.duplicateFieldShapes(fieldShapes,
                          this.props.amountOfShapesInTile, this.props.autoIncrementFieldTextNumbersOnDuplicate, false
                        )
                        this.props.onDuplicateFields(copies)
                      }}
              >
                <Icon.Group>
                  <Icon name='paste'/>
                  <Icon corner name='long arrow alternate right'/>
                </Icon.Group>
              </Button>
            </ToolTip>

            <ToolTip
              message={getRawI18n(
                this.props.langId,
                "Copy this shape and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) for all selected shapes from right to left. Shortcut <div class='keys'>ctrl+shift+d</div>, <div class='keys'>cmd+shift+d</div>"
              )}
            >
              <Button icon
                      onClick={() => {
                        const fieldShapes = (this.props.fieldShape as ReadonlyArray<FieldShape>)
                        const copies = DuplicateHelper.duplicateFieldShapes(fieldShapes,
                          this.props.amountOfShapesInTile, this.props.autoIncrementFieldTextNumbersOnDuplicate, true
                        )
                        this.props.onDuplicateFields(copies)
                      }}
              >
                <Icon.Group>
                  <Icon name='paste'/>
                  <Icon corner name='long arrow alternate left'/>
                </Icon.Group>
              </Button>
            </ToolTip>
          </Button.Group>


          <Button color="red" icon
                  onClick={() => {

                    this.props.setPropertyEditor_removeFieldShape()

                  }}
          >
            <Icon name="trash"/>
          </Button>
        </div>
      </Form.Field>
    )


    if (areFieldShapes && isSomeFieldBasedOnSymbol) {
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

    return (<div>

      {//else enter would trigger submission and clear all
      }
      <Form as="div">
        {
          actionsButtonsContent
        }

        {//if this field is based on a symbol... we cannot change this
          isSingleField && <Form.Field>
            <label>{getI18n(this.props.langId, "Id")}: {singleField.id}</label>
          </Form.Field>}
        {//we use field symbols only for shape not for commands
          isSingleField && <div>
            <Form.Field>
              <label>{getI18n(this.props.langId, "Command text")}
                <IconToolTip
                  message={'Click to validate the code syntactically'}
                  icon="code"
                  onClick={() => {

                    const editor = editorInstancesMap[fieldCmdTextEditorId]

                    if (!editor) {
                      Logger.fatal(`could not get editor instance`)
                      return
                    }

                    // let state = AbstractMachine.createNewMachineState()
                    let unit: GameUnit
                    try {
                      unit = Simulator.compiler.parse(editor.getValue())
                    } catch (err) {
                      Logger.fatal(`field statements has errors: ${err}`)
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

                {
                  isBasedOnSymbol && fieldSymbol.overwriteCmdText &&
                  <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
                }
              </label>
              <EditorWrapper
                id={fieldCmdTextEditorId}
                readony={isBasedOnSymbol && fieldSymbol.overwriteCmdText}
                value={(isBasedOnSymbol && fieldSymbol.overwriteCmdText
                  ? fieldSymbol.cmdText
                  : isSingleField
                    ? singleField.cmdText
                    : singleField.cmdText) || ''}
                height={'100px'}
                onLostFocus={val => {
                  this.props.setPropertyEditor_FieldCmdText(val)
                }}
              />

            </Form.Field>

            <ToolTip
              message={getRawI18n(
                this.props.langId,
                "Enables the next field mode. When you then click on a field (the next field) or a border point then a control goto statement is added to the command text and the next field is selected. To quit the mode click elsewhere on the canvas. Shortcut: <div class='keys'>ctrl+n</div>, <div class='keys'>cmd+n</div>. Press the shortcut again to disable the mode or <div class='keys'>esc</div>."
              )}
            >
              <Button icon disabled={isBasedOnSymbol && fieldSymbol.overwriteCmdText}
                      onClick={() => {
                        this.props.setTileEditorSelectingNextField(true, this.props.fieldShape[0] as FieldShape)
                      }}
              >
                <Icon name="share"/>
              </Button>
            </ToolTip>

          </div>}

        {isBasedOnSymbol && <Form.Field>
          <label>{getI18n(this.props.langId, "Name")}</label>
          <input value={fieldSymbol.displayName} disabled/>
        </Form.Field>}

        {isSingleField && <Form.Group widths='equal'>
          <Form.Field>
            <label>X</label>
            <input type="number"
                   value={singleField.x}
                   onChange={(e) => this.props.setPropertyEditor_FieldX(singleField.x,
                     parseInt(e.currentTarget.value)
                   )}
            />
          </Form.Field>
          <Form.Field>
            <label>Y</label>
            <input type="number"
                   value={singleField.y}

                   onChange={(e) => this.props.setPropertyEditor_FieldY(singleField.y,
                     parseInt(e.currentTarget.value)
                   )}
            />
          </Form.Field>
        </Form.Group>}


        <Form.Group widths='equal'>
          <Form.Field>
            <label>{getI18n(this.props.langId, "Height")}
              {
                isBasedOnSymbol && fieldSymbol.overwriteHeight &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
            </label>
            <input type="number" disabled={isBasedOnSymbol && fieldSymbol.overwriteHeight}
                   value={isBasedOnSymbol && fieldSymbol.overwriteHeight
                     ? fieldSymbol.height
                     : isSingleField /* what is this??? */
                       ? singleField.height
                       : singleField.height}
                   onChange={(e) => this.props.setPropertyEditor_FieldHeight(isBasedOnSymbol && fieldSymbol.overwriteHeight
                     ? fieldSymbol.height
                     : singleField.height,
                     parseInt(e.currentTarget.value)
                   )}
            />
          </Form.Field>
          <Form.Field>
            <label>{getI18n(this.props.langId, "Width")}
              {
                isBasedOnSymbol && fieldSymbol.overwriteWidth &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
            </label>
            <input type="number" disabled={isBasedOnSymbol && fieldSymbol.overwriteWidth}
                   value={isBasedOnSymbol && fieldSymbol.overwriteWidth
                     ? fieldSymbol.width
                     : isSingleField
                       ? singleField.width
                       : singleField.width}
                   onChange={(e) => this.props.setPropertyEditor_FieldWidth(isBasedOnSymbol && fieldSymbol.overwriteWidth
                     ? fieldSymbol.width
                     : singleField.width,
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
              {
                isBasedOnSymbol && fieldSymbol.overwriteColor &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
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
                color={isBasedOnSymbol && fieldSymbol.overwriteColor
                  ? fieldSymbol.color
                  : isSingleField
                    ? singleField.color
                    : singleField.color}
                onChangeComplete={color => {

                  if (isBasedOnSymbol && fieldSymbol.overwriteColor) return

                  this.props.setPropertyEditor_FieldColor(isBasedOnSymbol && fieldSymbol.overwriteColor
                    ? fieldSymbol.color
                    : singleField.color, color.hex)
                }}
              />}
            />

          </Form.Field>
          <Form.Field>
            <label>{getI18n(this.props.langId, "Background color")}
              <IconToolTip message={getI18n(this.props.langId,
                "To use transparent set the color to black (0, 0, 0) and then set alpha to 0"
              )}/>
              {
                isBasedOnSymbol && fieldSymbol.overwriteBgColor &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
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
                  color={isBasedOnSymbol && fieldSymbol.overwriteBgColor
                    ? fieldSymbol.bgColor
                    : isSingleField
                      ? singleField.bgColor
                      : singleField.bgColor}
                  onChangeComplete={color => {

                    if (isBasedOnSymbol && fieldSymbol.overwriteBgColor) return

                    this.props.setPropertyEditor_FieldBgColor(isBasedOnSymbol && fieldSymbol.overwriteBgColor
                      ? fieldSymbol.bgColor
                      : singleField.bgColor, color.hex)
                  }}
                />}
              />

              <div className="hoverable">
                <IconToolTip
                  message={getI18n(this.props.langId, "Transparent color")}
                  icon="circle outline"
                  onClick={() => {

                    if (isBasedOnSymbol && fieldSymbol.overwriteBgColor) return

                    this.props.setPropertyEditor_FieldBgColor(isBasedOnSymbol
                      ? fieldSymbol.bgColor
                      : singleField.bgColor, 'transparent')
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
              {
                isBasedOnSymbol && fieldSymbol.overwriteBorderColor &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
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
                color={isBasedOnSymbol && fieldSymbol.overwriteBorderColor
                  ? fieldSymbol.borderColor
                  : isSingleField
                    ? singleField.borderColor
                    : singleField.borderColor}
                onChangeComplete={color => {

                  if (isBasedOnSymbol && fieldSymbol.overwriteBorderColor) return

                  this.props.setPropertyEditor_FieldBorderColor(isBasedOnSymbol && fieldSymbol.overwriteBorderColor
                    ? fieldSymbol.bgColor
                    : singleField.bgColor, color.hex)
                }}
              />}
            />
          </Form.Field>
          <Form.Field>
            <label>{getI18n(this.props.langId, "Border size in px")}
              {
                isBasedOnSymbol && fieldSymbol.overwriteBorderSizeInPx &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
            </label>
            <input type="number" disabled={isBasedOnSymbol && fieldSymbol.overwriteBorderSizeInPx}
                   value={isBasedOnSymbol && fieldSymbol.overwriteBorderSizeInPx
                     ? fieldSymbol.borderSizeInPx
                     : isSingleField
                       ? singleField.borderSizeInPx
                       : singleField.borderSizeInPx}

                   onChange={(e) => this.props.setPropertyEditor_FieldBorderSizeInPx(isBasedOnSymbol && fieldSymbol.overwriteBorderSizeInPx
                     ? fieldSymbol.borderSizeInPx
                     : singleField.borderSizeInPx,
                     parseInt(e.currentTarget.value)
                   )}
            />
          </Form.Field>
        </Form.Group>


        <Form.Group widths='equal'>
          <Form.Field>
            <label>{getI18n(this.props.langId, "Font name")}
              {
                isBasedOnSymbol && fieldSymbol.overwriteFontName &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
            </label>
            <input type="text" disabled={isBasedOnSymbol && fieldSymbol.overwriteFontName}
                   value={isBasedOnSymbol && fieldSymbol.overwriteFontName
                     ? fieldSymbol.fontName
                     : isSingleField
                       ? singleField.fontName
                       : singleField.fontName}
                   onChange={(e) => this.props.setPropertyEditor_FieldFontName(isBasedOnSymbol && fieldSymbol.overwriteFontName
                     ? fieldSymbol.fontName
                     : singleField.fontName,
                     e.currentTarget.value
                   )}
            />
          </Form.Field>
          <Form.Field>
            <label>{getI18n(this.props.langId, "Font size in px")}
              {
                isBasedOnSymbol && fieldSymbol.overwriteFontSizeInPx &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
            </label>
            <input type="number" disabled={isBasedOnSymbol && fieldSymbol.overwriteFontSizeInPx}
                   value={isBasedOnSymbol && fieldSymbol.overwriteFontSizeInPx
                     ? fieldSymbol.fontSizeInPx
                     : isSingleField
                       ? singleField.fontSizeInPx
                       : singleField.fontSizeInPx}

                   onChange={(e) => this.props.setPropertyEditor_FieldFontSizeInPx(isBasedOnSymbol && fieldSymbol.overwriteFontSizeInPx
                     ? fieldSymbol.fontSizeInPx
                     : singleField.fontSizeInPx,
                     parseInt(e.currentTarget.value)
                   )}
            />
          </Form.Field>
        </Form.Group>


        <Form.Field>
          <label>{getI18n(this.props.langId, "Text decoration")}
            {
              isBasedOnSymbol && fieldSymbol.overwriteFontDecoration &&
              <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
            }
          </label>
          <Button.Group>
            <Button disabled={isBasedOnSymbol && fieldSymbol.overwriteFontDecoration}
                    active={isBasedOnSymbol && fieldSymbol.overwriteFontDecoration
                      ? fieldSymbol.isFontBold
                      : isSingleField
                        ? singleField.isFontBold
                        : singleField.isFontBold}
                    icon
                    onClick={() => {
                      this.props.setPropertyEditor_FieldIsFontBold(
                        isBasedOnSymbol && fieldSymbol.overwriteFontDecoration
                          ? fieldSymbol.isFontBold
                          : singleField.isFontBold, !(isBasedOnSymbol && fieldSymbol.overwriteFontDecoration
                          ? fieldSymbol.isFontBold
                          : singleField.isFontBold))
                    }}
            >
              <Icon name='bold'/>
            </Button>
            <Button disabled={isBasedOnSymbol && fieldSymbol.overwriteFontDecoration}
                    active={isBasedOnSymbol && fieldSymbol.overwriteFontDecoration
                      ? fieldSymbol.isFontItalic
                      : isSingleField
                        ? singleField.isFontItalic
                        : singleField.isFontItalic}
                    icon
                    onClick={() => {

                      this.props.setPropertyEditor_FieldIsFontItalic(
                        isBasedOnSymbol && fieldSymbol.overwriteFontDecoration
                          ? fieldSymbol.isFontItalic
                          : singleField.isFontItalic, !(isBasedOnSymbol && fieldSymbol.overwriteFontDecoration
                          ? fieldSymbol.isFontItalic
                          : singleField.isFontItalic))
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

        {
          isSingleField &&
          <Form.Field>
            <label>{getI18n(this.props.langId, "Text")}
              {
                isBasedOnSymbol && fieldSymbol.overwriteText &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
            </label>
            <textarea rows={2} disabled={isBasedOnSymbol && fieldSymbol.overwriteText}
                      value={isBasedOnSymbol && fieldSymbol.overwriteText
                        ? fieldSymbol.text
                        : isSingleField
                          ? singleField.text
                          : singleField.text}
                      onChange={(e) => this.props.setPropertyEditor_FieldText(isBasedOnSymbol && fieldSymbol.overwriteText
                        ? fieldSymbol.text
                        : singleField.text, e.currentTarget.value)}
            />
          </Form.Field>
        }


        <Form.Group widths='equal'>
          <Form.Field>
            <label>{getI18n(this.props.langId, "Horizontal text align")}
              {
                isBasedOnSymbol && fieldSymbol.overwriteHorizontalTextAlign &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
            </label>
            <Button.Group>
              <Button disabled={isBasedOnSymbol && fieldSymbol.overwriteHorizontalTextAlign}
                      active={(isBasedOnSymbol && fieldSymbol.overwriteHorizontalTextAlign
                        ? fieldSymbol.horizontalTextAlign
                        : isSingleField
                          ? singleField.horizontalTextAlign
                          : singleField.horizontalTextAlign) === HorizontalAlign.left}
                      icon
                      onClick={() => this.props.setPropertyEditor_FieldHorizontalAlign(HorizontalAlign.left)}
              >
                <Icon name='align left'/>
              </Button>
              <Button disabled={isBasedOnSymbol && fieldSymbol.overwriteHorizontalTextAlign}
                      active={(isBasedOnSymbol && fieldSymbol.overwriteHorizontalTextAlign
                        ? fieldSymbol.horizontalTextAlign
                        : isSingleField
                          ? singleField.horizontalTextAlign
                          : singleField.horizontalTextAlign) === HorizontalAlign.center}
                      icon
                      onClick={() => this.props.setPropertyEditor_FieldHorizontalAlign(HorizontalAlign.center)}
              >
                <Icon name='align center'/>
              </Button>
              <Button disabled={isBasedOnSymbol && fieldSymbol.overwriteHorizontalTextAlign}
                      active={(isBasedOnSymbol && fieldSymbol.overwriteHorizontalTextAlign
                        ? fieldSymbol.horizontalTextAlign
                        : isSingleField
                          ? singleField.horizontalTextAlign
                          : singleField.horizontalTextAlign) === HorizontalAlign.right}
                      icon
                      onClick={() => this.props.setPropertyEditor_FieldHorizontalAlign(HorizontalAlign.right)}
              >
                <Icon name='align right'/>
              </Button>
            </Button.Group>
          </Form.Field>
          <Form.Field>
            <label>{getI18n(this.props.langId, "Vertical text align")}
              {
                isBasedOnSymbol && fieldSymbol.overwriteVerticalTextAlign &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
            </label>
            <Button.Group>
              <Button disabled={isBasedOnSymbol && fieldSymbol.overwriteVerticalTextAlign}
                      active={(isBasedOnSymbol && fieldSymbol.overwriteVerticalTextAlign
                        ? fieldSymbol.verticalTextAlign
                        : isSingleField
                          ? singleField.verticalTextAlign
                          : singleField.verticalTextAlign) === VerticalAlign.top}
                      icon
                      onClick={() => this.props.setPropertyEditor_FieldVerticalAlign(VerticalAlign.top)}
              >
                <Icon name='caret up'/>
              </Button>
              <Button disabled={isBasedOnSymbol && fieldSymbol.overwriteVerticalTextAlign}
                      active={(isBasedOnSymbol && fieldSymbol.overwriteVerticalTextAlign
                        ? fieldSymbol.verticalTextAlign
                        : isSingleField
                          ? singleField.verticalTextAlign
                          : singleField.verticalTextAlign) === VerticalAlign.center}
                      icon
                      onClick={() => this.props.setPropertyEditor_FieldVerticalAlign(VerticalAlign.center)}
              >
                <Icon name='align center'/>
              </Button>
              <Button disabled={isBasedOnSymbol && fieldSymbol.overwriteVerticalTextAlign}
                      active={(isBasedOnSymbol && fieldSymbol.overwriteVerticalTextAlign
                        ? fieldSymbol.verticalTextAlign
                        : isSingleField
                          ? singleField.verticalTextAlign
                          : singleField.verticalTextAlign) === VerticalAlign.bottom}
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
            {
              isBasedOnSymbol && fieldSymbol.overwritePadding &&
              <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
            }
          </label>

          <div className="padding-inputs">
            <Input type="number" disabled={isBasedOnSymbol && fieldSymbol.overwritePadding}
                   value={isBasedOnSymbol && fieldSymbol.overwritePadding
                     ? fieldSymbol.padding.left
                     : isSingleField
                       ? singleField.padding.left
                       : singleField.padding.left}

                   onChange={(e) => this.props.setPropertyEditor_FieldPadding(isBasedOnSymbol && fieldSymbol.overwritePadding
                     ? fieldSymbol.padding.top
                     : singleField.padding.top, isBasedOnSymbol && fieldSymbol.overwritePadding
                     ? fieldSymbol.padding.right
                     : singleField.padding.right,
                     isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.bottom
                       : singleField.padding.bottom, isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.left
                       : singleField.padding.left,

                     isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.top
                       : singleField.padding.top, isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.right
                       : singleField.padding.right, isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.bottom
                       : singleField.padding.bottom,
                     parseInt(e.currentTarget.value)
                   )}
            />

            <div>
              <Input type="number" disabled={isBasedOnSymbol && fieldSymbol.overwritePadding}
                     value={isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.top
                       : isSingleField
                         ? singleField.padding.top
                         : singleField.padding.top}
                     onChange={(e) => this.props.setPropertyEditor_FieldPadding(isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.top
                       : singleField.padding.top, isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.right
                       : singleField.padding.right,
                       isBasedOnSymbol && fieldSymbol.overwritePadding
                         ? fieldSymbol.padding.bottom
                         : singleField.padding.bottom, isBasedOnSymbol && fieldSymbol.overwritePadding
                         ? fieldSymbol.padding.left
                         : singleField.padding.left,

                       parseInt(e.currentTarget.value), isBasedOnSymbol && fieldSymbol.overwritePadding
                         ? fieldSymbol.padding.right
                         : singleField.padding.right, isBasedOnSymbol && fieldSymbol.overwritePadding
                         ? fieldSymbol.padding.bottom
                         : singleField.padding.bottom,
                       isBasedOnSymbol && fieldSymbol.overwritePadding
                         ? fieldSymbol.padding.left
                         : singleField.padding.left
                     )}
              />
              <br/>
              <Input type="number" disabled={isBasedOnSymbol && fieldSymbol.overwritePadding}
                     value={isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.bottom
                       : isSingleField
                         ? singleField.padding.bottom
                         : singleField.padding.bottom}
                     onChange={(e) => this.props.setPropertyEditor_FieldPadding(isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.top
                       : singleField.padding.top, isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.right
                       : singleField.padding.right,
                       isBasedOnSymbol && fieldSymbol.overwritePadding
                         ? fieldSymbol.padding.bottom
                         : singleField.padding.bottom, isBasedOnSymbol && fieldSymbol.overwritePadding
                         ? fieldSymbol.padding.left
                         : singleField.padding.left,

                       isBasedOnSymbol && fieldSymbol.overwritePadding
                         ? fieldSymbol.padding.top
                         : singleField.padding.top, isBasedOnSymbol && fieldSymbol.overwritePadding
                         ? fieldSymbol.padding.right
                         : singleField.padding.right, parseInt(e.currentTarget.value),
                       isBasedOnSymbol && fieldSymbol.overwritePadding
                         ? fieldSymbol.padding.left
                         : singleField.padding.left
                     )}
              />
            </div>

            <Input type="number" disabled={isBasedOnSymbol && fieldSymbol.overwritePadding}
                   value={isBasedOnSymbol && fieldSymbol.overwritePadding
                     ? fieldSymbol.padding.right
                     : isSingleField
                       ? singleField.padding.right
                       : singleField.padding.right}
                   onChange={(e) => this.props.setPropertyEditor_FieldPadding(isBasedOnSymbol && fieldSymbol.overwritePadding
                     ? fieldSymbol.padding.top
                     : singleField.padding.top, isBasedOnSymbol && fieldSymbol.overwritePadding
                     ? fieldSymbol.padding.right
                     : singleField.padding.right,
                     isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.bottom
                       : singleField.padding.bottom, isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.left
                       : singleField.padding.left,

                     isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.top
                       : singleField.padding.top, parseInt(e.currentTarget.value), isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.bottom
                       : singleField.padding.bottom,
                     isBasedOnSymbol && fieldSymbol.overwritePadding
                       ? fieldSymbol.padding.left
                       : singleField.padding.left
                   )}
            />
          </div>

        </Form.Field>


        <Form.Group widths='equal'>
          <Form.Field>
            <label>{getI18n(this.props.langId, "Corner radius in px")}
              {
                isBasedOnSymbol && fieldSymbol.overwriteCornerRadius &&
                <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
              }
            </label>
            <input type="number" disabled={isBasedOnSymbol && fieldSymbol.overwriteCornerRadius}
                   value={isBasedOnSymbol && fieldSymbol.overwriteCornerRadius
                     ? fieldSymbol.cornerRadiusInPx
                     : isSingleField
                       ? singleField.cornerRadiusInPx
                       : singleField.cornerRadiusInPx}
                   onChange={(e) => this.props.setPropertyEditor_FieldCornerRadiusInPx(isBasedOnSymbol && fieldSymbol.overwriteCornerRadius
                     ? fieldSymbol.cornerRadiusInPx
                     : singleField.cornerRadiusInPx,
                     parseInt(e.currentTarget.value)
                   )}
            />
          </Form.Field>

          {isBasedOnSymbol === false && isSingleField && <Form.Field>
            <label>{getI18n(this.props.langId, "Z-index")}({singleField.zIndex})</label>
            <Button.Group icon>
              <Button onClick={() => {
                swapZIndexInTile(singleField, singleField.zIndex + 1, false, false, this.props.amountOfShapesInTile,
                  this.props.fieldShapes, this.props.lineShapes, this.props.imgShapes,
                  this.props.setPropertyEditor_FieldAbsoluteZIndex
                )
              }}
              >
                <Icon name='angle up'/>
              </Button>
              <Button
                onClick={() => {
                  swapZIndexInTile(singleField, singleField.zIndex - 1, false, false, this.props.amountOfShapesInTile,
                    this.props.fieldShapes, this.props.lineShapes, this.props.imgShapes,
                    this.props.setPropertyEditor_FieldAbsoluteZIndex
                  )
                }}
              >
                <Icon name='angle down'/>
              </Button>
              <Button
                onClick={() => {
                  swapZIndexInTile(singleField, singleField.zIndex + 1, true, false, this.props.amountOfShapesInTile,
                    this.props.fieldShapes, this.props.lineShapes, this.props.imgShapes,
                    this.props.setPropertyEditor_FieldAbsoluteZIndex
                  )
                }}
              >
                <Icon name='angle double up'/>
              </Button>
              <Button
                onClick={() => {
                  swapZIndexInTile(singleField, singleField.zIndex - 1, false, true, this.props.amountOfShapesInTile,
                    this.props.fieldShapes, this.props.lineShapes, this.props.imgShapes,
                    this.props.setPropertyEditor_FieldAbsoluteZIndex
                  )
                }}
              >
                <Icon name='angle double down'/>
              </Button>
            </Button.Group>
          </Form.Field>}
        </Form.Group>


        <Form.Field>
          <label>{getI18n(this.props.langId, "Rotation in degree")}
            {
              isBasedOnSymbol && fieldSymbol.overwriteRotationInDeg &&
              <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
            }
          </label>
          <Input disabled={isBasedOnSymbol && fieldSymbol.overwriteRotationInDeg}
                 value={isBasedOnSymbol && fieldSymbol.overwriteRotationInDeg
                   ? fieldSymbol.rotationInDegree
                   : isSingleField
                     ? singleField.rotationInDegree
                     : singleField.rotationInDegree}
                 type="number"
                 onChange={(e) => this.props.setPropertyEditor_FieldRotationInDegree(isBasedOnSymbol && fieldSymbol.overwriteRotationInDeg
                   ? fieldSymbol.rotationInDegree
                   : singleField.rotationInDegree,
                   parseInt(e.currentTarget.value)
                 )}
                 label={<Button icon onClick={() => {
                   this.props.setPropertyEditor_FieldRotationInDegree(isBasedOnSymbol && fieldSymbol.overwriteRotationInDeg
                     ? fieldSymbol.rotationInDegree
                     : singleField.rotationInDegree, 0)
                 }}>
                   <Icon name="undo"/>
                 </Button>}
                 labelPosition='right'
          />
        </Form.Field>

        <Form.Field>
          <label>{getI18n(this.props.langId, "Image")}
            {
              isBasedOnSymbol && fieldSymbol.overwriteBackgroundImage &&
              <IconToolTip icon="arrow down" message={getI18n(this.props.langId, "Overwritten by symbol, click to select symbol")} onClick={() => this.props.onGotoSymbol(fieldSymbol)}/>
            }
          </label>

          <Input labelPosition='right' type='text'>
            <input disabled={isBasedOnSymbol && fieldSymbol.overwriteRotationInDeg}
                   readOnly
                   value={isBasedOnSymbol && fieldSymbol.overwriteBackgroundImage
                     ? fieldSymbol.backgroundImgGuid === null
                       ? ''
                       : fieldSymbol.backgroundImgGuid
                     : singleField.backgroundImgGuid === null
                       ? ''
                       : singleField.backgroundImgGuid}
            />
            <Button icon disabled={isBasedOnSymbol && fieldSymbol.overwriteRotationInDeg}
                    onClick={() => {
                      this.props.setEditor_IsChooseFieldShapeBackgroundImageLibraryDisplayed(true)
                    }}>
              <Icon name="write"/>
            </Button>
          </Input>
          <ImageLibrary
            isCreatingNewImgShape={false}
            onImageTaken={(imgSurrogate) => {
              this.props.setPropertyEditor_field_backgroundImgGuid(isBasedOnSymbol
                ? fieldSymbol.backgroundImgGuid
                : singleField.backgroundImgGuid, imgSurrogate.guid)

              this.props.setEditor_IsChooseFieldShapeBackgroundImageLibraryDisplayed(false)
            }}
            isDisplayed={this.props.isChooseFieldShapeBackgroundImageLibraryDisplayed}
            set_isDisplayed={(isDisplayed) => {
              this.props.setEditor_IsChooseFieldShapeBackgroundImageLibraryDisplayed(isDisplayed)
            }}
          />

        </Form.Field>


        { //anchor points are always overwritten by symbols
          isSomeFieldBasedOnSymbol === false && (isSingleField) && <div>
            {(isBasedOnSymbol
              ? fieldSymbol
              : singleField).anchorPoints.map((anchorPoint, index) => {
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
                             const newList = (isBasedOnSymbol
                               ? fieldSymbol
                               : singleField).anchorPoints.map((p, i) => {
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
                             const newList = (isBasedOnSymbol
                               ? fieldSymbol
                               : singleField).anchorPoints.map((p, i) => {
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
                              this.props.setPropertyEditor_FieldAnchorPoints((isBasedOnSymbol
                                ? fieldSymbol
                                : singleField).anchorPoints.filter(
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

                      this.props.setPropertyEditor_FieldAnchorPoints((isBasedOnSymbol
                        ? fieldSymbol
                        : singleField).anchorPoints.concat(newPoint))
                    }}
            >
              <Icon name="add"/>
            </Button>
            <Divider/>
          </div>}


        {isBasedOnSymbol === false && isSingleField && <Form.Field>
          <label>{getI18n(this.props.langId, "Connected lines")}
            <IconToolTip message={getI18n(this.props.langId, "The connected lines via anchor points")}/>
          </label>
          <Input
            value={connectedPointsList} readOnly
            label={<Button icon onClick={() => {

              const linesIds = Object.keys(singleField.connectedLinesThroughAnchorPoints).map(p => Number(p))

              for (const lineId of linesIds) {
                this.props.setPropertyEditor_FieldConnectedLinesThroughAnchors(lineId, null)
              }

            }}>
              <Icon name="trash"/>
            </Button>}
            labelPosition='right'
          />
        </Form.Field>}


      </Form>
    </div>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(fieldPropertyEditor)