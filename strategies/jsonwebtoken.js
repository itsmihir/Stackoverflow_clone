const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const passport = require("passport");
const Person = mongoose.model('users')
const key = require("../setup/myurl");

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secret;

module.exports= passport=> passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {

        Person.findById(jwt_payload.id, function(err,user) {
             if (err) {
                 console.log(err);
                return done(err, false);
                }
            if (user) {

                console.log(user);
                return done(null, user);
            } else {
                return done(null, false);
                }
        });
}));
