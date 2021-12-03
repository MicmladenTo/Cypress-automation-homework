import faker from "faker";
import colour from "../support/consoleColour";
import locations from '../../cypress.json';

module.exports = {
	get({
		token = "",
		orgId = ""
	}) {
		return cy.request({
			method: "GET",
			url: `${locations.organisationsApi}/${orgId}/boards-data`,
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
		orgType = locations.scrumBoard,
		testMessage = "",
		configuration_board_id = null,
		team_members_board_id = null
	}) {
		return cy.request({
			failOnStatusCode: false,
			method: "POST",
			url: locations.boardsApi,
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
		taskUnit = locations.taskUnit,
		testMessage = ""
	}) {
		return cy.request({
			failOnStatusCode: false,
            method: "PUT",
            url: `${locations.boardsApi}/${boardId}`,
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
		boardCode = "",
		token = "",
		statusCode = 200,
		testMessage = ""
	}) {
		return cy.request({
			failOnStatusCode: false,
            method: "DELETE",
            url: `${locations.boardsApi}/${boardId}`,
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
