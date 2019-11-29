import Modifier from 'ember-modifier'
import { computeTimeout, nextTick, toTimingFunctionString } from '../-private/utils'
import { later, schedule, cancel } from '@ember/runloop'
import { EmberRunTimer } from '@ember/runloop/types'
import { assert } from '@ember/debug'

interface NamedArgs {
  active?: boolean
  delay?: number
  duration?: number
  enter?: boolean
  enterDelay?: number
  enterDuration?: number
  onEnter ? (element: Element): any
  leave?: boolean
  leaveDelay?: number
  leaveDuration?: number
  onLeave ? (element: Element): any
}

interface Args {
  named: NamedArgs
  positional: any[]
}

export default class CssTransitionModifier extends Modifier<Args> {
  constructor (owner: unknown, public args: Args) {
    super(owner, args)
    assert(`${this.constructor.name} requires transitionClasses`, this.transitionClasses.length)
  }

  get transitionClasses (): string[] {
    const classes = this.args.positional[0] || []
    return classes.split(' ')
  }

  get delays () {
    return {
      enter: this.args.named.enterDelay || this.args.named.delay,
      leave: this.args.named.leaveDelay || this.args.named.delay
    }
  }

  get durations () {
    return {
      enter: this.args.named.enterDuration || this.args.named.duration,
      leave: this.args.named.leaveDuration || this.args.named.duration
    }
  }

  transitionTimeouts: EmberRunTimer[] = []

  transition (animationType: 'enter' | 'leave', transitionClass: string) {
    if (this.args.named[animationType] === false) return

    return new Promise(async (resolve) => {
      // we may need to animate the clone if the element was destroyed
      let element = (this.clone || this.element) as HTMLElement

      const delay = this.delays[animationType]
      if (delay) element.style.transitionDelay = toTimingFunctionString(delay)
      const duration = this.durations[animationType]
      if (duration) element.style.transitionDuration = toTimingFunctionString(duration)

      let className = `${transitionClass}-${animationType}`
      let activeClassName = `${className}-active`

      // add first class right away
      element.classList.add(className)

      await nextTick()

      // This is for to force a repaint,
      // which is necessary in order to transition styles when adding a class name.
      element.scrollTop
      // add active class after repaint
      element.classList.add(activeClassName)

      // if we're animating a class removal
      // we need to remove the class
      if (animationType === 'leave') {
        element.classList.remove(transitionClass)
      }

      // wait for ember to apply classes
      schedule('afterRender', () => {
        // set timeout for animation end
        let timeout = later(() => {
          element.classList.remove(className)
          element.classList.remove(activeClassName)
          if (delay) element.style.transitionDelay = ''
          if (duration) element.style.transitionDuration = ''

          if (animationType === 'enter') {
            if (typeof this.args.named.onEnter === 'function') {
              this.args.named.onEnter(this.element)
            }
          } else if (animationType === 'leave') {
            if (typeof this.args.named.onLeave === 'function') {
              this.args.named.onLeave(this.element)
            }
          }
          resolve()
        }, computeTimeout(element) || 0)

        // Push to transition timeouts
        this.transitionTimeouts.push(timeout)
      })
    })
  }

  didInstall () {
    if ('active' in this.args.named && this.args.named.active !== true) {
      this.transitionClasses.forEach(transitionClass => {
        this.element.classList.add(`${transitionClass}-enter`)
      })
    } else {
      schedule('afterRender', () => this.doEnter())
    }
  }

  async doEnter () {
    await Promise.all(this.transitionClasses.map(transitionClass => this.transition('enter', transitionClass)))
  }

  active!: boolean

  async didUpdateArguments () {
    if (
      typeof this.args.named.active === 'boolean' &&
      this.active !== this.args.named.active
    ) {
      this.active = this.args.named.active
      this.active ? this.doEnter() : this.doLeave()
    }
  }

  clone?: Element

  get shouldClone () {
    return !('active' in this.args.named)
  }

  async doLeave () {
    this.transitionTimeouts.forEach(t => cancel(t))

    if (this.shouldClone) {
      this.clone = this.element.cloneNode(true) as Element
      this.clone.setAttribute('clone', 'true')
      if (this.element.parentNode) {
        this.element.parentNode.insertBefore(this.clone, this.element.nextElementSibling)
      }
    }

    await nextTick()

    await Promise.all(
      this.transitionClasses.map(transitionClass => this.transition('leave', transitionClass))
    )

    if (this.clone) {
      if (this.clone.parentNode) {
        this.clone.parentNode.removeChild(this.clone)
      }
      delete this.clone
    } else {
      this.transitionClasses.forEach(transitionClass => {
        this.element.classList.add(`${transitionClass}-enter`)
      })
    }
  }

  willRemove () {
    this.doLeave()
  }
}
