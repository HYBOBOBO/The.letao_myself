$(function () {

    var currentPage = 1;  // 当前页
    var pageSize = 5; // 每页多少条

    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (res) {
                console.log(res);
                var htmlStr = template("firstTpl", res);
                $("tbody").html(htmlStr)

                // 分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: res.page,
                    totalPages: Math.ceil(res.total / res.size),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render()
                    }
                })

            }
        })
    }

    // 点击添加按钮显示模块框
    $("#addBtn").on("click", function () {
        $("#addModal").modal("show")
    })

    // 添加表单验证
    $('#form').bootstrapValidator({

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 配置需要校验的字段列表
        fields: {
            categoryName: {
                // 配置校验规则
                validators: {
                    // 非空校验
                    notEmpty: {
                        message: '请输入一级分类名称'
                    }
                }
            }
        }
    });

    // 注册表单校验成功事件, 在事件中阻止默认的提交, 通过ajax提交即可
    $("#form").on("success.form.bv", function (e) {
        e.preventDefault();


        $.ajax({
            type: "post",
            url: "/category/addTopCategory",
            data: $("#form").serialize(),
            dataType: "json",
            success: function (res) {
                console.log(res);
                if(res.success){
                    $("#addModal").modal("hide");
                    currentPage = 1;
                    render()
                    $("#form").data("bootstrapValidator").resetForm(true)
                }

            }
        })
    })









})