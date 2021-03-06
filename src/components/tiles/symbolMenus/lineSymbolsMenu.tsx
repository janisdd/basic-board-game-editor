import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import SymbolRenderer from '../symbols/symbolRenderer'
import {
  set_selectedFieldSymbolGuid,
  set_selectedLineSymbolGuid
} from "../../../state/reducers/tileEditor/symbols/actions";
import {
  remove_lineSymbol,
  set_lineSymbol_displayIndex,
  set_lineSymbols
} from "../../../state/reducers/tileEditor/symbols/lineSymbols/actions";
import {
  set_editor_restoreRightTabActiveIndex,
  set_editor_rightTabActiveIndex, setSelectedFieldShapeIds, setSelectedImageShapeIds,
  setSelectedLineShapeIds
} from "../../../state/reducers/tileEditor/actions";
import {addLineShape} from "../../../state/reducers/tileEditor/lineProperties/actions";
import {LineShape, LineSymbol} from "../../../types/drawing";
import {symbolPreviewHeight, symbolPreviewWidth, ui_helpPopupDelayInMs} from "../../../constants";
import {getNextShapeId} from "../../../state/reducers/tileEditor/fieldProperties/fieldPropertyReducer";
import {getNiceBezierCurveBetween} from "../../../helpers/interactionHelper";
import {Button, Icon, Popup} from "semantic-ui-react";
import {renewAllZIndicesInTile, swapDisplayIndexWithGuid} from "../../../helpers/someIndexHelper";
import { RightTileEditorTabs} from "../../../state/reducers/tileEditor/tileEditorReducer";
import ToolTip from '../../helpers/ToolTip'
import {getI18n} from "../../../../i18n/i18nRoot";
import IconToolTip from "../../helpers/IconToolTip";
import {MajorLineDirection} from "../../../types/world";
import guide from "../../guide/guide";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    lineSymbols: rootState.lineSymbolState.present,

    selectedFieldShapeIds: rootState.tileEditorState.selectedFieldShapeIds,
    selectedLineShapeIds: rootState.tileEditorState.selectedLineShapeIds,
    selectedImageShapeIds: rootState.tileEditorState.selectedImageShapeIds,

    selectedLineSymbolGuid: rootState.symbolsState.selectedLineSymbolGuid,
    selectedImgSymbolGuid: rootState.symbolsState.selectedImgSymbolGuid,
    selectedFieldSymbolGuid: rootState.symbolsState.selectedFieldSymbolGuid,

    amountOfShapesInTile: rootState.tileEditorLineShapeState.present.length + rootState.tileEditorImgShapesState.present.length + rootState.tileEditorFieldShapesState.present.length,
    amountOfFieldsInTile: rootState.tileEditorFieldShapesState.present.length,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here
  set_selectedLineSymbolGuid,

  setSelectedLineShapeIds,

  addLineShape,

  set_lineSymbol_displayIndex,

  set_lineSymbols,

  remove_lineSymbol,

  set_editor_rightTabActiveIndex,

  setSelectedFieldShapeIds,
  setSelectedImageShapeIds,
  set_selectedFieldSymbolGuid,
  set_editor_restoreRightTabActiveIndex,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class lineSymbolsMenu extends React.Component<Props, any> {
  render(): JSX.Element {

    const sortedLineSymbols: LineSymbol[] = [...this.props.lineSymbols]
    sortedLineSymbols.sort((a, b) => a.displayIndex - b.displayIndex)

    return (
      <div className="property-editor-left">

        <div>
          <span>
            {
              getI18n(this.props.langId,
                "What is a symbol")
            }
          </span>
          <IconToolTip wide iconSize="large" message={getI18n(this.props.langId,
            "A symbol is like a plan for a shape, it defines properties. If you create an instance of this symbol then the created shape will keep a connection to the symbol and use the symbol properties instead of its own properties. Thus when you change the symbol all connected shapes will update too! Symbol instances are marked with a small indicator in the corner. To add a symbol select a shape and create a symbol from shape. Note that changes to symbols are global (applied to all tiles) and are applied immediately (without apply changes) and cannot be cancelled")}/>
        </div>

        <div className="flexed">
        {
          sortedLineSymbols.map((symbol, index) => {
            return (
              <div key={symbol.guid} className="symbol-menu-item">
                <SymbolRenderer
                  fieldSymbol={null}
                  imgSymbol={null}
                  lineSymbol={symbol}

                  selectedFieldSymbolGuid={null}
                  selectedImgSymbolGuid={null}
                  selectedLineSymbolGuid={this.props.selectedLineSymbolGuid}

                  disableSelection={false}
                  heightInPx={symbolPreviewWidth}
                  widthInPx={symbolPreviewHeight}

                  setSelectedLineSymbolGuid={(guid) => {
                    this.props.setSelectedLineShapeIds([]) //this de selects every line
                    this.props.set_selectedLineSymbolGuid(guid)
                    this.props.set_editor_rightTabActiveIndex(RightTileEditorTabs.propertyEditorTab)
                  }}

                  deselectAllShapes={() => {
                    //will only be called with empty array to unselect all

                    //we could also had selected a field in another stage
                    const wasNoShapeSelectedBeforeClear = this.props.selectedFieldShapeIds.length === 0
                      && this.props.selectedLineShapeIds.length === 0
                      && this.props.selectedImageShapeIds.length === 0
                      && this.props.selectedFieldSymbolGuid === null
                      && this.props.selectedLineSymbolGuid === null
                      && this.props.selectedImgSymbolGuid === null

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
                  }}
                />

                <div>

                  <ToolTip
                    message={getI18n(this.props.langId, "Adds a new shape with the props of the symbol")}
                  >
                    <Button icon
                            onClick={() => {
                              const shape = createNewLinShapeFromSymbol(symbol, this.props.amountOfShapesInTile,
                                false)
                              this.props.addLineShape(shape)

                              renewAllZIndicesInTile()
                            }}
                    >
                      <Icon name="add"/>
                    </Button>
                  </ToolTip>

                  <ToolTip
                    message={getI18n(this.props.langId,
                      "Adds a new shape that is linked to the symbol. When the symbol changes the shape will change too. Can be changed later")}
                  >
                    <Button icon
                            onClick={() => {
                              const shape = createNewLinShapeFromSymbol(symbol, this.props.amountOfShapesInTile, true)
                              this.props.addLineShape(shape)

                              renewAllZIndicesInTile()
                            }}
                    >
                      <Icon name="clone"/>
                    </Button>
                  </ToolTip>

                  <Button icon
                          onClick={() => {
                            this.props.setSelectedLineShapeIds([]) //hide normal props editor
                            this.props.set_selectedLineSymbolGuid(symbol.guid)
                            this.props.set_editor_rightTabActiveIndex(RightTileEditorTabs.propertyEditorTab)
                          }}
                  >
                    <Icon name="write"/>
                  </Button>

                  <ToolTip
                    message={getI18n(this.props.langId,
                      "Removing a symbol will disconnect all shapes from that symbol. The shapes will stay but use its own properties again")}
                  >
                    <Button color="red" icon
                            onClick={() => {
                              this.props.remove_lineSymbol(symbol,   this.props.lineSymbols)
                            }}
                    >
                      <Icon name="trash"/>
                    </Button>
                  </ToolTip>

                </div>

                {
                  //sorting
                }
                <div style={{marginTop: '0.5em'}}
                     className={[this.props.lineSymbols.length === 0 ? 'div-disabled' : ''].join(' ')}>
                  <Button icon
                          onClick={() => {
                            swapDisplayIndexWithGuid(
                              symbol,
                              symbol.displayIndex - 1,
                              false,
                              false,
                              this.props.lineSymbols.length,
                              this.props.lineSymbols,
                              this.props.set_lineSymbol_displayIndex
                            )
                          }}>
                    <Icon name="angle left"/>
                  </Button>

                  <Button icon
                          onClick={() => {
                            swapDisplayIndexWithGuid(
                              symbol,
                              symbol.displayIndex + 1,
                              false,
                              false,
                              this.props.lineSymbols.length,
                              this.props.lineSymbols,
                              this.props.set_lineSymbol_displayIndex
                            )
                          }}>
                    <Icon name="angle right"/>
                  </Button>

                  <Button icon
                          onClick={() => {
                            swapDisplayIndexWithGuid(
                              symbol,
                              symbol.displayIndex - 1,
                              true,
                              false,
                              this.props.lineSymbols.length,
                              this.props.lineSymbols,
                              this.props.set_lineSymbol_displayIndex
                            )
                          }}>
                    <Icon name="angle double left"/>
                  </Button>

                  <Button icon
                          onClick={() => {
                            swapDisplayIndexWithGuid(
                              symbol,
                              symbol.displayIndex + 1,
                              false,
                              true,
                              this.props.lineSymbols.length,
                              this.props.lineSymbols,
                              this.props.set_lineSymbol_displayIndex
                            )
                          }}>
                    <Icon name="angle double right"/>
                  </Button>
                </div>

              </div>
            )
          })
        }
        </div>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(lineSymbolsMenu)


function createNewLinShapeFromSymbol(symbol: LineSymbol, zIndex: number, linkToSymbol: boolean): LineShape {

  const shape: LineShape = {
    kind: "line",
    isSymbol: false,
    createdFromSymbolGuid: linkToSymbol ? symbol.guid : null,
    id: getNextShapeId(),
    zIndex,
    color: symbol.color,
    hasEndArrow: symbol.hasEndArrow,
    hasStartArrow: symbol.hasStartArrow,
    lineThicknessInPx: symbol.lineThicknessInPx,
    dashArray: [...symbol.dashArray],
    startPoint: {
      id: getNextShapeId(),
      x: 100,
      y: 100
    },
    points: [
      getNiceBezierCurveBetween({x: 100, y: 100}, {x: 200, y: 200}, MajorLineDirection.topToBottom)
    ],
    arrowHeight: symbol.arrowHeight,
    arrowWidth: symbol.arrowWidth
  }

  return shape

}

