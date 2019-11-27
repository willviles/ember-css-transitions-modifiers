import Component from '@glimmer/component'
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object'

export default class FooComponent extends Component {
  @tracked isVisible = false

  @action
  onClick () {
    this.isVisible = !this.isVisible
  }
}
