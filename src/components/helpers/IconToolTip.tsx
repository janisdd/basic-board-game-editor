import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Icon, Popup, SemanticICONS} from "semantic-ui-react";
import {popupDelay} from "../../constants";
import {LangObj} from "../../../i18n/i18nRoot";
import {IconSizeProp} from "semantic-ui-react/src/elements/Icon/Icon";

//const css = require('./styles.styl');

export interface MyProps {
  readonly message: string
  readonly title?: string
  readonly icon?: SemanticICONS
  readonly iconSize?: IconSizeProp
  readonly wide?: boolean | "very"
  readonly iconGroup?: JSX.Element
  readonly onClick?: ()=> void
}

const mapStateToProps = (rootState: RootState, props: MyProps) => {
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


//of some reason in labels this is not properly placed
export const horizontalIconPopupOffsetInPx = 9

class IconToolTip extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <Popup
        trigger={
          <div style={{display: 'inline-block'}} className="hoverable mar-left-half"
               onClick={this.props.onClick ? this.props.onClick : undefined}
          >
            {
              this.props.iconGroup &&
              this.props.iconGroup
            }
            {
              !this.props.iconGroup &&
              <Icon size={this.props.iconSize ? this.props.iconSize : undefined}
                    name={this.props.icon ? this.props.icon as SemanticICONS : 'question circle'}/>
            }
          </div>
        }
        content={this.props.message}
        header={this.props.title}
        horizontalOffset={horizontalIconPopupOffsetInPx}
        wide={this.props.wide === undefined
          ? false
          : this.props.wide === true
            ? true
            : 'very'
        }
        //mouseEnterDelay={popupDelay} //delay not needed because it's a separate icon
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IconToolTip)