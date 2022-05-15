let bCrypt = require('bcrypt-nodejs')

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('../../models');

module.exports = function(done) {
    let User = models.user

    passport.use('local-signup', new LocalStrategy(
    
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
    
        },
        function(req, email, password, done) {
            let generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user){
                    return done(null, false, {
                        message: 'El email ya existe'
                    });
            
                } else
                {
                    console.log("No exites email")
                    var userPassword = generateHash(password)
                    var data =
                        {
                            name: req.body.name,
                            email: email,
                            password: userPassword,
                        }
        
                    User.create(data).then(function(newUser, created) {
                        console.log("Creado:", newUser)
                        if (!newUser) {
                            return done(null, false)
                        }
            
                        if (newUser) {
                            return done(null, newUser)
                        }
                    })
                }
            }).catch(function(error) {
                console.log("error", error)
            })
        }
    ))

    passport.serializeUser(function(user, done) {
    
        done(null, user.id);
    
    });

    passport.deserializeUser(function(id, done) {
 
        User.findById(id).then(function(user) {
     
            if (user) {
     
                done(null, user.get());
     
            } else {
     
                done(user.errors, null);
     
            }
     
        });
     
    });
}
