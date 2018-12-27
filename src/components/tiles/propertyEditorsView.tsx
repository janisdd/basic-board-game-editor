import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {
  BezierPoint,
  FieldShape,
  FieldSymbol,
  ImgShape,
  ImgSymbol,
  LineShape,
  LineSymbol,
  PlainPoint
} from "../../types/drawing";
import {renewAllZIndicesInTile, swapDisplayIndex, swapDisplayIndexWithGuid} from "../../helpers/someIndexHelper";
import FieldPropertyEditor from './propertyEditors/fieldPropertyEditor'
import LinePropertyEditor from './propertyEditors/linePropertyEditor'
import ImagePropertyEditor from './propertyEditors/imagePropertyEditor'
import {
  removeFieldShape,
  setPropertyEditor_fieldsShapes,
  setPropertyEditor_FieldAbsoluteZIndex,
  setPropertyEditor_FieldAnchorPoints,
  setPropertyEditor_FieldBgColor,
  setPropertyEditor_FieldCmdText,
  setPropertyEditor_FieldColor,
  setPropertyEditor_FieldCornerRadiusInPx,
  setPropertyEditor_FieldCreatedFromSymbolId,
  setPropertyEditor_FieldHeight,
  setPropertyEditor_FieldHorizontalAlign,
  setPropertyEditor_FieldPadding,
  setPropertyEditor_FieldText,
  setPropertyEditor_FieldVerticalAlign,
  setPropertyEditor_FieldWidth,
  setPropertyEditor_FieldX,
  setPropertyEditor_FieldY,
  setPropertyEditor_fieldBorderColor,
  setPropertyEditor_fieldBorderSizeInPx,
  setPropertyEditor_fieldFontName,
  setPropertyEditor_fieldFontSizeInPx,
  setPropertyEditor_field_isFontItalic,
  setPropertyEditor_field_isFontBold,
  setPropertyEditor_FieldConnectedLinesThroughAnchors,
  setPropertyEditor_field_rotationInDegree,
  setPropertyEditor_field_backgroundImgGuid
} from "../../state/reducers/tileEditor/fieldProperties/actions";
import {
  removeLineShape, removePointFromLineShape,
  set_selectedLinePointNewPosAction,
  setPropertyEditor_addPointToLineShape,
  setPropertyEditor_LineAbsoluteZIndex,
  setPropertyEditor_LineArrowHeight,
  setPropertyEditor_LineArrowWidth,
  setPropertyEditor_LineColor, setPropertyEditor_LineCreatedFromSymbolId,
  setPropertyEditor_LineDashArray,
  setPropertyEditor_LineHasEndArrow,
  setPropertyEditor_LineHasStartArrow, setPropertyEditor_linePointCurveMode, setPropertyEditor_lineShapes,
  setPropertyEditor_LineThicknessInPx
} from "../../state/reducers/tileEditor/lineProperties/actions";
import {
  set_editor_isSelectingNextField,
  set_editor_leftTabActiveIndex,
  set_editor_restoreRightTabActiveIndex,
  setEditor_isChooseFieldShapeBackgroundImageLibraryDisplayed,
  setEditor_IsChooseImgShapeImageLibraryDisplayed,
  setSelectedFieldShapeIds,
  setSelectedImageShapeIds,
  setSelectedLineShapeIds
} from "../../state/reducers/tileEditor/actions";
import {
  removeImageShape,
  setPropertyEditor_ImageAbsoluteZIndex,
  setPropertyEditor_ImageCreatedFromSymbolId,
  setPropertyEditor_ImageHeight,
  setPropertyEditor_ImageImgGuid, setPropertyEditor_ImageIsMouseSelectionDisabled,
  setPropertyEditor_ImageRotationInDegree, setPropertyEditor_ImageSkewX, setPropertyEditor_ImageSkewY,
  setPropertyEditor_ImageWidth,
  setPropertyEditor_ImageX,
  setPropertyEditor_ImageY, setPropertyEditor_imgShapes
} from "../../state/reducers/tileEditor/imgProperties/actions";
import {getNextShapeId} from "../../state/reducers/tileEditor/fieldProperties/fieldPropertyReducer";
import {getNiceBezierCurveBetween} from "../../helpers/interactionHelper";
import {symbolPreviewStageXOffset, symbolPreviewStageYOffset} from "../../constants";
import SymbolPropertyEditorWrapper from './symbols/symbolPropertyEditorWrapper'
import {set_imgSymbol_displayIndex, set_imgSymbols} from "../../state/reducers/tileEditor/symbols/imgSymbols/actions";
import {
  set_lineSymbol_displayIndex,
  set_lineSymbols
} from "../../state/reducers/tileEditor/symbols/lineSymbols/actions";
import {
  set_fieldSymbol_displayIndex,
  set_fieldSymbols
} from "../../state/reducers/tileEditor/symbols/fieldSymbols/actions";
import {getGuid} from "../../helpers/guid";
import {LeftTileEditorTabs} from "../../state/reducers/tileEditor/tileEditorReducer";
import {MajorLineDirection} from "../../types/world";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    selectedFieldShapeIds: rootState.tileEditorState.selectedFieldShapeIds,
    selectedLineShapeIds: rootState.tileEditorState.selectedLineShapeIds,
    selectedImageShapeIds: rootState.tileEditorState.selectedImageShapeIds,

    fieldShapes: rootState.tileEditorFieldShapesState.present,
    imgShapes: rootState.tileEditorImgShapesState.present,
    lineShapes: rootState.tileEditorLineShapeState.present,

    fieldSymbols: rootState.fieldSymbolState.present,
    imgSymbols: rootState.imgSymbolState.present,
    lineSymbols: rootState.lineSymbolState.present,

    isChooseImgShapeImageLibraryDisplayed: rootState.tileEditorState.isChooseImgShapeImageLibraryDisplayed,
    isChooseFieldShapeBackgroundImageLibraryDisplayed: rootState.tileEditorState.isChooseFieldShapeBackgroundImageLibraryDisplayed,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  setEditor_IsChooseImgShapeImageLibraryDisplayed,
  setEditor_isChooseFieldShapeBackgroundImageLibraryDisplayed,
  set_editor_restoreRightTabActiveIndex,

  //--field props editor
  setPropertyEditor_fieldsShapes,
  setSelectedFieldShapeIds,
  setPropertyEditor_FieldX,
  setPropertyEditor_FieldY,
  setPropertyEditor_FieldText,
  setPropertyEditor_FieldWidth,
  setPropertyEditor_FieldHeight,
  setPropertyEditor_FieldColor,
  setPropertyEditor_FieldBgColor,
  setPropertyEditor_FieldVerticalAlign,
  setPropertyEditor_FieldHorizontalAlign,
  setPropertyEditor_FieldCmdText,
  setPropertyEditor_FieldAbsoluteZIndex,
  setPropertyEditor_FieldCornerRadiusInPx,
  setPropertyEditor_FieldPadding,
  setPropertyEditor_FieldAnchorPoints,
  setPropertyEditor_fieldBorderColor,
  setPropertyEditor_fieldBorderSizeInPx,
  setPropertyEditor_fieldFontName,
  setPropertyEditor_fieldFontSizeInPx,
  setPropertyEditor_field_isFontBold,
  setPropertyEditor_field_isFontItalic,
  setPropertyEditor_FieldConnectedLinesThroughAnchors,
  setPropertyEditor_field_rotationInDegree,
  setPropertyEditor_field_backgroundImgGuid,
  removeFieldShape,
  set_editor_isSelectingNextField,

  //--line props editor
  setPropertyEditor_lineShapes,
  setSelectedLineShapeIds,
  setPropertyEditor_LineColor,
  setPropertyEditor_LineThicknessInPx,
  setPropertyEditor_LineDashArray,
  setPropertyEditor_LineHasStartArrow,
  setPropertyEditor_LineHasEndArrow,
  setPropertyEditor_LineAbsoluteZIndex,
  setPropertyEditor_LineArrowHeight,
  setPropertyEditor_LineArrowWidth,

  setLinePointNewPos: set_selectedLinePointNewPosAction,
  setPropertyEditor_linePointCurveMode,
  setPropertyEditor_addPointToLineShape,
  removePointFromLineShape,
  removeLineShape,

  //--img props editor
  setPropertyEditor_imgShapes,
  setSelectedImageShapeIds,
  setPropertyEditor_ImageX,
  setPropertyEditor_ImageY,
  setPropertyEditor_ImageAbsoluteZIndex,
  setPropertyEditor_ImageHeight,
  setPropertyEditor_ImageRotationInDegree,
  setPropertyEditor_ImageWidth,
  setPropertyEditor_ImageImgGuid,
  setPropertyEditor_ImageSkewX,
  setPropertyEditor_ImageSkewY,
  setPropertyEditor_ImageIsMouseDisabled: setPropertyEditor_ImageIsMouseSelectionDisabled,
  removeImageShape,

  //-- add symbols
  set_fieldSymbols,
  set_imgSymbols,
  set_lineSymbols,

  set_fieldSymbol_displayIndex,
  set_imgSymbol_displayIndex,
  set_lineSymbol_displayIndex,

  setPropertyEditor_FieldCreatedFromSymbolId,
  setPropertyEditor_ImageCreatedFromSymbolId,
  setPropertyEditor_LineCreatedFromSymbolId,

  set_editor_leftTabActiveIndex,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

const nop = () => {
}

class propertyEditorsView extends React.Component<Props, any> {
  render(): JSX.Element {

    const selectedFieldShapes: ReadonlyArray<FieldShape> = this.props.fieldShapes.filter(
      p => this.props.selectedFieldShapeIds.indexOf(p.id) !== -1)

    const selectedImgShapes: ReadonlyArray<ImgShape> = this.props.imgShapes.filter(
      p => this.props.selectedImageShapeIds.indexOf(p.id) !== -1)

    const selectedLineShapes: ReadonlyArray<LineShape> = this.props.lineShapes.filter(
      p => this.props.selectedLineShapeIds.indexOf(p.id) !== -1)

    return (
      <div className="property-editor-right">

        {
          selectedFieldShapes.length > 0 &&
          <div>
            <FieldPropertyEditor
              fieldShape={selectedFieldShapes}
              fieldSymbols={this.props.fieldSymbols}

              isChooseFieldShapeBackgroundImageLibraryDisplayed={this.props.isChooseFieldShapeBackgroundImageLibraryDisplayed}

              setPropertyEditor_field_backgroundImgGuid={(oldBackgroundImgGuid, newBackgroundImgGuid) => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_field_backgroundImgGuid(fieldShape.id, newBackgroundImgGuid)
                }
              }}

              setEditor_IsChooseFieldShapeBackgroundImageLibraryDisplayed={this.props.setEditor_isChooseFieldShapeBackgroundImageLibraryDisplayed}

              setPropertyEditor_FieldRotationInDegree={(oldRotationInDegree, newRotationInDegree) => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_field_rotationInDegree(fieldShape.id, newRotationInDegree)
                }
              }}
              setPropertyEditor_FieldIsBasedOnSymbol={(oldSymbolGuid, symbolGuid) => {
                if (selectedFieldShapes.length === 1) {
                  this.props.setPropertyEditor_FieldCreatedFromSymbolId(selectedFieldShapes[0].id, symbolGuid)
                }
              }}

              setPropertyEditor_FieldConnectedLinesThroughAnchors={(lineId, connectedLinesThroughAnchors) => {
                if (selectedFieldShapes.length === 1) {
                  this.props.setPropertyEditor_FieldConnectedLinesThroughAnchors(selectedFieldShapes[0].id, lineId,
                    connectedLinesThroughAnchors)
                }
              }}

              setTileEditorSelectingNextField={(isSelectingNextField, sourceForSelectingNextField) => {
                this.props.set_editor_isSelectingNextField(isSelectingNextField, sourceForSelectingNextField)
              }}

              setPropertyEditor_FieldIsFontBold={(oldIsFontBold, newIsFontBold) => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_field_isFontBold(fieldShape.id, newIsFontBold)
                }
              }}
              setPropertyEditor_FieldIsFontItalic={(oldIsFontItalic, newIsFontItalic) => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_field_isFontItalic(fieldShape.id, newIsFontItalic)
                }
              }}

              onDuplicateFields={newFieldShapes => {
                this.props.setPropertyEditor_fieldsShapes(this.props.fieldShapes.concat(newFieldShapes))
                this.props.setSelectedFieldShapeIds(newFieldShapes.map(p => p.id))

                renewAllZIndicesInTile()
              }}

              setPropertyEditor_FieldBorderColor={(oldColor, newColor) => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_fieldBorderColor(fieldShape.id, newColor)
                }
              }}

              setPropertyEditor_FieldBorderSizeInPx={(oldBorderSizeInPx, newBorderSizeInPx) => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_fieldBorderSizeInPx(fieldShape.id, newBorderSizeInPx)
                }
              }}

              setPropertyEditor_FieldFontName={(oldFontName, newFontName) => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_fieldFontName(fieldShape.id, newFontName)
                }
              }}

              setPropertyEditor_FieldFontSizeInPx={(oldFontSizeInPx, newFontSizeInPx) => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_fieldFontSizeInPx(fieldShape.id, newFontSizeInPx)
                }
              }}

              setPropertyEditor_FieldAbsoluteZIndex={zIndex => {
                if (selectedFieldShapes.length === 1) {
                  this.props.setPropertyEditor_FieldAbsoluteZIndex(selectedFieldShapes[0].id, zIndex)
                }
              }}
              setPropertyEditor_FieldBgColor={(oldBgColor, newBgColor) => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_FieldBgColor(fieldShape.id, newBgColor)
                }
              }}
              setPropertyEditor_FieldCmdText={cmdText => {
                if (selectedFieldShapes.length === 1) {
                  this.props.setPropertyEditor_FieldCmdText(selectedFieldShapes[0].id, cmdText)
                }
              }}
              setPropertyEditor_FieldColor={(oldColor, newColor) => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_FieldColor(fieldShape.id, newColor)
                }
              }}
              setPropertyEditor_FieldCornerRadiusInPx={(oldCornerRadiusInPx, newCornerRadiusInPx) => {
                const delta = newCornerRadiusInPx - oldCornerRadiusInPx

                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_FieldCornerRadiusInPx(fieldShape.id, newCornerRadiusInPx)
                }
              }}
              setPropertyEditor_FieldHeight={(oldHeight, newHeight) => {
                const delta = newHeight - oldHeight
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_FieldHeight(fieldShape.id, newHeight)
                }
              }}
              setPropertyEditor_FieldHorizontalAlign={horizontalAlign => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_FieldHorizontalAlign(fieldShape.id, horizontalAlign)
                }
              }}
              setPropertyEditor_FieldText={(oldText, newText) => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_FieldText(fieldShape.id, newText)
                }
              }}
              setPropertyEditor_FieldVerticalAlign={verticalAlign => {
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_FieldVerticalAlign(fieldShape.id, verticalAlign)
                }
              }}
              setPropertyEditor_FieldWidth={(oldWidth, newWidth) => {
                const delta = newWidth - oldWidth
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_FieldWidth(fieldShape.id, newWidth)
                }
              }}
              setPropertyEditor_FieldX={(oldX, newX) => {
                const delta = newX - oldX
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_FieldX(fieldShape.id, newX)
                }
              }}
              setPropertyEditor_FieldY={(oldY, newY) => {
                const delta = newY - oldY
                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_FieldY(fieldShape.id, newY)
                }
              }}
              setPropertyEditor_removeFieldShape={() => {
                this.props.setSelectedFieldShapeIds([])
                for (const fieldShape of selectedFieldShapes) {
                  this.props.removeFieldShape(fieldShape.id)
                }

                renewAllZIndicesInTile()
                this.props.set_editor_restoreRightTabActiveIndex()
              }}

              setPropertyEditor_FieldPadding={(oldPaddingTop, oldPaddingRight, oldPaddingBottom, oldPaddingLeft, newPaddingTop, newPaddingRight, newPaddingBottom, newPaddingLeft) => {
                const deltaTop = newPaddingTop - oldPaddingTop
                const deltaRight = newPaddingRight - oldPaddingRight
                const deltaBottom = newPaddingBottom - oldPaddingBottom
                const deltaLeft = newPaddingLeft - oldPaddingLeft

                for (const fieldShape of selectedFieldShapes) {
                  this.props.setPropertyEditor_FieldPadding(fieldShape.id,
                    newPaddingTop,
                    newPaddingRight,
                    newPaddingBottom,
                    newPaddingLeft
                  )
                }
              }}
              setPropertyEditor_setSelectedFieldToNull={() => {

                this.props.setSelectedFieldShapeIds([])
                this.props.set_editor_restoreRightTabActiveIndex()
              }}
              onAddFieldSymbol={() => {

                if (selectedFieldShapes.length === 1) {
                  const symbol = createFieldSymbolFromFieldShape(selectedFieldShapes[0], this.props.fieldSymbols.length)

                  this.props.set_fieldSymbols(this.props.fieldSymbols.concat(symbol))

                  //move new symbol to front
                  swapDisplayIndexWithGuid(
                    symbol,
                    symbol.displayIndex - 1,
                    true,
                    false,
                    this.props.fieldSymbols.length,
                    this.props.fieldSymbols,
                    this.props.set_fieldSymbol_displayIndex
                  )

                  //then make the current field an instance of the symbol...
                  this.props.setPropertyEditor_FieldCreatedFromSymbolId(selectedFieldShapes[0].id, symbol.guid)
                  this.props.set_editor_leftTabActiveIndex(LeftTileEditorTabs.fieldSymbolsTab)
                }
              }}

              setPropertyEditor_FieldAnchorPoints={anchorPoints => {
                if (selectedFieldShapes.length === 1) {
                  this.props.setPropertyEditor_FieldAnchorPoints(selectedFieldShapes[0].id, anchorPoints)
                }
              }}
            />
          </div>
        }
        {
          selectedImgShapes.length > 0 &&
          <div>
            <ImagePropertyEditor imgShape={selectedImgShapes}
                                 imgSymbols={this.props.imgSymbols}

                                 setPropertyEditor_ImageIsMouseDisabled={(oldIsMouseDisabled, newIsMouseDisabled) => {
                                   for (const imgShape of selectedImgShapes) {
                                     this.props.setPropertyEditor_ImageIsMouseDisabled(imgShape.id, newIsMouseDisabled)
                                   }
                                 }}
                                 setPropertyEditor_ImageIsBasedOnSymbol={(oldSymbolGuid, symbolGuid) => {
                                   if (selectedImgShapes.length === 1) {
                                     this.props.setPropertyEditor_ImageCreatedFromSymbolId(selectedImgShapes[0].id,
                                       symbolGuid)
                                   }
                                 }}

                                 setPropertyEditor_ImageSkewX={(oldSkewX, newSkewX) => {
                                   for (const imgShape of selectedImgShapes) {
                                     this.props.setPropertyEditor_ImageSkewX(imgShape.id, newSkewX)
                                   }
                                 }}

                                 setPropertyEditor_ImageSkewY={(oldSkewY, newSkewY) => {
                                   for (const imgShape of selectedImgShapes) {
                                     this.props.setPropertyEditor_ImageSkewY(imgShape.id, newSkewY)
                                   }
                                 }}

                                 onDuplicateImgs={newImgShape => {
                                   this.props.setPropertyEditor_imgShapes(this.props.imgShapes.concat(newImgShape))
                                   this.props.setSelectedImageShapeIds(newImgShape.map(p => p.id))

                                   renewAllZIndicesInTile()
                                 }}

                                 setPropertyEditor_ImageX={(oldX, newX) => {
                                   const delta = newX - oldX
                                   for (const imgShape of selectedImgShapes) {
                                     this.props.setPropertyEditor_ImageX(imgShape.id, imgShape.x + delta)
                                   }
                                 }}
                                 setPropertyEditor_ImageY={(oldY, newY) => {
                                   const delta = newY - oldY
                                   for (const imgShape of selectedImgShapes) {
                                     this.props.setPropertyEditor_ImageY(imgShape.id, imgShape.y + delta)
                                   }
                                 }}
                                 setPropertyEditor_ImageAbsoluteZIndex={zIndex => {
                                   if (selectedImgShapes.length === 1) {
                                     this.props.setPropertyEditor_ImageAbsoluteZIndex(selectedImgShapes[0].id, zIndex)
                                   }
                                 }}
                                 setPropertyEditor_ImageHeight={(oldHeight, newHeight) => {
                                   const delta = newHeight - oldHeight
                                   for (const imgShape of selectedImgShapes) {
                                     this.props.setPropertyEditor_ImageHeight(imgShape.id, newHeight)
                                   }
                                 }}
                                 setPropertyEditor_ImageRotationInDegree={(oldRotationInDegree, newRotationInDegree) => {
                                   const delta = newRotationInDegree - oldRotationInDegree
                                   for (const imgShape of selectedImgShapes) {
                                     this.props.setPropertyEditor_ImageRotationInDegree(imgShape.id,
                                       newRotationInDegree)
                                   }
                                 }}
                                 setPropertyEditor_ImageWidth={(oldWidth, newWidth) => {
                                   const delta = newWidth - oldWidth
                                   for (const imgShape of selectedImgShapes) {
                                     this.props.setPropertyEditor_ImageWidth(imgShape.id, newWidth)
                                   }
                                 }}
                                 setPropertyEditor_removeImgShape={() => {
                                   this.props.setSelectedImageShapeIds([])
                                   for (const imgShape of selectedImgShapes) {
                                     this.props.removeImageShape(imgShape.id)
                                   }

                                   renewAllZIndicesInTile()
                                   this.props.set_editor_restoreRightTabActiveIndex()
                                 }}

                                 setPropertyEditor_setSelectedImageToNull={() => {
                                   this.props.setSelectedImageShapeIds([])
                                   this.props.set_editor_restoreRightTabActiveIndex()
                                 }}
                                 onAddImgSymbol={() => {

                                   if (selectedImgShapes.length === 1) {
                                     const symbol = createImgSymbolFromImgShape(selectedImgShapes[0],
                                       this.props.imgSymbols.length)

                                     this.props.set_imgSymbols(this.props.imgSymbols.concat(symbol))

                                     //move new symbol to front
                                     swapDisplayIndexWithGuid(
                                       symbol,
                                       symbol.displayIndex - 1,
                                       true,
                                       false,
                                       this.props.imgSymbols.length,
                                       this.props.imgSymbols,
                                       this.props.set_imgSymbol_displayIndex
                                     )

                                     //then make the current field an instance of the symbol...
                                     this.props.setPropertyEditor_ImageCreatedFromSymbolId(selectedImgShapes[0].id,
                                       symbol.guid)
                                     this.props.set_editor_leftTabActiveIndex(LeftTileEditorTabs.imgSymbolsTab)
                                   }
                                 }}
                                 setPropertyEditor_ImageImgGuid={(oldImgGuid, newImgGuid) => {
                                   for (const imgShape of selectedImgShapes) {
                                     this.props.setPropertyEditor_ImageImgGuid(imgShape.id, newImgGuid)
                                   }
                                 }}
                                 isChooseImgShapeImageLibraryDisplayed={this.props.isChooseImgShapeImageLibraryDisplayed}
                                 setEditor_IsChooseImgShapeImageLibraryDisplayed={(isDisplayed: boolean) => {
                                   this.props.setEditor_IsChooseImgShapeImageLibraryDisplayed(isDisplayed)
                                 }}
            />
          </div>
        }
        {
          selectedLineShapes.length > 0 &&
          <div>
            <LinePropertyEditor lineShape={selectedLineShapes}

                                lineSymbols={this.props.lineSymbols}

                                setPropertyEditor_LineIsBasedOnSymbol={(oldSymbolGuid, symbolGuid) => {
                                  if (selectedLineShapes.length === 1) {
                                    this.props.setPropertyEditor_LineCreatedFromSymbolId(selectedLineShapes[0].id,
                                      symbolGuid)
                                  }
                                }}

                                setLinePointCurveMode={(bezierPointId, newCurveMode) => {
                                  if (selectedLineShapes.length === 1) {
                                    this.props.setPropertyEditor_linePointCurveMode(selectedLineShapes[0].id,
                                      bezierPointId, newCurveMode)
                                  }
                                }}

                                onDuplicateLines={newLineShapes => {
                                  this.props.setPropertyEditor_lineShapes(this.props.lineShapes.concat(newLineShapes))
                                  this.props.setSelectedLineShapeIds(newLineShapes.map(p => p.id))

                                  renewAllZIndicesInTile()
                                }}

                                setPropertyEditor_setSelectedLineToNull={() => {
                                  this.props.setSelectedLineShapeIds([])
                                  this.props.set_editor_restoreRightTabActiveIndex()
                                }}

                                setPropertyEditor_LineThicknessInPx={(oldThicknessInPx, newThicknessInPx) => {
                                  for (const lineShape of selectedLineShapes) {
                                    this.props.setPropertyEditor_LineThicknessInPx(lineShape.id, newThicknessInPx)
                                  }
                                }}

                                setPropertyEditor_LineDashArray={(oldDashArray, newDashArray) => {
                                  for (const lineShape of selectedLineShapes) {
                                    this.props.setPropertyEditor_LineDashArray(lineShape.id, newDashArray)
                                  }
                                }}
                                setPropertyEditor_LineHasEndArrow={(oldHasEndArrow, newHasEndArrow) => {
                                  for (const lineShape of selectedLineShapes) {
                                    this.props.setPropertyEditor_LineHasEndArrow(lineShape.id, newHasEndArrow)
                                  }
                                }}
                                setPropertyEditor_LineHasStartArrow={(oldHasStartArrow, newHasStartArrow) => {
                                  for (const lineShape of selectedLineShapes) {
                                    this.props.setPropertyEditor_LineHasStartArrow(lineShape.id, newHasStartArrow)
                                  }
                                }}

                                set_lineSymbol_displayName={nop}
                                setLinePointNewPos={(oldPointId, newPointPos, canSetFieldAnchorPoints) => {
                                  if (selectedLineShapes.length === 1) {
                                    this.props.setLinePointNewPos(selectedLineShapes[0].id, oldPointId, newPointPos,
                                      canSetFieldAnchorPoints)
                                  }
                                }}

                                removePointFromLineShape={pointId => {
                                  if (selectedLineShapes.length === 1) {
                                    this.props.removePointFromLineShape(selectedLineShapes[0].id, pointId)
                                  }
                                }}
                                setPropertyEditor_addPointToLineShape={bezierPoint => {
                                  if (selectedLineShapes.length === 1) {
                                    this.props.setPropertyEditor_addPointToLineShape(selectedLineShapes[0].id,
                                      bezierPoint)
                                  }
                                }}

                                setPropertyEditor_LineAbsoluteZIndex={zIndex => {
                                  if (selectedLineShapes.length === 1) {
                                    this.props.setPropertyEditor_LineAbsoluteZIndex(selectedLineShapes[0].id, zIndex)
                                  }
                                }}
                                setPropertyEditor_LineColor={(oldColor, newColor) => {
                                  for (const lineShape of selectedLineShapes) {
                                    this.props.setPropertyEditor_LineColor(lineShape.id, newColor)
                                  }
                                }}
                                setPropertyEditor_LineArrowHeight={(oldArrowHeight, newArrowHeight) => {
                                  const delta = newArrowHeight - oldArrowHeight
                                  for (const lineShape of selectedLineShapes) {
                                    this.props.setPropertyEditor_LineArrowHeight(
                                      lineShape.id, lineShape.arrowHeight + delta)
                                  }
                                }}
                                setPropertyEditor_LineArrowWidth={(oldArrowWidth, newArrowWidth) => {
                                  const delta = newArrowWidth - oldArrowWidth
                                  for (const lineShape of selectedLineShapes) {
                                    this.props.setPropertyEditor_LineArrowWidth(
                                      lineShape.id, lineShape.arrowWidth + delta)
                                  }
                                }}

                                setPropertyEditor_removeLineShape={() => {
                                  this.props.setSelectedLineShapeIds([])
                                  for (const lineShape of selectedLineShapes) {
                                    this.props.removeLineShape(lineShape.id)
                                  }

                                  renewAllZIndicesInTile()
                                  this.props.set_editor_restoreRightTabActiveIndex()
                                }}

                                onAddLineSymbol={() => {

                                  if (selectedLineShapes.length === 1) {
                                    const symbol = createLineSymbolFromLineShape(selectedLineShapes[0],
                                      this.props.lineSymbols.length)

                                    this.props.set_lineSymbols(this.props.lineSymbols.concat(symbol))

                                    //move new symbol to front
                                    swapDisplayIndexWithGuid(
                                      symbol,
                                      symbol.displayIndex - 1,
                                      true,
                                      false,
                                      this.props.lineSymbols.length,
                                      this.props.lineSymbols,
                                      this.props.set_lineSymbol_displayIndex
                                    )

                                    //then make the current field an instance of the symbol...
                                    this.props.setPropertyEditor_LineCreatedFromSymbolId(selectedLineShapes[0].id,
                                      symbol.guid)
                                    this.props.set_editor_leftTabActiveIndex(LeftTileEditorTabs.lineSymbolsTab)
                                  }
                                }}


            />
          </div>
        }

        <SymbolPropertyEditorWrapper/>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(propertyEditorsView)

function createFieldSymbolFromFieldShape(fieldShape: FieldShape, displayIndex: number): FieldSymbol {

  const symbol: FieldSymbol = {
    guid: getGuid(),
    displayIndex,
    verticalTextAlign: fieldShape.verticalTextAlign,
    horizontalTextAlign: fieldShape.horizontalTextAlign,
    padding: {...fieldShape.padding},
    height: fieldShape.height,
    width: fieldShape.width,
    text: fieldShape.text,
    bgColor: fieldShape.bgColor,
    color: fieldShape.color,
    cornerRadiusInPx: fieldShape.cornerRadiusInPx,
    createdFromSymbolGuid: null,
    anchorPoints: fieldShape.anchorPoints,
    fontSizeInPx: fieldShape.fontSizeInPx,
    fontName: fieldShape.fontName,
    isSymbol: true,
    zIndex: -1,
    x: symbolPreviewStageXOffset,
    y: symbolPreviewStageYOffset,
    cmdText: fieldShape.cmdText,
    connectedLinesThroughAnchorPoints: [],
    displayName: 'field symbol',
    borderColor: fieldShape.borderColor,
    borderSizeInPx: fieldShape.borderSizeInPx,
    isFontBold: fieldShape.isFontBold,
    isFontItalic: fieldShape.isFontItalic,
    isFontUnderlined: fieldShape.isFontUnderlined,
    rotationInDegree: fieldShape.rotationInDegree,
    backgroundImgGuid: fieldShape.backgroundImgGuid,

    overwriteBackgroundImage: true,
    overwriteRotationInDeg: true,
    overwriteCornerRadius: true,
    overwritePadding: true,
    overwriteVerticalTextAlign: true,
    overwriteHorizontalTextAlign: true,
    overwriteHeight: true,
    overwriteWidth: true,
    overwriteColor: true,
    overwriteBgColor: true,
    overwriteBorderColor: true,
    overwriteBorderSizeInPx: true,
    overwriteFontName: true,
    overwriteFontSizeInPx: true,
    overwriteFontDecoration: true,
    overwriteText: true,
    overwriteCmdText: true,
  }

  return symbol
}

function createImgSymbolFromImgShape(imgShape: ImgShape, displayIndex: number): ImgSymbol {

  const id = getNextShapeId()
  const symbol: ImgSymbol = {
    guid: getGuid(),
    displayIndex,
    rotationInDegree: imgShape.rotationInDegree,
    height: imgShape.height,
    width: imgShape.width,
    imgGuid: imgShape.imgGuid,
    createdFromSymbolGuid: null,
    isSymbol: true,
    zIndex: -1,
    x: symbolPreviewStageXOffset,
    y: symbolPreviewStageYOffset,
    displayName: 'field symbol ' + id,
    skewX: imgShape.skewX,
    skewY: imgShape.skewY,
    isMouseSelectionDisabled: imgShape.isMouseSelectionDisabled,

    overwriteHeight: true,
    overwriteImage: true,
    overwriteIsDisabledForMouseSelection: true,
    overwriteRotationInDeg: true,
    overwriteSkewX: true,
    overwriteSkewY: true,
    overwriteWidth: true,
  }
  return symbol
}


function createLineSymbolFromLineShape(lineShape: LineShape, displayIndex: number): LineSymbol {

  const id = getNextShapeId()
  const symbol: LineSymbol = {
    guid: getGuid(),
    displayIndex,
    lineThicknessInPx: lineShape.lineThicknessInPx,
    color: lineShape.color,
    hasEndArrow: lineShape.hasEndArrow,
    hasStartArrow: lineShape.hasStartArrow,
    dashArray: [...lineShape.dashArray],
    isSymbol: true,
    createdFromSymbolGuid: null,
    startPoint: {
      id: getNextShapeId(),
      x: symbolPreviewStageXOffset,
      y: symbolPreviewStageYOffset,
    },
    points: [
      getNiceBezierCurveBetween({x: symbolPreviewStageXOffset, y: symbolPreviewStageYOffset}, {x: 100, y: 100},
        MajorLineDirection.topToBottom)
    ],
    zIndex: -1,
    arrowHeight: lineShape.arrowHeight,
    arrowWidth: lineShape.arrowWidth,
    displayName: 'field symbol ' + id,

    overwriteArrowHeight: true,
    overwriteArrowWidth: true,
    overwriteColor: true,
    overwriteGapsInPx: true,
    overwriteHasEndArrow: true,
    overwriteHasStartArrow: true,
    overwriteThicknessInPx: true,
  }

  return symbol

}

