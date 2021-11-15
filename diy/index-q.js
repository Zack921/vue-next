// https://javascript.info/proxy#reflect

const dinner = {
  _meal: 'hamberger',
  get meal() {
    return this._meal;
  },
}

const handler = {
  get(target, property, receiver) {
    // console.log('get: target, property, receiver: ', target, property, receiver);
    // console.log('target === dinner: ', target === dinner);
    // console.log('receiver === proxy: ', receiver === proxy);
    // track(target, property)
    return Reflect.get(target, property, receiver)
  },
  set(target, property, value, receiver) {
    // console.log('set: target, property, value, receiver: ', target, property, value, receiver);
    // console.log('target === dinner: ', target === dinner);
    // console.log('receiver === proxy: ', receiver === proxy);
    // trigger(target, property)
    return Reflect.set(target, property, value, receiver)
  }
}

const track = () => {
  console.log('track');
};

const trigger = () => {
  console.log('trigger');
};

const proxy = new Proxy(dinner, handler);

let admin = {
  __proto__: proxy,
  _meal: "meat"
};

admin.x = 1;

console.log('proxy.meal: ', proxy.meal);
proxy.drink = 'soda';
console.log('proxy.drink: ', proxy.drink);
console.log('proxy: ', proxy);
console.log('dinner: ', dinner); // 为啥dinner的值也变了?
console.log('proxy === dinner: ', proxy === dinner);

console.log('admin.meal: ', admin);

const t = {a: 1};
const r = {a: 2};
console.log(Reflect.get(t, 'a', r)); // 1
Reflect.set(t, 'a', 3, r);
console.log('t: ', t); // 1
console.log('r: ', r); // 3