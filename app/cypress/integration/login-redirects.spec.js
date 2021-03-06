const REQUIRED_QUERY_PARAMS = {
  facilities: '?organisationRowId=200',
  application: `?applicationId=${encodeURIComponent(
    window.btoa('["applications", 1]')
  )}&version=1&formResultId=${encodeURIComponent(
    window.btoa('["form_results", 1]')
  )}`,
  'view-application': `?applicationId=${encodeURIComponent(
    window.btoa('["applications", 1]')
  )}&version=1`,
  'new-application-disclaimer': `?applicationId=${encodeURIComponent(
    window.btoa('["applications", 1]')
  )}&version=1`,
  certify: `?applicationId=${encodeURIComponent(
    window.btoa('["applications", 2]')
  )}&version=1`,
  'certification-redirect': `?rowId=${encodeURIComponent(
    'sss999'
  )}&id=${encodeURIComponent(window.btoa('["applications", 2]'))}`,
  'application-review': `?applicationId=${encodeURIComponent(
    window.btoa('["applications", 3]')
  )}&applicationRevisionId=${encodeURIComponent(
    window.btoa('["application_revisions", 3, 1]')
  )}&version=1`
};

let DEBUG;

// Uncomment this to limit tests to a single page:
// DEBUG = 'certification-redirect';

const {AUTHENTICATED_PAGES} = Cypress.env;

function testRedirectsForScopedPages(scope, pages) {
  pages.forEach((page) => {
    if (DEBUG && DEBUG !== page) return;

    it(`should land the ${scope} on the ${page} page after redirecting through login`, () => {
      let url = `/${scope}/${page}${
        page in REQUIRED_QUERY_PARAMS ? REQUIRED_QUERY_PARAMS[page] : ''
      }`;
      if (page === 'index') url = `/${scope}`;

      cy.visit(url);
      cy.url().should('include', '/login-redirect');
      cy.url().should('include', `?redirectTo=${encodeURIComponent(url)}`);

      cy.mockLogin(scope);

      // As the SSO login page won't open in a frame in Cypress, the final redirect must be
      // tested indirectly as though we're following the auth callback:
      cy.visit(`/login?redirectTo=${encodeURIComponent(url)}`);
      cy.url().should('include', url);
    });
  });
}

describe('Successful redirection of authenticated pages through login', () => {
  before(() => {
    cy.cleanSchema();
    cy.deployProdData();
    cy.sqlFixture('fixtures/login-redirects-setup');
  });

  Object.keys(AUTHENTICATED_PAGES).forEach((scope) =>
    testRedirectsForScopedPages(scope, AUTHENTICATED_PAGES[scope])
  );
});

describe('When failing the keycloak authorization', () => {
  it('should redirect to the 403 page', () => {
    // Any request with the auth_callback=1 query param will be routed through the keycloak middleware
    cy.visit('/login?auth_callback=1');
    cy.url().should('include', '/403');
  });
});
