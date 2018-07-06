
var letao;
$(function () {
    // new一个实例化letao
    letao = new Letao();
    letao.getCartMessage();
    letao.getChecked();
    letao.deleteCart();
    letao.editCart();
    letao.selectSize();
    
  });
  
  // 声明一个Letao的构造函数
  var Letao = function () {
    
  }
  // 原型是对象
  Letao.prototype={
    // 获取购物车的信息
    getCartMessage:function(){
        $.ajax({
            url: '/cart/queryCart',
            success:function(data){
                // console.log(data);
                var html =template('getCartTmp',{'rows':data});
                // console.log(html);
                $('.main-ul').html(html);
                $('.input-check').prop('checked',true);
               
            }
        })
    },
    // 给删除按钮绑定事件
    deleteCart:function(){
        $('.main-ul').on('tap','.btn-delete',function(){
            // 获取当前商品的id
            var id =$(this).data('id');
            console.log(id);

            mui.confirm( '是否确定要删除?', '温馨提示', ['是','否'], function(e){
                // 回调函数里面就是e.index 当等于0的时候就是点击了左边的  等于1的话就是点击了右边的
                if(e.index ==0){
                    $.ajax({
                        url: '/cart/deleteCart',
                        data:{id:id},
                        success:function(data){
                            // console.log(data);
                            if(data.success){
                                // 成功的话就再次调用查询接口  刷新页面
                                letao.getCartMessage();
                            }else{
                                // 删除失败说明未登录
                                window.location.href='login.html';
                            }
                        }
                    })
                }else if(e.index ==1){
                    letao.getCartMessage();
                }
              });
            
        })
    },
    // 给编辑按钮绑定点击事件
    editCart:function(){
        
        $('.main-ul').on('tap','.btn-edit',function(){
            var　id= $(this).parent().data('id');
            // console.log(id);
            // 在编辑之前  先拿到尺码和数量
            var product={
                id:$(this).parent().parent().data('id'),
                size:$(this).parent().parent().data('size'),
                productSize:$(this).parent().parent().data('product-size'),
                num:$(this).parent().parent().data('num'),
                productNum:$(this).parent().parent().data('product-num'),
            }
            // console.log(product);
            var start =product.productSize.split('-')[0]-0;
            var end =product.productSize.split('-')[1]-0;
            var arr =[];
            for(var i=start;i<end;i++){
                arr.push(i);
            }
            product.productSize=arr;
            var html =template('editTmp',product);
            // 去掉模板里面的换行
            html=html.replace(/(\r)?\n/g,"");
            mui.confirm( html, '温馨提示', ['确定','取消'], function(e){
                // 回调函数里面就是e.index 当等于0的时候就是点击了左边的  等于1的话就是点击了右边的
               if(e.index==0){
                //    获取当前新的尺码和数量
                    var newSize =$('.btn-size.active').data('size');
                    var newNum =mui('.mui-numbox').numbox().getValue();
                    // console.log(newNum);
                    $.ajax({
                        url:'/cart/updateCart',
                        data:{
                            id:product.id,
                            size: newSize,
                            num: newNum
                        },
                        type:'post',
                        success:function(data){
                            // console.log(data);
                            if(data.success){
                                letao.getCartMessage();
                            }
                        }
                    })
               }
              });
              // 因为尺码是动态生成的 是不能点击 需要再次初始化
            mui('.mui-numbox').numbox();
        })
    },
    selectSize:function(){
        $('body').on('tap','.btn-size',function(){
            // console.log(this);
            $(this).addClass('active').siblings().removeClass('active');
        })
    },
    // 给所有的复选框添加点击事件
    getChecked:function(){
        getAllSum();
        $('.main-ul').on('change','.input-check',function(){
            // console.log(this);
            getAllSum();
            // letao.getCartMessage();
        });
        function getAllSum(){
            var sum =0;
            // 获取当前被选中的复选框
            var checkeds =$('input[type="checkbox"]:checked');
            // console.log(checkeds);
            checkeds.each(function(i,value){
                var price =$(value).data('price');
                var num =$(value).data('num');
                console.log(num);
                // console.log(price);
                var produceSum =price* num;
                sum +=produceSum;
            })
            $('.sum').html(sum.toFixed(2));
            
        }
    }
   
  }