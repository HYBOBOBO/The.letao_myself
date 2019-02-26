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
    $(".dropdown-menu").on("click", "a", function () {
        var txt = $(this).text();
        $("#dropdownText").text(txt);
        var id = $(this).data("id")
        $('[name="categoryId"]').val(id);
        // 添加完ID,表单验证成功
        $("#form").data("bootstrapValidator").updateStatus("categoryId", "VALID")

    })

    //4. 完成文件上传初始化
    $("#fileupload").fileupload({
        dataType: "json",
        done: function (e, res) {
            console.log(res);
            var picUrl = res.result.picAddr
            console.log(picUrl);
            
            $("#addImg").attr("src",picUrl)
            $('[name="brandLogo"]').val(picUrl)

            // 添加成功后表单验证成功
            $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID")
        }
    })
})

// 表单验证
$('#form').bootstrapValidator({
    // 配置 excluded 排除项, 对隐藏域完成校验
    excluded: [],

    // 配置图标
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },

    // 配置校验字段列表
    fields: {
        // 选择一级分类
        categoryId: {
            validators: {
                notEmpty: {
                    message: '请选择一级分类'
                }
            }
        },
        // 输入二级分类名称
        brandName: {
            validators: {
                notEmpty: {
                    message: '请输入二级分类名称'
                }
            }
        },
        // 二级分类图片
        brandLogo: {
            validators: {
                notEmpty: {
                    message: '请选择图片'
                }
            }
        }
    }
});
// 表单验证成功事件
$("#form").on("success.form.bv",function(e){
    e.preventDefault;
    $.ajax({
        type:"post",
        url:"/category/addSecondCategory",
        data:$("#form").serialize(),
        dataType:"json",
        success:function(res){
            if(res.success){
                $("#addModal").madal("hide");
                currentPage = 1;
                render()
                $("#form").data("bootstrapValidator").resetForm(true)
                $("#dropdownText").text("请选择一级分类")
                $("#addImg").attr("src","./images/none.png")


            }
        }

    })
    
})