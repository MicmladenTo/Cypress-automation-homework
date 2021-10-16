import loginPage from '../fixtures/loginModule.json';
import addOrganisation from '../fixtures/addOrganisation.json';
import data from '../fixtures/data.json';
import sidebar from '../fixtures/sidebar.json';
import navigation from '../fixtures/navigation.json';

describe('Organisation CRUD suite', () => { 
	
	it('Log into vivify scrum', () => {
		cy.visit('/', {timeout: 30000});
		cy.get(loginPage.emailInput).clear().type(data.user.email);
		cy.get(loginPage.passwordInput).clear().type(data.user.password);
		cy.get(loginPage.loginButton).click();
	});

	it('Create an organisation from the dashboard', () => {
		cy.get(addOrganisation.addNewOrganisation, {timeout: 10000}).click();
		cy.get(addOrganisation.navigate.organisationName).type(data.accountDetails.organisationName);
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();
	});

	it('Create an organisation from the sidebar', () => {
		cy.get(sidebar.addNewTop.addNew).click();
		cy.get(sidebar.addNewTop.addOrganization, {timeout: 10000}).click();
		cy.get(addOrganisation.navigate.organisationName).type(data.accountDetails.organisationName);
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();
	});

	it('Add another organisation from the sidebar', () => {
		cy.get(sidebar.addNewTop.addNew).click();
		cy.get(sidebar.addNewTop.addOrganization, {timeout: 10000}).click();
		cy.get(addOrganisation.navigate.organisationName).type(data.accountDetails.organisationName);
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.navigate.nextButton).click();
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();
	});

	it('Edit organisation name - name too long', () => {
		cy.get(navigation.homeButton).click();
		cy.get(addOrganisation.organisationNameHeader).eq(0).click();
		cy.get(addOrganisation.editOrganisation).clear().type(data.accountDetails.tooLongOrgName);
		cy.get(addOrganisation.confirmOrgNameChange).click();
	});

	it('Edit organisation name - empty string', () => {
		cy.get(addOrganisation.organisationNameHeader).eq(0).click();
		cy.get(addOrganisation.editOrganisation).clear();
		cy.get(addOrganisation.confirmOrgNameChange).click();
	});

	it('Edit organisation name - spaces', () => {
		cy.get(addOrganisation.organisationNameHeader).eq(0).click();
		cy.get(addOrganisation.editOrganisation).clear().type(data.accountDetails.orgNameOnlySpaces);
		cy.get(addOrganisation.confirmOrgNameChange).click();
	});

	it('Edit organisation name - unicode', () => {
		cy.get(addOrganisation.organisationNameHeader).eq(0).click();
		cy.get(addOrganisation.editOrganisation).clear().type(data.accountDetails.unicodeName);
		cy.get(addOrganisation.confirmOrgNameChange).click();
	});

	it('Edit organisation name from the dashboard', () => {
		cy.get(addOrganisation.organisationNameHeader).eq(0).click();
		cy.get(addOrganisation.editOrganisation).clear().type(data.accountDetails.editedOrgName);
		cy.get(addOrganisation.confirmOrgNameChange).click();
	});

	it('Edit organisation name through config screen', () => {
		cy.get(addOrganisation.toOrganisationConfig).eq(0).click();
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();
		cy.get(sidebar.organisationMenu.configuration).click();
		cy.get(addOrganisation.organisationConfig.organisationNameInput).clear().type(data.accountDetails.companyName);
		cy.get(addOrganisation.organisationConfig.updateOrgNameButton).eq(0).click();
	});

	
	it('Delete organisation from config screen - close modal', () => {
		cy.get(addOrganisation.organisationConfig.deleteOrgButton).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();
	});

	it('Delete organisation from config screen - press "No"', () => {
		cy.get(addOrganisation.organisationConfig.deleteOrgButton).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.noButton).click();
	});

	it('Delete organisation from config screen - wrong password', () => {
		cy.get(addOrganisation.organisationConfig.deleteOrgButton).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput).type(data.wrongUser.wrongPassword);
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();
	});

	it('Delete organisation from config screen - successful', () => {
		cy.get(addOrganisation.organisationConfig.deleteOrgButton).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput).type(data.user.password);
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
		cy.wait(2500);
	});

	it('Archive and delete the organisation - close the modal', () => {
		cy.get(navigation.homeButton, {timeout: 8000}).click();
		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();
	});

	it('Archive and delete the organisation - press "no"', () => {
		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.noButton).click();
	});

	it('Archive and delete the organisation - close deletion modal', () => {
		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
		cy.get(addOrganisation.deleteArchivedOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();
	});

	it('Archive and delete the organisation - press "no" at deletion screen', () => {
		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
		cy.get(addOrganisation.deleteArchivedOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.noButton).click();
	});

	it('Archive and delete the organisation - enter a wrong password', () => {
		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
		cy.get(addOrganisation.deleteArchivedOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput).type(data.wrongUser.wrongPassword);
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();
});

	it('Archive and delete the organisation from dashboard - success', () => {
		cy.get(addOrganisation.archiveOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
		cy.get(addOrganisation.deleteArchivedOrg).eq(0).click({force: true});
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput).type(data.user.password);
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
		cy.wait(1500);
	});

	it('Delete the archived organisation through the panel - close the modal', () => {
		cy.get(addOrganisation.goToArchivedOrgs).eq(0).click({force: true});
		cy.get(addOrganisation.boardsModal, {timeout: 10000}).click();
		cy.get(addOrganisation.deleteOrgFromPanel).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();
	});

	it('Delete the archived organisation through the panel - press "No"', () => {
		cy.get(addOrganisation.deleteOrgFromPanel).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.noButton).click();
	});

	it('Delete the archived organisation through the panel - wrong password', () => {
		cy.get(addOrganisation.deleteOrgFromPanel).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput).type(data.wrongUser.wrongPassword);
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.closeModal).click();
	});

	it('Delete the archived organisation through the panel - positive', () => {
		cy.get(addOrganisation.deleteOrgFromPanel).click();
		cy.get(addOrganisation.organisationConfig.confirmationModal.paswordInput).type(data.user.password);
		cy.get(addOrganisation.organisationConfig.confirmationModal.yesButton).click();
		cy.wait(5000);
	});
	})
