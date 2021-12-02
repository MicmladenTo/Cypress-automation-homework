import faker from "faker";
import colour from "../support/consoleColour";

module.exports = {
	get({token = ""}) {
		return cy.request({
			method: "GET",
			url: "https://cypress-api.vivifyscrum-stage.com/api/v2/organizations-data",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			expect(response.status).to.eql(200);
			return response.body
		})
	},
	post({
		orgName = faker.animal.crocodilia(),
		token = "",
		statusCode = 200,
		testMessage = ""
	}) {
		return cy.request({
			failOnStatusCode: false,
            method: "POST",
            url: "https://cypress-api.vivifyscrum-stage.com/api/v2/organizations",
            body: {
              name: orgName,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
		}).then((response) => {
			typeof response.status !== "undefined" && response.status === statusCode
            ? colour.log(`${testMessage} - Pass`, "success")
            : colour.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");

			expect(response.status).to.eql(statusCode);
			return response.body
		})
	},
	
	delete({
		orgId = "",
		token = "",
		statusCode = 201,
		testMessage = "",
		password = "Vivify8"
	}) {
		cy.request({
			failOnStatusCode: false,
            method: "POST",
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`,
            body: {
              passwordOrEmail: password,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
		}).then((response) => {
			typeof response.status !== "undefined" && response.status === statusCode
            ? colour.log(`${testMessage} - Pass`, "success")
            : colour.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");

			expect(response.status).to.eql(statusCode);
		})
	},

	put({
		orgId = "",
		orgName = faker.animal.crocodilia(),
		token = "",
		statusCode = 200,
		testMessage = ""
	}) {
		return cy.request({
			failOnStatusCode: false,
            method: "PUT",
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`,
            body: {
              name: orgName,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
		}).then((response) => {
			typeof response.status !== "undefined" && response.status === statusCode
            ? colour.log(`${testMessage} - Pass`, "success")
            : colour.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");

			expect(response.status).to.eql(statusCode);
			return response.body
		})
	},
}