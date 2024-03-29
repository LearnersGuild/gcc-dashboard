import path from 'path'
import express from 'express'
import {HTTPS as https} from 'express-sslify'
import next from 'next'
import bodyParser from 'body-parser'
import {addUserToRequestFromJWT} from '@learnersguild/idm-jwt-auth/lib/middlewares'
import routes from './routes'

export default () => {
  const dev = process.env.NODE_ENV !== 'production'
  const dir = path.resolve(__dirname, '..')

  const app = next({dev, dir})
  const handle = app.getRequestHandler()

  app.prepare()
    .then(() => {
      const server = express()
      const port = process.env.PORT || 3000
      server.use(require('cookie-parser')())
      server.use(bodyParser.urlencoded({extended: false}))
      server.use(bodyParser.json())
      if (!dev) {
        server.use(https({trustProtoHeader: true}))
        server.use(addUserToRequestFromJWT)
        server.use((request, response, next) => {
          const {user} = request
          if (!user) {
            const completeUrl = `${request.protocol}://${request.get('host')}${request.originalUrl}`
            response.redirect(
              `${process.env.IDM_BASE_URL}/sign-in?redirect=${encodeURIComponent(completeUrl)}`
            )
          } else {
            next()
          }
        })
      }
      server.get('/whoami', (request, response) => {
        response.json(request.user)
      })

      server.use('/api', routes.api)

      server.get('*', (req, res) => {
        return handle(req, res)
      })

      server.listen(port, err => {
        if (err) {
          throw err
        }
        console.info(`🌎  Listening on port ${port}`)
      })
    })
}
