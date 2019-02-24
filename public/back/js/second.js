$(function () {
    var currentPage = 1; // 当前页
    var pageSize = 5; // 每页条数

    render();

    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
                var htmlStr = template("secondTpl", res);
                $("tbody").html(htmlStr)

                // 分页
                $("#paginator").bootstrapPaginator({
                    // 版本号
                    bootstrapMajorVersion: 3,
                    // 当前页
                    currentPage: res.page,
                    // 总页数
                    totalPages: Math.ceil(res.total / res.size),
                    // 给页码添加点击事件
                    onPageClicked: function (a, b, c, page) {
                        // 更新当前页
                        currentPage = page;
                        // 并且重新渲染
                        render();
                    }
                })
            }
        })
    }

    // 点击添加按钮显示模态框
    $("#addBtn").on("click", function () {
        $("#addModal").modal("show")

        // 发送请求, 获取一级分类的全部数据, 将来用于渲染
        // 根据已有接口, 模拟获取全部数据的接口, page:1  pageSize:100
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function (res) {
                console.log(res);
                var htmlStr = template("dropdownTpl", res);
                $(".dropdown-menu").html(htmlStr)
            }
        })

    })

    // 点击li添加进btn文字区域
    $(".dropdown-menu").on("click","a",function(){
        var txt = $(this).text();
        $("#dropdownText").text(txt)
    })
})