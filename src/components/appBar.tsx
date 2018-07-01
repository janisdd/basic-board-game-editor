import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../state";
import {Button, Icon, Modal, Segment} from "semantic-ui-react";
import {appProperties} from "../constants";
import {getI18n, getRawI18n} from "../../i18n/i18nRoot";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class appBar extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div id="app-bar">

        <Segment>

          <div className="flexed" style={{justifyContent: 'space-between'}}>

            <div>
              <h3>
                {
                  appProperties.appName
                }
              </h3>


            </div>

            <div className="flexed">
              <div className="mar-right">
                v
                {
                  appProperties.version
                }
              </div>
              <a className="clickable mar-right-half" target="_blank" href="https://github.com/janisdd/basic-board-game-editor">
                <Icon name="github" size='large'/>
              </a>

              <Modal closeIcon={true}
                     trigger={
                       <div className="clickable">
                         {getI18n(this.props.langId, "About")}
                       </div>
                     }

              >
                <Modal.Header>{getI18n(this.props.langId, "Basic board game editor")} - {getI18n(this.props.langId, "About")}</Modal.Header>
                <Modal.Content>

                  <div dangerouslySetInnerHTML={getRawI18n(this.props.langId, "This project was created with other open source projects. <br /> To see a full list go to the github page and find the file package.json file and look for the dependencies section.")}>

                  </div>


                </Modal.Content>
              </Modal>

            </div>

          </div>

        </Segment>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(appBar)