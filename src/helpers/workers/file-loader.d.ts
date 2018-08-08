declare module "file-loader?name=[name].js!*" {
  const value: string;
  export = value;
}

declare module "worker-loader?name=simulation.worker.js*" {
  class WebpackWorker extends Worker {
    constructor();
  }

  export = WebpackWorker;
}