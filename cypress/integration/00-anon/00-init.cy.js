/// <reference types="Cypress" />

context('anon', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load front page and have correct title', () => {
    cy.get('#app')
      .should('exist')
    cy.title()
      .should('include', 'Keebord')
  })
})
