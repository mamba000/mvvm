let id = 0
export default class Dep {
  constructor () {
    this.subs = []
    this.uid = id++
  }
  depend () {
    Dep.target.addDep(this)
  }
  addSub (watcher) {
    this.subs.push(watcher)
  }
  notify () {
    this.subs.forEach((sub) => {
      sub.update && sub.update()
    })
  }
}

Dep.prototype.target = null