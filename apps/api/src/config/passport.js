const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')
const User = require('../models/user')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

async function verify(payload, done) {
  try {
    const foundUser = await User.findOne({ _id: payload.sub })

    if (foundUser) {
      return done(null, foundUser)
    }
    return done(null, false)
  } catch (err) {
    return done(err)
  }
}

const strategy = new JWTStrategy(options, verify)

module.exports = (passport) => {
  passport.use(strategy)
}
