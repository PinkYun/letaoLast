

$(function () {
    // new一个实例化letao
    var letao =new Letao();
   letao.getUserMessage();
   letao.loginOut();
  });
  
  // 声明一个Letao的构造函数
  var Letao = function () {
    
  }
  // 原型是对象
  Letao.prototype={
    // 获取用户信息
    getUserMessage:function(){
        // 调用接口
        $.ajax({
            url: '/user/queryUserMessage',
            success:function(data){
            // 判断一下是否已登录
                if(data.error){
                    // 说明未登录
                    window.location.href ='login.html';
                }else{
                      // console.log(data);//直接渲染页面
                    $('.username').html(data.username);
                    $('.mobile').html(data.mobile);
                }

            }
        })
    },
    // 给退出登录绑定事件
    loginOut:function(){
        $('.btn-outLogin').on('tap',function(){
            // console.log(this);
            $.ajax({
                url:'/user/logout',
                success:function(data){
                    // console.log(data);
                    if(data.success){
                        // 如果成功的话就提示用户
                        mui.toast('退出成功',{ duration:'long', type:'div' });
                    }else{
                        //如果推出失败的话就说明未登录
                        window.location.href='login.html';
                    }
                }
            })
        })
    }
  }