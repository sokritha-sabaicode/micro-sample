import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserRepository from "../database/repository/user-repository";

/*
Google Auth Strategy Configuration:


*/

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/v1/auth/google/callback",
      passReqToCallback: false,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: Function
    ) => {
      try {
        const userRepository = new UserRepository();

        let user = await userRepository.FindUser({
          email: profile.emails[0].value,
        });

        if (user) {
          // User exists, link accounts if not already linked
          if (!user.googleId) {
            user.googleId = profile.id;
            await userRepository.UpdateUserById({
              id: profile.id,
              newInfo: { googleId: profile.id },
            });
          }
        } else {
          // No user found, create a new user
          user = await userRepository.CreateUser({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
