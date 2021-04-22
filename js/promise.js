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
    const _this = this;
    // 异常穿透
    if(typeof onRejected !== 'function') {
        onRejected = reason => {
            throw reason;
        }
    }

    // 值传递
    if(typeof onResolved !== 'function') {
        onResolved = value => value;
    }

    return new Promise((resolve, reject) => {
        function callback(fn) {
            // try-catch处理抛出异常
            try {
                // 获取回调函数的执行结果
                let result = fn(_this.PromiseResult);
                if(result instanceof Promise) {
                    // 如果是Promise类型对象，则result的状态会影响最终的返回状态
                    result.then(r => {
                        resolve(r);
                    }, e => {
                        reject(e);
                    })
                } else {
                    // 结果的对象状态为【成功】
                    resolve(result)
                }
            } catch (error) {
                reject(error);
            }
        }   

        // 处理同步返回
        if(this.PromiseState === 'fulfilled') {
            callback(onResolved);
        }
    
        if(this.PromiseState === 'rejected') {
            callback(onRejected)
        }
    
        // 保存回调函数(处理异步)
        if(this.PromiseState === 'pending') {
            // 处理指定多个回调
            this.callbacks.push({
                onResolved: function() {
                    callback(onResolved);
                },
                onRejected: function() {
                    callback(onRejected);
                },
            });
        }
    })
}


Promise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected);
}


Promise.resolve = function(value) {
    return new Promise((resolve, reject) => {
        if(value instanceof Promise) {
            value.then(v => {
                resolve(v)
            }, e => {
                reject(e)
            })
        } else {
            resolve(value)
        }
    })
}

Promise.reject = function(value) {
    return new Promise((resolve, reject) => {
        reject(value);
    })
}


Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        let arr = [];

        for(let i = 0; i < promises.length; i++) {
            promises[i].then(v => {
                // 在这里知道当前promise是否成功
                count++;
                // 为了保证顺序
                arr[i] = v;
                if(count === promises.length) {
                    resolve(arr);
                }
            }, e => {
                reject(e);
            })
        }
    })
}


Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        for(let i = 0; i < promises.length; i++) {
            promises[i].then(v => {
                resolve(v);
            }, e => {
                reject(e);
            })
        }
    })
}