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
}
