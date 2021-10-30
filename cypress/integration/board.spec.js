import loginPage from '../fixtures/loginModule.json';
import addOrganisation from '../fixtures/addOrganisation.json';
import addBoard from '../fixtures/addBoard.json';
import data from '../fixtures/data.json';
import sidebar from '../fixtures/sidebar.json';
import navigation from '../fixtures/navigation.json';

describe('Organisation CRUD suite', () => {

	it('Go to the app and log in', () => {
		// Intercept the login, logout and my-organization routes
		cy.intercept('POST', '/api/v2/login').as('login');
		cy.intercept('GET', '/api/v2/my-organizations').as('myOrganizations');

		cy.visit('/', {timeout: 30000});

		// Enter the email and password and assert that they are correct
		cy.get(loginPage.emailInput)
		.clear().type(data.user.email)
		.should('have.value', data.user.email);

		cy.get(loginPage.passwordInput)
		.clear()
		.type(data.user.password)
		.should('have.value', data.user.password);

		cy.get(loginPage.loginButton).click();

		// Assert that login attempt has been authorised
		cy.wait('@login')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		})

		// Assert that we have successfully requested organization list upon logging in
		cy.wait('@myOrganizations')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		})

		// Make sure that the browser has loaded the correct URL
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/my-organizations');
	});

	it.only('Create an organisation from the panel', () => {
		cy.intercept('POST', '/api/v2/organizations').as('addOrganization');

		cy.get(addOrganisation.addNewOrganisation, {timeout: 10000}).click();
		cy.get(addOrganisation.navigate.organisationName).type(data.accountDetails.organisationName);
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();

		// Assert a successful post request and verify organisation name from the response
		cy.wait('@addOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		expect(res.body.name).to.eq(data.accountDetails.organisationName);
		cy.url().should('eq', Cypress.config().baseUrl + 'organizations/' + res.body.id + '/boards');
		})
	});

	it.only('Create a Scrum board from the panel', () => {
		cy.intercept('POST', '/api/v2/boards').as('postABoard');

		cy.get(addBoard.addBoardFromPanel).click();
		cy.get(addBoard.newBoard.boardTitle).type(data.boardTitle);
		cy.get(addBoard.newBoard.navigate.nextButton).click();
		cy.get(addBoard.newBoard.boardType.scrum).click();
		cy.get(addBoard.newBoard.navigate.nextButton).click();
		cy.get(addBoard.newBoard.navigate.nextButton).click();
		cy.get(addBoard.newBoard.navigate.nextButton).click();
		
		// Assert a successful post request and verify board name and URL from the response
		cy.wait('@postABoard')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(201);
		expect(res.body.name).to.eq(data.boardTitle);
		cy.url().should('eq', Cypress.config().baseUrl + 'boards/' + res.body.id);
		})
	});

	it.only('Go back and archive the board - close modal', () => {
		cy.get(sidebar.goToOrganisation).click({force:true});
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();
		cy.get(addBoard.archiveBoard).click({force:true})
		cy.get(addBoard.modal.close).click();

		//Assert that the modal no longer exists
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it.only('Archive the board - "no" button', () => {
		cy.get(addBoard.archiveBoard).click({force:true})
		cy.get(addBoard.modal.noButton).click();

		//Assert that the modal no longer exists
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it.only('Archive the board - positive', () => {
		cy.intercept('PUT', '/api/v2/boards/**').as('archiveABoard');

		cy.get(addBoard.archiveBoard).click({force:true})
		cy.get(addBoard.modal.yesButton).click();

		// Assert a successful post request and verify board name, status and URL from the response
		cy.wait('@archiveABoard')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		expect(res.body.status).to.eq("archived");
		expect(res.body.name).to.eq(data.boardTitle);
		cy.url().should('eq', Cypress.config().baseUrl + 'organizations/' + res.body.organization_id + '/boards');
		})
	});

	it.only('Delete the archived board - close modal', () => {
		cy.get(addBoard.deleteArchivedBoard).eq(0).click({force:true})
		cy.get(addBoard.modal.close).click();

		//Assert that the modal no longer exists
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it.only('Delete the archived board - "no" button', () => {
		cy.get(addBoard.deleteArchivedBoard).eq(0).click({force:true})
		cy.get(addBoard.modal.noButton).click();

		//Assert that the modal no longer exists
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it.only('Delete the archived board - positive', () => {
		cy.intercept('DELETE', '/api/v2/boards/*').as('deleteABoard');

		cy.get(addBoard.deleteArchivedBoard).eq(0).click({force:true})
		cy.get(addBoard.modal.yesButton).click();

		// Assert that the board has actually been deleted
		cy.wait('@deleteABoard')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		});
	})

	it.only('Delete organisation from config screen - positive', () => {
		cy.intercept('POST', '/api/v2/organizations/*').as('deleteABoard');

		cy.get(sidebar.organisationMenu.configuration).click();
		cy.get(addOrganisation.organisationConfig.deleteOrgButton).click();
		
		// Assert that the right password has been entered
		cy
		.get(addOrganisation.organisationConfig.confirmationModal.paswordInput)
		.type(data.user.password)
		.should('have.value', data.user.password);

		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();

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
