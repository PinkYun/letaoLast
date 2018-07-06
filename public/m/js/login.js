

$(function () {
    // new一个实例化letao
    var letao =new Letao();
   letao.login();
  });
  
  // 声明一个Letao的构造函数
  var Letao = function () {
    
  }
  // 原型是对象
  Letao.prototype={
    //给登录绑定点击事件  获取数据验证用户名和密码
    login:function(){
        $('.btn-login').on('tap',function(){
            // 获取当前输入的密码以及用户名
            var username =$('.userName').val();
            var password =$('.password').val();
            // console.log(username);
            // console.log(password);
            // 判断一下 是否是否输入了用户名或者密码
            if(!username){
                mui.toast('请输入用户名',{ duration:'long', type:'div' });
                return;
            }
            if(!password){
                mui.toast('请输入密码',{ duration:'long', type:'div' });
                return;
            }
            // 调用接口验证用户名密码
            $.ajax({
                url:' /user/login',
                data:{username:username,password:password},
                type:'post',
                success:function(data){
                    // console.log(data);
                    // 判断一下是否登录成功 
                    if(data.success){
                        // 如果登录成功就提示用户
                        mui.toast('登陆成功',{ duration:'long', type:'div' });
                        window.location.href='user.html';
                    }else{
                        // 如果不成功的话就去注册页面
                        // window.location.href ='index.html';
                        mui.toast('用户不存在,请立马注册',{ duration:'long', type:'div' });
                    }
                }
            })
        })
    }
  }