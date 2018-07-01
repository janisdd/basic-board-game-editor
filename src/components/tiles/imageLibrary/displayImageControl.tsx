import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {ImgStorage} from "../../../externalStorage/imgStorage";
import {Card, Divider, Button, Icon} from 'semantic-ui-react'
import {imgLibrary_removeImg} from "../../../state/reducers/imgLibrary/actions";
import {getI18n} from "../../../../i18n/i18nRoot";
import ToolTip from '../../helpers/TooTip'
import {ImageAssetSurrogate} from "../../../types/world";

//const css = require('./styles.styl');

export interface MyProps {
  readonly imgSurrogate: ImageAssetSurrogate

  readonly onImgTaken: (imgSurrogate: ImageAssetSurrogate) => void

  readonly onImgDisplayIndexIncrease: (imgSurrogate: ImageAssetSurrogate) => void
  readonly onImgDisplayIndexDecrease: (imgSurrogate: ImageAssetSurrogate) => void

  readonly onImgDisplayIndexAbsoluteFirst: (imgSurrogate: ImageAssetSurrogate) => void
  readonly onImgDisplayIndexSetAbsoluteLast: (imgSurrogate: ImageAssetSurrogate) => void

  readonly isCreatingNewImgShape: boolean
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

  imgLibrary_removeImg
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class displayImageControl extends React.Component<Props, any> {


  render(): JSX.Element {

    const img = ImgStorage.getImgFromGuid(this.props.imgSurrogate.guid)

    return (
      <div className="img-library-img-wrapper">
        <Card>
          <div className="img-library-img-wrapper-inner">
            <img className="img-library-img" src={img.base64}/>
          </div>
          <Card.Content>
            <Card.Header className="img-caption" title={this.props.imgSurrogate.displayName}>
              {
                this.props.imgSurrogate.displayName
              }
            </Card.Header>
            {/*<Card.Meta>*/}
            {/*<span>*/}
            {/*original size in px: {`${this.props.imgSurrogate.width} x ${this.props.imgSurrogate.height}`}*/}
            {/*</span>*/}
            {/*<Divider/>*/}
            {/*<span>*/}
            {/*original size in byte: {`${this.props.imgSurrogate.sizeInByte}`}*/}
            {/*</span>*/}
            {/*</Card.Meta>*/}
          </Card.Content>

          <Card.Content extra>

            <div>
              <div className="flexed-well-spaced">
                <Button icon
                        onClick={() => {
                          this.props.onImgTaken(this.props.imgSurrogate)
                        }}
                >
                  {
                    this.props.isCreatingNewImgShape &&
                    <Icon name="add"/>
                  }
                  {
                    !this.props.isCreatingNewImgShape &&
                    <Icon name="checkmark"/>
                  }

                </Button>
                <ToolTip
                  message={getI18n(this.props.langId, "All image (shapes) that use this image will remain but display the generic image")}
                >
                <Button icon color='red'
                        onClick={() => {
                          this.props.imgLibrary_removeImg(this.props.imgSurrogate.guid)
                        }}
                >
                  <Icon name="trash"/>
                </Button>
                </ToolTip>
              </div>
            </div>

            {
              //sorting
            }
            <div className="flexed-well-spaced" style={{marginTop: '0.5em'}}>
              <Button icon
                      onClick={() => {
                        this.props.onImgDisplayIndexDecrease(this.props.imgSurrogate)
                      }}>
                <Icon name="angle left"/>
              </Button>

              <Button icon
                      onClick={() => {
                        this.props.onImgDisplayIndexIncrease(this.props.imgSurrogate)
                      }}>
                <Icon name="angle right"/>
              </Button>

              <Button icon
                      onClick={() => {
                        this.props.onImgDisplayIndexAbsoluteFirst(this.props.imgSurrogate)
                      }}>
                <Icon name="angle double left"/>
              </Button>

              <Button icon
                      onClick={() => {
                        this.props.onImgDisplayIndexSetAbsoluteLast(this.props.imgSurrogate)
                      }}>
                <Icon name="angle double right"/>
              </Button>
            </div>

          </Card.Content>

        </Card>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(displayImageControl)

// angle left
// angle right
// angle double left
// angle double right