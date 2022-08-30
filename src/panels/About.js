import App from '/src/App.js';
import Panel from './Panel';
import Icon from '/src/components/Icon';
import Button from '../components/Button';
import AppVersion from '/src/utils/AppVersion';
import Utils from '/src/utils/Utils';

export default class About extends Panel {
  begin() {
    this.name = 'О программе';

    this.html = /*html*/`
      <article class="">
        <div class="vertical-filler"></div>

        <h1>
          ElementaryAUV App<br>
          <span class="opacity-50 text-small">
            Версия ${AppVersion.version} / ${AppVersion.buildDate}
          </span>

            ${AppVersion.isDevBuild ? /*html*/`
            <div class="tag-warning">
              <span>DEV BUILD</span>
            </div>
            ` : ``}
        </h1>

        <img id="about-splash-logo" src="media/splash.png" class="about-splash"/>

        <p class="text-center">
          ${AppVersion.copyright}
        </p>

        <div class="vertical-filler"></div>

        <div id="about-buttons" class="row buttons-collapsed"></div>
      </article>
    `;
  }

  init() {
    this.panelButton.setAttribute('type', 'logo');
    const tag = !AppVersion.isDevBuild ? `` : /*html*/`
      <div class="tag-warning margin-top-zero">DEV</div>
    `;

    this.panelButton.setText(`<img src="media/icon-small.png" />${tag}`);

    this.makeButtons();

    this.q('#about-splash-logo').onclick = () => this.splashClick();
  }

  makeButtons() {
    this.headButtonsEl = this.q('#about-buttons');

    // new Button({
    //   name: 'licenses',
    //   text: 'Сторонние компоненты',
    //   action: () => {},
    //   icon: 'star-outline',
    //   iconClasses: 'small',
    //   // classes: 'button-vertical'
    // }).inject(this.headButtonsEl);

    // new Button({
    //   name: 'authors',
    //   text: 'Авторы',
    //   action: () => {},
    //   icon: 'account',
    //   iconClasses: 'small',
    //   // classes: 'button-vertical'
    // }).inject(this.headButtonsEl);

    new Button({
      name: 'settings',
      text: 'Настройки',
      action: () => App.panelSelect(App.panels.settings),
      icon: 'wrench',
      iconClasses: 'small',
      // classes: 'button-vertical'
    }).inject(this.headButtonsEl);
  }

  splashClick() {
    this.splashClicks += 1;
    if (this.splashClicks === 7) {
      this.q('#about-splash-logo').src = 'media/splash-anim.gif';
    } else if (this.splashClicks === 0) {
      this.q('#about-splash-logo').src = 'media/splash.png';
    }
  }

  onActiveChanged() {
    this.splashClicks = -1;
    this.splashClick();
  }
}
