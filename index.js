import express from "express";
import session from "express-session";
import passport from "passport";
import GoogleStrategyFunction from "passport-google-oauth";

const app = express();

app.set("view engine", "ejs");

app.use(
    session({
        resave: false,
        saveUnitialized: true,
        secret: "SECRET",
    })
);

app.get("/", function (req, res) {
    res.render("pages/auth");
});

// passport setup

let userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get("/success", (req, res) => res.send(userProfile));
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

// google oauth

const GoogleStrategy = GoogleStrategyFunction.OAuth2Strategy;
const GOOGLE_CLIENT_ID =
    "861209010758-bpbmqhur5nu894uvuum8ugrnbc434hek.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            userProfile = profile;

            return done(null, userProfile);
        }
    )
);

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/error" }),
    (req, res) => {
        res.redirect("/success");
    }
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port: ${port}`));
