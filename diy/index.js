const handler = {
  get(target, property, receiver) {
    console.log('get: ', property);
    track(target, property)
    return Reflect.get(target, property, receiver)
  },
  set(target, property, value, receiver) {
    console.log('set: ', property, value);
    Reflect.set(target, property, value, receiver)
    trigger(target, property);
  }
}

const track = (target, property) => {
  console.log('track');
  const effect = runningEffects[runningEffects.length - 1];
  // 记录当前执行的副作用函数与 target-proxy 和 property 的映射
  if(target2EffectMap[target]) {
    if(target2EffectMap[target][property]) {
      target2EffectMap[target][property].push(effect);
    } else {
      target2EffectMap[target][property] = [effect];
    }
  } else {
    target2EffectMap[target] = new WeakMap();
    target2EffectMap[target][property] = [effect];
  }
};

const trigger = (target, property) => {
  console.log('trigger');
  const effects = target2EffectMap?.[target]?.[property];
  effects && toRunEffectArr.push(...effects);
};

// 维持一个执行副作用的栈
const runningEffects = []

const createEffect = fn => {
  // 将传来的 fn 包裹在一个副作用函数中
  const effect = () => {
    runningEffects.push(effect)
    fn()
    runningEffects.pop()
  }
  effect._id = new Date().getTime();

  // 立即自动执行副作用
  effect()
}

const target2EffectMap = new WeakMap();
let toRunEffectArr = [];

// mock tick
const nextTick = () => {
  setInterval(() => {
    if(toRunEffectArr.length) {
      toRunEffectArr = _.uniqBy(toRunEffectArr, '_id');
      toRunEffectArr.forEach(effect => { effect() });
      toRunEffectArr = [];
    }
  }, 3000);
};

nextTick();

const dinner = {
  food: 'hamberger',
}
const proxy = new Proxy(dinner, handler);

createEffect(() => {
  console.log(proxy.food, proxy.food);
})

createEffect(() => {
  console.log(proxy.food);
})

proxy.food = 'apple';