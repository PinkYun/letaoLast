var letao;
$(function(){
    letao =new Letao();
    letao.getCategorySecond();
    letao.getSelectCategory();
    letao.getCategory();
})

var Letao =function(){};
var page= 1;
var pageSize =5;
Letao.prototype={
    // 获取查询分类
    getCategorySecond:function(){
        $.ajax({
            url:'/category/querySecondCategoryPaging',
            data:{page:page,pageSize:pageSize},
            success:function(data){
                // console.log(data);
                var html =template('categorySecondTmp',data);
                $('tbody').html(html);
            }
        })
    },
    // 获取分类列表
    getSelectCategory:function(){
        $.ajax({
            url:'/category/queryTopCategoryPaging',
            data:{page:page,pageSize:100},
            success:function(data){
                // console.log(data);
                var html =template('categorySelectTmp',data);
                $('.category-select').html(html);
            }
        })
    },
    // 添加品牌
    getCategory:function(){
        // 给添加按钮绑定点击事件
        $('.right-main').on('click','.btn-category',function(){
            // 获取当前的品牌名称
            var brandName =$('.brandName').val();
            // 获取当前分类的id
            var categoryId =$('.category-select').val();
            // console.log(brandName+'---'+categoryId);
           // 获取图片地址  使用js截取的\的话 要写两个\\才可以  不然会报错
           var arr =$('.brandLogo').val().split('\\');
           // console.log(arr);这样把图片的地址变成数组形式  然后在数组获取
           // 最后一个就是图片的名字
           var brandLogo ='/mobile/images/'+arr[arr.length-1];
           // console.log(brandLogo);
           $('.brandLogo-img').attr('src',brandLogo);
            // 调用接口
            $.ajax({
                url:'/category/addSecondCategory',
                data:{
                    brandName:brandName,
                    categoryId:categoryId,
                    brandLogo:brandLogo,
                    hot:1
                },
                type:'post',
                success:function(data){
                    // console.log(data);
                    if(data.success){
                        // 成功的话再次调用查询接口 刷新页面
                        letao.getCategorySecond();
                        
                    }
                }
            })
        })
    }
}