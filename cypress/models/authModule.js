import data from '../fixtures/data.json';
import sidebar from './sidebarModule';
import navigationModule from './navigationModule';

module.exports = {
	get emailInput() {
		return cy.get("input[type='email']");
	},

	get passwordInput() {
		return cy.get("input[type='password']");
	},

	get loginButton() {
		return cy.get("button[type='submit']");
	},

	get forgotPasswordLink() {
		return cy.get(".vs-c-forgot-password-link > a");
	},

	get backToHomeLink() {
		return cy.get("a[href='https://cypress-api.vivifyscrum-stage.com']");
	},

	get googleLogin() {
		return cy.get("button[class='vs-c-btn--gp']");
	},

	get facebookLogin() {
		return cy.get("button[class='vs-c-btn--fb']");
	},

	get twitterLogin() {
		return cy.get("button[class='vs-c-btn--tw']");
	},

	get regzenLogin() {
		return cy.get("button[class='vs-c-btn--regzen']");
	},

	get linktoSignup() {
		return cy.get("a[href='https://cypress-api.vivifyscrum-stage.com/pricing']");
	},

	get errorFields() {
		return cy.get(".el-form-item__error");
	},

	get loginError() {
		return cy.get(".vs-c-custom-errors > .el-form-item__error");
	},

	// Ako funkciji prosledimo objekat, ona ne mora da radi sa egzaktnim podacima, nego objekat može biti i prazan
	login({ email = data.user.email, password = data.user.password }) {
		if (email !== "") {
		  this.emailInput.should("be.visible").type(email);
		}
		if (password !== "") {
		  this.passwordInput.should("be.visible").type(password);
		} 
		cy.intercept("POST", "**/api/v2/login").as("login");
		this.loginButton.click();
		if (email == data.user.email && password == data.user.password) {
		//   cy.intercept("POST", "**/api/v2/login").as("login");
		  cy.intercept('GET', '/api/v2/my-organizations').as('myOrganizations');
		  // Assert that login attempt has been authorised
			cy.wait("@login").then((intercept) => {
				expect(intercept.response.statusCode).to.eql(200);
			  });
			// Assert that we have successfully requested organization list upon logging in
			cy.wait('@myOrganizations').its('response').then((res) => {
				expect(res.statusCode).to.eq(200);
			  });
		}
	},

	logout() {
		cy.intercept('POST', '**api/v2/logout').as('logout');
		sidebar.myAccountButton.should('be.visible').click();
		sidebar.profileSettings.should('be.visible').click();
		// Assert that we are at the "Settings" page
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/account/settings');
		navigationModule.logoutButton.should('be.visible').click();
		cy.wait('@logout').then((intercept) => {
			expect(intercept.response.statusCode).to.eql(201);
		});
		// Assert that we are back at the right screen
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/login');
	},
};
