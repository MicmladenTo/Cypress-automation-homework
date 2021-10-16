import loginPage from '../fixtures/loginModule.json';
import addOrganisation from '../fixtures/addOrganisation.json';
import addBoard from '../fixtures/addBoard.json';
import data from '../fixtures/data.json';
import sidebar from '../fixtures/sidebar.json';
import navigation from '../fixtures/navigation.json';

describe('Organisation CRUD suite', () => {

	it('Go to the app and log in', () => {
		cy.visit('/', {timeout: 30000});
		cy.get(loginPage.emailInput).clear().type(data.user.email);
		cy.get(loginPage.passwordInput).clear().type(data.user.password);
		cy.get(loginPage.loginButton).click();
	});

	it('Create an organisation from the panel', () => {
		cy.get(addOrganisation.addNewOrganisation, {timeout: 10000}).click();
		cy.get(addOrganisation.navigate.organisationName).type(data.accountDetails.organisationName);
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();
	});

	it('Create a Scrum board from the panel', () => {
		cy.get(addBoard.addBoardFromPanel).click();
		cy.get(addBoard.newBoard.boardTitle).type(data.boardTitle);
		cy.get(addBoard.newBoard.navigate.nextButton).click();
		cy.get(addBoard.newBoard.boardType.scrum).click();
		cy.get(addBoard.newBoard.navigate.nextButton).click();
		cy.get(addBoard.newBoard.navigate.nextButton).click();
		cy.get(addBoard.newBoard.navigate.nextButton).click();
		cy.wait(3000);
	});

	it('Go back and archive the board - close modal', () => {
		cy.get(sidebar.goToOrganisation).click({force:true});
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();
		cy.wait(3000);
		cy.get(addBoard.archiveBoard).click({force:true})
		cy.get(addBoard.modal.close).click();
	});

	it('Archive the board - "no" button', () => {
		cy.get(addBoard.archiveBoard).click({force:true})
		cy.get(addBoard.modal.noButton).click();
	});

	it('Archive the board - positive', () => {
		cy.get(addBoard.archiveBoard).click({force:true})
		cy.get(addBoard.modal.yesButton).click();
	});

	it('Delete the archived board - close modal', () => {
		cy.get(addBoard.deleteArchivedBoard).eq(0).click({force:true})
		cy.get(addBoard.modal.close).click();
	});

	it('Delete the archived board - "no" button', () => {
		cy.get(addBoard.deleteArchivedBoard).eq(0).click({force:true})
		cy.get(addBoard.modal.noButton).click();
	});

	it('Delete the archived board - positive', () => {
		cy.get(addBoard.deleteArchivedBoard).eq(0).click({force:true})
		cy.get(addBoard.modal.yesButton).click();
	});

	it('Delete organisation from config screen - positive', () => {
		cy.wait(1500);
		cy.get(sidebar.organisationMenu.configuration).click();
		cy.wait(1500);
		cy.get(addOrganisation.organisationConfig.deleteOrgButton).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput).type(data.user.password);
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
	});

})
