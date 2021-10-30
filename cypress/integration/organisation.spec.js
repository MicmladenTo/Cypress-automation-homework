import loginPage from '../fixtures/loginModule.json';
import addOrganisation from '../fixtures/addOrganisation.json';
import data from '../fixtures/data.json';
import sidebar from '../fixtures/sidebar.json';
import navigation from '../fixtures/navigation.json';

describe('Organisation CRUD suite', () => { 
	
	it('Log into vivify scrum', () => {
		cy.intercept('/api/v2/health-check').as('loginRedirect');
		cy.intercept('POST', '/api/v2/login').as('login');
		cy.intercept('GET', '/api/v2/my-organizations').as('myOrganizations');
		cy.visit('/', {timeout: 30000});

		// Make sure we have been properly redirected at the beginning of the suite
		cy.wait('@loginRedirect')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		})

		// Make sure we are at the correct URL for logging in
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/login')

		// Enter login data
		cy
		.get(loginPage.emailInput)
		.clear()
		.type(data.user.email)
		.should('have.value', data.user.email);

		cy
		.get(loginPage.passwordInput)
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

	it('Create an organisation from the dashboard', () => {
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

		// Go back to My Organizations
		cy.get(navigation.homeButton).click();

		// Verify that only one organisation has been created
		cy
		.get(addOrganisation.organisationNameHeader)
		.should('be.visible')
		.and('have.length', 2);

		// Verify that its name is as expected on the frontend
		cy
		.get(addOrganisation.organisationNameHeader).eq(0)
		.should('contain', data.accountDetails.organisationName);
	});

	it('Create an organisation from the sidebar', () => {
		cy.intercept('POST', '/api/v2/organizations').as('addOrganization');

		cy.get(sidebar.addNewTop.addNew).click();
		cy.get(sidebar.addNewTop.addOrganization, {timeout: 10000}).click();
		cy.get(addOrganisation.navigate.organisationName).type(data.accountDetails.organisationName2);
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();

		// Assert a successful post request and verify organisation name and URL from the response
		cy.wait('@addOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		expect(res.body.name).to.eq(data.accountDetails.organisationName2);
		cy.url().should('eq', Cypress.config().baseUrl + 'organizations/' + res.body.id + '/boards');
		})

		// Go back to My Organizations
		cy.get(navigation.homeButton).click();

		// Verify that only one organisation has been created
		cy
		.get(addOrganisation.organisationNameHeader)
		.should('be.visible')
		.and('have.length', 3);

		// Verify that its name is as expected on the frontend
		cy
		.get(addOrganisation.organisationNameHeader).eq(1)
		.should('contain', data.accountDetails.organisationName2);

	});

	it('Add another organisation from the sidebar', () => {
		cy.intercept('POST', '/api/v2/organizations').as('addOrganization');

		cy.get(sidebar.addNewTop.addNew).click();
		cy.get(sidebar.addNewTop.addOrganization, {timeout: 10000}).click();
		cy.get(addOrganisation.navigate.organisationName).type(data.accountDetails.organisationName3);
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();

		// Assert a successful post request and verify organisation name from the response
		cy.wait('@addOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		expect(res.body.name).to.eq(data.accountDetails.organisationName3);
		cy.url().should('eq', Cypress.config().baseUrl + 'organizations/' + res.body.id + '/boards');
		})

		// Go back to My Organizations
		cy.get(navigation.homeButton).click();

		// Verify that only one organisation has been created
		cy
		.get(addOrganisation.organisationNameHeader)
		.should('be.visible')
		.and('have.length', 4);

		// Verify that its name is as expected on the frontend
		cy
		.get(addOrganisation.organisationNameHeader).eq(2)
		.should('contain', data.accountDetails.organisationName3);	
	});

	it('Edit organisation name - name too long', () => {
		cy.intercept('PUT', '/api/v2/organizations/*').as('rename');

		cy.get(navigation.homeButton).click();
		cy.get(addOrganisation.organisationNameHeader).eq(0).click();
		cy.get(addOrganisation.editOrganisation).clear().type(data.accountDetails.tooLongOrgName);
		cy.get(addOrganisation.confirmOrgNameChange).click();

		// Assert the "unprocessable entity" status code and the error message
		cy.wait('@rename')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(422);
		expect(res.body.name[0]).to.eq("The name may not be greater than 255 characters.");
		})
	});

	it('Edit organisation name - empty string', () => {
		cy.get(addOrganisation.organisationNameHeader).eq(0).click();
		cy.get(addOrganisation.editOrganisation).clear();
		cy.get(addOrganisation.confirmOrgNameChange).click();

		// Verify that the name has not been changed on the frontend
		cy
		.get(addOrganisation.organisationNameHeader).eq(0)
		.should('contain', data.accountDetails.organisationName);
	});

	it('Edit organisation name - spaces', () => {
		cy.get(addOrganisation.organisationNameHeader).eq(0).click();
		cy.get(addOrganisation.editOrganisation).clear().type(data.accountDetails.orgNameOnlySpaces);
		cy.get(addOrganisation.confirmOrgNameChange).click();

		// Verify that the name has not been changed on the frontend
		cy
		.get(addOrganisation.organisationNameHeader).eq(0)
		.should('contain', data.accountDetails.organisationName);
	});

	it('Edit organisation name - unicode', () => {
		cy.intercept('PUT', '/api/v2/organizations/*').as('rename');

		cy.get(addOrganisation.organisationNameHeader).eq(0).click();

		// Enter a unicode name and assert that it is present in the input field
		cy
		.get(addOrganisation.editOrganisation)
		.clear()
		.type(data.accountDetails.unicodeName)
		.should('have.value', data.accountDetails.unicodeName);
		cy.get(addOrganisation.confirmOrgNameChange).click();

		// Assert that the name has been changed into a unicode one
		cy.wait('@rename')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		expect(res.body.name).to.eq(data.accountDetails.unicodeName);
		})

		// Verify that the name has been changed to a unicode one on the frontend
		cy
		.get(addOrganisation.organisationNameHeader).eq(0)
		.should('contain', data.accountDetails.unicodeName);
	});

	it('Edit organisation name from the dashboard', () => {
		cy.intercept('PUT', '/api/v2/organizations/*').as('rename');

		cy.get(addOrganisation.organisationNameHeader).eq(0).click();
		// Enter an edited org name and assert that it is present in the input field
		cy
		.get(addOrganisation.editOrganisation)
		.clear()
		.type(data.accountDetails.editedOrgName)
		.should('have.value', data.accountDetails.editedOrgName);
		cy.get(addOrganisation.confirmOrgNameChange).click();

		// Assert that the name has been changed into a unicode one
		cy.wait('@rename')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		expect(res.body.name).to.eq(data.accountDetails.editedOrgName);
		})

		// Verify that the name has been changed to a unicode one on the frontend
		cy
		.get(addOrganisation.organisationNameHeader).eq(0)
		.should('contain', data.accountDetails.editedOrgName);
	});

	it('Edit organisation name through config screen', () => {
		cy.intercept('GET', '/api/v2/organizations/**').as('viewOrganization');
		cy.intercept('PUT', '/api/v2/organizations/**').as('editOrganization');

		cy.get(addOrganisation.toOrganisationConfig).eq(0).click();
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();

		// Assert a successful post request and verify organisation name from the response
		cy.wait('@viewOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		cy.url().should('contain','/boards');

		// Parse the URL for organisation ID
		// cy.url().then(url => {
		// 	const currentURL = url.split('/');
		// 	const id = currentURL[4];
		//   }).then(id => {
		// 	// Assert the correct URL
		// 	cy.url().should('eq', id)
		//   })
		// })

		cy.get(sidebar.organisationMenu.configuration).click();
		cy
		.get(addOrganisation.organisationConfig.organisationNameInput)
		.clear()
		.type(data.accountDetails.companyName)
		.should('have.value', data.accountDetails.companyName);
		cy.get(addOrganisation.organisationConfig.updateOrgNameButton).eq(0).click();
		
		// Assert a successful PUT request and verify organisation name from the response
		cy.wait('@editOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		expect(res.body.name).to.eq(data.accountDetails.companyName);
		cy.url().should('eq', Cypress.config().baseUrl + 'organizations/' + res.body.id + '/settings');
		});

		//Assert the popup notification
		cy
		.get(addOrganisation.notificationModal)
		.should('be.visible')
		.and('contain', 'Successfully updated the Organization name.')
	})
	})

	it('Delete organisation from config screen - close modal', () => {
		cy.get(addOrganisation.organisationConfig.deleteOrgButton).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();
		//Assert that the modal no longer exists
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it('Delete organisation from config screen - press "No"', () => {
		cy.get(addOrganisation.organisationConfig.deleteOrgButton).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.noButton).click();
		//Assert that the modal is no longer visible
		cy.get(addOrganisation.organisationConfig.confirmationModal).should('not.be.visible');
	});

	it('Delete organisation from config screen - wrong password', () => {
		cy.intercept('POST', '/api/v2/organizations/*').as('editOrganization');

		cy.get(addOrganisation.organisationConfig.deleteOrgButton).click();

		// Assert that the wrong password has been entered in the input field
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput)
		.type(data.wrongUser.wrongPassword)
		.should('have.value', data.wrongUser.wrongPassword);

		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();

		//Assert the "Unauthorised" status code and the "Wrong password" error
		cy.wait('@editOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(403);
		expect(res.body.errors[0]).to.eq("You entered the wrong password!");
		});
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();
	});

	it('Delete organisation from config screen - successful', () => {
		cy.intercept('POST', '/api/v2/organizations/*').as('deleteOrganization');

		cy.get(addOrganisation.organisationConfig.deleteOrgButton).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput).type(data.user.password);
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
		
		// Wait for confirmation of successful deletion through status code
		cy.wait('@deleteOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(201);
		});

		// Assert return to the home screen
		cy.get(navigation.myOrganisations).should('be.visible');
	});

	it('Archive and delete the organisation - close the modal', () => {
		// cy.get(navigation.homeButton, {timeout: 8000}).click();
		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();

		// Assert that the modal no longer exists
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it('Archive and delete the organisation - press "no"', () => {
		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.noButton).click();
		// Assert that the modal no longer exists
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it('Archive the organisation and close the deletion modal', () => {
		cy.intercept('PUT', '/api/v2/organizations/**').as('archiveOrganization');

		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();

		// Wait for confirmation of successful archiving through status code
		cy.wait('@archiveOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		});

		cy.get(addOrganisation.deleteArchivedOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();

		// Assert that the modal is longer visible
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it('Archive and delete the organisation - press "no" at deletion screen', () => {
		cy.intercept('PUT', '/api/v2/organizations/**').as('archiveOrganization');

		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();

		// Wait for confirmation of successful archiving through status code
		cy.wait('@archiveOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		});

		cy.get(addOrganisation.deleteArchivedOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.noButton).click();

		// Assert that the modal is longer visible
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it('Archive and delete the organisation - enter a wrong password', () => {
		cy.intercept('PUT', '/api/v2/organizations/**').as('archiveOrganization');
		cy.intercept('POST', '/api/v2/organizations/**').as('deleteOrganization');

		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();

		// Wait for confirmation of successful archiving through status code
		cy.wait('@archiveOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		});

		cy.get(addOrganisation.deleteArchivedOrg).eq(0).click({force: true});
		
		//Assert that the incorrect password has been entered in the input field
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput)
		.type(data.wrongUser.wrongPassword)
		.should('have.value', data.wrongUser.wrongPassword);
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();

		// Assert that the deletion has not gone through and the "Wrong message" password
		cy.wait('@deleteOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(403);
		expect(res.body.errors[0]).to.eq("You entered the wrong password!");
		});

		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();
	});

	it('Archive and delete the organisation from dashboard - success', () => {
		cy.intercept('PUT', '/api/v2/organizations/**').as('archiveOrganization');
		cy.intercept('POST', '/api/v2/organizations/**').as('deleteOrganization');

		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();

		// Wait for confirmation of successful archiving through status code
		cy.wait('@archiveOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(200);
		});

		cy.get(addOrganisation.deleteArchivedOrg).eq(0).click({force: true});

		// Enter the password and assert that a valid password has been entered
		cy
		.get(addOrganisation.organisationConfig.confirmationModal.paswordInput)
		.type(data.user.password)
		.should('have.value', data.user.password);

		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();

		// Assert that the deletion has been successful
		cy.wait('@deleteOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(201);
		});
	});

	it('Delete the archived organisation through the panel - close the modal', () => {
		cy.get(addOrganisation.goToArchivedOrgs).eq(0).click({force: true});
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();
		cy.get(addOrganisation.deleteOrgFromPanel).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();

		// Assert that the modal no longer exists
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it('Delete the archived organisation through the panel - press "No"', () => {
		cy.get(addOrganisation.deleteOrgFromPanel).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.noButton).click();

		// Assert that the modal no longer exists
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it('Delete the archived organisation through the panel - wrong password', () => {
		cy.intercept('POST', '/api/v2/organizations/**').as('deleteOrganization');

		cy.get(addOrganisation.deleteOrgFromPanel).click();

		// Assert that a wrong password has been entered in the input field
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput)
		.type(data.wrongUser.wrongPassword)
		.should('have.value', data.wrongUser.wrongPassword);

		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();

		// Assert that the deletion has not gone through and the "Wrong message" password
		cy.wait('@deleteOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(403);
		expect(res.body.errors[0]).to.eq("You entered the wrong password!");
		});

		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();

		// Assert that the modal no longer exists
		cy.get(addOrganisation.organisationConfig.modalPopup).should('not.exist');
	});

	it('Delete the archived organisation through the panel - positive', () => {
		cy.intercept('POST', '/api/v2/organizations/**').as('deleteOrganization');

		cy.get(addOrganisation.deleteOrgFromPanel).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput).type(data.user.password);
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();

		// Assert that the organisation has been successfully deleted
		cy.wait('@deleteOrganization')
		.its('response')
		.then((res) => {
		expect(res.statusCode).to.eq(201);
		});

		// Make sure that we have been redirected to the "My organizations" page
		cy.url().should('eq', 'https://cypress.vivifyscrum-stage.com/my-organizations');

		cy.wait(5000);
	});
	})
