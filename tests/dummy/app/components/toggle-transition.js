import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object'

export default class ToggleTransitionComponent extends Component {
  @tracked isActive = false

  @action
  toggleActive () {
    this.isActive = !this.isActive
  }
}
