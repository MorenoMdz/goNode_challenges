const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true,
});

app.set('view engine', 'njk');
app.use(express.urlencoded({ extended: false }));

const checkAge = (req, res, next) => {
  const age = req.query.age;
  console.log(age);
  if (!age) {
    return res.redirect('/?error=empty-field');
  }
  return next();
};

app.get('/', (req, res) => {
  error = req.query.error;
  return res.render('home', { error });
});

app.post('/check', (req, res) => {
  const age = req.body.age;
  if (age < 18) {
    return res.redirect(`/minor?age=${age}`);
  }
  return res.redirect(`/major?age=${age}`);
});

app.get('/minor', checkAge, (req, res) => {
  const age = req.query.age;
  res.render('minor', { age });
});

app.get('/major', checkAge, (req, res) => {
  const age = req.query.age;
  res.render('major', { age });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
