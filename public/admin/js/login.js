$(function(){
    var letao =new Letao();
    letao.checkLogin();
})

var Letao =function(){};

Letao.prototype={
    checkLogin:function(){
        $(".btn-login").click(function(event){
            event.preventDefault();
            var username= $('.username').val();
            if(!username){
                mui.toast('请输入用户名',{ duration:'long', type:'div' });
                return;
            }
            var password = $(".password").val();
            if(!password){
                mui.toast('请输入密码',{ duration:'long', type:'div' }) ;
                return;
            }
          
            $.ajax({
                url:'/employee/employeeLogin',
                data:{
                    username:username,
                    password:password
                },
                type:'post',
                success:function(data){
                    // console.log(data);
                    if(data.success==true){
                        // 说明成功了 就跳转去首页
                        mui.toast('登录成功',{ duration:'long', type:'div' }) ;
                        // 跳转去首页
                        window.location.href ='index.html';
                    }else if(data.error == 1000){
                        mui.toast('用户名不存在',{ duration:'long', type:'div' }) ;
                        
                    }else if(data.error==1001){
                        mui.toast('密码错误',{ duration:'long', type:'div' }) ;
                     
                    }
                }
            })
        })
    }


}