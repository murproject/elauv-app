import Element from './Element.js';

export default class TextInput extends Element {
  static get defaultClasses() {
    return [];
  }

  static get tag() {
    return 'text-input';
  }

  init() {

  }

  static get defaultAttrs() {
    return {
      name: this.constructor.name,
      title: '',
      text: '',
      maxLen: 65,
      enabled: true,
      color: 'dark',
    };
  }

  setEnabled(isEnabled) {
    this.setClass('disabled', !isEnabled);
  }

  setText(text) {
    this.attrs.text = text;
    this.update();
  }

  getText() {
    return this.attrs.text;
  }

  onchange(event) {
    this.attrs.text = this.textInputEl.value;
  }

  render() {
    return /*html*/`
      <span class="input-caption">${this.attrs.title}</span>
      <input
        id="text-input"
        maxlength="${this.attrs.maxLen}"
        class="text-input"
        type="text"
        pattern="[\[\]\.\,\ 0-9]*"
        inputmode="numeric"
        value="${this.attrs.text}"
      />
    `;
  }

  afterRender() {
    this.textInputEl = this.querySelector('#text-input');
    this.textInputEl.onchange = (event) => {
      this.attrs.text = this.textInputEl.value;
    };
  }
}

TextInput.register();
