import Element from './Element.js'
import Icon from '/src/components/Icon'
import Utils from "/src/utils/Utils";

export default class GlobalDialog extends Element {
  static get defaultClasses() {
    return ['global-dialog'];
  }

  static get tag() {
    return 'global-dialog'
  }

  static get defaultAttrs() {
    return {
      title: '',
      text: '',
      buttons: [],
    };
  }

  render() {
    return /*html*/`
      <h1>${this.attrs.title}</h1>
      <p>${this.attrs.text}</p>
      <div class="vertical-filler"></div>
    `
  }

  afterRender() {
    this.buttonsRow = document.createElement("div");
    this.buttonsRow.classList.add("row");
    this.attrs.buttons.forEach(button => button.inject(this.buttonsRow));
    this.appendChild(this.buttonsRow);
  }

}

GlobalDialog.register();
