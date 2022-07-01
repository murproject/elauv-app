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
      closable: false,
    };
  }

  beforeRender() {
    // if (this.attrs.closable) {
    //   this.closeButton = document.createElement('div');
    //   this.appendChild(this.closeButton);
    //   this.closeButton.innerHTML = /*html*/`
    //     <div class="global-dialog-close">${Icon('close')}</div>
    //   `;
    //   this.closeButton.querySelector(".global-dialog-close").onclick = document.app.closeGlobalDialog;
    // }
  }

  render() {
    this.applyClasses(this.attrs.classes);

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
