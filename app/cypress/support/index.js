import './commands';
import 'cypress-axe';
import 'cypress-plugin-retries';
// eslint-disable-next-line import/no-unresolved
import authenticatedPages from './authenticatedPages.json';

Cypress.env.AUTHENTICATED_PAGES = authenticatedPages;
