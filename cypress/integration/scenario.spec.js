import userApi from "../api/user"
import organisationApi from "../api/organisation"
import { all } from "bluebird";

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


	// it('first it', () => {
	// 	// Da nam funkcija ne bi vratila samo promise, sačekaćemo je sa "then"
	// 	let token = userApi.login({}).then((token) => {
	// 		console.log(token);
	// 	})
	// })
	// it('wrong email', () => {
	// 	userApi.login({email: "pera@gmail.com", password: "sifra", statusCode: 200})
	// 	console.log(userToken);
	// 	})

	let organisationId;
	let organisationName;
	it('02 - Create organization', () => {
		organisationApi.post({
			token: userToken,
			testMessage: "02 - Create organization"
		}).then((organisationObject) => {
			organisationId = organisationObject.id;
			organisationName = organisationObject.name;
			console.log(organisationName)
		})
	});
	it('02b - Edit organization', () => {
		organisationApi.put({
			token: userToken,
			orgId:organisationId,
			testMessage: "02b - Edit organization"
		}).then((organisationObject) => {
			organisationName = organisationObject.name;
			console.log(organisationName)
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
		 	console.log(allOrgs);
		})
	})
})