import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import SymbolRenderer from '../symbols/symbolRenderer'
import {set_selectedImgSymbolGuid} from "../../../state/reducers/tileEditor/symbols/actions";
import {setSelectedImageShapeIds} from "../../../state/reducers/tileEditor/actions";
import {addImageShape} from "../../../state/reducers/tileEditor/imgProperties/actions";
import {
  remove_imgSymbol,
  set_imgSymbol_displayIndex
} from "../../../state/reducers/tileEditor/symbols/imgSymbols/actions";
import {swapDisplayIndex, swapDisplayIndexWithGuid} from "../../../helpers/someIndexHelper";
import {ui_helpPopupDelayInMs} from "../../../constants";
import {ImgShape, ImgSymbol} from "../../../types/drawing";
import {Button, Icon, Popup} from "semantic-ui-react";
import {getNextShapeId} from "../../../state/reducers/tileEditor/fieldProperties/fieldPropertyReducer";
import ToolTip from '../../helpers/ToolTip'
import {getI18n} from "../../../../i18n/i18nRoot";
import IconToolTip from "../../helpers/IconToolTip";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    imgSymbols: rootState.imgSymbolState.present,

    amountOfShapesInTile: rootState.tileEditorLineShapeState.present.length + rootState.tileEditorImgShapesState.present.length + rootState.tileEditorFieldShapesState.present.length,
    amountOfFieldsInTile: rootState.tileEditorFieldShapesState.present.length,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_selectedImgSymbolGuid,
  setSelectedImageShapeId: setSelectedImageShapeIds,
  addImageShape,
  set_imgSymbol_displayIndex,
  remove_imgSymbol,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class imgSymbolsMenu extends React.Component<Props, any> {
  render(): JSX.Element {

    const sortedImgSymbols: ImgSymbol[] = [...this.props.imgSymbols]
    sortedImgSymbols.sort((a, b) => a.displayIndex - b.displayIndex)

    return (
      <div className="property-editor-left">


        <div>
          <span>
            {
              getI18n(this.props.langId,
                "What is a symbol")
            }
          </span>
          <IconToolTip iconSize="large" message={getI18n(this.props.langId,
            "A symbol is like a plan for a shape, it defines properties. If you create an instance of this symbol then the created shape will keep a connection to the symbol and use the symbol properties instead of its own properties. Thus when you change the symbol all connected shapes will update too! Symbol instances are marked with a small indicator in the corner. To add a symbol select a shape and create a symbol from shape")}/>
        </div>

        <div className="flexed">
          {
            sortedImgSymbols.map((symbol, index) => {
              return (
                <div key={symbol.guid} className="symbol-menu-item">
                  <SymbolRenderer
                    fieldSymbol={null}
                    imgSymbol={symbol}
                    lineSymbol={null}
                  />

                  <div>

                    <ToolTip
                      message={getI18n(this.props.langId, "Adds a new shape with the props of the symbol")}
                    >
                      <Button icon
                              onClick={() => {
                                const shape = createNewImgShapeFromSymbol(symbol, this.props.amountOfShapesInTile,
                                  false)
                                this.props.addImageShape(shape)
                              }}
                      >
                        <Icon name="add"/>
                      </Button>
                    </ToolTip>

                    <ToolTip
                      message={getI18n(this.props.langId,
                        "Adds a new shape that is linked to the symbol. When the symbol changes the shape will changetoo. Can be changed later")}
                    >
                      <Button icon
                              onClick={() => {
                                const shape = createNewImgShapeFromSymbol(symbol, this.props.amountOfShapesInTile, true)
                                this.props.addImageShape(shape)
                              }}
                      >
                        <Icon name="clone"/>
                      </Button>
                    </ToolTip>

                    <Button icon
                            onClick={() => {
                              this.props.setSelectedImageShapeId(null) //hide normal props editor
                              this.props.set_selectedImgSymbolGuid(symbol.guid)
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
                                this.props.remove_imgSymbol(symbol, this.props.imgSymbols)
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
                       className={[this.props.imgSymbols.length === 0 ? 'div-disabled' : ''].join(' ')}>
                    <Button icon
                            onClick={() => {
                              swapDisplayIndexWithGuid(
                                symbol,
                                symbol.displayIndex - 1,
                                false,
                                false,
                                this.props.imgSymbols.length,
                                this.props.imgSymbols,
                                this.props.set_imgSymbol_displayIndex
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
                                this.props.imgSymbols.length,
                                this.props.imgSymbols,
                                this.props.set_imgSymbol_displayIndex
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
                                this.props.imgSymbols.length,
                                this.props.imgSymbols,
                                this.props.set_imgSymbol_displayIndex
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
                                this.props.imgSymbols.length,
                                this.props.imgSymbols,
                                this.props.set_imgSymbol_displayIndex
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

export default connect(mapStateToProps, mapDispatchToProps)(imgSymbolsMenu)

function createNewImgShapeFromSymbol(symbol: ImgSymbol, zIndex: number, linkToSymbol: boolean): ImgShape {

  const shape: ImgShape = {
    isSymbol: false,
    createdFromSymbolGuid: linkToSymbol ? symbol.guid : null,
    id: getNextShapeId(),
    width: symbol.width,
    height: symbol.height,
    imgGuid: symbol.imgGuid,
    zIndex,
    rotationInDegree: symbol.rotationInDegree,
    y: 100,
    x: 100,
    skewY: symbol.skewY,
    skewX: symbol.skewX,
    isMouseSelectionDisabled: symbol.isMouseSelectionDisabled
  }
  return shape
}
