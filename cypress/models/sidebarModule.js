import sidebar from '../fixtures/sidebar.json';

module.exports = {
	get myAccountButton() {
		return cy.get("a[href='/account']", {timeout : 60000});
	},

	get profileSettings() {
		return cy.get("[href='/account/settings']");
	},

	get topAddNew() {
		return cy.get(".vb-content > div.vs-c-list > .vs-c-list__item > .vs-c-list__btn");
	},

	get topAddOrganisation() {
		return cy.get(".vs-c-list > :nth-child(1) > a", {timeout: 10000});
	},

	get orgMenuConfiguration() {
		return cy.get(":nth-child(8) > span > div > .vs-c-site-logo");
	},

	get goToOrganisation() {
		return cy.get("a.active.vs-c-list__organisation");
	}
}
