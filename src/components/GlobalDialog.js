import Element from './Element.js';

export default class GlobalDialog extends Element {
  static get defaultClasses() {
    return ['global-dialog'];
  }

  static get tag() {
    return 'global-dialog';
  }

  static get defaultAttrs() {
    return {
      title: '',
      text: '',
      buttons: [],
      closable: false,
      textInput: false,
    };
  }

  render() {
    this.applyClasses(this.attrs.classes);

    return /*html*/`
      <h1>${this.attrs.title}</h1>

      ${this.attrs.text ? /*html*/`
        <p>${this.attrs.text}</p>
      ` : ''}

      ${this.attrs.textInput ? /*html*/`
        <input id="text-input" maxlength="65" class="text-input" type="text" />
      ` : ''}

      <div class="vertical-filler"></div>
    `;
  }

  afterRender() {
    this.buttonsRow = document.createElement('div');
    this.buttonsRow.classList.add('row');
    this.attrs.buttons.forEach((button) => button.inject(this.buttonsRow));
    this.appendChild(this.buttonsRow);

    if (this.attrs.textInput) {
      this.textInputEl = this.querySelector('#text-input');
      this.textInputEl.onchange = (event) => this.attrs.textInput(this.textInputEl.value);
    }
  }
}

GlobalDialog.register();
