import NodeControl from './NodeControl.vue'

describe('<NodeControl />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(NodeControl)
  })
})