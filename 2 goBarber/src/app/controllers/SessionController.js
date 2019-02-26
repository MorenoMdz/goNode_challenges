const { User } = require('../models');

class SessionController {
  async create(req, res) {
    return res.render('auth/signin');
  }

  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      req.flash('error', 'Usuário nāo encontrado.');
      return res.redirect('/');
    }

    // check if password matches
    if (!(await user.checkPassword(password))) {
      req.flash('error', 'Usuário ou senha nāo conferem.');
      return res.redirect('/');
    }

    // if everything passes save the user in the session
    req.session.user = user;

    return res.redirect('/app/dashboard');
  }

  // destroy the session passing a callback that specify the session cookie name
  destroy(req, res) {
    req.session.destroy(() => {
      res.clearCookie('root');
      res.redirect('/');
    });
  }
}

module.exports = new SessionController();
