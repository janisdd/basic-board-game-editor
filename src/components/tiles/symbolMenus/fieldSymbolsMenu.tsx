import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {swapDisplayIndex, swapDisplayIndexWithGuid} from "../../../helpers/someIndexHelper";
import {newField_x, newField_y, ui_helpPopupDelayInMs} from "../../../constants";
import {FieldShape, FieldSymbol} from "../../../types/drawing";
import {Button, Icon, Popup} from "semantic-ui-react";
import {getNextShapeId} from "../../../state/reducers/tileEditor/fieldProperties/fieldPropertyReducer";
import {addFieldShape} from "../../../state/reducers/tileEditor/fieldProperties/actions";
import {
  remove_fieldSymbol,
  set_fieldSymbol_displayIndex
} from "../../../state/reducers/tileEditor/symbols/fieldSymbols/actions";
import {set_selectedFieldSymbolGuid} from "../../../state/reducers/tileEditor/symbols/actions";
import {setSelectedFieldShapeIds} from "../../../state/reducers/tileEditor/actions";
import SymbolRenderer from '../symbols/symbolRenderer'
import {getI18n} from "../../../../i18n/i18nRoot";
import ToolTip from '../../helpers/ToolTip'
import IconToolTip from "../../helpers/IconToolTip";


//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    fieldSymbols: rootState.fieldSymbolState.present,
    amountOfShapesInTile: rootState.tileEditorLineShapeState.present.length + rootState.tileEditorImgShapesState.present.length + rootState.tileEditorFieldShapesState.present.length,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_selectedFieldSymbolId: set_selectedFieldSymbolGuid,

  setSelectedFieldShapeId: setSelectedFieldShapeIds,

  addFieldShape,

  set_fieldSymbol_displayIndex,

  remove_fieldSymbol,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


class fieldSymbolsMenu extends React.Component<Props, any> {
  render(): JSX.Element {

    const sortedFieldSymbols: FieldSymbol[] = [...this.props.fieldSymbols]
    sortedFieldSymbols.sort((a, b) => a.displayIndex - b.displayIndex)

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
            sortedFieldSymbols.map((symbol, index) => {
              return (
                <div key={symbol.guid} className="symbol-menu-item">
                  {/*<p>{symbol.displayIndex}</p>*/}
                  <SymbolRenderer
                    fieldSymbol={symbol}
                    imgSymbol={null}
                    lineSymbol={null}
                  />

                  <div>
                    <ToolTip
                      message={getI18n(this.props.langId, "Adds a new shape with the props of the symbol")}
                    >
                      <Button icon
                              onClick={() => {
                                const field = createNewFieldShapeFromSymbol(symbol, this.props.amountOfShapesInTile,
                                  false)
                                this.props.addFieldShape(field)
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
                                const field = createNewFieldShapeFromSymbol(symbol, this.props.amountOfShapesInTile,
                                  true)
                                this.props.addFieldShape(field)
                              }}
                      >
                        <Icon name="clone"/>
                      </Button>
                    </ToolTip>

                    <Button icon
                            onClick={() => {
                              this.props.setSelectedFieldShapeId(null) //hide normal props editor
                              this.props.set_selectedFieldSymbolId(symbol.guid)
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
                                this.props.remove_fieldSymbol(symbol, this.props.fieldSymbols)
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
                       className={[this.props.fieldSymbols.length === 0 ? 'div-disabled' : ''].join(' ')}>
                    <Button icon
                            onClick={() => {
                              swapDisplayIndexWithGuid(
                                symbol,
                                symbol.displayIndex - 1,
                                false,
                                false,
                                this.props.fieldSymbols.length,
                                this.props.fieldSymbols,
                                this.props.set_fieldSymbol_displayIndex
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
                                this.props.fieldSymbols.length,
                                this.props.fieldSymbols,
                                this.props.set_fieldSymbol_displayIndex
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
                                this.props.fieldSymbols.length,
                                this.props.fieldSymbols,
                                this.props.set_fieldSymbol_displayIndex
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
                                this.props.fieldSymbols.length,
                                this.props.fieldSymbols,
                                this.props.set_fieldSymbol_displayIndex
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

export default connect(mapStateToProps, mapDispatchToProps)(fieldSymbolsMenu)

function createNewFieldShapeFromSymbol(symbol: FieldSymbol, zIndex: number, linkToSymbol: boolean): FieldShape {
  const shape: FieldShape = {
    isSymbol: false,
    createdFromSymbolGuid: linkToSymbol ? symbol.guid : null,
    connectedLinesThroughAnchorPoints: {},
    anchorPoints: symbol.anchorPoints,
    id: getNextShapeId(),
    cornerRadiusInPx: symbol.cornerRadiusInPx,
    bgColor: symbol.bgColor,
    height: symbol.height,
    width: symbol.width,
    padding: {
      bottom: symbol.padding.bottom,
      left: symbol.padding.left,
      right: symbol.padding.right,
      top: symbol.padding.top
    },
    horizontalTextAlign: symbol.horizontalTextAlign,
    verticalTextAlign: symbol.verticalTextAlign,
    text: symbol.text,
    x: newField_x,
    y: newField_y,
    cmdText: symbol.cmdText,
    color: symbol.color,
    fontSizeInPx: symbol.fontSizeInPx,
    fontName: symbol.fontName,
    zIndex,
    borderSizeInPx: symbol.borderSizeInPx,
    borderColor: symbol.borderColor,
    isFontUnderlined: symbol.isFontUnderlined,
    isFontItalic: symbol.isFontItalic,
    isFontBold: symbol.isFontBold,
    rotationInDegree: symbol.rotationInDegree,
    backgroundImgGuid: symbol.backgroundImgGuid
  }

  return shape
}

