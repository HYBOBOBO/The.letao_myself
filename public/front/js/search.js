$(function () {
    // 分析功能:
    // 功能1: 历史记录渲染功能
    // 功能2: 清空全部的历史记录
    // 功能3: 删除单个历史记录
    // 功能4: 添加单个历史记录

    render()
    // 功能1: 历史记录渲染功能
    // 思路:
    // (1) 获取本地历史
    // (2) 获取得到的是 jsonStr, 需要转成数组
    // (3) 渲染搜索历史列表  (模板引擎: template(模板id, 数据对象) )
    function getHistory() {
        var jsonStr = localStorage.getItem("search_list") || "[]";
        var arr = JSON.parse(jsonStr)
        return arr;
    }

    // 读取本地存储, 获取数组, 根据数组完成渲染
    function render() {
        // 获取arr,调用上面的方法
        var arr = getHistory();
        // console.log(arr);
        var htmlStr = template("search_list", { arr: arr });
        // console.log(htmlStr);
        $(".history").html(htmlStr);
    }

    // 功能2: 清空历史记录功能
    // 思路:
    // (1) 点击清空按钮 (事件委托绑定)
    // (2) 移除本地历史的数据 使用 removeItem
    // (3) 页面重新渲染
    $(".history").on("click", ".btn_empty", function () {
        mui.confirm("确认要清空记录嘛", "温馨提示", ["取消", "确认"], function (e) {
            if (e.index === 1) {
                localStorage.removeItem("search_list");
                render();
            }
        })

    })

    // 功能3: 删除单个历史记录
    // 思路:
    // (1) 给删除按钮添加点击事件 (事件委托)
    // (2) 从本地获取对应的数组
    // (3) 将该条数据 根据下标 从数组中删除
    // (4) 将已经修改后的数组, 存回本地
    // (5) 页面重新渲染
    $(".history").on("click", ".btn_delete", function () {
        var arr = getHistory();
        var id = $(this).data("id");
        arr.splice(id, 1);
        jsonStr = JSON.stringify(arr)
        localStorage.setItem("search_list", jsonStr);
        render()
    })





    // 功能4: 添加单个历史记录功能
    // 思路:
    // (1) 给搜索按钮, 添加点击事件
    // (2) 获取输入框的值, 往数组的最前面加 unshift
    // (3) 转成 jsonStr, 存到本地
    // (4) 重新渲染
    $(".search_btn").on("click", function () {
        var val = $(".text").val().trim()
        var arr = getHistory();
        if (val.length == 0) {
            mui.toast("请输入关键字");
            return
        }
        // 判断是否存在,存在的话删除那一项
        if (arr.indexOf(val) != -1) {
            var idx = arr.indexOf(val)
            arr.splice(idx, 1);
        }
        if (arr.length >= 10) {
            arr.pop();
        }
        arr.unshift(val)
        jsonStr = JSON.stringify(arr)
        localStorage.setItem("search_list", jsonStr);
        render()
        $(".text").val("")
    })


})