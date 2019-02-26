const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    //transform the verify from callback based into a promise based method
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // decoded will have the used id (what we set in the model to be saved into the token)
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'token invalid' });
  }
};
