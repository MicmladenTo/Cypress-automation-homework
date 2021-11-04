import data from '../fixtures/data.json';

module.exports = {
	get emailField() {
		return cy.get("input[type='email']", { timeout: 10000 });
	},

	get passwordField() {
		return cy.get("input[type='password']");
	},

	get numberOfUsers() {
		return cy.get("input[name='number_of_users']");
	},

	get checkbox() {
		return cy.get("span[class='vs-c-checkbox-check']");
	},

	get submitButton() {
		return cy.get("button[type='submit']");
	},

	get errorFields() {
		return cy.get(".el-form-item__error");
	},

	get firstName() {
		return cy.get("input[name='first_name']");
	},

	get lastName() {
		return cy.get("input[name='last_name']");
	},

	get companyName() {
		return cy.get("input[name='company_name']");
	},

	get organizationName() {
		return cy.get("input[name='organization_name']");
	},

	get submitButton() {
		return cy.get("button[type='submit']");
	},

	get cancelButton() {
		return cy.get("form + button");
	},

	register({ 
		email = data.user.email, 
		password = data.user.password,
		numberOfUsers = data.numberOfUsers.validNumber
	}) {	
		this.emailField.clear();
		this.passwordField.clear();
		this.numberOfUsers.clear();

		if (email !== "") {
		this.emailField.should("be.visible").type(email);
		}
		if (password !== "") {
		this.passwordField.should("be.visible").type(password);
		}
		if (numberOfUsers !== "") {
		this.numberOfUsers.should("be.visible").type(numberOfUsers);
		}
		this.submitButton.click();

		if (email == data.user.email &&
			password == data.user.password &&
			numberOfUsers == data.numberOfUsers.validNumber) {
				cy.intercept('POST', '/api/v2/register').as('register');
				cy.intercept('GET', '/api/v2/my-organizations').as('myOrganizations');

				// Assert that registration POST request was successful
				cy.wait('@register').its('response').then((res) => {
				expect(res.statusCode).to.eq(200);
				})

				// Assert that "My organizations" have been requested
				cy.wait('@myOrganizations').its('response').then((res) => {
				expect(res.statusCode).to.eq(200);
				})

				// Make sure that the browser has loaded the correct URL
				cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/my-organizations');
			}
	}
}
