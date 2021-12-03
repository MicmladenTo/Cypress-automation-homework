import colour from "../support/consoleColour";
import locations from '../../cypress.json'

module.exports = {
	login({
		email = locations.user.username,
		password = locations.user.password,
		statusCode = 200,
		testMessage = ""
	}) {
		return cy.request({
			failOnStatusCode: false,
			method : "POST",
			url : locations.loginApi,
			body : {
				email: email,
				password: password
			}
		}).then((response) => {
			typeof response.status !== "undefined" && response.status === statusCode
            ? colour.log(`${testMessage} - Pass`, "success")
            : colour.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");

			expect(response.status).to.eql(statusCode);
			return response.body.token
		});
	}
}
