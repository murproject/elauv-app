import Icon from '/src/components/Icon'

export default class Button {

  constructor(
    name = this.constructor.name,
    text = name,
    type = 'push-button',
    action = undefined,
    icon = undefined,
    enabled = true,
    timeout = 0
  ) {
    // this.begin();
    // this.inject();
    // this.init();

    this.el = document.createElement("div");
    this.el.classList.add(type);

    this.iconEl = document.createElement("span");
    this.iconEl.classList.add("button-icon")
    this.el.appendChild(this.iconEl);

    this.textEl = document.createElement("span");
    this.textEl.classList.add("button-text")
    this.el.appendChild(this.textEl);

    this.el.id = type + "-" + name;

    this.setEnabled(enabled);
    this.setText(text)

    if (icon) {
      this.setIcon(icon);
    }

    if (action) {
      this.setAction(action, timeout);
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