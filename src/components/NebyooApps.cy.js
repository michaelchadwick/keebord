import NebyooApps from './NebyooApps.vue'

describe('<NebyooApps />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(NebyooApps)
  })
})