var express = require('express');
var router = express.Router();
var models = require('../models');
let passport = require('passport')
let User = models.user

router.get('/signup', function(req, res, next) {
  res.send('Estas en signup');
});

// router.post('/signup', passport.authenticate('local-signup', {
//     successRedirect: 'http://localhost:3000/piscina/analisis',
//     failureRedirect: '/signup'
// }));

router.post('/signup', passport.authenticate('local-signup'),
  function(req, res) {
    res.status(200).send({
      session: 'true', user: req.user.id
    })
  },
  function(req, res) {
    res.status(404).send({
      id: 'usuarioNo'
    })
  }
);

router.post('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;