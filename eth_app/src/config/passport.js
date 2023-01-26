const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, cb) => {
    // In this callback function, you can check the payload to see if the user is authorized to access your routes
    // For example, you can check if the wallet address in the payload is in your whitelist
    connection.query('SELECT expirydate FROM basemotest WHERE wallet_address = ?', [jwtPayload.wallet_address], (error, results) => {
        if (error) {
            return cb(error, false);
        }
        if(results.length > 0){
            return cb(null, true);
        }else{
            return cb(null, false);
        }
    });
}));
