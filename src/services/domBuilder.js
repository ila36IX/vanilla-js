/**
 *
 * text: string: text content of the tag
 * options {}: is an object with optional keys:
 *  - attrs: key:value of attrubutes eg. {'href': '/users'}
 *  - on: event:handler eg. {'click': () => alert("clicked")}
 *  - childern: array of Node types, the same type that this function returns
 */
export default function DOMBuilder(tag, text, options={})
{
  const el = document.createElement(tag);  

  if (typeof text == 'string')
    el.textContent = text;

  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      if (typeof value == 'string')
        el.setAttribute(key, value);
    }
  }

  if (options.on) {
    for (const [event, handler] of Object.entries(options.on)) {
      if (typeof handler == 'function')
        el.addEventListener(event, handler);
    }
  }

  if (Array.isArray(options.children)) {
    for (const child of options.children) {
      if (child instanceof Node)
        el.appendChild(child);
    }
  }
  return (el);
}
