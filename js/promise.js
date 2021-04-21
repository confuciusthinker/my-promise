function Promise(executor) {
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    const _this = this;

    function resolve(data) {
        // 1.修改状态
        _this.PromiseState = 'fulfilled';
        // 2.设置对象结果值
        _this.PromiseResult = data;
    }

    function reject(data) {
        // 1.修改状态
        _this.PromiseState = 'rejected';
        // 2.设置对象结果值
        _this.PromiseResult = data;
    }

    try {
        // 同步执行【执行器函数】
        executor(resolve, reject);   
    } catch (error) {
        reject(error);
    }
}

Promise.prototype.then = function(onResolved, onRejected) {

}
