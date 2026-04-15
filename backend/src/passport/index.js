import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.models.js';
import ApiError from '../utils/ApiError.js';
import {
              AvailbleSocialLogins,
              AvailbleUserRole,
          }
           from '../utils/constants.js';
import { googleCallbackUrL, googleClientId, googleClientSecret } from '../utils/config.js';


passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrL,
      scope: ["profile", "email"],
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(
            new ApiError(400, "Google account does not have an email"),
            null
          );
        }

        let user = await User.findOne({ email });

        if (user && user.loginType !== AvailbleSocialLogins.GOOGLE) {
          return done(
            new ApiError(
              400,
              "Account already exists with different login method"
            ),
            null
          );
        }

        if (user) {
          return done(null, user);
        }

        user = await User.create({
          email,
          fullName: profile.displayName,
          password: profile.id,
          isEmailVerified: true,
          role: AvailbleUserRole.USER,
          avatar: profile.photos?.[0]?.value,
          loginType: AvailbleSocialLogins.GOOGLE,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
