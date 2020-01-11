import Observer from './observer'
import Compliter from './compile'
export default class Vue {
  constructor (options) {
    this.data = options.data
    this.el = options.el
    // 数据劫持
    new Observer(this.data)
    // 模板编译
    new Compliter(this.el, this)
  }
}