interface Entry {
  blob: Blob
  url: string
}

interface MyStorage {
  [url: string]: Entry
}

/**
 * stores world units as images with are accessible as (png) blobs
 */
import {FieldAbsolutePosition} from "../helpers/worldTilesHelper";


export class WorldUnitAsImgBlobStorage {
  private constructor() {
  }


  static storageFieldImgs: MyStorage = {}
  static storageTileImgs: MyStorage = {}

  public static clearFieldStorage() {

    console.log('clearing 1')

    const keys = Object.keys(this.storageFieldImgs)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      // this.storage[key]
      URL.revokeObjectURL(key)
    }

    this.storageFieldImgs = {}
  }

  public static clearTileStorage() {

    console.log('clearing 2')
    const keys = Object.keys(this.storageTileImgs)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      // this.storage[key]
      URL.revokeObjectURL(key)
    }

    this.storageTileImgs = {}
  }


  public static async addFieldImg(absolutePosition: FieldAbsolutePosition, canvas: HTMLCanvasElement): Promise<string> {

    return new Promise<string>((resolve, reject) => {
      try {
        canvas.toBlob((blob) => {

          if (!blob) {
            reject('falsy blob')
            return
          }

          const url = URL.createObjectURL(blob)

          this.storageFieldImgs[`${absolutePosition.tileGuid}.${absolutePosition.fieldId}`] = {
            blob,
            url
          }

          resolve(url)
        })
      } catch (err) {

        reject(err)
      }
    })
  }

  public static async addTileImg(tileGuid: string, canvas: HTMLCanvasElement): Promise<string> {

    return new Promise<string>((resolve, reject) => {
      try {
        canvas.toBlob((blob) => {

          if (!blob) {
            reject('falsy blob')
            return
          }

          const url = URL.createObjectURL(blob)

          this.storageTileImgs[tileGuid] = {
            blob,
            url
          }

          resolve(url)
        })
      } catch (err) {

        reject(err)
      }
    })
  }

  public static getImgByAbsolutePosition(absolutePosition: FieldAbsolutePosition): string | null {

    const entry = this.storageFieldImgs[`${absolutePosition.tileGuid}.${absolutePosition.fieldId}`]

    if (!entry) return null

    return entry.url
  }

  public static getImgByTileGuid(tileGuid: string): string | null {

    const entry = this.storageTileImgs[tileGuid]

    if (!entry) return null

    return entry.url
  }

}