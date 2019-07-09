import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {
  set_gie_actionResultCopyText,
  set_gie_editorFontSize, set_gie_isActionResultCopyModalDisplayed
} from "../../state/reducers/gameInstructionsEditor/actions";
import {defaultGameInstructionEditorFontSize, maxZoomedFontSize, minZoomedFontSize} from "../../constants";
import {Icon} from "semantic-ui-react";
import IconToolTip from "../helpers/IconToolTip";
import ToolTip from "../helpers/ToolTip";
import {getI18n} from "../../../i18n/i18nRoot";
import {generateMarkdownPhraseDefinitionList} from "../../helpers/markdownHelper";

export interface MyProps {
  // readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    editorFontSize: rootState.gameInstructionsEditorState.editorFontSize,

    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  set_gie_editorFontSize,

  set_gie_actionResultCopyText,
  set_gie_isActionResultCopyModalDisplayed,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


class EditorActionsBar extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div className="action-bar">


        <div className="item" style={{marginLeft: '1em'}} onClick={() => {
          this.props.set_gie_editorFontSize(Math.min(maxZoomedFontSize, this.props.editorFontSize + 1))
        }}>
          <Icon name="zoom in"/>
        </div>

        <div className="item" onClick={() => {
          this.props.set_gie_editorFontSize(defaultGameInstructionEditorFontSize)
        }}>
          <Icon name="undo"/>
        </div>

        <div className="item" onClick={() => {
          this.props.set_gie_editorFontSize(Math.max(minZoomedFontSize, this.props.editorFontSize - 1))
        }}>
          <Icon name="zoom out"/>
        </div>


        <div className="item">
          <IconToolTip
            message={getI18n(this.props.langId, "Creates the initial template for new game instructions with the current world settings (game init code)")}
            icon="asterisk"
            onClick={() => {

            }}
          />
        </div>

        <div className="item">
          <IconToolTip
            message={getI18n(this.props.langId, "This will collect all used phrases from all fields in the world into a markdown list, so that you can explain each one manually")}
            icon="list"
            onClick={() => {

              let phrases: string[] = []

              let markdown = generateMarkdownPhraseDefinitionList(phrases)
              this.props.set_gie_actionResultCopyText('aaaaaaaaaaaaaaaaaaaaaa\n\n\n\n\n\nda')
              this.props.set_gie_isActionResultCopyModalDisplayed(true)

            }}
          />
        </div>


      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorActionsBar)
