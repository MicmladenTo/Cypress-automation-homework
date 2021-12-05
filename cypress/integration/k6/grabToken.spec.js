import userApi from "../../api/user"
import data from "../../fixtures/data.json"


describe('Grab tokens', () => {
	let userToken = {};	
	it('User login', () => {
		for(const[key, value] of Object.entries(data.accounts)) {
			userApi
			 .login({email: value.email, password: value.password, testMessage: "01-Login before other tests"})
			 .then((token) => {
			userToken[key] = token;
			});
		}
	});

	it('log', () => {
		console.log(userToken)
		cy.writeFile('K6/token.json', [userToken])
	})
});
// Funkcija k6 prepoznaje samo array