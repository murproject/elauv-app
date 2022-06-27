import Icon from '/src/components/Icon'

export default class Button {

  // constructor(
  //   name = this.constructor.name,
  //   text = name,
  //   type = 'push-button',
  //   action = undefined,
  //   icon = undefined,
  //   enabled = true,
  //   timeout = 0,
  // ) {

  constructor(config) {
    const name    = 'name'    in config ? config.name     : this.constructor.name;
    const text    = 'text'    in config ? config.text     : name;
    const type    = 'type'    in config ? config.type     : 'push-button';
    const action  = 'action'  in config ? config.action   : undefined;
    const icon    = 'icon'    in config ? config.icon     : undefined;
    const enabled = 'enabled' in config ? config.enabled  : true;
    const timeout = 'timeout' in config ? config.timeout  : 0;
    const classes = 'classes' in config ? config.classes  : undefined;
    const iconColor   = 'iconColor'   in config ? config.iconColor  : 'dark';
    const iconClasses = 'iconClasses' in config ? config.iconClasses  : '';

    this.el = document.createElement("div");
    this.el.classList.add(type);

    this.iconEl = document.createElement("span");
    this.iconEl.classList.add("button-icon")
    this.el.appendChild(this.iconEl);

    this.textEl = document.createElement("span");
    this.textEl.classList.add("caption")
    this.el.appendChild(this.textEl);

    this.el.id = type + "-" + name;

    this.setEnabled(enabled);
    this.setText(text)

    if (icon) {
      this.setIcon(icon, iconColor, iconClasses);
    }

    if (action) {
      this.setAction(action, timeout);
    }

    if (classes) {
      if (typeof(classes) === 'object') {
        classes.forEach(item => this.el.classList.add(item));
      } else {
        this.el.classList.add(classes)
      }
    }
  }

  setEnabled(isEnabled) {
    if (isEnabled) {
      this.el.classList.remove('disabled');
    } else {
      this.el.classList.add('disabled');
    }
  }

  setActive(isActive) {
    if (isActive) {
      this.el.classList.add('active');
    } else {
      this.el.classList.remove('active');
    }
  }

  setAction(action, timeout) {
    if (timeout > 0) {
      this.el.onclick = () => {
        window.setTimeout(action, timeout);
      };
    } else {
      this.el.onclick = action;
    }
  }

  setIcon(name, color='dark', modifier = 'big') {
    this.iconEl.innerHTML = Icon(name, modifier, color);
  }

  setText(text) {
    this.textEl.innerText = text;
  }

  inject(parent) {
    parent.appendChild(this.el);
  }

}