import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {FieldSymbol, ImgSymbol, LineSymbol} from "../../../types/drawing";
import FieldSymbolPropertyEditor from '../propertyEditors/fieldSymbolPropertyEditor'
import {
  set_fieldSymbol_anchorPoints,
  set_fieldSymbol_backgroundImgGuid,
  set_fieldSymbol_bgColor,
  set_fieldSymbol_borderColor,
  set_fieldSymbol_borderSizeInPx,
  set_fieldSymbol_cmdText,
  set_fieldSymbol_color,
  set_fieldSymbol_cornerRadiusInPx,
  set_fieldSymbol_displayName,
  set_fieldSymbol_fontName,
  set_fieldSymbol_fontSizeInPx,
  set_fieldSymbol_height,
  set_fieldSymbol_horizontalAlign,
  set_fieldSymbol_isFontBold,
  set_fieldSymbol_isFontItalic, set_fieldSymbol_overwriteBackgroundImage,
  set_fieldSymbol_overwriteBgColor,
  set_fieldSymbol_overwriteBorderColor,
  set_fieldSymbol_overwriteBorderSizeInPx,
  set_fieldSymbol_overwriteCmdText,
  set_fieldSymbol_overwriteColor,
  set_fieldSymbol_overwriteCornerRadius,
  set_fieldSymbol_overwriteFontDecoration,
  set_fieldSymbol_overwriteFontName,
  set_fieldSymbol_overwriteFontSizeInPx,
  set_fieldSymbol_overwriteHeight,
  set_fieldSymbol_overwriteHorizontalTextAlign,
  set_fieldSymbol_overwritePadding,
  set_fieldSymbol_overwriteRotationInDeg,
  set_fieldSymbol_overwriteText,
  set_fieldSymbol_overwriteVerticalTextAlign,
  set_fieldSymbol_overwriteWidth,
  set_fieldSymbol_padding,
  set_fieldSymbol_rotationInDegree,
  set_fieldSymbol_text,
  set_fieldSymbol_verticalAlign,
  set_fieldSymbol_width
} from "../../../state/reducers/tileEditor/symbols/fieldSymbols/actions";
import {
  set_selectedFieldSymbolGuid,
  set_selectedImgSymbolGuid,
  set_selectedLineSymbolGuid
} from "../../../state/reducers/tileEditor/symbols/actions";
import ImageSymbolPropertyEditor from '../propertyEditors/imageSymbolPropertyEditor'
import LineSymbolPropertyEditor from '../propertyEditors/lineSymbolPropertyEditor'
import {
  set_imgSymbol_displayName,
  set_imgSymbol_height,
  set_imgSymbol_imgStorageGuid,
  set_imgSymbol_isMouseSelectionDisabled,
  set_imgSymbol_overwriteHeight, set_imgSymbol_overwriteImage, set_imgSymbol_overwriteIsDisabledForMouseSelection,
  set_imgSymbol_overwriteRotationInDeg, set_imgSymbol_overwriteSkewX, set_imgSymbol_overwriteSkewY,
  set_imgSymbol_overwriteWidth,
  set_imgSymbol_rotation,
  set_imgSymbol_skewX,
  set_imgSymbol_skewY,
  set_imgSymbol_width
} from "../../../state/reducers/tileEditor/symbols/imgSymbols/actions";
import {
  set_lineSymbol_arrowHeight,
  set_lineSymbol_arrowWidth,
  set_lineSymbol_color,
  set_lineSymbol_dashArray,
  set_lineSymbol_displayName,
  set_lineSymbol_hasEndArrow,
  set_lineSymbol_hasStartArrow,
  set_lineSymbol_overwriteArrowHeight,
  set_lineSymbol_overwriteArrowWidth,
  set_lineSymbol_overwriteColor,
  set_lineSymbol_overwriteGapsInPx,
  set_lineSymbol_overwriteHasEndArrow,
  set_lineSymbol_overwriteHasStartArrow,
  set_lineSymbol_overwriteThicknessInPx,
  set_lineSymbol_thicknessInPx
} from "../../../state/reducers/tileEditor/symbols/lineSymbols/actions";
import {
  adjustLinesFromAnchorPointsFromFieldSymbolChangedHeight,
  adjustLinesFromAnchorPointsFromFieldSymbolChangedRotation,
  adjustLinesFromAnchorPointsFromFieldSymbolChangedWidth
} from "../../../state/reducers/tileEditor/fieldProperties/actions";
import {
  setEditor_isChooseFieldShapeBackgroundImageLibraryDisplayed,
  setEditor_IsChooseImgShapeImageLibraryDisplayed
} from "../../../state/reducers/tileEditor/actions";
import {changeLinesFromAllTilesInLibraryWhenChangingFieldSymbol} from "../../../constants";
import SymbolLibrary from "../propertyEditorsView";

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
    possibleTiles: rootState.tileLibraryState.possibleTiles,
    tileGuide: rootState.tileEditorState.tileProps.guid,
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

  adjustLinesFromAnchorPointsFromFieldSymbolChangedWidth,
  adjustLinesFromAnchorPointsFromFieldSymbolChangedHeight,
  adjustLinesFromAnchorPointsFromFieldSymbolChangedRotation,

  set_fieldSymbol_overwriteCmdText,
  set_fieldSymbol_overwriteWidth,
  set_fieldSymbol_overwriteHeight,
  set_fieldSymbol_overwriteColor,
  set_fieldSymbol_overwriteBgColor,
  set_fieldSymbol_overwriteBorderColor,
  set_fieldSymbol_overwriteBorderSizeInPx,
  set_fieldSymbol_overwriteFontName,
  set_fieldSymbol_overwriteFontSizeInPx,
  set_fieldSymbol_overwriteFontDecoration,
  set_fieldSymbol_overwriteText,
  set_fieldSymbol_overwriteHorizontalTextAlign,
  set_fieldSymbol_overwriteVerticalTextAlign,
  set_fieldSymbol_overwritePadding,
  set_fieldSymbol_overwriteCornerRadius,
  set_fieldSymbol_overwriteRotationInDeg,
  set_fieldSymbol_overwriteBackgroundImage,

  set_imgSymbol_overwriteWidth,
  set_imgSymbol_overwriteHeight,
  set_imgSymbol_overwriteRotationInDeg,
  set_imgSymbol_overwriteImage,
  set_imgSymbol_overwriteSkewX,
  set_imgSymbol_overwriteSkewY,
  set_imgSymbol_overwriteIsDisabledForMouseSelection,


  set_lineSymbol_overwriteColor,
  set_lineSymbol_overwriteThicknessInPx,
  set_lineSymbol_overwriteGapsInPx,
  set_lineSymbol_overwriteHasStartArrow,
  set_lineSymbol_overwriteHasEndArrow,
  set_lineSymbol_overwriteArrowWidth,
  set_lineSymbol_overwriteArrowHeight,

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
            <FieldSymbolPropertyEditor fieldShape={selectedFieldSymbol}

                                       set_fieldSymbol_overwriteCmdText={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteCmdText(selectedFieldSymbol.guid, overwrite)
                                       }}
                                       set_fieldSymbol_overwriteWidth={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteWidth(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteHeight={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteHeight(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteColor={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteColor(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteBgColor={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteBgColor(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteBorderColor={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteBorderColor(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteBorderSizeInPx={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteBorderSizeInPx(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteFontName={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteFontName(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteFontSizeInPx={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteFontSizeInPx(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteFontDecoration={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteFontDecoration(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteText={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteText(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteHorizontalTextAlign={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteHorizontalTextAlign(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteVerticalTextAlign={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteVerticalTextAlign(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwritePadding={(overwrite) => {
                                         this.props.set_fieldSymbol_overwritePadding(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteCornerRadius={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteCornerRadius(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteRotationInDeg={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteRotationInDeg(selectedFieldSymbol.guid, overwrite)

                                       }}
                                       set_fieldSymbol_overwriteBackgroundImage={(overwrite) => {
                                         this.props.set_fieldSymbol_overwriteBackgroundImage(selectedFieldSymbol.guid, overwrite)

                                       }}

                                       isChooseFieldShapeBackgroundImageLibraryDisplayed={this.props.isChooseFieldShapeBackgroundImageLibraryDisplayed}

                                       setEditor_IsChooseFieldShapeBackgroundImageLibraryDisplayed={isDisplayed => {
                                         this.props.setEditor_isChooseFieldShapeBackgroundImageLibraryDisplayed(isDisplayed)
                                       }}

                                       setPropertyEditor_field_backgroundImgGuid={(newBackgroundImgGuid) => {
                                         this.props.set_fieldSymbol_backgroundImgGuid(selectedFieldSymbol.guid,
                                           newBackgroundImgGuid)
                                       }}

                                       setPropertyEditor_FieldRotationInDegree={(oldRotationInDegree, newRotationInDegree) => {
                                         this.props.set_fieldSymbol_rotationInDegree(selectedFieldSymbol.guid,
                                           newRotationInDegree)

                                         if (changeLinesFromAllTilesInLibraryWhenChangingFieldSymbol) {

                                           //this will change the line points in the tile library
                                           //but the current tile is a copy (mostly) so if we change the lines only in the tile library...
                                           //... and click on cancel everything is fine because the world displays the tile library tiles
                                           //....or click on apply then we overwrite the corrected lines with the lines in the single tile editor

                                           for (let i = 0; i < this.props.possibleTiles.length; i++) {
                                             const possibleTile = this.props.possibleTiles[i]

                                             if (possibleTile.guid === this.props.tileGuide) continue //this is the default case, handled below


                                             //update the connected lines of all dependent fields
                                             for (const field of possibleTile.fieldShapes) {
                                               if (field.createdFromSymbolGuid === selectedFieldSymbol.guid) {
                                                 this.props.adjustLinesFromAnchorPointsFromFieldSymbolChangedRotation(
                                                   field,
                                                   selectedFieldSymbol,
                                                   possibleTile.lineShapes,
                                                   possibleTile.guid,
                                                   oldRotationInDegree,
                                                   newRotationInDegree,
                                                 )
                                               }
                                             }
                                           }
                                         }

                                         //update the connected lines of all dependent fields
                                         for (const field of this.props.fieldShapes) {
                                           if (field.createdFromSymbolGuid === selectedFieldSymbol.guid) {

                                             this.props.adjustLinesFromAnchorPointsFromFieldSymbolChangedRotation(
                                               field,
                                               selectedFieldSymbol,
                                               null,
                                               null,
                                               oldRotationInDegree,
                                               newRotationInDegree
                                             )
                                           }
                                         }

                                       }}

                                       setPropertyEditor_FieldIsFontItalic={(newIsFontItalic) => {
                                         this.props.set_fieldSymbol_isFontItalic(selectedFieldSymbol.guid, newIsFontItalic)
                                       }}

                                       setPropertyEditor_FieldIsFontBold={(newIsFontBold) => {
                                         this.props.set_fieldSymbol_isFontBold(selectedFieldSymbol.guid, newIsFontBold)
                                       }}

                                       setPropertyEditor_FieldBorderSizeInPx={(newBorderSizeInPx) => {
                                         this.props.set_fieldSymbol_borderSizeInPx(selectedFieldSymbol.guid,
                                           newBorderSizeInPx)
                                       }}
                                       setPropertyEditor_FieldBorderColor={(newColor) => {
                                         this.props.set_fieldSymbol_borderColor(selectedFieldSymbol.guid, newColor)
                                       }}

                                       setPropertyEditor_FieldFontSizeInPx={(newFontSizeInPx) => {
                                         this.props.set_fieldSymbol_fontSizeInPx(selectedFieldSymbol.guid, newFontSizeInPx)
                                       }}
                                       setPropertyEditor_FieldFontName={(newFontName) => {
                                         this.props.set_fieldSymbol_fontName(selectedFieldSymbol.guid, newFontName)
                                       }}


                                       setPropertyEditor_FieldAbsoluteZIndex={nop}

                                       setPropertyEditor_FieldPadding={(newPaddingTop, newPaddingRight, newPaddingBottom, newPaddingLeft) => {
                                         this.props.set_fieldSymbol_padding(selectedFieldSymbol.guid, newPaddingTop,
                                           newPaddingRight, newPaddingBottom,
                                           newPaddingLeft)
                                       }}

                                       setPropertyEditor_FieldWidth={(oldWidth, newWidth) => {
                                         this.props.set_fieldSymbol_width(selectedFieldSymbol.guid, newWidth)

                                         if (changeLinesFromAllTilesInLibraryWhenChangingFieldSymbol) {

                                           //this will change the line points in the tile library
                                           //but the current tile is a copy (mostly) so if we change the lines only in the tile library...
                                           //... and click on cancel everything is fine because the world displays the tile library tiles
                                           //....or click on apply then we overwrite the corrected lines with the lines in the single tile editor

                                           for (let i = 0; i < this.props.possibleTiles.length; i++) {
                                             const possibleTile = this.props.possibleTiles[i]

                                             if (possibleTile.guid === this.props.tileGuide) continue //this is the default case, handled below

                                             //update the connected lines of all dependent fields
                                             for (const field of possibleTile.fieldShapes) {
                                               if (field.createdFromSymbolGuid === selectedFieldSymbol.guid) {

                                                 this.props.adjustLinesFromAnchorPointsFromFieldSymbolChangedWidth(
                                                   field,
                                                   selectedFieldSymbol,
                                                   possibleTile.lineShapes,
                                                   possibleTile.guid,
                                                   oldWidth,
                                                   newWidth,
                                                 )
                                               }
                                             }

                                           }


                                         }

                                         //update the connected lines of all dependent fields
                                         for (const field of this.props.fieldShapes) {
                                           if (field.createdFromSymbolGuid === selectedFieldSymbol.guid) {

                                             this.props.adjustLinesFromAnchorPointsFromFieldSymbolChangedWidth(
                                               field,
                                               selectedFieldSymbol,
                                               null,
                                               null,
                                               oldWidth,
                                               newWidth,
                                             )
                                           }
                                         }


                                       }}
                                       setPropertyEditor_FieldVerticalAlign={verticalAlign => {
                                         this.props.set_fieldSymbol_verticalAlign(selectedFieldSymbol.guid, verticalAlign)
                                       }}
                                       setPropertyEditor_FieldText={(newText) => {
                                         this.props.set_fieldSymbol_text(selectedFieldSymbol.guid, newText)
                                       }}
                                       setPropertyEditor_FieldHorizontalAlign={horizontalAlign => {
                                         this.props.set_fieldSymbol_horizontalAlign(selectedFieldSymbol.guid, horizontalAlign)
                                       }}
                                       setPropertyEditor_FieldHeight={(oldHeight, newHeight) => {
                                         this.props.set_fieldSymbol_height(selectedFieldSymbol.guid, newHeight)

                                         if (changeLinesFromAllTilesInLibraryWhenChangingFieldSymbol) {

                                           //this will change the line points in the tile library
                                           //but the current tile is a copy (mostly) so if we change the lines only in the tile library...
                                           //... and click on cancel everything is fine because the world displays the tile library tiles
                                           //....or click on apply then we overwrite the corrected lines with the lines in the single tile editor

                                           for (let i = 0; i < this.props.possibleTiles.length; i++) {
                                             const possibleTile = this.props.possibleTiles[i]

                                             if (possibleTile.guid === this.props.tileGuide) continue //this is the default case, handled below

                                             //update the connected lines of all dependent fields
                                             for (const field of possibleTile.fieldShapes) {
                                               if (field.createdFromSymbolGuid === selectedFieldSymbol.guid) {
                                                 this.props.adjustLinesFromAnchorPointsFromFieldSymbolChangedHeight(
                                                   field,
                                                   selectedFieldSymbol,
                                                   possibleTile.lineShapes,
                                                   possibleTile.guid,
                                                   oldHeight,
                                                   newHeight,
                                                 )
                                               }
                                             }
                                           }

                                         }

                                         //update the connected lines of all dependent fields
                                         for (const field of this.props.fieldShapes) {
                                           if (field.createdFromSymbolGuid === selectedFieldSymbol.guid) {

                                             this.props.adjustLinesFromAnchorPointsFromFieldSymbolChangedHeight(
                                               field,
                                               selectedFieldSymbol,
                                               null,
                                               null,
                                               oldHeight,
                                               newHeight,
                                             )
                                           }
                                         }


                                       }}
                                       setPropertyEditor_FieldCornerRadiusInPx={(newCornerRadiusInPx) => {
                                         this.props.set_fieldSymbol_cornerRadiusInPx(selectedFieldSymbol.guid,
                                           newCornerRadiusInPx)
                                       }}
                                       setPropertyEditor_FieldColor={(newColor) => {
                                         this.props.set_fieldSymbol_color(selectedFieldSymbol.guid, newColor)
                                       }}
                                       setPropertyEditor_FieldCmdText={cmdText => {
                                         this.props.set_fieldSymbol_cmdText(selectedFieldSymbol.guid, cmdText)
                                       }}
                                       setPropertyEditor_FieldBgColor={(newBgColor) => {
                                         this.props.set_fieldSymbol_bgColor(selectedFieldSymbol.guid, newBgColor)
                                       }}
                                       setPropertyEditor_setSelectedFieldToNull={() => this.props.set_selectedFieldSymbolGuid(
                                         null)}

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
            <ImageSymbolPropertyEditor

              set_imgSymbol_overwriteWidth={(overwrite) => {
              this.props.set_imgSymbol_overwriteWidth(selectedImgSymbol.guid,overwrite)}
              }
              set_imgSymbol_overwriteHeight={(overwrite) => {
                this.props.set_imgSymbol_overwriteHeight(selectedImgSymbol.guid,overwrite)
              }}
              set_imgSymbol_overwriteRotationInDeg={(overwrite) => {
                this.props.set_imgSymbol_overwriteRotationInDeg(selectedImgSymbol.guid,overwrite)
              }}
              set_imgSymbol_overwriteImage={(overwrite) => {
                this.props.set_imgSymbol_overwriteImage(selectedImgSymbol.guid,overwrite)
              }}
              set_imgSymbol_overwriteSkewX={(overwrite) => {
                this.props.set_imgSymbol_overwriteSkewX(selectedImgSymbol.guid,overwrite)
              }}
              set_imgSymbol_overwriteSkewY={(overwrite) => {
                this.props.set_imgSymbol_overwriteSkewY(selectedImgSymbol.guid,overwrite)
              }}
              set_imgSymbol_overwriteIsDisabledForMouseSelection={(overwrite) => {
                this.props.set_imgSymbol_overwriteIsDisabledForMouseSelection(selectedImgSymbol.guid,overwrite)
              }}

              setPropertyEditor_ImageIsMouseDisabled={(oldIsMouseDisabled, newIsMouseDisabled) => {
                this.props.set_imgSymbol_isMouseDisabled(selectedImgSymbol.guid, newIsMouseDisabled)
              }}

              setPropertyEditor_ImageSkewY={(oldSkewY, newSkewY) => {
                this.props.set_imgSymbol_skewY(selectedImgSymbol.guid, newSkewY)
              }}

              setPropertyEditor_ImageSkewX={(oldSkewX, newSkewX) => {
                this.props.set_imgSymbol_skewX(selectedImgSymbol.guid, newSkewX)
              }}


              imgShape={selectedImgSymbol}

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
            <LineSymbolPropertyEditor
              lineShape={selectedLineSymbol}

              set_lineSymbol_overwriteColor={(overwrite: boolean) => {
              this.props.set_lineSymbol_overwriteColor(selectedLineSymbol.guid, overwrite)}
              }
              set_lineSymbol_overwriteThicknessInPx={(overwrite: boolean) => {
                this.props.set_lineSymbol_overwriteThicknessInPx(selectedLineSymbol.guid, overwrite)
              }}
              set_lineSymbol_overwriteGapsInPx={(overwrite: boolean) => {
                this.props.set_lineSymbol_overwriteGapsInPx(selectedLineSymbol.guid, overwrite)
              }}
              set_lineSymbol_overwriteHasStartArrow={(overwrite: boolean) => {
                this.props.set_lineSymbol_overwriteHasStartArrow(selectedLineSymbol.guid, overwrite)
              }}
              set_lineSymbol_overwriteHasEndArrow={(overwrite: boolean) => {
                this.props.set_lineSymbol_overwriteHasEndArrow(selectedLineSymbol.guid, overwrite)
              }}
              set_lineSymbol_overwriteArrowWidth={(overwrite: boolean) => {
                this.props.set_lineSymbol_overwriteArrowWidth(selectedLineSymbol.guid, overwrite)
              }}
              set_lineSymbol_overwriteArrowHeight={(overwrite: boolean) => {
                this.props.set_lineSymbol_overwriteArrowHeight(selectedLineSymbol.guid, overwrite)
              }}


              onDuplicateLines={nop}

              setPropertyEditor_setSelectedLineToNull={() => this.props.set_selectedLineSymbolGuid(null)}

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

