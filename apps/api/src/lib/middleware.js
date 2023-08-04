const ExpressError = require('./ExpressError')
const { getUser } = require('./utils')

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

const isAdmin = async (req, res, next) => {
  const user = await getUser(req)

  if (user.roles.includes('admin')) {
    next()
  } else {
    throw new ExpressError('You do not have permission to do that', 403)
  }
}

module.exports = {
  validateBody,
  validateQuery,
  isAdmin,
}
