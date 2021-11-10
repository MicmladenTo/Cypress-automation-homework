import loginPage from '../fixtures/loginModule.json';
import addOrganisation from '../fixtures/addOrganisation.json';
import addBoard from '../fixtures/addBoard.json';
import data from '../fixtures/data.json';
import sidebar from '../fixtures/sidebar.json';
import navigation from '../fixtures/navigation.json';
import authModule from '../models/authModule';
import organisationModule from '../models/organisationModule';
import boardModule from '../models/boardModule';
import sidebarModule from '../models/sidebarModule';

describe('Organisation CRUD suite', () => {

	it('Go to the app and log in', () => {
		cy.visit('/', {timeout: 30000});

		authModule.login({});

		// Assert that the browser has visited the correct URL
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/my-organizations');
	});

	it('Create an organisation from the panel', () => {
		organisationModule.addNewOrganisation.click();
		organisationModule.configureAndAssertNewOrg({})
	});

	it('Create a Scrum board from the panel', () => {
		boardModule.configureAndAssertABoard({})
	});

	it('Go back and archive the board - close modal', () => {
		sidebarModule.goToOrganisation.click({force:true});
		organisationModule.confirmBoardsModal.click();
		boardModule.archiveBoard.click({force:true});
		boardModule.closeModal.click();

		//Assert that the modal no longer exists
		organisationModule.modalPopup.should('not.exist');
	});

	it('Archive the board - "no" button', () => {
		boardModule.archiveBoard.click({force:true});
		boardModule.modalNoButton.click();

		//Assert that the modal no longer exists
		organisationModule.modalPopup.should('not.exist');
	});

	it('Archive the board - positive', () => {
		cy.intercept('PUT', '/api/v2/boards/**').as('archiveABoard');

		boardModule.archiveBoard.click({force:true})
		boardModule.modalYesButton.click();

		// Assert a successful post request and verify board name, status and URL from the response
		cy.wait('@archiveABoard')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		expect(res.body.status).to.eq("archived");
		expect(res.body.name).to.eq(data.boardTitle);
		cy.url().should('eq', `${Cypress.config().baseUrl}organizations/${res.body.organization_id}/boards`);
		})
	});

	it('Delete the archived board - close modal', () => {
		boardModule.deleteArchivedBoard.eq(0).click({force:true})
		boardModule.closeModal.click();

		//Assert that the modal no longer exists
		organisationModule.modalPopup.should('not.exist');
	});

	it('Delete the archived board - "no" button', () => {
		boardModule.deleteArchivedBoard.eq(0).click({force:true});
		boardModule.modalNoButton.click();

		//Assert that the modal no longer exists
		organisationModule.modalPopup.should('not.exist');
	});

	it('Delete the archived board - positive', () => {
		cy.intercept('DELETE', '/api/v2/boards/*').as('deleteABoard');

		boardModule.deleteArchivedBoard.eq(0).click({force:true});
		boardModule.modalYesButton.click();

		// Assert that the board has actually been deleted
		cy.wait('@deleteABoard')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		});
	})

	it('Delete organisation from config screen - positive', () => {
		cy.intercept('POST', '/api/v2/organizations/*').as('deleteABoard');

		sidebarModule.orgMenuConfiguration.click();
		organisationModule.configDeleteOrgButton.click();
		
		// Assert that the right password has been entered
		organisationModule.modalPasswordInput
		.type(data.user.password)
		.should('have.value', data.user.password);

		organisationModule.modalYesButton.click();

		// Assert that the organisation has been successfully deleted
		cy.wait('@deleteABoard')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(201);

		
		// Make sure that we have been redirected to the "My organizations" page
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/my-organizations');
	});
	});
})
