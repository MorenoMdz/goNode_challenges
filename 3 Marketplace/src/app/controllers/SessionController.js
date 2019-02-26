const User = require('../models/User');

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // check if user exists, then Error out if it does
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    // User exists, continue...

    // then Error out if the password does not match
    if (!(await user.compareHash(password))) {
      // TODO req.flash
      return res.status(400).json({ error: 'Invalid password' });
    }

    // everything is fine, return the user and a newly generated token
    return res.json({ user, token: User.generateToken(user) });
  }
}

module.exports = new SessionController();
