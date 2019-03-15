/// <reference path="../@types/koa-ejs.d.ts" />

import * as Koa from 'koa'
import * as render from 'koa-ejs'
import * as assets from 'koa-static'
import * as Router from 'koa-router'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import * as path from 'path'
import { getEnvVariable } from '@brandembassy/be-javascript-utils'

import fetch from 'node-fetch';

const LIMOALERT_SERVICE_PORT = getEnvVariable('LIMOALERT_SERVICE_PORT', "3000")

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

router.get('/', async (ctx: Koa.Context, next: Function) => {
  const limo = ctx.request.query.limo
  await ctx.render('success', {
    limo
  })
  ctx.response.status = 200
  await next()
})

app.use(logger())
app.use(assets(path.join(__dirname, '..', 'assets')))
app.use(bodyParser())
app.use(router.routes())
app.listen(LIMOALERT_SERVICE_PORT)
console.info('Server runnning on port', LIMOALERT_SERVICE_PORT)
