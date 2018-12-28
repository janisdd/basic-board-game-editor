import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {Button, Card, Icon, Modal} from "semantic-ui-react";
import {getI18n} from "../../../../i18n/i18nRoot";
import {FieldSymbol, ImgSymbol, LineSymbol} from "../../../types/drawing";
import SymbolRenderer from '../symbols/symbolRenderer'
import {symbolPreviewHeight, symbolPreviewWidth} from "../../../constants";

export interface MyProps {
  //readonly test: string

  readonly fieldSymbols: ReadonlyArray<FieldSymbol> | null
  readonly imgSymbols: ReadonlyArray<ImgSymbol> | null
  readonly lineSymbols: ReadonlyArray<LineSymbol> | null

  readonly isDisplayed: boolean
  readonly set_isDisplayed: (isDisplayed: boolean) => void

  readonly onFieldSymbolChosen?: (symbol: FieldSymbol) => void
  readonly onImgSymbolChosen?: (symbol: ImgSymbol) => void
  readonly onLineSymbolChosen?: (symbol: LineSymbol) => void
}

const mapStateToProps = (rootState: RootState, props: MyProps) => {
  return {
    //test0: rootState...
    //test: props.test
    ...props,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


class SymbolLibrary extends React.Component<Props, any> {
  render(): JSX.Element {

    const hasNoContent = (!this.props.fieldSymbols || this.props.fieldSymbols.length === 0)
      && (!this.props.lineSymbols || this.props.lineSymbols.length === 0)
      && (!this.props.imgSymbols || this.props.imgSymbols.length === 0)

    return (
      <div>
        <Modal closeIcon={true}
               open={this.props.isDisplayed}
               onClose={() => {
                 this.props.set_isDisplayed(false)
               }}
               size="fullscreen"
        >
          <Modal.Header>{getI18n(this.props.langId, "Symbol library")}</Modal.Header>
          <Modal.Content>
            <div className="flexed">

              {
                hasNoContent &&
                <div>
                  {getI18n(this.props.langId, "No symbols")}
                </div>
              }

              {
                this.props.fieldSymbols &&
                this.props.fieldSymbols.map((fieldSymbol) => {
                  return (
                    <div key={fieldSymbol.guid}>
                      <Card style={{width: `${symbolPreviewWidth + 10}px`}}>
                        <div style={{margin: 'auto'}}>
                          <SymbolRenderer
                            fieldSymbol={fieldSymbol}
                            imgSymbol={null}
                            lineSymbol={null}

                            disableSelection={true}
                            heightInPx={symbolPreviewWidth}
                            widthInPx={symbolPreviewHeight}

                            selectedLineSymbolGuid={null}
                            selectedImgSymbolGuid={null}
                            selectedFieldSymbolGuid={null}

                          />
                        </div>
                        <Card.Content style={{textAlign: 'center'}}>
                          <Button icon onClick={() => {

                            if (this.props.onFieldSymbolChosen) this.props.onFieldSymbolChosen(fieldSymbol)

                            this.props.set_isDisplayed(false)
                          }}>
                            <Icon name="checkmark"/>
                          </Button>
                        </Card.Content>
                      </Card>
                    </div>
                  )
                })
              }
              {
                this.props.imgSymbols &&
                this.props.imgSymbols.map((imgSymbol) => {
                  return (
                    <div key={imgSymbol.guid}>
                      <Card style={{width: `${symbolPreviewWidth + 10}px`}}>
                        <div style={{margin: 'auto'}}>
                          <SymbolRenderer
                            fieldSymbol={null}
                            imgSymbol={imgSymbol}
                            lineSymbol={null}

                            disableSelection={true}
                            heightInPx={symbolPreviewWidth}
                            widthInPx={symbolPreviewHeight}

                            selectedLineSymbolGuid={null}
                            selectedImgSymbolGuid={null}
                            selectedFieldSymbolGuid={null}

                          />
                        </div>
                        <Card.Content style={{textAlign: 'center'}}>
                          <Button icon onClick={() => {

                            if (this.props.onImgSymbolChosen) this.props.onImgSymbolChosen(imgSymbol)

                            this.props.set_isDisplayed(false)
                          }}>
                            <Icon name="checkmark"/>
                          </Button>
                        </Card.Content>
                      </Card>
                    </div>
                  )
                })
              }
              {
                this.props.lineSymbols &&
                this.props.lineSymbols.map((lineSymbol) => {
                  return (
                    <div key={lineSymbol.guid}>
                      <Card style={{width: `${symbolPreviewWidth + 10}px`}}>
                        <div style={{margin: 'auto'}}>
                          <SymbolRenderer
                            fieldSymbol={null}
                            imgSymbol={null}
                            lineSymbol={lineSymbol}

                            disableSelection={true}
                            heightInPx={symbolPreviewWidth}
                            widthInPx={symbolPreviewHeight}

                            selectedLineSymbolGuid={null}
                            selectedImgSymbolGuid={null}
                            selectedFieldSymbolGuid={null}

                          />
                        </div>
                        <Card.Content style={{textAlign: 'center'}}>
                          <Button icon onClick={() => {

                            if (this.props.onLineSymbolChosen) this.props.onLineSymbolChosen(lineSymbol)

                            this.props.set_isDisplayed(false)
                          }}>
                            <Icon name="checkmark"/>
                          </Button>
                        </Card.Content>
                      </Card>
                    </div>
                  )
                })
              }
            </div>
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SymbolLibrary)