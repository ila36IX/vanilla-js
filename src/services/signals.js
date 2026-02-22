var dependencies = null;

function $state() {
  const subs = new Set();
  let initState = {};

  const proxy = new Proxy(initState, {
    set(target, property, value) {
      target[property] = value;
      for (const sub of subs) {
        sub(target, property, value);
      }
      return true;
    }
  });

  function subscribe(subscriber) {
    subs.add(subscriber);
    return () => subs.delete(subscriber);
  }

  return {
    get: proxy,
    set(propery, value) {
      proxy[propery] = value;
    },
    subscribe,
  }
}



export function createSignal(initialValue = null) {
  let _value = initialValue;
  let subs = new Set();

  function notify() {
    for (let subscriber of subs.keys()) {
      subscriber(_value);
    }
  }

  function subscribe(subscriber) {
    subs.add(subscriber);
    return () => subs.delete(subscriber);
  }

  return {
    isSignal: true,

    get value() {
      if (dependencies) {
        dependencies.add(subscribe);
      }
      return _value;
    },

    set value(v) {
      if (typeof v == 'function') {
        _value = v(_value);
      } else {
        _value = v;
      }
      notify();
    },
    subscribe
  };
}

export function createDerived(fn) {
  let cached;
  const unSubs = new Set();
  if (dependencies)
    throw Error("[createDerived] can't use derived signal inside another");

  function subscribeDerived() {
    cached = fn();
  }

  dependencies = new Set();

  cached = fn();

  for (const sub of dependencies)
    unSubs.add(sub(subscribeDerived));

  dependencies = null;

  return {
    get value() {
      return cached;
    },
    delete() {
      for (const unSub of unSubs)
        unSub();
    }
  }
}
