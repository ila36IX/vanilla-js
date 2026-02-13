/**
 * https://github.com/facebook/react/blob/a4195750779dbd9a13e1615fbbd493bf2c5768ca/packages/react/src/ReactElement.js#L362
 * text: string: text content of the tag
 * options {}: is an object with optional keys:
 *  - attrs: key:value of attrubutes eg. {'href': '/users'}
 *  - on: event:handler eg. {'click': () => alert("clicked")}
 *  - childern: array of Node types, the same type that this function returns
 */
export function DOMBuilder(tag, text="", options={})
{
  console.log(tag);
  const el = document.createElement(tag);  
  if (!el)
    console.error("DOMBuilder cannot create tag:", tag);

  if (typeof text == 'string')
    el.textContent = text;
  else
    console.error("DOMBuilder text must be string. Got: ", text);

  if (options.attr) {
    for (const [key, value] of Object.entries(options.attr)) {
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
