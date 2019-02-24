// 测试进度条功能
// 开始
// NProgress.start();

// setTimeout(function() {
//   // 结束
//   NProgress.done();
// }, 2000);


// 在发送第一个ajax请求, 开启进度条
// 在全部的ajax回来, 关闭进度条

// ajax全局事件
// .ajaxComplete(fn);   每个ajax完成时, 都会调用fn回调函数   (完成: 不管成功还是失败)
// .ajaxSuccess(fn);    每个ajax只要成功了, 就会调用fn
// .ajaxError(fn);      每个ajax只要失败了, 就会调用fn
// .ajaxSend(fn);       每个ajax发送前, 都会调用fn

// .ajaxStart(fn);      在第一个ajax开始发送时, 调用fn
// .ajaxStop(fn);       在全部的ajax完成时, 调用fn  (不管成功还是失败)

$(document).ajaxStart(function () {
    NProgress.start()
});

$(document).ajaxStop(function () {

    setTimeout(function () {
        NProgress.done()
    }, 500)
})

// 公用的功能:
// 1. 左侧二级菜单的切换
// 2. 左侧整体菜单的切换
// 3. 公共的退出功能 

// 等待 dom 结构加载完成后, 才会执行
$(function(){
    // 分类二级栏
    $(".category").click(function(){
        $(this).next().stop().slideToggle();
    })

    // topbar左侧栏
    $(".icon_menu").click(function(){
        $(".side").toggleClass("hiding");
        $(".main").toggleClass("hiding");
        $(".topbar").toggleClass("hiding");
    })

    // 退出弹出模块框
    $(".icon_logout").click(function(){
        $("#logoutModal").modal("show")
    })
    //   点击模态框的退出按钮, 表示确认退出
    //   发送 ajax 请求, 让服务器端销毁用户的登陆状态
    $("#logoutBtn").click(function(){
        $.ajax({
            type:"get",
            url:"/employee/employeeLogout",
            data:{},
            dataType:"json",
            success:function(res){
                if(res.success){
                    location.href = "login.html"
                }                
            }
        })
        
    })




})
