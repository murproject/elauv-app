import Utils from "/src/utils/Utils";

export default class Element extends HTMLElement {
  constructor(attrs = undefined, action = undefined, actionTimeout = undefined) {
    super();

    this.attrs = Utils.fillDefaults(attrs, this.constructor.defaultAttrs);
    this.actionTimeout = 0;
    this.hasRendered = false;

    this.init();

    if (action) {
      this.attrs.action = action;
    }

    this.setAction(this.attrs.action, this.actionTimeout);
  }

  init() {
    return;
  }

  setClass(name, isActive = true) {
    if (isActive) {
      this.classList.add(name);
    } else {
      this.classList.remove(name);
    }
  }

  setAction(action, actionTimeout = undefined) {
    this.action = action;
    if (actionTimeout !== null && actionTimeout !== undefined) {
      this.actionTimeout = actionTimeout;
    }

    this.onclick = () => setTimeout(this.action, this.actionTimeout);
  }

  applyClasses() {
    // console.log("classes = " + this.constructor.defaultClasses);
    this.constructor.defaultClasses.forEach(item => {
      this.classList.add(item);
    });
  }

  update() {
    console.log("UPD");
    this.hasRendered = true;
    this.innerHTML = this.render();
  }

  render() {
    console.warn("Trying to render dummy element!");
    return `<!-- dummy element -->`;
  }

  static get defaultClasses() {
    return ['none'];
  }

  static get defaultAttrs() {
    return {
      active: false,
      enabled: true,
    };
  }

  static get observedAttributes() {
    // console.log("observed:")
    // console.log(this.defaultAttrs)
    return Object.keys(this.defaultAttrs);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`set ${name} = ${newValue}`);
    this.attrs[name] = newValue;
    this.update();
  }

  connectedCallback() {
    if (!this.hasRendered) {
      this.applyClasses();
      this.update();
    }
  }

  inject(parent) {
    parent.appendChild(this);
  }

  static get tag() {
    console.error("Trying to get tag of dummy element!");
    return 'dummy-element';
  }

  static register() {
    customElements.define(this.tag, this);
  }

  static create(attrs) {
    return this.constructor(attrs);
  }
}