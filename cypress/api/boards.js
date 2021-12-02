import faker from "faker";
import colour from "../support/consoleColour";

module.exports = {
	get({
		token = "",
		orgId = ""
	}) {
		return cy.request({
			method: "GET",
			url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}/boards-data`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}).then((response) => {
			expect(response.status).to.eql(200);
			return response.body
		})
	},
	post({
		boardName = faker.animal.cat(),
		token = "",
		statusCode = 201,
		organisationId = "",
		orgType = "",
		testMessage = "",
		configuration_board_id = null,
		team_members_board_id = null
	}) {
		return cy.request({
			// failOnStatusCode: false,
			method: "POST",
			url: "https://cypress-api.vivifyscrum-stage.com/api/v2/boards",
			body: {
				name: boardName,
				organization_id: organisationId,
				type: orgType,
				configuration_board_id: configuration_board_id,
				team_members_board_id: team_members_board_id
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
	put({
		boardId = "",
		boardCode = "",
		boardName = faker.animal.dog(),
		token = "",
		statusCode = 200,
		description = null,
		taskUnit = "points",
		testMessage = ""
	}) {
		return cy.request({
			failOnStatusCode: false,
            method: "PUT",
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}`,
            body: {
              name: boardName,
			  code: boardCode,
			  description: description,
			  task_unit: taskUnit
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
		boardId = "",
		token = "",
		statusCode = 200,
		testMessage = ""
	}) {
		return cy.request({
			failOnStatusCode: false,
            method: "DELETE",
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}`,
            body: {
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
		}).then((response) => {
			typeof response.status !== "undefined" && response.status === statusCode
            ? colour.log(`${testMessage} - Pass`, "success")
            : colour.log(`${testMessage} - Fail - ${JSON.stringify(response)}`, "error");
		})
	},
}