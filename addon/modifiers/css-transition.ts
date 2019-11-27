import Modifier from 'ember-modifier'
import { computeTimeout, nextTick } from '../-private/utils'
import { later, schedule, cancel } from '@ember/runloop'
import { EmberRunTimer } from '@ember/runloop/types'
import { assert } from '@ember/debug'

interface NamedArgs {
  onEnter (element: Element): any
  onLeave (element: Element): any
}

interface Args {
  named: NamedArgs
  positional: any[]
}

export default class CssTransitionModifier extends Modifier<Args> {
  constructor (owner: unknown, public args: Args) {
    super(owner, args)
    assert(`${this.constructor.name} requires transitionClasses`, this.transitionClasses.length)
    schedule('afterRender', () => this.afterRender())
  }

  clone?: Element

  get transitionClasses (): string[] {
    const classes = this.args.positional[0] || []
    return classes.split(' ')
  }

  addClass (className: string, element: Element) {
    element.classList.add(className)
  }

  removeClass (className: string, element: Element) {
    element.classList.remove(className)
  }

  transitionTimeouts: EmberRunTimer[] = []

  transition (animationType: 'enter' | 'leave', transitionClass: string) {
    return new Promise(async (resolve) => {
      // we may need to animate the clone if the element was destroyed
      let element = this.clone || this.element

      let className = `${transitionClass}-${animationType}`
      let activeClassName = `${className}-active`

      // add first class right away
      this.addClass(className, element)

      await nextTick()

      // This is for to force a repaint,
      // which is necessary in order to transition styles when adding a class name.
      element.scrollTop
      // add active class after repaint
      this.addClass(activeClassName, element)

      // if we're animating a class removal
      // we need to remove the class
      if (animationType === 'leave') {
        this.removeClass(transitionClass, element)
      }

      // wait for ember to apply classes
      schedule('afterRender', () => {
        // set timeout for animation end
        let timeout = later(() => {
          this.removeClass(className, element)
          this.removeClass(activeClassName, element)
          resolve()
        }, computeTimeout(element) || 0)
        // Push to transition timeouts
        this.transitionTimeouts.push(timeout)
      })
    })

  }

  async afterRender () {
    await Promise.all(
      this.transitionClasses.map(async (transitionClass) => {
        await this.transition('enter', transitionClass)
        if (typeof this.args.named.onEnter === 'function') {
          this.args.named.onEnter(this.element)
        }
      })
    )
  }

  async willRemove () {
    this.transitionTimeouts.forEach(t => cancel(t))

    await Promise.all(
      this.transitionClasses.map(async (transitionClass) => {
        const clone = this.clone = this.element.cloneNode(true) as Element

        clone.setAttribute('id', `${this.element.id}_clone`)

        if (this.element.parentNode) {
          this.element.parentNode.insertBefore(clone, this.element.nextElementSibling)
        }

        await nextTick()

        await this.transition('leave', transitionClass)
        if (clone.parentNode) {
          clone.parentNode.removeChild(clone)
        }

        if (typeof this.args.named.onLeave === 'function') {
          this.args.named.onLeave(this.element)
        }

        delete this.clone
      })
    )
  }
}
