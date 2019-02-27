// 左边分类
$(function(){
    // a标签上的ID
    var id ;


    $.ajax({
        type:"get",
        url:"/category/queryTopCategory",
        dataType:"json",
        success:function(res){
            console.log(res);
            var htmlStr = template("leftTpl",res)
            $(".ul_left").html(htmlStr)
            // 根据返回的数据渲染二级分类
            renderId( res.rows[0].id )

        }
    })
    // 点击切换分类
    $(".ul_left").on("click","a",function(){
        // 排他
        $(".ul_left").find("a").removeClass("current");
        // 添加类名
        $(this).addClass("current")
        // 获取当前a标签的data-id
        id = $(this).data("id")
        console.log(id);
        renderId(id)
    })
    
    // 右边分类,封装成函数
    function renderId(id){
        $.ajax({
            type:"get",
            url:"/category/querySecondCategory",
            data:{
                id:id
            },
            dataType:"json",
            success:function(res){
                // console.log(res);
                var htmlStr = template("rightTpl",res)
                $(".ul_right").html(htmlStr)
                
            }
        })
    }
    



})
