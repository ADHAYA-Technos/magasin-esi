import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Users from '../models/User.js'; // Adjust the path to your User model
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { createTransport } from 'nodemailer';

// Configure the local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await Users.findOne({ where: { email } });
        if (!user) return done(null, false, { message: 'Incorrect email' });

        if (!user.isVerified) {
          if (Date.now() > user.verificationDate.getTime() + 3600000) {
            const verificationKey = uuidv4();
            const verificationDate = new Date();
            user.set({
              verificationKey,
              verificationDate,
            });
            await user.save();
            const transporter = createTransport({
              host: 'smtp.zoho.com',
              port: 465,
              secure: true,
              auth: {
                user: 'adhaya.es3@zohomail.com',
                pass: 'bUzGBC7W.AN@VjR',
              },
            });
            await transporter.sendMail({
              from: 'adhaya.es3@zohomail.com',
              to: email,
              subject: 'ES3 verification key',
              html: `<p>Click this link to verify your account:<a href="http://localhost:3000/verify-email?key=${verificationKey}">Verify Email Address</a></p>`,
            });
            return done(null, false, {
              message: 'Verification key expired, sent a new one',
            });
          }
          return done(null, false, { message: 'Not verified' });
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) return done(null, false, { message: 'Incorrect password' });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize the user
passport.serializeUser((user, done) => {
  done(null, user.email);
});

// Deserialize the user
passport.deserializeUser(async (email, done) => {
  try {
    const user = await Users.findOne({ where: { email } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
