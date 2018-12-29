import {SweetAlertOptions, SweetAlertType} from "sweetalert2";
import Swal from 'sweetalert2'

export class DialogHelper {
  private constructor() {
  }

  public static okDialog(title: string, message: string): Promise<boolean> {
    const options: SweetAlertOptions = {
      title: title,
      text: message,
      type: translateDialogType(DialogType.success),
      showConfirmButton: true,
      showCloseButton: false,
      showCancelButton: false,
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
      allowEnterKey: true,
    }

    return new Promise<boolean>((resolve) => {
      Swal(options)
        .then((result: { value: boolean }) => {
          resolve(result.value)
        })
    })
  }
  public static askDialog(title: string, message: string): Promise<boolean> {

    const options: SweetAlertOptions = {
      title: title,
      text: message,
      type: translateDialogType(DialogType.question),
      showConfirmButton: true,
      showCloseButton: false,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      allowEnterKey: true,
    }

    return new Promise<boolean>((resolve) => {
      Swal(options)
        .then((result: { value: boolean }) => {
          resolve(result.value)
        })
    })

  }
}

export enum DialogType {
  success,
  warning,
  info,
  question,
  error,
}


function translateDialogType(type?: DialogType): SweetAlertType {

  if (type === DialogType.success) return 'success'

  if (type === DialogType.info) return 'info'

  if (type === DialogType.error) return 'error'

  if (type === DialogType.warning) return 'warning'

  if (type === DialogType.question) return 'question'

  return 'info'
}