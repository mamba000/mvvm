import Watcher from './watcher'
const REG = /\{\{(.*)\}\}/

export default class Compiler {
  constructor (el, vm) {
    this.vm = vm
    this.$el = typeof el === 'object' ? el : document.querySelector(el)
    this.compiler(this.$el)
  }
  compiler (parentNode) {
    let frag = document.createDocumentFragment()
    let $el = parentNode
    let node = null
    while(node = $el.firstChild) {
      if (node.nodeType === 1) { // 元素节点
        // 获取元素的标签名
        let tagName = node.tagName
        // 编译含有v-model的input或者textarea
        Array.from(node.attributes).forEach((attr) => {
          if ((tagName === 'INPUT' || tagName === 'TEXTAREA') && attr.name === 'v-model') {
            let key = attr.value
            node.value = this.vm.data[key]
            node.removeAttribute(attr.name)
            // 将表达式或指令与watcher一一对应
            new Watcher(this.vm, key, node)

            node.addEventListener('input', (e) => {
              this.vm.data[key] = e.target.value
            }, false)
          }
        })
        if (node.childNodes.length) {
          this.compiler(node)
        }
      } else if (node.nodeType === 3)  { // 文本节点
        if (REG.test(node.nodeValue)) {
          let key = RegExp.$1.trim()
          this.parseKey(key)
          node.nodeValue = this.vm.data[key]
          // 将表达式或指令与watcher一一对应
          new Watcher(this.vm, key, node)
        }
      }
      frag.appendChild(node)
    }
    $el.appendChild(frag)
  }
  parseKey (key) {
    let res = key.split('.')
  }
}