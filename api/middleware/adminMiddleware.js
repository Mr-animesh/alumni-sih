const adminMiddleware = (req, res, next) => {
    try {
        next();
    } catch (e) {
        res.status(403).json({msg:"Error in admin middleware"})
    }
}

module.exports = {adminMiddleware};