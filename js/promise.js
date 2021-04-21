function Promise(executor) {
    this.PromiseState = 'pending';
    this.PromiseResult = null;
    this.callbacks = [];
    const _this = this;

    function resolve(data) {
        if(_this.PromiseState !== 'pending') return;
        // 1.修改状态
        _this.PromiseState = 'fulfilled';
        // 2.设置对象结果值
        _this.PromiseResult = data;
        // 执行成功的回调函数
        _this.callbacks.forEach(item => {
            item.onResolved(data);
        });
    }

    function reject(data) {
        if(_this.PromiseState !== 'pending') return;
        // 1.修改状态
        _this.PromiseState = 'rejected';
        // 2.设置对象结果值
        _this.PromiseResult = data;
        // 执行失败的回调函数
        _this.callbacks.forEach(item => {
            item.onRejected(data);
        });
    }

    try {
        // 同步执行【执行器函数】
        executor(resolve, reject);   
    } catch (error) {
        reject(error);
    }
}

Promise.prototype.then = function(onResolved, onRejected) {
    if(this.PromiseState === 'fulfilled') {
        onResolved(this.PromiseResult);
    }

    if(this.PromiseState === 'rejected') {
        onRejected(this.PromiseResult);
    }

    // 保存回调函数(处理异步)
    if(this.PromiseState === 'pending') {
        // 处理指定多个回调
        this.callbacks.push({
            onResolved,
            onRejected,
        });
    }
}

