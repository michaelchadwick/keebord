import AudioSynth from './AudioSynth.vue'

describe('<AudioSynth />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(AudioSynth)
  })
})