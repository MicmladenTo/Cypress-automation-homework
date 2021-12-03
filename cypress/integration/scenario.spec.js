import userApi from "../api/user"
import organisationApi from "../api/organisation"

describe('API testing', () => {
	let userToken;	
	before(() => {
		userApi.login({testMessage: "01-Login before other tests"}).then((token) => {
			userToken = token;
		});
	}),
	after(() => {
		organisationApi.get({
			token:userToken
		}).then((organisations) => {
			organisations.forEach((organisation) => {
				organisationApi.delete({
					token: userToken,
					orgId: organisation.id
				})
			})
		})
	})

	let organisationId;
	let organisationName;
	it('02 - Create organization', () => {
		organisationApi.post({
			token: userToken,
			testMessage: "02 - Create organization"
		}).then((organisationObject) => {
			organisationId = organisationObject.id;
			organisationName = organisationObject.name;
		})
	});

	it('02b - Edit organization', () => {
		organisationApi.put({
			token: userToken,
			orgId:organisationId,
			testMessage: "02b - Edit organization"
		}).then((organisationObject) => {
			organisationName = organisationObject.name;
		})
	});

	it('03 - Delete organization', () => {
		organisationApi.delete({
			token:userToken,
			orgId:organisationId
		});
	});

	let allOrganisations;
	it('04 - Get all organizations', () => {
		organisationApi.get({
			token:userToken,
		 }).then((allOrgs) => {
			 allOrganisations = allOrgs;
		})
	})
})
