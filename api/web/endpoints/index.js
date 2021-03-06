const routes = [
  require('./new'),
  require('./login'),
  require('./colours'),
  require('./profile')
]

/**
 * @param app - The Express app instance
 * @param pool - The database connection for the app to use
 */
module.exports = (app, pool) => {
  return routes.map((routeMethod) => routeMethod(app, pool))
}