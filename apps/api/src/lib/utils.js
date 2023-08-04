const crypto = require('crypto')
const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/user')

function validatePassword(password, hash, salt) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex')
  return hash === hashVerify
}

function genPassword(password) {
  const salt = crypto.randomBytes(32).toString('hex')
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex')

  return {
    salt,
    hash: genHash,
  }
}

function issueJWT(user) {
  const { _id } = user

  const nowDate = new Date()

  // set expiry date after 2 weeks
  nowDate.setDate(nowDate.getDate() + 14)

  const expiresIn = Date.parse(nowDate)

  const payload = {
    sub: _id,
    iat: Date.now(),
  }

  const signedToken = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  })

  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  }
}

async function getUser(req) {
  const JWT = req.headers.authorization.split('Bearer ')[1]

  const { sub } = jsonwebtoken.decode(JWT)

  const foundUser = await User.findById(sub)
  return foundUser
}

function getUrl(req) {
  return `${req.protocol}://${req.headers.host}`
}

module.exports = {
  validatePassword,
  genPassword,
  issueJWT,
  getUser,
  getUrl,
}
