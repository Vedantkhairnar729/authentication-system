import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/user';

// Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      // Check if email already exists
      user = await User.findOne({ email: profile.emails?.[0]?.value });

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.provider = 'google';
        user.isEmailVerified = true; // Google emails are verified
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        googleId: profile.id,
        email: profile.emails?.[0]?.value,
        username: profile.displayName || profile.emails?.[0]?.value.split('@')[0],
        provider: 'google',
        isEmailVerified: true,
        avatar: profile.photos?.[0]?.value
      });

      done(null, user);
    } catch (error) {
      done(error as Error, undefined);
    }
  }
  ));
}

// GitHub OAuth Strategy (only if credentials are provided)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/github/callback`
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ githubId: profile.id });

      if (user) {
        return done(null, user);
      }

      // Check if email already exists
      const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;
      user = await User.findOne({ email });

      if (user) {
        // Link GitHub account to existing user
        user.githubId = profile.id;
        user.provider = 'github';
        user.isEmailVerified = true;
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        githubId: profile.id,
        email,
        username: profile.username || profile.displayName,
        provider: 'github',
        isEmailVerified: true,
        avatar: profile.photos?.[0]?.value
      });

      done(null, user);
    } catch (error) {
      done(error as Error, undefined);
    }
  }
  ));
}

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
