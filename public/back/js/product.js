$(function () {
    var currentPage = 1;
    var pageSize = 5;

    // 存在所有返回的图片信息
    var picArr = []

    // 发送AJAX渲染页面
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/product/queryProductDetailList",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (res) {
                // console.log(res);
                var htmlStr = template("proTpl", res);
                $("tbody").html(htmlStr);
                // 分页
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: res.page,
                    totalPages: Math.ceil(res.total / res.size),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }

    //  点击添加商品,显示模态框
    $("#addBtn").on("click", function () {
        $("#addModal").modal("show")
        // 获取ul下li的数据,发送ajax
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (res) {
                // console.log(res);
                var htmlStr = template("dropdownTpl", res);
                $(".dropdown-menu").html(htmlStr)
            }
        })
    })

    // 点击li里面的a,添加入一级分类,创建隐藏域
    $(".dropdown-menu").on("click", "a", function () {
        var txt = $(this).text();
        $("#dropdownText").text(txt);
        var id = $(this).data("id");
        $('[name="brandId"]').val(id)
        // 成功添加name="brandId"的id值后表单验证成功
        $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID');
    })

    // 点击图片,进行文件上传
    $("#fileupload").fileupload({
        dataType: "json",
        done: function (e, res) {
            console.log(res);
            var picUrl = res.result.picAddr
            // console.log(picUrl);
            // 存入图片数组中
            picArr.unshift(res.result)
            // 加入图片区域
            $('#imgBox').prepend('<img style="height: 100px;" src="' + picUrl + '" alt="">');
            if (picArr.length > 3) {
                picArr.pop();
                $('#imgBox img:last-of-type').remove();
            }
            if (picArr.length === 3) {
                // 图片校验成功
                $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID');
            }
        }
    })

    // 效验CV大法
    $('#form').bootstrapValidator({
        // 配置 excluded 排除项, 对隐藏域完成校验
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 配置字段列表
        fields: {
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    // 1  10  111  1111
                    // 正则校验, 必须非零开头的数字
                    // \d  0-9 数字
                    // ?   表示 0 次 或 1 次
                    // +   表示 1 次 或 多次
                    // *   表示 0 次 或 多次
                    // {n} 表示 出现 n 次
                    // {n, m}  表示 出现 n ~ m 次
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非零开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    // 尺码格式, 必须是 xx-xx 格式,  xx 是两位的数字
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 xx-xx 格式,  xx 是两位数字, 例如: 32-40 '
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品现价'
                    }
                }
            },
            // 标记图片是否上传满三张的
            picStatus: {
                validators: {
                    notEmpty: {
                        message: '请上传三张图片'
                    }
                }
            }
        }
    });

    // 点击提交按钮,渲染页面
    $("#form").on("success.form.bv",function(e){
        e.preventDefault;//阻止默认提交
        // 发送ajax
        console.log($("#form").serialize());
//brandId=9&proName=%E5%A8%9C%E5%A8%9C&proDesc=%E8%80%81%E5%A9%86&num=2&size=34-50&oldPrice=999&price=999&picStatus=
        // 需要传picArr,拼接一下
        var dataStr = $("#form").serialize() + "&picArr=" + JSON.stringify(picArr)
        console.log(dataStr);
        
        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data:dataStr,
            dataType:"json",
            success:function(res){
                if(res.success){
                    $("#addModal").modal("hide");
                    currentPage = 1;
                    render();
                    $("#form").data("bootstrapValidator").resetForm(true);
                    $("#dropdownText").text("请选择一级分类");
                    $("#imgBox img").remove();
                    picArr = []
                }
            }
            
        })
    })





})