import ModalDialog from './ModalDialog.vue'

describe('<ModalDialog />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(ModalDialog)
  })
})