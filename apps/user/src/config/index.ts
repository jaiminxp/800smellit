import prodConfig from './prod'
import devConfig from './dev'

let config = devConfig
const isProd = import.meta.env.PROD
const isDev = import.meta.env.DEV

if (isProd) {
  config = prodConfig
}

export { config, isProd, isDev }
