const intercept = require("../index");
const assert = require("assert");

describe("intercept()", () => {
	describe("replace()", () => {
		it("Will intercept a call and replace it with our own function", () => {
			const testObj = {
				"foo": () => {
					return "foo";
				}
			};
			
			intercept(testObj, "foo").replace(() => {
				return "bar";
			});
			
			const returnVal1 = testObj.foo();
			const returnVal2 = testObj.foo();
			
			assert.strictEqual(returnVal1, "bar", "The first response is correct");
			assert.strictEqual(returnVal2, "bar", "The second response is correct");
		});
		
		it("Will intercept a call and replace it with our own function but restore when required", () => {
			const testObj = {
				"foo": () => {
					return "foo";
				}
			};
			
			intercept(testObj, "foo").replace(() => {
				return "bar";
			});
			
			const returnVal1 = testObj.foo();
			
			intercept(testObj, "foo").restore();
			
			const returnVal2 = testObj.foo();
			
			assert.strictEqual(returnVal1, "bar", "The first response is correct");
			assert.strictEqual(returnVal2, "foo", "The second response is correct");
		});
	});
	
	describe("replaceReturn()", () => {
		it("Will intercept a call and return the value we specify only once", () => {
			const testObj = {
				"foo": () => {
					return "foo";
				}
			};
			
			intercept(testObj, "foo").replaceReturn("bar", 1);
			
			const returnVal1 = testObj.foo();
			const returnVal2 = testObj.foo();
			
			assert.strictEqual(returnVal1, "bar", "The first response is correct");
			assert.strictEqual(returnVal2, "foo", "The second response is correct");
		});
		
		it("Will intercept a call and return a promise correctly", async () => {
			const testObj = {
				"foo": () => {
					return "foo";
				}
			};
			
			intercept(testObj, "foo").replaceReturn(Promise.resolve("bar"), 1);
			
			const returnVal1 = await testObj.foo();
			const returnVal2 = testObj.foo();
			
			assert.strictEqual(returnVal1, "bar", "The first response is correct");
			assert.strictEqual(returnVal2, "foo", "The second response is correct");
		});
		
		it("Will intercept a call and return the value we specify, as many times as we call the function", () => {
			const testObj = {
				"foo": () => {
					return "foo";
				}
			};
			
			intercept(testObj, "foo").replaceReturn("bar");
			
			const returnVal1 = testObj.foo();
			const returnVal2 = testObj.foo();
			
			assert.strictEqual(returnVal1, "bar", "The first response is correct");
			assert.strictEqual(returnVal2, "bar", "The second response is correct");
		});
	});
	
	describe("restore()", () => {
		it("Will restore a replaceReturn() intercepted function back to the original state", () => {
			const testObj = {
				"foo": () => {
					return "foo";
				}
			};
			
			intercept(testObj, "foo").replaceReturn("bar", 1);
			intercept(testObj, "foo").restore();
			
			const returnVal1 = testObj.foo();
			
			assert.strictEqual(returnVal1, "foo", "The first response is correct");
		});
		
		it("Will restore a replaceReturn() intercepted function back to the original state", () => {
			const testObj = {
				"foo": () => {
					return "foo";
				}
			};
			
			intercept(testObj, "foo").replaceReturn("bar");
			
			const returnVal1 = testObj.foo();
			const returnVal2 = testObj.foo();
			
			intercept(testObj, "foo").restore();
			
			const returnVal3 = testObj.foo();
			
			assert.strictEqual(returnVal1, "bar", "The first response is correct");
			assert.strictEqual(returnVal2, "bar", "The second response is correct");
			assert.strictEqual(returnVal3, "foo", "The third response is correct");
		});
		
		it("Will restore a replaceReturn() intercepted function via the returned restorer function", async () => {
			const testObj = {
				"foo": () => "foo"
			};
			
			const restorer = intercept(testObj, "foo").replaceReturn("bar", 1);
			restorer();
			
			const returnVal1 = testObj.foo();
			
			assert.strictEqual(returnVal1, "foo", "The first response is correct");
		});
		
		it("Will restore a replaceReturn() intercepted function via the returned restorer function", async () => {
			const testObj = {
				"foo": () => Promise.resolve("foo")
			};
			
			const restorer = intercept(testObj, "foo").replaceReturn(Promise.resolve("bar"));
			
			const returnVal1 = await testObj.foo();
			const returnVal2 = await testObj.foo();
			
			restorer();
			
			const returnVal3 = await testObj.foo();
			
			assert.strictEqual(returnVal1, "bar", "The first response is correct");
			assert.strictEqual(returnVal2, "bar", "The second response is correct");
			assert.strictEqual(returnVal3, "foo", "The third response is correct");
		});
	});
});
