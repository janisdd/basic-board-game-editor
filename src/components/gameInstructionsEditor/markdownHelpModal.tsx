import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Icon, Modal} from "semantic-ui-react";
import {getI18n} from "../../../i18n/i18nRoot";
import {set_gie_isMarkdownHelpModalDisplayed} from "../../state/reducers/gameInstructionsEditor/actions";
import MarkdownRenderer from './markdownRenderer'

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {

    isMarkdownHelpModalDisplayed: rootState.gameInstructionsEditorState.isMarkdownHelpModalDisplayed,

    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  set_gie_isMarkdownHelpModalDisplayed,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;



const markdownGuide = require('./markdownGuide.md') as string

class MarkdownHelpModal extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div>
        <Modal closeIcon={true} centered={false}
               open={this.props.isMarkdownHelpModalDisplayed}
               onClose={() => {
                 this.props.set_gie_isMarkdownHelpModalDisplayed(false)
               }}
               size="large"
        >

          <Modal.Header>{getI18n(this.props.langId, "Markdown help")}

            <a className="mar-left" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
               target="_blank" style={{fontSize: '12px'}}>
              <Icon name="external alternate"/>
              {getI18n(this.props.langId, "Cheatsheet")}
            </a>

          </Modal.Header>

          <Modal.Content scrolling>

            <MarkdownRenderer
              markdown={markdownGuide}
              printId={'markdown-help-modal-no-printable'}
              fontSizeInPx={12}
            />
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MarkdownHelpModal)
