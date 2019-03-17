/// <reference path="../@types/koa-ejs.d.ts" />

import * as Koa from 'koa'
import * as render from 'koa-ejs'
import * as assets from 'koa-static'
import * as Router from 'koa-router'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import * as path from 'path'
import { checkUserToken, sendMessageToSlack, renderSuccess, renderLimoList } from './middleware';

const app = new Koa()
const router = new Router()
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'ejs',
  cache: false,
  debug: false
});

router.get('/', renderLimoList)
router.get('/limo/:limo',
  checkUserToken,
  sendMessageToSlack,
)
router.get('/success/:limo', renderSuccess)


app.use(logger())
app.use(assets(path.join(__dirname, '..', 'assets')))
app.use(bodyParser())
app.use(router.routes())

app.use(async (ctx) => {
  try {
    const statusPages = [401, 404, 500]
    if (statusPages.indexOf(ctx.status) > -1)  {
      await ctx.render(ctx.status)
    }
  } catch (err) {
    await ctx.render('500', {
      error: err.message
    })
  }
})

export default app
