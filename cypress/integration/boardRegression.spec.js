import userApi from "../api/user"
import organisationApi from "../api/organisation"
import boardApi from "../api/boards"

describe('API testing', () => {
	let userToken;	
	before(() => {
		userApi.login({testMessage: "01-Login before other tests"}).then((token) => {
			userToken = token;
		});
	})

	after(() => {
		boardApi.get({
			token: userToken,
			orgId: organisationId
		}).then((boards) => {
			boards.forEach((board) => {
				boardApi.delete({
					token: userToken,
					boardId: board.id
				})
			})
		})
	})

	let organisationId;
	it('02 - Create organization', () => {
		organisationApi.post({
			token: userToken,
			testMessage: "02 - Create organization"
		}).then((organisationObject) => {
			organisationId = organisationObject.id;
		})
	});

	let boardId;
	let boardCode;
	it('03 - Create a board', () => {
		boardApi.post({
			token: userToken,
			testMessage: "03 - Create a board",
			organisationId: organisationId,
		}).then((boardObject) => {
			boardId = boardObject.id;
			boardCode = boardObject.code;
		})
	});

	it('03a - Create a second board', () => {
		boardApi.post({
			token: userToken,
			testMessage: "03a - Create a second board",
			organisationId: organisationId,
		})
	});

	it('04 - Edit the first board', () => {
		boardApi.put({
			boardId: boardId,
			boardCode: boardCode,
			token: userToken,
			testMessage: "04 - Edit a board",
		}).then((boardObject) => {
			boardId = boardObject.id;
			boardCode = boardObject.code;
		})
	});

	it('05 - Delete a board', () => {
		boardApi.put({
			boardId: boardId,
			boardCode: boardCode,
			token: userToken,
			testMessage: "05 - Delete a board",
		})
	});

	it('06 - Get all boards', () => {
		boardApi.get({
			token: userToken,
			orgId: organisationId,
			testMessage: "06 - Get all boards",
		})
	});
})
