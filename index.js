const {"get": pathGet, "set": pathSet} = require("irrelon-path");

const returnOnce = (obj, path, returnVal) => {
	const originalFunc = pathGet(obj, path);
	
	pathSet(obj, path, () => {
		pathSet(obj, path, originalFunc);
		return returnVal;
	});
};

const intercept = (obj, path) => {
	return {
		"returnOnce": (returnVal) => {
			return returnOnce(obj, path, returnVal);
		}
	};
};

module.exports = intercept;
