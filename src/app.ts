import express from "express";
import bodyParser from "body-parser";
import processEnv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan";
import { redis } from "./db/redis";
import connectRedis from "connect-redis";
import RouterAdaptor from "./adaptors/router";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
import { clientRouter } from "./router/api/index";


const RedisStore = connectRedis(session)
processEnv.config();
app.use(morgan("dev"));



app.use(session({
    store: new RedisStore({
        client: redis as any,
    }),
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}))
const routerAdaptor = new RouterAdaptor();
app.use("/v1.0", routerAdaptor.init(clientRouter));

app.all('*', (req, res) => {
    try {
        return res.send("partials/page-404.pug")
    } catch (error) {

    }
});
export default app;