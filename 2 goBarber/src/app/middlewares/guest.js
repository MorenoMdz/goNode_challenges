module.exports = (req, res, next) => {
  if (req.session && !req.session.user) {
    /* If a guest session is found go to the next route */
    return next();
  }

  /* If an user exists redirect to the dashboard */
  return res.redirect('/app/dashboard');
};
