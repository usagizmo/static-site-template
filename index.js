const protect = require('static-auth')
const safeCompare = require('safe-compare')

const app = protect(
  '/',
  (username, password) => safeCompare(username, 'admin') && safeCompare(password, 'pass'),
  {
    directory: __dirname + '/src/public',
    onAuthFailed: (res) => {
      res.end('Authentication failed')
    },
  }
)

module.exports = app
