const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(new GoogleStrategy(
{
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Extract email safely
        const email = profile.emails?.[0]?.value;

        if (!email) {
            return done(null, false);
        }

        // 2. Check if user exists with googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        }

        // 3. Check if user exists with same email (IMPORTANT)
        user = await User.findOne({ email });

        if (user) {
            // Link Google account
            user.googleId = profile.id;
            user.authProvider = "google";

            // Optional: update profile pic
            if (profile.photos?.[0]?.value) {
                user.profilePicture = profile.photos[0].value;
            }

            await user.save();
            return done(null, user);
        }

        // 4. Create new user
        user = await User.create({
            username: profile.displayName,
            email: email,
            googleId: profile.id,
            authProvider: "google",
            profilePicture: profile.photos?.[0]?.value
        });

        return done(null, user);


        console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

    } catch (err) {
        return done(err, null);
    }
}));

module.exports = passport;