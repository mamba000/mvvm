import Dep from './dep'
export default class Observer {
  constructor (data) {
    this.data = data
    this.observe()
  }
  observe () {
    let self = this
    let data = this.data
    Object.keys(data).forEach((key) => {
      let val = data[key]
      let dep = new Dep()
      this.observeInner(data[key])
      Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get () {
          if (Dep.target) {
            dep.depend()
          } 
          return val
        },
        set (newVal) {
          if (val === newVal) {
            return
          }
          val = newVal
          self.observe(newVal)
          dep.notify()
        }
      })
    })
  }
  // 如果属性值为对象，继续劫持该值
  observeInner (val) {
    if (!val || typeof val !== 'object') {
      return
    }
    return new Observer(val)
  }
}