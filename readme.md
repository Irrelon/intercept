# Intercept
A simple tool to intercept calls to a function and
return a different result (the original function) is
never called.

Useful when writing unit tests so you don't have to
worry about side effects of calling a function, API
calls being made, data being changed etc.

## Install
```bash
npm i @irrelon/intercept --save-dev
```

## Usage

### replace(replacement)
Creates an intercept that when accessed, provides the specified value
instead of the original.

Returns a restorer function that when called will disable the
intercept and restore the value to the original one.

```js
// Require the assert module from Node to test our responses
const assert = require("assert");

// Require the intercept module
const intercept = require("@irrelon/intercept");

// Create a simple test object with a function called
// foo() that when called will return the string "foo" 
const testObj = {
	foo: () => {
		return "foo";
	}
};
		
// Intercept testObj's foo() function and when it is
// called, return "bar" instead. You can call the returned
// restorer function if you wish to cancel the intercept.
// You can also use the restore() function if you prefer not
// to keep a reference to the restorer (see doc for restore()
// further down this readme).
const restorer = intercept(testObj, "foo").replace(() => {
	return "bar";
});

// Call foo() the first time and we get our value
// from the function we replaced it with
const returnVal1 = testObj.foo();

// Call foo() a second time and we get the response
// from the original foo() function of "foo"
const returnVal2 = testObj.foo();

assert.strictEqual(returnVal1, "bar", "The first response is correct");
assert.strictEqual(returnVal2, "foo", "The second response is correct");
```

### replaceReturn(returnVal, autoRestoreCount = 0)
Creates an intercept that when called returns the specified value
instead of calling the original.

If an autoRestoreCount is specified then the intercept will be
automatically restored to the original once the intercept has been
called the specified number of times. If not specified then the
original will only be restored by calling restore() or the restorer
function returned from replaceReturn().

Returns a restorer function that when called will disable the
intercept and restore the function to the original one.

```js
// Require the assert module from Node to test our responses
const assert = require("assert");

// Require the intercept module
const intercept = require("@irrelon/intercept");

// Create a simple test object with a function called
// foo() that when called will return the string "foo" 
const testObj = {
	foo: () => {
		return "foo";
	}
};
		
// Intercept testObj's foo() function and when it is
// called, return "bar" instead. Notice replaceReturn()
// is used with a count of 1 in the second argument. This
// restores the original function that was intercepted
// after the first call to the intercepted one.
const restorer = intercept(testObj, "foo").replaceReturn("bar", 1);

// Call foo() the first time and we get our value
// from intercept's replaceReturn() which will be "bar"
const returnVal1 = testObj.foo();

// Call foo() a second time and we get the response
// from the original foo() function of "foo" because we
// specified an autoRestoreCount of 1 to replaceReturn()
const returnVal2 = testObj.foo();

assert.strictEqual(returnVal1, "bar", "The first response is correct");
assert.strictEqual(returnVal2, "foo", "The second response is correct");
```

### restore()
Restores any intercepts on the object to their original values
effectively disabling intercept on the object and path.

```js
// Require the assert module from Node to test our responses
const assert = require("assert");

// Require the intercept module
const intercept = require("@irrelon/intercept");

// Create a simple test object with a function called
// foo() that when called will return the string "foo" 
const testObj = {
	"foo": () => {
		return "foo";
	}
};

// Create the intercept
const restorer = intercept(testObj, "foo").replaceReturn("bar");

// Check the intercept works
const returnVal1 = testObj.foo();

// Restore the intercept back to the original (you could
// also just called restorer() as returned from replaceReturn()
// but both ways are acceptable)
intercept(testObj, "foo").restore();

// Check the original works
const returnVal2 = testObj.foo();

// Make sure our values are what we expect
assert.strictEqual(returnVal1, "bar", "The first response is correct");
assert.strictEqual(returnVal2, "foo", "The second response is correct");
```
