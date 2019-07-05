import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Button, Icon, Tab} from "semantic-ui-react";
import TileContentOutline from './tileContentOutline'
import {
  set_editor_isLeftTabMenuExpandedAction,
  set_editor_leftTabActiveIndex
} from "../../state/reducers/tileEditor/actions";
import FieldSymbolsMenu from './symbolMenus/fieldSymbolsMenu'
import ImgSymbolsMenu from './symbolMenus/imgSymbolsMenu'
import LineSymbolsMenu from './symbolMenus/lineSymbolsMenu'
import {getI18n} from "../../../i18n/i18nRoot";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    leftTabActiveIndex: rootState.tileEditorState.leftTabActiveIndex,
    isLeftTabMenuExpanded: rootState.tileEditorState.isLeftTabMenuExpanded,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_editor_leftTabActiveIndex,
  set_editor_isLeftTabMenuExpandedAction,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class leftEditorTabMenu extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div className="left-tab-menu">

        {
          this.props.isLeftTabMenuExpanded === false &&
          <div style={{marginTop: '4px'}} className="fh">
            <Button icon
                    onClick={() => {
                      this.props.set_editor_isLeftTabMenuExpandedAction(true)

                      //make sure the canvas resizes
                      setTimeout(() => {
                        window.dispatchEvent(new Event('resize'))
                      }, 100)
                    }}
            >
              <div className="flexed-h vertical-stacked-icons">
                <Icon name="cube"/>
                <Icon name="image"/>
                <Icon name="exchange"/>
                <Icon name="sitemap"/>
              </div>
            </Button>
          </div>
        }

        {
          this.props.isLeftTabMenuExpanded &&

          <div style={{position: 'relative'}} className="left-tab-menu-inner-wrapper">

            {
              //display inside the tab menu content because the header spans the full with and we cannot access it
              //because it's generated
            }
            <span style={{position: 'absolute', top: '36px', right: '-5px'}}
                 className="clickable"
                 onClick={() => {
                   this.props.set_editor_isLeftTabMenuExpandedAction(false)

                   //make sure the canvas resizes
                   setTimeout(() => {
                     window.dispatchEvent(new Event('resize'))
                   }, 100)
                 }}
            >
              <Icon size='large' name="caret square left outline"/>
            </span>

            <Tab menu={{secondary: true, pointing: true}}
                 activeIndex={this.props.leftTabActiveIndex}
                 onTabChange={(event1, data) => {
                   this.props.set_editor_leftTabActiveIndex(data.activeIndex as number)
                 }}
                 panes={[
                   {
                     menuItem: {key: 0, icon: 'cube', content: getI18n(this.props.langId, "Symbols")},
                     render: () => {
                       return (
                         <FieldSymbolsMenu/>
                       )
                     }
                   },
                   {
                     menuItem: {key: 1, icon: 'image', content: getI18n(this.props.langId, "Symbols")},
                     render: () => {
                       return (
                         <ImgSymbolsMenu/>
                       )
                     }
                   },
                   {
                     menuItem: {key: 2, icon: 'exchange', content: getI18n(this.props.langId, "Symbols")},
                     render: () => {
                       return (
                         <LineSymbolsMenu/>
                       )
                     }
                   },
                   {
                     menuItem: {key: 3, icon: 'sitemap', content: getI18n(this.props.langId, "Outline")},
                     render: () => {
                       return (
                         <TileContentOutline/>
                       )
                     }
                   }
                 ]
                 }
            >
            </Tab>
          </div>
        }

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(leftEditorTabMenu)
