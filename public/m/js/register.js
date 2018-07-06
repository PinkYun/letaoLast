
var letao;
$(function () {
    // new一个实例化letao
    letao =new Letao();
    letao.getCode();
    letao.getregister();
  });
  
  // 声明一个Letao的构造函数
  var Letao = function () {
    
  }
  var code ='';
  // 原型是对象
Letao.prototype={
    getCode:function(){
           // 给获取验证码绑定点击事件 获取验证码
           $('.get-vcode').on('tap',function(){
            $.ajax({
                url: '/user/vCode',
                success:function(data){
                    // console.log(data);
                   code= data.vCode;
                //    console.log(code);
                    // console.log(code);
                $('.code').val(code);
                }
            })
        })
    },
    // 给立即注册绑定点击事件
    getregister:function(){
        
        // 给立即注册绑定点击事件
        $('.btn-register').on('tap',function(){
            // 获取表单的内容
            var username =$('.username').val();
            if(!username){
                mui.toast('请输入用户名',{ duration:'long', type:'div' });
                return;
            }
            var mobile =$('.mobile').val();
            if(!mobile){
                mui.toast('请输入手机号',{ duration:'long', type:'div' });
                return;
            }
            var password1 =$('.password1').val();
            var password2 =$('.password2').val();
            if(!password1 || !password2 ){
                mui.toast('请输入密码和确认密码',{ duration:'long', type:'div' });
                return;
            }else if(password1 != password2){
                mui.toast('请重新输入,您的密码不匹配',{ duration:'long', type:'div' });
                return;
            }
            // console.log(code[0].value);//得到验证码
        //    var nowCode =$('.code').val();
        //    if(!nowCode){
        //     mui.toast('请输入验证码',{ duration:'long', type:'div' });
        //     return;
        //     }
            // if(nowCode !=code){
            //     mui.toast('验证码有误',{ duration:'long', type:'div' });
            //     // setTimeout(function(){
            //     //     alert(code);
            //     // },1000);
            //     return;
            // }
            $.ajax({
                url: '/user/register',
                data:{
                    'username':username,
                    'mobile': mobile,
                    'password':password1,
                    'vCode': code
                },
                type:'post',
                success:function(data){
                    // console.log(data);
                    if(data.success){
                        // 如果注册成功的话就去登录页面
                        mui.toast('恭喜您,注册成功',{ duration:'long', type:'div' });
                        window.location.href ='login.html';
                    }else{
                        // 如果进到这就说明注册不成功或者是用户存在
                        mui.toast(data.message,{ duration:'long', type:'div' });
                    }
                }
            })
           
        })
    }
  }