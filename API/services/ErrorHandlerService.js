function generateResponse(message, data = null) {
	return {
		message: message,
		data: data
	};
}

const errorHandler = (handler) => {
    return async (req, res, next) => {
        try {
            const result = await handler(req, res);
            if (!result) return;
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json(generateResponse(error));
        }
    };
};

export {errorHandler, generateResponse};