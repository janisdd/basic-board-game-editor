import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {FieldBase, FieldShape, FieldSymbol, ImgShape, ImgSymbol, LineShape, LineSymbol} from "../../../types/drawing";
import TileRenderer from '../tileRenderer'
import {
  set_selectedFieldSymbolGuid,
  set_selectedImgSymbolGuid,
  set_selectedLineSymbolGuid
} from "../../../state/reducers/tileEditor/symbols/actions";
import {
  set_editor_restoreRightTabActiveIndex,
  set_editor_rightTabActiveIndex,
  setSelectedFieldShapeIds,
  setSelectedImageShapeIds,
  setSelectedLineShapeIds
} from "../../../state/reducers/tileEditor/actions";
import {RightTileEditorTabs} from "../../../state/reducers/tileEditor/tileEditorReducer";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string

  readonly fieldSymbol: FieldSymbol | null
  readonly lineSymbol: LineSymbol | null
  readonly imgSymbol: ImgSymbol | null
}

const mapStateToProps = (rootState: RootState, props: MyProps) => {
  return {
    //test0: rootState...
    //test: props.test
    ...props,
    selectedFieldShapeIds: rootState.tileEditorState.selectedFieldShapeIds,
    selectedLineShapeIds: rootState.tileEditorState.selectedLineShapeIds,
    selectedImageShapeIds: rootState.tileEditorState.selectedImageShapeIds,

    selectedLineSymbolGuid: rootState.symbolsState.selectedLineSymbolGuid,
    selectedImgSymbolGuid: rootState.symbolsState.selectedImgSymbolGuid,
    selectedFieldSymbolGuid: rootState.symbolsState.selectedFieldSymbolGuid,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_selectedFieldSymbolGuid,
  set_selectedImgSymbolGuid,
  set_selectedLineSymbolGuid,

   setSelectedFieldShapeIds,
   setSelectedImageShapeIds,
   setSelectedLineShapeIds,

  set_editor_rightTabActiveIndex,
  set_editor_restoreRightTabActiveIndex,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


let nop = (...maybe: any[]) => {
}

class symbolRenderer extends React.Component<Props, any> {
  render(): JSX.Element {

    return (
      <div>
        <TileRenderer
          selectionRect={null}
          setSelectionRect={nop}
          printLargeTilePreferredHeightInPx={0}
          printLargeTilePreferredWidthInPx={0}
          displayPrintGuidesDisplayed={false}
          setPropertyEditor_FieldCmdText={nop}
          setTileEditorSelectingNextField={nop}
          isSelectingNextField={false}
          sourceForSelectingNextField={null}
          simulationMachineState={null}
          botBorderPoints={[]}
          leftBorderPoints={[]}
          rightBorderPoint={[]}
          topBorderPoints={[]}
          canvasWidth={150}
          canvasHeight={150}
          viewMaxHeight={150}
          viewMaxWidth={150}
          lineShapes={this.props.lineSymbol ? [this.props.lineSymbol] : []}
          imgShapes={this.props.imgSymbol ? [this.props.imgSymbol] : []}
          fieldShapes={this.props.fieldSymbol ? [this.props.fieldSymbol] : []}
          snapToGrid={false}
          gridSizeInPx={10}
          drawGrid={true}
          drawFieldIds={false}

          setSelectedLineShapeIds={nop}
          setSelectedImageShapeIds={nop}
          setSelectedFieldShapeIds={ids => {

            //will only be called with empty array to unselect all

            //we could also had selected a field in another stage
            const wasNoShapeSelectedBeforeClear = this.props.selectedFieldShapeIds.length === 0
              && this.props.selectedLineShapeIds.length === 0
              && this.props.selectedImageShapeIds.length === 0
              && this.props.selectedFieldSymbolGuid === null
              && this.props.selectedLineSymbolGuid === null
              && this.props.selectedImgSymbolGuid === null


            if (ids.length === 0) {

              this.props.setSelectedFieldShapeIds([])
              this.props.setSelectedLineShapeIds([])
              this.props.setSelectedImageShapeIds([])

              this.props.set_selectedFieldSymbolGuid(null) //this will deselect all other symbols

              if (wasNoShapeSelectedBeforeClear) {
                //then we don't need to reset
                //this can happen if we switch right tabs and no shape is selected
                //if we then click on the tile the index should not switch back
                return
              }

              this.props.set_editor_restoreRightTabActiveIndex()

              return
            }

          }}

          setSelectedFieldSymbolGuid={guid => {
            this.props.setSelectedFieldShapeIds([]) //this de selects every field/img/line
            this.props.set_selectedFieldSymbolGuid(guid)

            this.props.set_editor_rightTabActiveIndex(RightTileEditorTabs.propertyEditorTab)
          }}
          setSelectedLineSymbolGuid={guid => {
            this.props.setSelectedLineShapeIds([])
            this.props.set_selectedLineSymbolGuid(guid)

            this.props.set_editor_rightTabActiveIndex(RightTileEditorTabs.propertyEditorTab)
          }}
          setSelectedImageSymbolGuid={guid => {
            this.props.setSelectedImageShapeIds([])
            this.props.set_selectedImgSymbolGuid(guid)

            this.props.set_editor_rightTabActiveIndex(RightTileEditorTabs.propertyEditorTab)
          }}
          setPropertyEditor_ImageY={nop}
          setPropertyEditor_ImageX={nop}
          setLinePointNewPos={nop}
          setPropertyEditor_FieldX={nop}
          setPropertyEditor_FieldY={nop}

          selectedFieldSymbolGuid={this.props.selectedFieldSymbolGuid}
          selectedImageSymbolGuid={this.props.selectedImgSymbolGuid}
          selectedLineSymbolGuid={this.props.selectedLineSymbolGuid}

          selectedFieldShapeIds={[]}
          selectedImageShapeIds={[]}
          selectedLineShapeIds={[]}


          setEditor_stageOffset={nop}
          stageOffsetY={0}
          stageOffsetX={0}
          set_editor_stageOffsetScaleCorrection={nop}
          setEditor_stageScale={nop}
          stageScaleX={1}
          stageScaleY={1}
          stageOffsetYScaleCorrection={0}
          stageOffsetXScaleCorrection={0}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(symbolRenderer)