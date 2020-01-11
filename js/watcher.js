import Dep from './dep'
export default class Watcher {
  constructor (vm, key, node) {
    this.vm = vm
    this.key = key
    this.node = node
    this.depsId = {}
    this.value = this.get()
  }
  get () {
    Dep.target = this
    var val = this.vm.data[this.key] // 获取当前watcher对应的属性的值
    Dep.target = null
    return val
  }
  update () {
    let newVal = this.get()
    let oldVal = this.value
    if (newVal !== oldVal) {
      this.node.nodeValue = this.vm.data[this.key]
    }
  }
  addDep (dep) {
    if (!this.depsId.hasOwnProperty(dep.uid)) {
      this.depsId[dep.uid] = dep
      dep.addSub(this)
    }
  }
}
