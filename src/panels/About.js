import Panel from './Panel'

export default class About extends Panel {

  begin() {
    this.html = /*html*/`
      <article class="">
        <h1>ElementaryAUV App</h1>

        <img src="/media/splash-anim.gif" class="about-splash"/>

        <p class="text-center">
          ООО "Центр робототехники"<br>
          г. Владивосток
        </p>
      </article>
    `
  }

  init() {
    // this.panelButton.el.classList.remove('panel-button');
    this.panelButton.el.classList.add('logo');
    this.panelButton.el.innerHTML = `<img src="/media/icon-small.png" />`;

    this.setIcon('bluetooth-connect');
  }
}