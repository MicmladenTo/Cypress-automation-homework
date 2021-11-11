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
};
