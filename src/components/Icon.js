export default function Icon(name, modifier, color) {
    modifier = modifier ? modifier : '';
    color = color ? color : '';

    return /*html*/`
        <span
            class="icon ${modifier} ${color}"
            style="-webkit-mask: url(mdi/ui/${name}.svg) no-repeat center;"
        ></span>
    `;
}