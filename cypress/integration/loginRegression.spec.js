import userApi from "../api/user"

describe('API testing', () => {
	let userToken;	
	it('positive login', () => {
		userApi.login({testMessage: "Positive login"}).then((token) => {
			userToken = token;
		})
	})
	it('wrong email without @', () => {
		userApi.login({
			email: "peragmail.com",
			testMessage: "02 - Wrong email without @",
			statusCode: 401
		})
	})
	it('wrong email with space in front', () => {
		userApi.login({
			email: " pera@gmail.com",
			testMessage: "02 - Wrong email with space in front",
			statusCode: 401
		})
	})
	it('wrong email without com', () => {
		userApi.login({
			email: "pera@gmail",
			testMessage: "03 - Wrong email without .com",
			statusCode: 401
		})
	})
	it('wrong email with space in front', () => {
		userApi.login({
			email: "@.com",
			testMessage: "05 - wrong password",
			statusCode: 401
		})
	})
})
