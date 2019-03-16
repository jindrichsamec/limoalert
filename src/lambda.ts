/// <reference path="../@types/serverless-http.d.ts" />

import * as serverless from 'serverless-http'
import app from './app'

export const handler = serverless(app);
