var letao;
$(function(){
    letao =new Letao();
    letao.getCategoryFirst();
    letao.getAddCategory();
})

var Letao =function(){};
var page= 1;
var pageSize =5;
Letao.prototype={
        //获取用户的信息
       getCategoryFirst:function(){
           $.ajax({
               url:'/category/queryTopCategoryPaging',
               data:{
                   page: page,
                   pageSize: pageSize
               },
               success:function(data){
                //    console.log(data);
                    var html=template('getCategoryTmp',data);
                    $('tbody').html(html);
               }
           })
       },
    //    给添加分类绑定点击事件
    getAddCategory:function(){
        $('.right-main').on('click','.btn-add',function(){
            // console.log(this);
            var text =$('.category-input').val();
            // console.log(text);
            $.ajax({
                url:'/category/addTopCategory',
                data:{
                    categoryName:text
                },
                type:'post',
                success:function(data){
                    // console.log(data);
                    if(data.success){
                        // 成功的话 再次调用查询接口 刷新页面
                        letao.getCategoryFirst();
                    }
                }
            })
        })
    }
}