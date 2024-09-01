const errorHandler = (err, req, res, next) => {
    res.send({
        status: err.name,
        code: err.code || 500,
        msg: err.message || "Internal server error"
    })
};

module.exports = errorHandler;