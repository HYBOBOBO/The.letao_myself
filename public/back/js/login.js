/*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */
$(function () {
    $("#form").bootstrapValidator({

        //设置小图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //设置校验规则
        fields: {

            username: {
                validators: {
                    notEmpty: {
                        message: "用户名不能为空"
                    },
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: "用户名不能小于2位数,大于6位数"
                    },
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "密码不能小于6位数,大于12位数"
                    },
                    callback: {
                        message: "密码不正确"
                    }
                }
            }

        }
    })



    /* 
    2. 使用 submit 按钮, 会进行表单提交, 此时表单校验插件会立刻进行校验
       (1) 校验成功, 此时会默认提交, 发生页面跳转,  注册表单校验成功事件, 在事件中阻止默认的跳转提交, 通过ajax提交
       (2) 校验失败, 自动拦截提交

      注册表单校验成功事件, 在事件中阻止默认的提交, 通过ajax提交
  */
    $("#form").on("success.form.bv", function (e) {
        // 阻止默认submit按钮跳转
        e.preventDefault();
        // console.log(123);

        $.ajax({
            type: "post",
            // 链接端口域名
            url: '/employee/employeeLogin',
            data: $("#form").serialize(),
            dataType: "json",
            success: function (res) {
                console.log(res);
                // console.log($("#form").serialize());
                if (res.error == 1000) {
                    // bootstrapvalidator中的updateStatus的方法(field, status, validator)
                    // 参数一:更新字段的名称
                    // 参数二:更新的状态 VALID成功,INVALID失败
                    // 参数三:配置校验规则, 将来会用配置的规则的 message 进行提示
                    $("#form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback");


                } else if (res.error == 1001) {
                    $("#form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback")


                } else if (res.success == true ) {
                    console.log(111);
                    
                    location.href = "index.html"
                }
            }
        })

    })

    /* 
    3. 表单重置功能
      reset 按钮, 本身就可以重置内容, 所以此时只需要重置状态即可
      resetForm(false);  只重置状态
      resetForm(true);   重置内容和状态
    */
   $('[type = "reset"]').click(function(){
       console.log(123);
       
       $("#form").data("bootstrapValidator").resetForm(false);
   })


})


