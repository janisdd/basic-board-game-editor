declare module "file-loader?name=[name].js!*" {
  const value: string;
  export = value;
}

declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export = WebpackWorker;
}