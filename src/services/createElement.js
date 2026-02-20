/**
 * Create and return a new element in the DOM of the given type.
 * See https://github.com/facebook/react/blob/a4195750779dbd9a13e1615fbbd493bf2c5768ca/packages/react/src/ReactElement.js#L362
 *
 * @param {string} type - tag of the element to be created
 * @param {string|number} text - text content of the type
 * @param {Object} porps - key:value of properties eg. {'href': '/users'}
 * @param {Object} events - event:handler eg. {'click': () => alert("clicked")}
 * @param {Array} childern - Nodes to be nested inside this node
 * @returns {Node} the created node
 */
export function createElement(type, text="", props={}, events={}, children=[])
{
  const el = document.createElement(type);  

  el.textContent = text;

  // set properties
  for (const [k, v] of Object.entries(props)) {
    el.setAttribute(k, v);
  }

  // set event listeners
  Object.entries(events).forEach((event, handler) => el.addEventListener(event, handler));

  // append children
  children.forEach(child =>el.appendChild(child));

  return (el);
}
