import storage from '../state/state'
import {imgLibrary_addImg} from "../state/reducers/imgLibrary/actions";
import {ImageAsset, ImageAssetSurrogate} from "../types/world";

const ladder = require('../../imgAssets/ladder.svg')

// console.log(ladder) //url
// console.log(SparkMD5.hash(ladder)) //only md5 of url

//ladder will only get us the path/file name not the base64 content but this is ok because img.base64 can be an url
//we only need to set the guid manually

const allImages: ImageAsset[] = [
  {
    guid: 'a28d750900ffc60db2c415b2e9cf41eb',
    base64: ladder,
    width: 100,
    height: 100,
    displayName: 'ladder',
    mimeType: '',
    originalName: '',
    sizeInByte: -1,
    displayIndex: 1,
  }
]


export class ImgStorage {
  private constructor() {
  }

  public static images: ImageAsset[] = []

  public static getImgFromGuid(guid: string | null): ImageAsset | null {

    const img = this.images.find(p => p.guid === guid)

    if (img) return img

    return null
  }

  public static addImg(img: ImageAsset): ImageAssetSurrogate {
    this.images.push(img)

    return {
      guid: img.guid,
      displayName: img.displayName,
      height: img.height,
      width: img.width,
      mimeType: img.mimeType,
      originalName: img.originalName,
      sizeInByte: img.sizeInByte,
      displayIndex: img.displayIndex
    }
  }

  public static removeImg(imgGuid: string): boolean {

    const index = this.images.findIndex(p => p.guid === imgGuid)

    if (index === -1) return false

    this.images.splice(index, 1)
    return true
  }

}

//add predefined library images

for (const img of allImages) {

  const surrogate = ImgStorage.addImg(img)
  storage.dispatch(imgLibrary_addImg(surrogate))
}
