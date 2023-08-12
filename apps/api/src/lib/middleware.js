const ExpressError = require('./ExpressError')
const debug = require('./debug')
const { getUser, isProd } = require('./utils')

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(400, msg)
  } else {
    next()
  }
}

const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(400, msg)
  } else {
    next()
  }
}

const isAdmin = async (req, res, next) => {
  const user = await getUser(req)

  if (user.roles.includes('admin')) {
    next()
  } else {
    throw new ExpressError(403, 'You do not have permission to do that')
  }
}

const logError = (err, req, res, next) => {
  debug.error('%s', err)
  next(err)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = 'Something went wrong'

  res.status(statusCode).json({
    message: err.message,
    stack: isProd ? null : err.stack,
  })
}

module.exports = {
  validateBody,
  validateQuery,
  isAdmin,
  errorHandler,
  logError,
}
