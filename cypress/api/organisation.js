import faker from "faker";
import colour from "../support/consoleColour";
import locations from '../../cypress.json'

module.exports = {
	get({token = ""}) {
		return cy.request({
			method: "GET",
			url: locations.organisationsApi,
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
            url: locations.organisationsApi,
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
		password = locations.user.password
	}) {
		cy.request({
			failOnStatusCode: false,
            method: "POST",
            url: `${locations.organisationsApi}/${orgId}`,
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
            url: `${locations.organisationsApi}/${orgId}`,
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
