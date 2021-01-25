describe('When logged in as a certifier(reporter) they should be able to load all pages within their access scope', () => {
  beforeEach(() => {
    cy.cleanSchema();
    cy.deployProdData();
    cy.sqlFixture('fixtures/certifier-access-setup');
    cy.mockLogin('certifier');
    cy.useMockedTime(new Date(2020, 5, 10, 9, 0, 0, 0)); //May 10th at 9am
  });

  it('can access the certification-redirect page (ie: from an email link) and go on to certify an application', () => {
    const applicationId = window.btoa('["applications", 1]');
    cy.visit('localhost:3004/certifier/certification-redirect?rowId=testpage');
    cy.get('#page-content');
    cy.get('body').happoScreenshot({
      component: 'Certification Redirect'
    });
    cy.contains('Continue').click();
    cy.visit(
      `http://localhost:3004/certifier/certify?applicationId=${applicationId}&version=1`
    );
    cy.url().should('include', '/certifier');
    cy.get('#page-content');
    cy.contains('Certifier Signature');
    cy.get('body').happoScreenshot({
      component: 'Certification Page'
    });
    cy.get('.btn-success').contains('Sign').click();
    cy.visit(
      `http://localhost:3004/certifier/certify?applicationId=${applicationId}&version=1`
    );
    cy.contains('has been certified');
  });

  it('should redirect the certifier to /certify if they access the edit view by URL', () => {
    const applicationId = window.btoa('["applications", 1]');
    const formResultId = window.btoa('[formResults, 1]');
    cy.visit(
      `http://localhost:3004/reporter/application?formResultId=${formResultId}&applicationId=${applicationId}&version=1`
    );
    cy.wait(500);
    cy.url().should('include', '/certifier/certify');
  });

  it('can access the certification requests page via a link on the reporter dash', () => {
    cy.visit('/reporter');
    cy.get('.alert-link').contains('View all certification requests.').click();
    cy.url().should('include', '/certifier/requests');
  });

  it('can access the batch certification (certification requests) page and certify an application there', () => {
    cy.visit('/certifier/requests');
    cy.contains('test_organisation');

    cy.get('body').happoScreenshot({
      component: 'Batch certification page',
      variant: 'Nothing selected'
    });
    cy.get('tbody input[type="checkbox"]').first().click();
    cy.contains('Legal Disclaimer');
    cy.contains('Certifier Signature');
    cy.get('body').happoScreenshot({
      component: 'Batch certification page',
      variant: 'Multiple certification requests selected'
    });
    cy.get('.btn-success').contains('Sign').click();
    cy.should('not.contain', 'Certifier Signature');
  });

});
