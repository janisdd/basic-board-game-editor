import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Popup} from "semantic-ui-react";
import {popupDelay} from "../../constants";
import {LangObj} from "../../../i18n/i18nRoot";

//const css = require('./styles.styl');

export interface MyProps {
  readonly message: string | {__html: string}
  readonly title?: string
}

const mapStateToProps = (rootState: RootState , props: MyProps) => {
  return {
    //test0: rootState...
    //test: props.test
    ...props
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class ToolTip extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <Popup
        trigger={
          this.props.children
        }
        content={typeof this.props.message === "string" ? this.props.message : <div dangerouslySetInnerHTML={this.props.message}></div>  }
        header={this.props.title}
        mouseEnterDelay={popupDelay}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolTip)