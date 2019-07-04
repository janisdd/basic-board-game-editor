import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {FieldSymbol, ImgSymbol, LineSymbol} from "../../../types/drawing";
import TileRenderer from '../tileRenderer'

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string

  readonly fieldSymbol: FieldSymbol | null
  readonly lineSymbol: LineSymbol | null
  readonly imgSymbol: ImgSymbol | null

  readonly disableSelection: boolean
  readonly widthInPx: number
  readonly heightInPx: number

  readonly selectedLineSymbolGuid: string | null
  readonly selectedImgSymbolGuid: string | null
  readonly selectedFieldSymbolGuid: string | null

  readonly setSelectedFieldSymbolGuid?: (guid: string) => void
  readonly setSelectedImgSymbolGuid?: (guid: string) => void
  readonly setSelectedLineSymbolGuid?: (guid: string) => void

  readonly deselectAllShapes?: () => void
}

const mapStateToProps = (rootState: RootState, props: MyProps) => {
  return {
    //test0: rootState...
    //test: props.test
    ...props,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here
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
          canvasWidth={this.props.widthInPx}
          canvasHeight={this.props.heightInPx}
          tileHeight={this.props.heightInPx}
          tileWidth={this.props.widthInPx}
          viewMaxHeight={this.props.heightInPx}
          viewMaxWidth={this.props.widthInPx}
          lineShapes={this.props.lineSymbol ? [this.props.lineSymbol] : []}
          imgShapes={this.props.imgSymbol ? [this.props.imgSymbol] : []}
          fieldShapes={this.props.fieldSymbol ? [this.props.fieldSymbol] : []}
          snapToGrid={false}
          gridSizeInPx={10}
          drawGrid={true}
          drawFieldIds={false}
          setPropertyEditor_FieldHeight={nop}
          setPropertyEditor_FieldWidth={nop}
          setPropertyEditor_ImageHeight={nop}
          setPropertyEditor_ImageWidth={nop}


          setSelectedLineShapeIds={nop}
          setSelectedImageShapeIds={nop}
          setSelectedFieldShapeIds={() => {
            if (this.props.disableSelection) return

            if (this.props.deselectAllShapes) this.props.deselectAllShapes()
          }}

          setSelectedFieldSymbolGuid={guid => {
            if (this.props.disableSelection) return

            if (this.props.setSelectedFieldSymbolGuid) this.props.setSelectedFieldSymbolGuid(guid)
          }}
          setSelectedLineSymbolGuid={guid => {
            if (this.props.disableSelection) return

            if (this.props.setSelectedLineSymbolGuid) this.props.setSelectedLineSymbolGuid(guid)
          }}
          setSelectedImageSymbolGuid={guid => {
            if (this.props.disableSelection) return

            if (this.props.setSelectedImgSymbolGuid) this.props.setSelectedImgSymbolGuid(guid)
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
