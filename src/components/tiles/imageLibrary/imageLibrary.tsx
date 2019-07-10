import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";

//const css = require('./styles.styl');

import DisplayImageControl from './displayImageControl'
import {Icon, Modal} from "semantic-ui-react";
import {ImgStorage} from "../../../externalStorage/imgStorage";
import {DragEvent, SyntheticEvent} from "react";
import {
  imgLibrary_addImg,
  imgLibrary_set_imgDisplayIndexAction
} from "../../../state/reducers/imgLibrary/actions";
import {swapDisplayIndexWithGuid} from "../../../helpers/someIndexHelper";
import SparkMD5 = require("spark-md5");
import {getI18n, getRawI18n} from "../../../../i18n/i18nRoot";
import {ImageAsset, ImageAssetSurrogate} from "../../../types/world";
import {Logger} from "../../../helpers/logger";


export interface MyProps {
  //readonly test: string
  readonly onImageTaken: (imgSurrogate: ImageAssetSurrogate) => void

  readonly isDisplayed: boolean

  readonly set_isDisplayed: (isDisplayed: boolean) => void

  /**
   * true: we select the img to create a new img shape (display other icon)
   * false: not
   */
  readonly isCreatingNewImgShape: boolean

  /**
   * true: user can select the generic img
   * false: hide generic img
   */
  readonly displayGenericImg: boolean

}

const mapStateToProps = (rootState: RootState, props: MyProps) => {
  return {
    //test0: rootState...
    //test: props.test
    ...props,
    images: rootState.imgLibraryState,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  imgLibrary_addImg,
  imgLibrary_set_imgDisplayIndexAction,

}, dispatch)


export const previewImgWidth = 200
export const previewImgHeight = 200

const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml']

const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class imageLibrary extends React.Component<Props, any> {

  imgInput: HTMLInputElement = null
  dropElementId: string = 'imgLibDropArea'

  componentWillMount() {
    this.onImgDrop = this.onImgDrop.bind(this)
    this.onImgDragEnter = this.onImgDragEnter.bind(this)
    this.onImgDragLeave = this.onImgDragLeave.bind(this)
  }

  async addImageAsset(e: SyntheticEvent<HTMLInputElement>): Promise<void> {

    const files = e.currentTarget.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      //TODO maybe make real promise?
      await this.readImgAssetFile(file)
    }

  }

  async readImgAssetFile(file: File): Promise<void> {

    if (allowedTypes.indexOf(file.type) === -1) {
      //TODO message
      console.warn(`not allowed file type: ${file.type}`)
      return
    }

    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onprogress = ev => {
      Logger.log(`load status: ${ev.loaded}/${ev.total}`)
    }

    fileReader.onload = ev => {
      const base64 = fileReader.result as string
      let img = new createjs.Bitmap(base64)


      img.image.onload = ev1 => {

        const width = img.image.width
        const height = img.image.height

        let imgAsset: ImageAsset = {
          guid: SparkMD5.hash(base64),
          displayName: file.name,
          originalName: file.name,
          mimeType: file.type,
          sizeInByte: file.size,
          base64,
          width,
          height,
          displayIndex: this.props.images.length
        }
        const surrogate = ImgStorage.addImg(imgAsset)

        this.props.imgLibrary_addImg(surrogate)

        swapDisplayIndexWithGuid(
          surrogate,
          surrogate.displayIndex - 1,
          true,
          false,
          this.props.images.length,
          this.props.images,
          this.props.imgLibrary_set_imgDisplayIndexAction
        )

        this.imgInput.value = ''

      }

    }

    fileReader.onerror = ev => {
      Logger.log('error')
      this.imgInput.value = ''
    }
  }

  getValidFilesIds(e: DragEvent<HTMLDivElement>): number[] {

    let fileIds: number[] = []

    for (let i = 0; i < e.dataTransfer.items.length; i++) {
      const item = e.dataTransfer.items[i]
      if (item.kind === 'file') {
        if (allowedTypes.indexOf(item.type) !== -1) {
          fileIds.push(i)
        }
      }
    }
    return fileIds
  }

  async onImgDrop(e: DragEvent<HTMLDivElement>) {

    //because async
    e.persist()

    const imgFilesIds = this.getValidFilesIds(e)
    for (const id of imgFilesIds) {

      const file = e.dataTransfer.files.item(id)
      await this.readImgAssetFile(file)
    }
    e.preventDefault()
    this.onImgDragLeave(null)
  }

  onImgDragOver(e: DragEvent<HTMLDivElement>) {

    // this.onImgDragEnter(e)
    //TODO only show effect when we drop allowed types
    if (e.dataTransfer.types[0] === 'Files') {
      e.dataTransfer.dropEffect = 'link'
    } else {
      e.dataTransfer.dropEffect = 'none'
    }

    e.preventDefault()
  }

  onImgDragEnter(e: DragEvent<HTMLDivElement>) {
    if (e.dataTransfer.types[0] === 'Files' && this.getValidFilesIds(e).length > 0) {
      e.dataTransfer.dropEffect = 'link'
      const areaDiv = document.getElementById(this.dropElementId) as HTMLDivElement
      (areaDiv.childNodes[0] as HTMLElement).classList.add('library-add-div-drop')
      areaDiv.classList.add('imgLibDropAreaEffect')
    } else {
      e.dataTransfer.dropEffect = 'none'
    }
    e.preventDefault()
  }

  onImgDragLeave(e: DragEvent<HTMLDivElement> | null) {
    const areaDiv = document.getElementById(this.dropElementId) as HTMLDivElement
    (areaDiv.childNodes[0] as HTMLElement).classList.remove('library-add-div-drop')
    areaDiv.classList.remove('imgLibDropAreaEffect')
    if (e) {
      e.preventDefault()
    }

  }


  render(): JSX.Element {

    const images: ImageAssetSurrogate[] = [...this.props.images]

    images.sort((a, b) => a.displayIndex - b.displayIndex)

    return (

      <div>
        <Modal closeIcon={true}
               open={this.props.isDisplayed}
               onClose={() => {
                 this.props.set_isDisplayed(false)
               }}
               size="fullscreen"
        >
          <Modal.Header>{getI18n(this.props.langId, "Image library")}</Modal.Header>
          <Modal.Content>
            <div className="flexed">
              <div>
                <div id="imgLibDropArea" className="img-library-img-wrapper"
                     onClick={() => this.imgInput.click()}

                     onDragOver={this.onImgDragOver}
                     onDrop={this.onImgDrop}
                     onDragEnter={this.onImgDragEnter}
                     onDragLeave={this.onImgDragLeave}

                >
                  <div className="library-add-div">
                    <div className="img-library-img-wrapper-inner">
                      <div className="img-library-img">
                        <Icon name="add" size="big"/>
                        <p
                          dangerouslySetInnerHTML={getRawI18n(this.props.langId, "Drop image(s) or <br /> click to select image(s)")}></p>
                      </div>
                    </div>
                  </div>
                </div>
                <input ref={(i) => this.imgInput = i} type="file" className="collapsed" accept={allowedTypes.join(', ')}
                       onChange={(e: SyntheticEvent<HTMLInputElement>) => this.addImageAsset(e)}/>
              </div>

              {
                //generic icon / no img
              }
              {
                this.props.displayGenericImg &&
                <div>
                  <div className="img-library-img-wrapper"
                       onClick={() => {
                         this.props.onImageTaken({
                           guid: null,
                           height: -1,
                           width: -1,
                           displayIndex: -1,
                           displayName: 'no img',
                           mimeType: '',
                           originalName: 'no img',
                           sizeInByte: -1
                         })
                       }}
                  >
                    <div className=" img-library-generic-img-div">
                      <div className="img-library-img-wrapper-inner">
                        <div className="img-library-img">
                          <Icon name="image" size="massive"/>
                          <p>{getI18n(this.props.langId, "No/Generic image")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }


              {
                images.map((p, index) => {
                  return (
                    <div key={p.guid}>
                      <DisplayImageControl
                        isCreatingNewImgShape={this.props.isCreatingNewImgShape}
                        imgSurrogate={p}
                        onImgTaken={this.props.onImageTaken}
                        onImgDisplayIndexDecrease={(imgSurrogate) => {
                          swapDisplayIndexWithGuid(
                            imgSurrogate,
                            imgSurrogate.displayIndex - 1,
                            false,
                            false,
                            this.props.images.length,
                            this.props.images,
                            this.props.imgLibrary_set_imgDisplayIndexAction
                          )
                        }}
                        onImgDisplayIndexIncrease={(imgSurrogate) => {
                          swapDisplayIndexWithGuid(
                            imgSurrogate,
                            imgSurrogate.displayIndex + 1,
                            false,
                            false,
                            this.props.images.length,
                            this.props.images,
                            this.props.imgLibrary_set_imgDisplayIndexAction
                          )
                        }}
                        onImgDisplayIndexAbsoluteFirst={(imgSurrogate) => {
                          swapDisplayIndexWithGuid(
                            imgSurrogate,
                            imgSurrogate.displayIndex - 1,
                            true,
                            false,
                            this.props.images.length,
                            this.props.images,
                            this.props.imgLibrary_set_imgDisplayIndexAction
                          )
                        }}
                        onImgDisplayIndexSetAbsoluteLast={(imgSurrogate) => {
                          swapDisplayIndexWithGuid(
                            imgSurrogate,
                            imgSurrogate.displayIndex + 1,
                            false,
                            true,
                            this.props.images.length,
                            this.props.images,
                            this.props.imgLibrary_set_imgDisplayIndexAction
                          )
                        }}
                      />
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

export default connect(mapStateToProps, mapDispatchToProps)(imageLibrary)
