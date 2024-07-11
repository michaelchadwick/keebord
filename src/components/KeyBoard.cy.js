import KeyBoard from './KeyBoard.vue'

describe('<KeyBoard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(KeyBoard)
  })
})