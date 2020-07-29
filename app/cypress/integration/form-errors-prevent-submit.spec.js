describe('When logged in as a reporter', () => {
  beforeEach(() => {
    cy.logout();
    cy.login(
      Cypress.env('TEST_REPORTER_USERNAME'),
      Cypress.env('TEST_REPORTER_PASSWORD')
    );
    cy.sqlFixture('fixtures/form-errors-prevent-submit-setup');
  });

  afterEach(() => {
    cy.sqlFixture('fixtures/form-errors-prevent-submit-teardown');
  });

  it('The reporter should not be able to send an application for certification if there are errors', () => {
    const applicationId = window.btoa('["applications", 2]');
    cy.visit(
      `/reporter/application?applicationId=${applicationId}&confirmationPage=true&version=1`
    );
    cy.url().should('include', '/reporter/application');
    cy.get('.errors').contains('Your Application contains errors');
    cy.get('Submit for Certification').should('not.exist');
  });
});
