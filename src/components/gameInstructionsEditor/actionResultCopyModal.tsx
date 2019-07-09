import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {Button, Icon, Modal, TextArea} from "semantic-ui-react";
import {RootState} from "../../state";
import {getI18n} from "../../../i18n/i18nRoot";
import {set_gie_isActionResultCopyModalDisplayed} from "../../state/reducers/gameInstructionsEditor/actions";

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    isActionResultCopyModalDisplayed: rootState.gameInstructionsEditorState.isActionResultCopyModalDisplayed,
    actionResultCopyText: rootState.gameInstructionsEditorState.actionResultCopyText,

    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  set_gie_isActionResultCopyModalDisplayed,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


const actionResultCopyModalCopyId = 'actionResultCopyModalCopyId'

class ActionResultCopyModal extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div>
        <Modal closeIcon={true} centered={false}
               open={this.props.isActionResultCopyModalDisplayed}
               onClose={() => {
                 this.props.set_gie_isActionResultCopyModalDisplayed(false)
               }}
               size="large"
        >

          <Modal.Header>{getI18n(this.props.langId, "Copy modal")}</Modal.Header>
          <Modal.Content>

            <TextArea id={actionResultCopyModalCopyId} style={{width: '100%', resize: 'none'}} rows={30}
                      value={this.props.actionResultCopyText}
            />



          </Modal.Content>

          <Modal.Actions>

            <Button icon labelPosition="left" onClick={() => {
              const copyTextArea = document.getElementById(actionResultCopyModalCopyId) as HTMLTextAreaElement
              copyTextArea.select()
              document.execCommand("copy")

              this.props.set_gie_isActionResultCopyModalDisplayed(false)
            }}>
              <Icon name="clipboard outline"/>
              {getI18n(this.props.langId, "Copy text to clipboard and close modal")}
            </Button>

            <Button icon labelPosition="left" onClick={() => {
              this.props.set_gie_isActionResultCopyModalDisplayed(false)
            }}>
              <Icon name="close"/>
              {getI18n(this.props.langId, "Close")}
            </Button>
          </Modal.Actions>

        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionResultCopyModal)
