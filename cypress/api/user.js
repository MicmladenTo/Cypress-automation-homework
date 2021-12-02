import colour from "../support/consoleColour";

module.exports = {
	login({
		email = "mlart8441@yahoo.com",
		password = "Vivify8",
		statusCode = 200,
		testMessage = ""
	}) {
		return cy.request({
			failOnStatusCode: false,
			method : "POST",
			url : "https://cypress-api.vivifyscrum-stage.com/api/v2/login",
			body : {
				email: email,
				password: password
			}
		}).then((response) => {
			typeof response.status !== "undefined" && response.status === statusCode
            ? colour.log(`${testMessage} - Pass`, "success")
            : colour.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");

			expect(response.status).to.eql(statusCode);
			// console.log(response)
			return response.body.token
		});
	}
}