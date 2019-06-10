import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Daily Letter";
    res.locals.routes = routes;

    next();
};