import { getEnvVariable } from '@brandembassy/be-javascript-utils'
import app from './app'

const LIMOALERT_SERVICE_PORT = getEnvVariable('LIMOALERT_SERVICE_PORT')

if (!module.parent) {
  app.listen(LIMOALERT_SERVICE_PORT)
  console.info('Server runnning on port', LIMOALERT_SERVICE_PORT)
}
