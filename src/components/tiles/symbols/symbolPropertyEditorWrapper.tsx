import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {FieldShape, FieldSymbol, ImgShape, ImgSymbol, LineShape, LineSymbol} from "../../../types/drawing";
import FieldPropertyEditor from '../propertyEditors/fieldPropertyEditor'
import {
  set_fieldSymbol_anchorPoints, set_fieldSymbol_backgroundImgGuid,
  set_fieldSymbol_bgColor, set_fieldSymbol_borderColor, set_fieldSymbol_borderSizeInPx,
  set_fieldSymbol_cmdText,
  set_fieldSymbol_color,
  set_fieldSymbol_cornerRadiusInPx, set_fieldSymbol_displayName, set_fieldSymbol_fontName, set_fieldSymbol_fontSizeInPx,
  set_fieldSymbol_height,
  set_fieldSymbol_horizontalAlign, set_fieldSymbol_isFontBold, set_fieldSymbol_isFontItalic,
  set_fieldSymbol_padding, set_fieldSymbol_rotationInDegree,
  set_fieldSymbol_text,
  set_fieldSymbol_verticalAlign,
  set_fieldSymbol_width
} from "../../../state/reducers/tileEditor/symbols/fieldSymbols/actions";
import {
  set_selectedFieldSymbolGuid,
  set_selectedImgSymbolGuid,
  set_selectedLineSymbolGuid
} from "../../../state/reducers/tileEditor/symbols/actions";
import ImagePropertyEditor from '../propertyEditors/imagePropertyEditor'
import LinePropertyEditor from '../propertyEditors/linePropertyEditor'
import {
  set_imgSymbol_displayName,
  set_imgSymbol_height,
  set_imgSymbol_imgStorageGuid,
  set_imgSymbol_isMouseSelectionDisabled,
  set_imgSymbol_rotation,
  set_imgSymbol_skewX,
  set_imgSymbol_skewY,
  set_imgSymbol_width
} from "../../../state/reducers/tileEditor/symbols/imgSymbols/actions";
import {
  set_lineSymbol_arrowHeight, set_lineSymbol_arrowWidth,
  set_lineSymbol_color, set_lineSymbol_dashArray, set_lineSymbol_displayName, set_lineSymbol_hasEndArrow,
  set_lineSymbol_hasStartArrow, set_lineSymbol_thicknessInPx
} from "../../../state/reducers/tileEditor/symbols/lineSymbols/actions";
import {
  setPropertyEditor_FieldX
} from "../../../state/reducers/tileEditor/fieldProperties/actions";
import {
  setEditor_isChooseFieldShapeBackgroundImageLibraryDisplayed,
  setEditor_IsChooseImgShapeImageLibraryDisplayed
} from "../../../state/reducers/tileEditor/actions";

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test

    selectedFieldSymbolGuid: rootState.symbolsState.selectedFieldSymbolGuid,
    selectedImgSymbolGuid: rootState.symbolsState.selectedImgSymbolGuid,
    selectedLineSymbolGuid: rootState.symbolsState.selectedLineSymbolGuid,

    fieldSymbols: rootState.fieldSymbolState.present,
    imgSymbols: rootState.imgSymbolState.present,
    lineSymbols: rootState.lineSymbolState.present,

    fieldShapes: rootState.tileEditorFieldShapesState.present,
    isChooseImgShapeImageLibraryDisplayed: rootState.tileEditorState.isChooseImgShapeImageLibraryDisplayed,
    isChooseFieldShapeBackgroundImageLibraryDisplayed: rootState.tileEditorState.isChooseFieldShapeBackgroundImageLibraryDisplayed,

  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_selectedFieldSymbolGuid,
  set_selectedImgSymbolGuid,
  set_selectedLineSymbolGuid,

  setEditor_IsChooseImgShapeImageLibraryDisplayed,
  setEditor_isChooseFieldShapeBackgroundImageLibraryDisplayed,

  //--field symbol props
  set_fieldSymbol_text,
  set_fieldSymbol_width,
  set_fieldSymbol_height,
  set_fieldSymbol_color,
  set_fieldSymbol_bgColor,
  set_fieldSymbol_verticalAlign,
  set_fieldSymbol_horizontalAlign,
  set_fieldSymbol_cornerRadiusInPx,
  set_fieldSymbol_cmdText,
  set_fieldSymbol_padding,
  set_fieldSymbol_anchorPoints,
  set_fieldSymbol_displayName,
  set_fieldSymbol_borderColor,
  set_fieldSymbol_borderSizeInPx,
  set_fieldSymbol_fontName,
  set_fieldSymbol_fontSizeInPx,
  set_fieldSymbol_isFontBold,
  set_fieldSymbol_isFontItalic,
  set_fieldSymbol_rotationInDegree,
  set_fieldSymbol_backgroundImgGuid,

  //-- img symbols props
  set_imgSymbol_width,
  set_imgSymbol_height,
  set_imgSymbol_rotation,
  set_imgSymbol_imgStorageGuid,
  set_imgSymbol_displayName,
  set_imgSymbol_skewX,
  set_imgSymbol_skewY,
  set_imgSymbol_isMouseDisabled: set_imgSymbol_isMouseSelectionDisabled,


  //-- line symbol props
  set_lineSymbol_color,
  set_lineSymbol_thicknessInPx,
  set_lineSymbol_dashArray,
  set_lineSymbol_hasStartArrow,
  set_lineSymbol_hasEndArrow,
  set_lineSymbol_arrowWidth,
  set_lineSymbol_arrowHeight,
  set_lineSymbol_displayName,

  setPropertyEditor_FieldX, //used to update the field anchor points

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

/**
 * functions/callbacks that are not used because a symbol cannot modify
 * all normal shape props (e.g. z index wound't make sense)
 */
const nop = () => {
}

class symbolPropertyEditorWrapper extends React.Component<Props, any> {
  render(): JSX.Element {

    const selectedFieldSymbol: FieldSymbol | null = this.props.selectedFieldSymbolGuid !== null ? this.props.fieldSymbols.find(
      p => p.guid === this.props.selectedFieldSymbolGuid) : null

    const selectedImgSymbol: ImgSymbol | null = this.props.selectedImgSymbolGuid !== null ? this.props.imgSymbols.find(
      p => p.guid === this.props.selectedImgSymbolGuid) : null

    const selectedLineSymbol: LineSymbol | null = this.props.selectedLineSymbolGuid !== null ? this.props.lineSymbols.find(
      p => p.guid === this.props.selectedLineSymbolGuid) : null

    return (
      <div>


        {
          selectedFieldSymbol !== null &&
          <div>
            <FieldPropertyEditor fieldShape={selectedFieldSymbol}

                                 isChooseFieldShapeBackgroundImageLibraryDisplayed={this.props.isChooseFieldShapeBackgroundImageLibraryDisplayed}

                                 setEditor_IsChooseFieldShapeBackgroundImageLibraryDisplayed={isDisplayed => {
                                 this.props.setEditor_isChooseFieldShapeBackgroundImageLibraryDisplayed(isDisplayed)
                                 }}

                                 setPropertyEditor_field_backgroundImgGuid={(oldBackgroundImgGuid, newBackgroundImgGuid) => {
                                   this.props.set_fieldSymbol_backgroundImgGuid(selectedFieldSymbol.guid,
                                     newBackgroundImgGuid)
                                 }}

                                 setPropertyEditor_FieldRotationInDegree={(oldRotationInDegree, newRotationInDegree) => {
                                   this.props.set_fieldSymbol_rotationInDegree(selectedFieldSymbol.guid,
                                     newRotationInDegree)
                                 }}
                                 setPropertyEditor_FieldIsBasedOnSymbol={nop}

                                 setTileEditorSelectingNextField={nop}
                                 setPropertyEditor_FieldConnectedLinesThroughAnchors={nop}

                                 setPropertyEditor_FieldIsFontItalic={(oldIsFontItalic, newIsFontItalic) => {
                                   this.props.set_fieldSymbol_isFontItalic(selectedFieldSymbol.guid, newIsFontItalic)
                                 }}

                                 setPropertyEditor_FieldIsFontBold={(oldIsFontBold, newIsFontBold) => {
                                   this.props.set_fieldSymbol_isFontBold(selectedFieldSymbol.guid, newIsFontBold)
                                 }}

                                 onDuplicateFields={nop}
                                 setPropertyEditor_FieldBorderSizeInPx={(oldBorderSizeInPx, newBorderSizeInPx) => {
                                   this.props.set_fieldSymbol_borderSizeInPx(selectedFieldSymbol.guid,
                                     newBorderSizeInPx)
                                 }}
                                 setPropertyEditor_FieldBorderColor={(oldColor, newColor) => {
                                   this.props.set_fieldSymbol_borderColor(selectedFieldSymbol.guid, newColor)
                                 }}

                                 setPropertyEditor_FieldFontSizeInPx={(oldFontSizeInPx, newFontSizeInPx) => {
                                   this.props.set_fieldSymbol_fontSizeInPx(selectedFieldSymbol.guid, newFontSizeInPx)
                                 }}
                                 setPropertyEditor_FieldFontName={(oldFontName, newFontName) => {
                                   this.props.set_fieldSymbol_fontName(selectedFieldSymbol.guid, newFontName)
                                 }}

                                 setPropertyEditor_FieldY={nop}
                                 setPropertyEditor_FieldX={nop}
                                 setPropertyEditor_FieldAbsoluteZIndex={nop}
                                 setPropertyEditor_removeFieldShape={nop}

                                 setPropertyEditor_FieldPadding={(oldPaddingTop, oldPaddingRight, oldPaddingBottom, oldPaddingLeft, newPaddingTop, newPaddingRight, newPaddingBottom, newPaddingLeft) => {
                                   this.props.set_fieldSymbol_padding(selectedFieldSymbol.guid, newPaddingTop,
                                     newPaddingRight, newPaddingBottom,
                                     newPaddingLeft)
                                 }}

                                 setPropertyEditor_FieldWidth={(oldWidth, newWidth) => {
                                   this.props.set_fieldSymbol_width(selectedFieldSymbol.guid, newWidth)

                                   //update anchor points of all dependent fields
                                   for (const field of this.props.fieldShapes) {
                                     if (field.createdFromSymbolGuid === selectedFieldSymbol.guid) {
                                       //this will update the connected lines (via anchor points)
                                       // this.props.setPropertyEditor_FieldX(field.id, field.x)
                                       //TODO update anchor points!!
                                     }
                                   }
                                 }}
                                 setPropertyEditor_FieldVerticalAlign={verticalAlign => {
                                   this.props.set_fieldSymbol_verticalAlign(selectedFieldSymbol.guid, verticalAlign)
                                 }}
                                 setPropertyEditor_FieldText={(oldText, newText) => {
                                   this.props.set_fieldSymbol_text(selectedFieldSymbol.guid, newText)
                                 }}
                                 setPropertyEditor_FieldHorizontalAlign={horizontalAlign => {
                                   this.props.set_fieldSymbol_horizontalAlign(selectedFieldSymbol.guid, horizontalAlign)
                                 }}
                                 setPropertyEditor_FieldHeight={(oldHeight, newHeight) => {
                                   this.props.set_fieldSymbol_height(selectedFieldSymbol.guid, newHeight)

                                   //update anchor points of all dependent fields
                                   for (const field of this.props.fieldShapes) {

                                     if (field.createdFromSymbolGuid === selectedFieldSymbol.guid) {
                                       //this will update the connected lines (via anchor points)
                                       // this.props.setPropertyEditor_FieldX(field.id, field.x)
                                       //TODO update anchor points!!
                                     }
                                   }

                                 }}
                                 setPropertyEditor_FieldCornerRadiusInPx={(oldCornerRadiusInPx, newCornerRadiusInPx) => {
                                   this.props.set_fieldSymbol_cornerRadiusInPx(selectedFieldSymbol.guid,
                                     newCornerRadiusInPx)
                                 }}
                                 setPropertyEditor_FieldColor={(oldColor, newColor) => {
                                   this.props.set_fieldSymbol_color(selectedFieldSymbol.guid, newColor)
                                 }}
                                 setPropertyEditor_FieldCmdText={cmdText => {
                                   this.props.set_fieldSymbol_cmdText(selectedFieldSymbol.guid, cmdText)
                                 }}
                                 setPropertyEditor_FieldBgColor={(oldBgColor, newBgColor) => {
                                   this.props.set_fieldSymbol_bgColor(selectedFieldSymbol.guid, newBgColor)
                                 }}
                                 setPropertyEditor_setSelectedFieldToNull={() => this.props.set_selectedFieldSymbolGuid(
                                   null)}

                                 onAddFieldSymbol={nop}
                                 setPropertyEditor_FieldAnchorPoints={anchorPoints => {
                                   this.props.set_fieldSymbol_anchorPoints(selectedFieldSymbol.guid, anchorPoints)
                                 }}
                                 set_fieldSymbol_displayName={displayName => {
                                   this.props.set_fieldSymbol_displayName(selectedFieldSymbol.guid, displayName)
                                 }}
            />

          </div>
        }

        {
          selectedImgSymbol !== null &&
          <div>
            <ImagePropertyEditor

              setPropertyEditor_ImageIsMouseDisabled={(oldIsMouseDisabled, newIsMouseDisabled) => {
                this.props.set_imgSymbol_isMouseDisabled(selectedImgSymbol.guid, newIsMouseDisabled)
              }}

              setPropertyEditor_ImageIsBasedOnSymbol={nop}

              setPropertyEditor_ImageSkewY={(oldSkewY, newSkewY) => {
                this.props.set_imgSymbol_skewY(selectedImgSymbol.guid, newSkewY)
              }}

              setPropertyEditor_ImageSkewX={(oldSkewX, newSkewX) => {
                this.props.set_imgSymbol_skewX(selectedImgSymbol.guid, newSkewX)
              }}

              setPropertyEditor_ImageAbsoluteZIndex={nop}
              setPropertyEditor_ImageY={nop}
              setPropertyEditor_ImageX={nop}

              imgShape={selectedImgSymbol}
              onDuplicateImgs={nop}

              setPropertyEditor_setSelectedImageToNull={() => this.props.set_selectedImgSymbolGuid(null)}
              setPropertyEditor_ImageWidth={(oldWidth, newWidth) => {
                this.props.set_imgSymbol_width(selectedImgSymbol.guid, newWidth)
              }}
              setPropertyEditor_ImageRotationInDegree={(oldRotationInDegree, newRotationInDegree) => {
                this.props.set_imgSymbol_rotation(selectedImgSymbol.guid, newRotationInDegree)
              }}
              setPropertyEditor_ImageHeight={(oldHeight, newHeight) => {
                this.props.set_imgSymbol_height(selectedImgSymbol.guid, newHeight)
              }}

              setPropertyEditor_removeImgShape={nop}
              onAddImgSymbol={nop}
              setPropertyEditor_ImageImgGuid={(oldImgGuid, newImgGuid) => {
                //then call setPropertyEditor_ImageImgId
                this.props.set_imgSymbol_imgStorageGuid(selectedImgSymbol.guid, newImgGuid)
                this.props.setEditor_IsChooseImgShapeImageLibraryDisplayed(false)
              }}
              isChooseImgShapeImageLibraryDisplayed={this.props.isChooseImgShapeImageLibraryDisplayed}
              setEditor_IsChooseImgShapeImageLibraryDisplayed={(isDisplayed) => {
                this.props.setEditor_IsChooseImgShapeImageLibraryDisplayed(isDisplayed)
              }}
              set_imgSymbol_displayName={displayName => {
                this.props.set_imgSymbol_displayName(selectedImgSymbol.guid, displayName)
              }}
            />
          </div>
        }

        {
          selectedLineSymbol !== null &&
          <div>
            <LinePropertyEditor
              lineShape={selectedLineSymbol}

              setPropertyEditor_LineIsBasedOnSymbol={nop}

              onDuplicateLines={nop}
              setLinePointCurveMode={nop}

              setPropertyEditor_setSelectedLineToNull={() => this.props.set_selectedLineSymbolGuid(null)}
              setPropertyEditor_removeLineShape={nop}
              setPropertyEditor_LineThicknessInPx={(oldThicknessInPx, newThicknessInPx) => {
                this.props.set_lineSymbol_thicknessInPx(selectedLineSymbol.guid, newThicknessInPx)
              }}
              setPropertyEditor_LineHasStartArrow={(oldHasStartArrow, newHasStartArrow) => {
                this.props.set_lineSymbol_hasStartArrow(
                  selectedLineSymbol.guid, newHasStartArrow)
              }}
              setPropertyEditor_LineHasEndArrow={(oldHasEndArrow, newHasEndArrow) => {
                this.props.set_lineSymbol_hasEndArrow(selectedLineSymbol.guid, newHasEndArrow)
              }}
              setPropertyEditor_LineDashArray={(oldDashArray, newDashArray) => {
                this.props.set_lineSymbol_dashArray(selectedLineSymbol.guid, newDashArray)
              }}
              setPropertyEditor_LineColor={(oldColor, newColor) => {
                this.props.set_lineSymbol_color(selectedLineSymbol.guid, newColor)
              }}
              setPropertyEditor_LineAbsoluteZIndex={nop}
              setPropertyEditor_addPointToLineShape={nop}
              removePointFromLineShape={nop}
              setLinePointNewPos={nop}
              onAddLineSymbol={nop}
              setPropertyEditor_LineArrowWidth={(oldArrowWidth, newArrowWidth) => {
                this.props.set_lineSymbol_arrowWidth(selectedLineSymbol.guid, newArrowWidth)
              }}
              setPropertyEditor_LineArrowHeight={(oldArrowHeight, newArrowHeight) => {
                this.props.set_lineSymbol_arrowHeight(selectedLineSymbol.guid, newArrowHeight)
              }}
              set_lineSymbol_displayName={displayName => {
                this.props.set_lineSymbol_displayName(selectedLineSymbol.guid, displayName)
              }}
            />
          </div>
        }

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(symbolPropertyEditorWrapper)

