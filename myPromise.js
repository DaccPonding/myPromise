class MyPromise{
  constructor(handle){
    this.status = 'pending'
    this.value = undefined
    try{
      handle(this.resolve.bind(this),this.reject.bind(this))
    }catch (e) {
      this.reject(e)
    }
  }
  resolve(data){
    this.status = 'resolved'
    this.value = data
  }
  reject(err){
    this.status = 'rejected'
    this.value = err
  }
  flag = true
  then(onResolved, onRejected){
    // 传递非函数参数 直接返回原promise
    if (this.status==='resolved'&&typeof onResolved !== 'function' ||
      this.status==='rejected'&& typeof onResolved !== 'function') return this

    if(this.status ==='rejected'){
      setTimeout(()=>{
        if (this.flag) throw `in MyPromise ${this.value}`
      },0)
    }
    return new MyPromise((resolve, reject)=>{
      let obs = new MutationObserver(()=>{
        // 原状态resolved 执行resolve方法 新promise为resolve状态
        if(this.status !== 'pending'){
          // 检查有没有处理rejected状态 没有则在本次loop的微任务结束后抛出异常
          let res = this.status==='resolved' ? onRejected && onResolved(this.value) : onRejected && !(this.flag=false) && onRejected(this.value)
          if (res instanceof MyPromise) return res
          resolve(res)
        }
      })
      obs.observe(document.body, {attributes:true})
      document.body.setAttribute('kkp',Math.random())
    })
  }
  catch(onRejected){
    return this.then(undefined, onRejected)
  }
  finally(callback){
    return this.then(callback,callback)
  }
}

// export default MyPromise
// module.exports = {
//   MyPromise
// }