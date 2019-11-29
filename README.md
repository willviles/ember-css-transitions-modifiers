ember-css-transitions-modifiers
==============================================================================

🚧 **Work in progress**

This is an Ember.js [element modifiers](https://blog.emberjs.com/2019/03/06/coming-soon-in-ember-octane-part-4.html#:~:targetText=Modifiers%20are%20used%20for%20manipulating,button%20element%20it%20is%20modifying.&targetText=Modifiers%20are%20not%20an%20entirely%20new%20concept%20in%20Ember.) solution for attaching CSS transitions, heavily inspired by the old component-based approach offered by [ember-css-transitions](https://github.com/peec/ember-css-transitions).

Installation
------------------------------------------------------------------------------

```bash
ember install ember-css-transitions-modifiers
```

Usage
------------------------------------------------------------------------------

Use the `css-transition` modifier, as shown below:

```hbs
<div {{css-transition "fade"}}>
  Watch me transition!
</div>
```

Define transitions in CSS. The modifier will add `-enter`, `-enter-active`, `-leave` & `-leave-active` suffixes at the appropriate times on insertion and removal.

```css
.fade-enter {
  opacity: 0.01;
}

.fade-enter.fade-enter-active {
  opacity: 1;
  transition: opacity .5s ease-in;
}
.fade-leave {
  opacity: 1;
}

.fade-leave.fade-leave-active {
  opacity: 0.01;
  transition: opacity .5s ease-in;
}
```

Define multiple classes using a space delimited string. Note that CSS transitions set on multiple classes will not work together.

```hbs
<div {{css-transition "foo bar"}}>
  Setting transition suffixes for both classes
</div>
```

### Conditional Transitions

Transitions can be toggled on and off using `enter` and `leave` named args. Truthy values do not need to be specified, but for the sake of this example:

```hbs
<div {{css-transition "fade" enter=false leave=true}}>
  Will only transition on leave
</div>
```

### Timing Functions

The `transition-delay` CSS property can be defined (in ms) via `delay`, `enterDelay` and `leaveDelay` named args:

```hbs
<div {{css-transition "fade" delay=1000}}>
  Sets a custom delay on enter & leave transitions
</div>
```

```hbs
<div {{css-transition "fade" enterDelay=2000 leaveDelay=3000}}>
  Sets different custom delays for enter & leave transitions
</div>
```

The `transition-duration` CSS property can be defined (in ms) via `duration`, `enterDuration` and `leaveDuration` named args:

```hbs
<div {{css-transition "fade" duration=1000}}>
  Sets a custom delay on enter & leave transitions
</div>
```

```hbs
<div {{css-transition "fade" enterDuration=2000 leaveDuration=3000}}>
  Sets different custom durations for enter & leave transitions
</div>
```

### Activation

The `active` parameter allows transitions to be fired via a named arg, rather than lifecycle hooks. This allows use cases where:

- Transitions need to be run without the element being added & removed from the DOM (e.g. on-scroll implementations).
- The element may need to be rendered via Fastboot (e.g. SEO critical content).

```hbs
<div {{css-transition "fade" active=this.isActive}}>
  Content is always present in the DOM, with the transition firing via active named arg
</div>
```

### Events

Attach actions to `onEnter` and `onLeave` events using named arguments:

```hbs
<div {{css-transition "fade" onEnter=this.onEnter onLeave=this.onLeave}}>
  Do something when the transition has entered and when it has left!
</div>
```

Compatibility
------------------------------------------------------------------------------

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
