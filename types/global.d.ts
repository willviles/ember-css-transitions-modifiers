// Types for compiled templates
declare module 'ember-css-transitions-modifiers/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module 'ember-modifier' {
  export default class ClassBasedModifier<Args> {
    constructor (owner: unknown, args: Args)

    element: Element
    args: Args

    didReceiveArguments (): any
    didUpdateArguments (): any
    didInstall (): any
    willRemove (): any
    willDestroy (): any

    isDestroying: boolean
    isDestroyed: boolean
  }
}
