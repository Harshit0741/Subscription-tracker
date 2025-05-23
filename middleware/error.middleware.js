const errorMiddleware = (err, req, res, next) => {
    try {
        let error = {...err};
        error.message = err.message;
        console.error(err);
        if(err.name === 'CastError'){
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new Error(message, 404);
        }
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new Error(message, 400);
        }
        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statusCode = 400;
        }
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error',
        });
    }catch(err){
        next(err);
    }
};

export default errorMiddleware;