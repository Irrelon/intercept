const {"get": pathGet, "set": pathSet} = require("irrelon-path");

/**
 * Stores the value at the given path in obj inside
 * obj.__interceptStore so we can use restore() later to
 * get it back.
 * @param {Object} obj The class instance or object that holds
 * the function to intercept.
 * @param {String} path The dot-delimited path to the function
 * within obj to operate on.
 * @returns {Object} The class instance or object that holds
 * the function to intercept.
 */
const store = (obj, path) => {
	obj.__interceptStore = obj.__interceptStore || {};
	obj.__interceptStore[path] = pathGet(obj, path);
	
	return obj;
};

/**
 * Intercepts calls to the specified function in the given object
 * or class instance with a function that returns the specified
 * value instead.
 * @param {Object} obj The class instance or object that holds
 * the function to intercept.
 * @param {String} path The dot-delimited path to the function
 * within obj to operate on.
 * @param {*} returnVal The value to return when the intercepted
 * function is called.
 * @param {Number=} autoRestoreCount The number of times to intercept
 * before automatically restoring to the original function. Defaults
 * to zero which means it will not auto-restore.
 * @returns {Function} A function that when called restores the
 * intercept back to the original function that existed at the
 * given path in obj.
 */
const replaceReturn = (obj, path, returnVal, autoRestoreCount = 0) => {
	let callCount = 0;
	
	return replace(obj, path, () => {
		callCount++;
		
		if (autoRestoreCount > 0 && callCount === autoRestoreCount) {
			restore(obj, path);
		}
		
		return returnVal;
	}, autoRestoreCount);
};

const replace = (obj, path, replacement) => {
	store(obj, path);
	
	pathSet(obj, path, replacement);
	
	return () => {
		restore(obj, path);
	};
};

/**
 * Restores a function at a given path on obj to the original version
 * of the function thereby removing the existing intercept on it.
 * @param {Object} obj The class instance or object that holds
 * the function to intercept.
 * @param {String} path The dot-delimited path to the function
 * within obj to operate on.
 * @returns {Boolean} True when successful or false if no original
 * function was found to restore.
 */
const restore = (obj, path) => {
	if (obj.__interceptStore && obj.__interceptStore[path]) {
		pathSet(obj, path, obj.__interceptStore[path]);
		delete obj.__interceptStore[path];
		
		return true;
	}
	
	return false;
};

/**
 * Sets up intercept on an object at a particular path.
 * @param {Object} obj The class instance or object that holds
 * the function to intercept.
 * @param {String} path The dot-delimited path to the function
 * within obj to operate on.
 * @returns {Object} The intercept instance with various
 * operation functions such as returnOnce(), returnMany()
 * and restore().
 */
const intercept = (obj, path) => {
	return {
		/**
		 * Intercepts calls to the specified function in the given object
		 * or class instance with a function that returns the specified
		 * value instead.
		 * @param {*} returnVal The value to return when the intercepted
		 * function is called.
		 * @param {Number=} autoRestoreCount The number of times to intercept
		 * before automatically restoring to the original function. Defaults
		 * to zero which means it will not auto-restore.
		 * @returns {Function} A function that when called restores the
		 * intercept back to the original function that existed at the
		 * given path in obj.
		 */
		"replaceReturn": (returnVal, autoRestoreCount = 0) => {
			return replaceReturn(obj, path, returnVal, autoRestoreCount);
		},
		
		"replace": (replacement) => {
			return replace(obj, path, replacement);
		},
		
		/**
		 * Restores any intercept back to the original function or value.
		 * @returns {Boolean} True on success or false if no intercept
		 * was found.
		 */
		"restore": () => {
			return restore(obj, path);
		}
	};
};

module.exports = intercept;
