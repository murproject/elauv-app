export default function icon(name, modifier, color) { // TODO: color
    modifier = modifier ? modifier : '';
    color = color ? color : '';

    return /*html*/`
        <div
            class="icon ${modifier} ${color}"
            style="-webkit-mask: url(/mdi/ui/${name}.svg) no-repeat center;"
        ></div>
    `;
}