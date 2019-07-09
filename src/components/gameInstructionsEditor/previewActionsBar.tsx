import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Icon} from "semantic-ui-react";
import {set_gie_previewFontSize} from "../../state/reducers/gameInstructionsEditor/actions";
import {defaultGameInstructionPreviewFontSize, maxZoomedFontSize, minZoomedFontSize} from "../../constants";
import {PrintHtmlHelper} from "../../helpers/printHtmlHelper";
import {Logger} from "../../helpers/logger";

export interface MyProps {
  readonly printDivId: string
}

const mapStateToProps = (rootState: RootState , props: MyProps) => {
  return {
    ...props,
    previewFontSize: rootState.gameInstructionsEditorState.previewFontSize,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  set_gie_previewFontSize,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


class PreviewActionsBar extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div className="action-bar">

        <div className="item" onClick={() => {

          const el = document.getElementById(`${this.props.printDivId}`)

          if (!el) {
            Logger.log('found none or too many printable contents')
            return
          }

          PrintHtmlHelper.printContent(el.innerHTML)

        }}>
          <Icon name="print"/>
        </div>

        <div className="item" style={{marginLeft: '1em'}} onClick={() => {
          this.props.set_gie_previewFontSize(Math.min(maxZoomedFontSize, this.props.previewFontSize + 1))
        }}>
          <Icon name="zoom in"/>
        </div>

        <div className="item" onClick={() => {
          this.props.set_gie_previewFontSize(defaultGameInstructionPreviewFontSize)
        }}>
          <Icon name="undo"/>
        </div>

        <div className="item" onClick={() => {
          this.props.set_gie_previewFontSize(Math.max(minZoomedFontSize, this.props.previewFontSize - 1))
        }}>
          <Icon name="zoom out"/>
        </div>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewActionsBar)
