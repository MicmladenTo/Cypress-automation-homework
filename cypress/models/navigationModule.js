module.exports = {

	get logoutButton() {
		return cy.get(".vs-c-logout > button");
	},

	get homeButton() {
		return cy.get(".vs-l-project__header > .vs-c-site-logo");
	},

	get myOrganisations() {
		return cy.get(".vs-l-sprint__name");
	}
}
