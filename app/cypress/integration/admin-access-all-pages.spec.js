describe('When logged in as an analyst', () => {
  beforeEach(() => {
    cy.login(
      Cypress.env('TEST_ADMIN_USERNAME'),
      Cypress.env('TEST_ADMIN_PASSWORD')
    );
  });

  afterEach(() => {
    cy.logout();
  });

  it('The admin should be able to load all pages within their access scope', () => {
    cy.visit('/admin');
    cy.url().should('include', '/admin');
    cy.get('.card-body');
    cy.visit('/admin/organisation-requests');
    cy.url().should('include', '/admin/organisation-requests');
    cy.get('tr');
    cy.visit('/admin/user-list');
    cy.url().should('include', '/admin/user-list');
    cy.get('tr');
    cy.visit('/admin/products-benchmarks');
    cy.url().should('include', '/admin/products-benchmarks');
    cy.get('tr');
    // TODO: This route doesn't always work. Note made in YouTrack to investigage
    // cy.visit('/analyst/applications');
    // cy.url().should('include', '/analyst/applications');
    // cy.get('tr');
  });
});