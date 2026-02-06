import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import MemoryStore from "memorystore";
import type { Express, RequestHandler } from "express";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "brushwhackers2026";

const adminUser = { id: "admin", username: ADMIN_USERNAME };

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
    }
  }
}

export function setupAuth(app: Express) {
  const SessionStore = MemoryStore(session);

  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({ checkPeriod: 86400000 }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  });

  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy((username, password, done) => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return done(null, adminUser);
      }
      return done(null, false, { message: "Invalid credentials" });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id: string, done) => {
    if (id === "admin") {
      done(null, adminUser);
    } else {
      done(null, false);
    }
  });
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
};
