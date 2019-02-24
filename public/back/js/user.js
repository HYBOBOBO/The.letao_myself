// 发送AJAX,渲染页面
$(function () {
    // 全局变量:当前页,页面信息条数
    var currentPage = 1;
    var pageSize = 5;
    //  当前用户的ID
    var currentID;
    // 当前用户的状态
    var isDelete;

    render()
    function render() {
        $.ajax({
            type: "get",
            url: "/user/queryUser",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
                var htmlStr = template("userTpl", res);
                $(".userTb").html(htmlStr)
    
                // 根据返回res渲染分页
                $("#paginator").bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    // 当前页数
                    currentPage: res.page,
                    // 总页数
                    totalPages: Math.ceil(res.total / res.size),
                    // 点击切换页面后可以切换到所选的那页数据
                    onPageClicked: function(a,b,c,page) {
                        currentPage = page;
                        render()
                    }
                })
    
    
            }
        })
    
    }

  // 2. 点击表格中的按钮, 显示模态框
  // 事件委托的作用:
  // 1. 给动态创建的元素绑定点击事件
  // 2. 批量绑定点击事件 (效率比较高的)
  // 思路: 使用事件委托绑定按钮点击事件
  $(".userTb").on("click",".btn",function(){

    $("#userModal").modal("show");

    // 获取用户的ID
    currentID = $(this).parent().data("id")
    // console.log(currentID);
    // 获取用户的状态并修改
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    
  })
  

  $("#confirmBtn").on("click",function(){
      console.log(123);
      
      $.ajax({
          type:"post",
          url:"/user/updateUser",
          data:{
              id:currentID,
              isDelete:isDelete
          },
          dataType:"json",
          success:function(res){
              console.log(res);
              if (res.success) {
                // 关闭模态框
                $('#userModal').modal('hide');
                // 重新调用 render 完成渲染
                render();
              }
          }
      })
  })
  




})