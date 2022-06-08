import Panel from './Panel'

export default class About extends Panel {

  begin() {
    this.html = /*html*/`
      <article class="">
        <h1>ElemetaryAUV App</h1>

        <img src="/media/splash.png" class="about-splash"/>

        <p>ООО "Центр робототехники", г. Владивосток</p>
      </article>
    `
  }

  init() {
    // this.panelButton.el.classList.remove('panel-button');
    this.panelButton.el.classList.add('logo');
    this.panelButton.el.innerHTML = `<img class="" src="/media/logo.png" />`;

    this.setIcon('bluetooth-connect');
  }
}