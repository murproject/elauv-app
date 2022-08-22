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

        <!-- <div id="about-center"> -->

        <!--
        <h1>
          Приложение для работы с<br>
          ElementaryAUV.
        </h1>
        -->

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



        <img src="media/splash-anim.gif" class="about-splash"/>

        <p class="text-center">
          ООО "Центр робототехники"<br>
          г. Владивосток, 2022 г.
        </p>
        <!-- </div> -->

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
}
