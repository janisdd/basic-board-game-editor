declare var process: {
  env: {
    NODE_ENV: string
  }
}

export const isDebug = (process.env.NODE_ENV !== 'production')