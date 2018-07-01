import Swal from 'sweetalert2'

export class Logger {

  private constructor() {
  }

  public static log(message: string, a: any = undefined): void {

    if (a === undefined) {
      console.log(message)
      return
    }
    console.log(message, a)
  }

  public static message(message: string, title = 'Message'): void {
    Swal(title, message, "info")
  }

  public static success(message: string, title = 'Message'): void {
    Swal(title, message, "success")
  }

  // public static error(message: string) {
  //   Swal('Error', message, "error")
  //   console.error(message)
  // }

  public static fatal(message: string, title?: string): never {
    Swal(title || 'Error', message, "error")
    throw new Error(message)
  }

}