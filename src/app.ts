/// <reference path="../@types/koa-ejs.d.ts" />

import * as Koa from 'koa'
import * as render from 'koa-ejs'
import * as assets from 'koa-static'
import * as Router from 'koa-router'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import * as path from 'path'
import { checkUserToken, sendMessageToSlack, renderSuccess } from './middleware';

const app = new Koa()
const router = new Router()
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

export default app
