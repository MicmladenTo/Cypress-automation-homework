import data from '../fixtures/data.json';

module.exports = {
	get addBoardFromPanel() {
		return cy.get(".vs-c-organization-boards__item--add-new");
	},

	get newBoardTitle() {
		return cy.get("input[name='name']");
	},

	get nextButton() {
		return cy.get("button[name='next_btn']");
	},

	get boardTypeScrum() {
		return cy.get("span[name='type_scrum']");
	},

	get archiveBoard() {
		return cy.get(".vs-c-organization__section:first-of-type .vs-c-boards-item__actions div:first-child");
	},

	get closeModal() {
		return cy.get("button[name='close-confirmation-modal-btn']");
	},

	get modalNoButton() {
		return cy.get("button[name='cancel-btn']");
	},

	get modalYesButton() {
		return cy.get("button[name='save-btn']");
	},

	get deleteArchivedBoard() {
		return cy.get(".vs-c-organization-boards__item--archived .vs-c-boards-item__actions div:first-child");
	},

	configureAndAssertABoard({boardTitle = data.boardTitle}) {
		cy.intercept('POST', '/api/v2/boards').as('postABoard');

		this.addBoardFromPanel.click();
		this.newBoardTitle.type(boardTitle);
		this.nextButton.click();
		this.boardTypeScrum.click();
		this.nextButton.click();
		this.nextButton.click();
		this.nextButton.click();
		
		// Assert a successful post request and verify board name and URL from the response
		cy.wait('@postABoard')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(201);
		expect(res.body.name).to.eq(boardTitle);
		cy.url().should('eq', `${Cypress.config().baseUrl}boards/${res.body.id}`);
		})
	}
}
