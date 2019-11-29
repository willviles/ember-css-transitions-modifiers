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
<div {{css-transition "example"}}>
  Watch me transition!
</div>
```

Define your transitions in CSS. The modifier will add `-enter`, `-enter-active`, `-leave` & `-leave-active` suffixes at the appropriate times on insertion and removal.

```css
.example-enter {
  opacity: 0.01;
}

.example-enter.example-enter-active {
  opacity: 1;
  transition: opacity .5s ease-in;
}
.example-leave {
  opacity: 1;
}

.example-leave.example-leave-active {
  opacity: 0.01;
  transition: opacity .5s ease-in;
}
```

Define as many animation classes as you want using a space delimited string:

```hbs
<div {{css-transition "fade move-up"}}>
  Watch me fade-in and move-up!
</div>
```

You can attach actions to `onEnter` and `onLeave` events using named arguments:

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
