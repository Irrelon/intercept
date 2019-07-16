const intercept = require("../index");
const assert = require("assert");

describe("intercept()", () => {
	it("Will intercept a call and return the value we specify only once", () => {
		const testObj = {
			foo: () => {
				return "foo";
			}
		};
		
		intercept(testObj, "foo").returnOnce("bar");
		
		const returnVal1 = testObj.foo();
		const returnVal2 = testObj.foo();
		
		assert.strictEqual(returnVal1, "bar", "The first response is correct");
		assert.strictEqual(returnVal2, "foo", "The second response is correct");
	});
	
	it("Will intercept a call and return a promise correctly", async () => {
		const testObj = {
			foo: () => {
				return "foo";
			}
		};
		
		intercept(testObj, "foo").returnOnce(Promise.resolve("bar"));
		
		const returnVal1 = await testObj.foo();
		const returnVal2 = testObj.foo();
		
		assert.strictEqual(returnVal1, "bar", "The first response is correct");
		assert.strictEqual(returnVal2, "foo", "The second response is correct");
	});
});
