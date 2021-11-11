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
}
