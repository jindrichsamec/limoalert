/// <reference path="../@types/koa-ejs.d.ts" />

import * as Koa from 'koa'
import * as render from 'koa-ejs'
import * as assets from 'koa-static'
import * as Router from 'koa-router'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import * as path from 'path'
import { getEnvVariable } from '@brandembassy/be-javascript-utils'
import { checkUserToken, sendMessageToSlack, renderSuccess } from './middleware';

const LIMOALERT_SERVICE_PORT = getEnvVariable('LIMOALERT_SERVICE_PORT')

const app = new Koa()
const router = new Router({
  prefix: '/1.0'
})
render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: false
});

router.get('/limo/:limo',
  checkUserToken,
  sendMessageToSlack,
)

router.get('/success/:limo', renderSuccess)

app.use(logger())
app.use(assets(path.join(__dirname, '..', 'assets')))
app.use(bodyParser())
app.use(router.routes())
app.listen(LIMOALERT_SERVICE_PORT)
console.info('Server runnning on port', LIMOALERT_SERVICE_PORT)
