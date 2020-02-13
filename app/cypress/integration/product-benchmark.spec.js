describe('The products and benchmark page', () => {
  beforeEach(() => {
    cy.sqlFixture('fixtures/products-benchmarks-setup');
    cy.login(
      Cypress.env('TEST_ADMIN_USERNAME'),
      Cypress.env('TEST_ADMIN_PASSWORD')
    );
  });

  afterEach(() => {
    cy.sqlFixture('fixtures/products-benchmarks-teardown');
    cy.logout();
  });

  it('Displays the list of all products', () => {
    cy.visit('/admin/products-benchmarks');
    cy.get('#page-content');
    cy.get('tr')
      .its('length')
      .should('be.gte', 2);
  });

  it('Opens a modal when clicking on the edit button', () => {
    cy.visit('/admin/products-benchmarks');
    cy.get('#page-content');
    cy.contains('Edit').click();
  });

  it('Allows the user to edit the product', () => {
    cy.visit('/admin/products-benchmarks');
    cy.get('#page-content');
    cy.contains('Edit').click();
    cy.get('#root_description')
      .clear()
      .type('whatever');
    cy.contains('Save').click();
    cy.visit('/admin/products-benchmarks');
    cy.get('#page-content').contains('whatever');
  });

  it('Allows the user to edit the benchmark', () => {
    cy.visit('/admin/products-benchmarks');
    cy.get('#page-content');
    cy.contains('Edit').click();
    cy.get('#root_benchmark')
      .clear()
      .type('0.42');
    cy.get(':nth-child(8) > .btn-primary').click();
    cy.visit('/admin/products-benchmarks');
    cy.get('td').contains('0.42');
  });
});
