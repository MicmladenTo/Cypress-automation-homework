import data from '../fixtures/data.json';

module.exports = {
	get addNewOrganisation() {
		return cy.get('.vs-c-my-organization--add-new', {timeout: 10000});
	},

	get organisationNameHeader() {
		return cy.get(".vs-c-my-organization__title");
	},

	get navigateOrgName() {
		return cy.get("input[name='name']");
	},

	get navigateNextButton() {
		return cy.get("button[name='next_btn']");
	},

	get confirmBoardsModal() {
		return cy.get(
			"button[class='vs-c-btn vs-c-btn--primary vs-c-btn--lg vs-u-font-sm vs-c-modal--features-confirm-button']",
			 {timeout: 10000});
	},

	get editOrganisation() {
		return cy.get("input[name='change-organization-name']");
	},

	get confirmOrgNameChange() {
		return cy.get("button[name='change-organization-name']");
	},

	get toOrganisationConfig() {
		return cy.get(".vs-c-my-organization.organization-list-item");
	},

	get configOrgNameInput() {
		return cy.get("input[name='name']");
	},

	get configUpdateOrgName() {
		return cy.get(".el-form button[type='submit']");
	},

	get notificationModal() {
		return cy.get(".el-message__group");
	},

	get configDeleteOrgButton() {
		return cy.get(".vs-c-btn.vs-c-btn--warning.vs-c-btn--spaced");
	},

	get closeConfirmationModal() {
		return cy.get("button[name='close-confirmation-modal-btn']");
	},

	get modalPopup() {
		return cy.get(".vs-c-confirmation-modal");
	},

	get modalNoButton() {
		return cy.get("button[name='cancel-btn']")
	},

	get modalYesButton() {
		return cy.get("button[name='save-btn']")
	},

	get modalPasswordInput() {
		return cy.get("input[type='password']");
	},

	get closeModal() {
		return cy.get("button[name='close-confirmation-modal-btn']");
	},

	get archiveOrg() {
		return cy.get(".vs-l-my-organizations__content .vs-c-my-organizations-item-wrapper .vs-c-icon--archive");
	},

	get deleteArchivedOrg() {
		return cy.get(".vs-c-icon--remove");
	},

	get goToArchivedOrgs() {
		return cy.get(".vs-c-my-organizations-item-wrapper--archived > div");
	},
	
	get deleteOrgFromPanel() {
		return cy.get(".vs-c-btn--warning");
	},

	configureAndAssertNewOrg({organisationName = data.accountDetails.organisationName}) {
		cy.intercept('POST', '/api/v2/organizations').as('addOrganization');

		this.navigateOrgName.should('be.visible').type(organisationName);
		this.navigateNextButton.click();
		this.navigateNextButton.click();

		this.confirmBoardsModal.click();

		cy.wait('@addOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		expect(res.body.name).to.eq(organisationName);
		cy.url().should('eq', `${Cypress.config().baseUrl}organizations/${res.body.id}/boards`);
		})
	},

	editOrgName({organisationName = data.accountDetails.organisationName}) {
		cy.intercept('PUT', '/api/v2/organizations/*').as('rename');

		this.organisationNameHeader.eq(0).click();
		if (organisationName != "") {
		this.editOrganisation.clear().type(organisationName);
		}
		this.confirmOrgNameChange.click();
	}
}
