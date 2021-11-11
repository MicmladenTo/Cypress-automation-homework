import loginPage from '../fixtures/loginModule.json';
import addOrganisation from '../fixtures/addOrganisation.json';
import data from '../fixtures/data.json';
import sidebar from '../fixtures/sidebar.json';
import navigation from '../fixtures/navigation.json';
import authModule from '../models/authModule';
import organisationModule from '../models/organisationModule';
import navigationModule from '../models/navigationModule';
import sidebarModule from '../models/sidebarModule';

describe('Organisation CRUD suite', () => { 
	
	it('Log into vivify scrum', () => {
		cy.intercept('/api/v2/health-check').as('loginRedirect');

		// Visit the Vivify Scrum app URL
		cy.visit('/', {timeout: 30000});

		// Make sure we have been properly redirected at the beginning of the suite
		cy.assertStatusCode('@loginRedirect', 200);

		// Make sure we are at the correct URL for logging in
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/login')

		cy.login({});

		// // Make sure that the browser has loaded the correct URL
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/my-organizations');
	});

	it('Create an organisation from the dashboard', () => {
		organisationModule.addNewOrganisation.click();

		cy.configureAndAssertNewOrg({});

		// Go back to My Organizations
		navigationModule.homeButton.click();

		// Verify that only one organisation has been created
		organisationModule.organisationNameHeader
		.should('be.visible')
		.and('have.length', 2);

		// Verify that its name is as expected on the frontend
		organisationModule.organisationNameHeader.eq(0)
		.should('contain', data.accountDetails.organisationName);
	});

	it('Create an organisation from the sidebar', () => {

		sidebarModule.topAddNew.click();
		sidebarModule.topAddOrganisation.click();

		cy.configureAndAssertNewOrg({organisationName: data.accountDetails.organisationName2});

		// Go back to My Organizations
		navigationModule.homeButton.click();

		// Verify that only one organisation has been created
		organisationModule.organisationNameHeader
		.should('be.visible')
		.and('have.length', 3);

		// Verify that its name is as expected on the frontend
		organisationModule.organisationNameHeader.eq(1)
		.should('contain', data.accountDetails.organisationName2);

	});

	it('Add another organisation from the sidebar', () => {
		cy.intercept('POST', '/api/v2/organizations').as('addOrganization');

		sidebarModule.topAddNew.click();
		sidebarModule.topAddOrganisation.click();

		cy.configureAndAssertNewOrg({organisationName: data.accountDetails.organisationName3});

		// Go back to My Organizations
		navigationModule.homeButton.click();

		// Verify that only one organisation has been created
		organisationModule.organisationNameHeader
		.should('be.visible')
		.and('have.length', 4);

		// Verify that its name is as expected on the frontend
		organisationModule.organisationNameHeader.eq(2)
		.should('contain', data.accountDetails.organisationName3);	
	});

	it('Edit organisation name - name too long', () => {
		navigationModule.homeButton.click();

		cy.editOrgName({organisationName: data.accountDetails.tooLongOrgName})

		// Assert the "unprocessable entity" status code and the error message
		cy.wait('@rename').its('response').then((res) => {
		expect(res.statusCode).to.eq(422);
		expect(res.body.name[0]).to.eq("The name may not be greater than 255 characters.");
		})
	});

	it('Edit organisation name - empty string', () => {
		cy.editOrgName({organisationName: ""})

		// Verify that the name has not been changed on the frontend
		organisationModule.organisationNameHeader.eq(0)
		.should('contain', data.accountDetails.organisationName);
	});

	it('Edit organisation name - spaces', () => {
		cy.editOrgName({organisationName: data.accountDetails.orgNameOnlySpaces})

		// Verify that the name has not been changed on the frontend
		organisationModule.organisationNameHeader.eq(0)
		.should('contain', data.accountDetails.organisationName);
	});

	it('Edit organisation name - unicode', () => {
		cy.editOrgName({organisationName: data.accountDetails.unicodeName})

		// Assert that the name has been changed into a unicode one
		cy.assertStatusCodeAndBody('@rename', 200, data.accountDetails.unicodeName);

		// Verify that the name has been changed to a unicode one on the frontend
		organisationModule.organisationNameHeader.eq(0)
		.should('contain', data.accountDetails.unicodeName);
	});

	it('Edit organisation name from the dashboard', () => {
		cy.editOrgName({organisationName: data.accountDetails.editedOrgName})

		// Assert that the name has been changed into a unicode one
		cy.assertStatusCodeAndBody('@rename', 200, data.accountDetails.editedOrgName);

		// Verify that the name has been changed to a unicode one on the frontend
		organisationModule.organisationNameHeader.eq(0)
		.should('contain', data.accountDetails.editedOrgName);
	});

	it('Edit organisation name through config screen', () => {
		cy.intercept('GET', '/api/v2/organizations/**').as('viewOrganization');
		cy.intercept('PUT', '/api/v2/organizations/**').as('editOrganization');

		organisationModule.toOrganisationConfig.eq(0).click();
		organisationModule.confirmBoardsModal.click();

		// Assert a successful post request and verify organisation name from the response
		cy.assertStatusCodeAndBody('@viewOrganization', 200);

		// Parse the URL for organisation ID
		// cy.url().then(url => {
		// 	const currentURL = url.split('/');
		// 	const id = currentURL[4];
		//   }).then(id => {
		// 	// Assert the correct URL
		// 	cy.url().should('eq', id)
		//   })
		// })

		sidebarModule.orgMenuConfiguration.click();

		cy.get(sidebar.organisationMenu.configuration).click();
		cy
		organisationModule.configOrgNameInput
		.clear()
		.type(data.accountDetails.companyName)
		.should('have.value', data.accountDetails.companyName);
		organisationModule.configUpdateOrgName.eq(0).click();
		
		// Assert a successful PUT request and verify organisation name from the response
		cy.assertStatusCodeAndBody('@editOrganization', 200, data.accountDetails.companyName);

		//Assert the popup notification
		organisationModule.notificationModal
		.should('contain', 'Successfully updated the Organization name.');
	});

	it('Delete organisation from config screen - close modal', () => {
		organisationModule.configDeleteOrgButton.click();
		organisationModule.closeConfirmationModal.click();
		//Assert that the modal no longer exists
		organisationModule.modalPopup.should('not.exist');
	});

	it('Delete organisation from config screen - press "No"', () => {
		organisationModule.configDeleteOrgButton.click();
		organisationModule.modalNoButton.click();
		//Assert that the modal is no longer visible
		organisationModule.modalPopup.should('not.exist');
	});

	it('Delete organisation from config screen - wrong password', () => {
		cy.intercept('POST', '/api/v2/organizations/*').as('editOrganization');

		organisationModule.configDeleteOrgButton.click();

		// Assert that the wrong password has been entered in the input field
		organisationModule.modalPasswordInput
		.type(data.wrongUser.wrongPassword)
		.should('have.value', data.wrongUser.wrongPassword);

		organisationModule.modalYesButton.click();

		//Assert the "Unauthorised" status code and the "Wrong password" error
		cy.assertStatusCodeAndError('@editOrganization', 403, "You entered the wrong password!");

		organisationModule.closeConfirmationModal.click();
	});

	it('Delete organisation from config screen - successful', () => {
		cy.intercept('POST', '/api/v2/organizations/*').as('deleteOrganization');

		organisationModule.configDeleteOrgButton.click();
		organisationModule.modalPasswordInput.type(data.user.password);
		organisationModule.modalYesButton.click();
		
		// Wait for confirmation of successful deletion through status code
		cy.assertStatusCode('@deleteOrganization', 201);

		// Assert return to the home screen
		navigationModule.myOrganisations.should('be.visible');
	});

	it('Archive and delete the organisation - close the modal', () => {
		// cy.get(navigation.homeButton, {timeout: 8000}).click();
		organisationModule.archiveOrg.eq(0).click({force: true});
		organisationModule.closeConfirmationModal.click();

		// Assert that the modal no longer exists
		organisationModule.modalPopup.should('not.exist');
	});

	it('Archive and delete the organisation - press "no"', () => {
		organisationModule.archiveOrg.eq(0).click({force: true});
		organisationModule.modalNoButton.click();
		// Assert that the modal no longer exists
		organisationModule.modalPopup.should('not.exist');
	});

	it('Archive the organisation and close the deletion modal', () => {
		cy.intercept('PUT', '/api/v2/organizations/**').as('archiveOrganization');

		organisationModule.archiveOrg.eq(0).click({force: true});
		organisationModule.modalYesButton.click();

		// Wait for confirmation of successful archiving through status code
		cy.assertStatusCode('@archiveOrganization', 200);

		organisationModule.deleteArchivedOrg.eq(0).click({force: true});
		organisationModule.closeConfirmationModal.click();

		// Assert that the modal is longer visible
		organisationModule.modalPopup.should('not.exist');
	});

	it('Archive and delete the organisation - press "no" at deletion screen', () => {
		cy.intercept('PUT', '/api/v2/organizations/**').as('archiveOrganization');

		organisationModule.archiveOrg.eq(0).click({force: true});
		organisationModule.modalYesButton.click();

		// Wait for confirmation of successful archiving through status code
		cy.assertStatusCode('@archiveOrganization', 200);

		organisationModule.deleteArchivedOrg.eq(0).click({force: true});
		organisationModule.modalNoButton.click();

		// Assert that the modal is longer visible
		organisationModule.modalPopup.should('not.exist');
	});

	it('Archive and delete the organisation - enter a wrong password', () => {
		cy.intercept('PUT', '/api/v2/organizations/**').as('archiveOrganization');
		cy.intercept('POST', '/api/v2/organizations/**').as('deleteOrganization');

		organisationModule.archiveOrg.eq(0).click({force: true});
		organisationModule.modalYesButton.click();

		// Wait for confirmation of successful archiving through status code
		cy.assertStatusCode('@archiveOrganization', 200);

		organisationModule.deleteArchivedOrg.eq(0).click({force: true});
		
		//Assert that the incorrect password has been entered in the input field
		organisationModule.modalPasswordInput
		.type(data.wrongUser.wrongPassword)
		.should('have.value', data.wrongUser.wrongPassword);
		organisationModule.modalYesButton.click();

		// Assert that the deletion has not gone through and the "Wrong message" password
		cy.assertStatusCodeAndError('@deleteOrganization', 403, "You entered the wrong password!");

		organisationModule.closeConfirmationModal.click();
	});

	it('Archive and delete the organisation from dashboard - success', () => {
		cy.intercept('PUT', '/api/v2/organizations/**').as('archiveOrganization');
		cy.intercept('POST', '/api/v2/organizations/**').as('deleteOrganization');

		organisationModule.archiveOrg.eq(0).click({force: true});
		organisationModule.modalYesButton.click();

		// Wait for confirmation of successful archiving through status code
		cy.assertStatusCode('@archiveOrganization', 200);

		organisationModule.deleteArchivedOrg.eq(0).click({force: true});

		// Enter the password and assert that a valid password has been entered
		organisationModule.modalPasswordInput
		.type(data.user.password)
		.should('have.value', data.user.password);

		organisationModule.modalYesButton.click();

		// Assert that the deletion has been successful
		cy.assertStatusCode('@deleteOrganization', 201);
	});

	it('Delete the archived organisation through the panel - close the modal', () => {
		organisationModule.goToArchivedOrgs.eq(0).click({force: true});
		organisationModule.confirmBoardsModal.click();
		organisationModule.deleteOrgFromPanel.click();
		organisationModule.closeConfirmationModal.click();

		// Assert that the modal no longer exists
		organisationModule.modalPopup.should('not.exist');
	});

	it('Delete the archived organisation through the panel - press "No"', () => {
		organisationModule.deleteOrgFromPanel.click();
		organisationModule.modalNoButton.click();

		// Assert that the modal no longer exists
		organisationModule.modalPopup.should('not.exist');
	});

	it('Delete the archived organisation through the panel - wrong password', () => {
		cy.intercept('POST', '/api/v2/organizations/**').as('deleteOrganization');

		organisationModule.deleteOrgFromPanel.click();

		// Assert that a wrong password has been entered in the input field
		organisationModule.modalPasswordInput
		.type(data.wrongUser.wrongPassword)
		.should('have.value', data.wrongUser.wrongPassword);

		organisationModule.modalYesButton.click();

		// Assert that the deletion has not gone through and the "Wrong message" password
		cy.assertStatusCodeAndError('@deleteOrganization', 403, "You entered the wrong password!");

		organisationModule.closeConfirmationModal.click();

		// Assert that the modal no longer exists
		organisationModule.modalPopup.should('not.exist');
	});

	it('Delete the archived organisation through the panel - positive', () => {
		cy.intercept('POST', '/api/v2/organizations/**').as('deleteOrganization');

		organisationModule.deleteOrgFromPanel.click();
		organisationModule.modalPasswordInput.type(data.user.password);
		organisationModule.modalYesButton.click();

		// Assert that the organisation has been successfully deleted
		cy.assertStatusCode('@deleteOrganization', 201);

		// Make sure that we have been redirected to the "My organizations" page
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/my-organizations');

		cy.wait(5000);
	});
})
