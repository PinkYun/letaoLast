var letao;
var productid;
$(function () {
  // new一个实例化letao
  letao = new Letao();
  letao.selectSize();
  letao.addCart();
  // 获取当前url上的id
  productid = getQueryString("product");
  // 调用轮播图的数据  
  letao.productSlide(productid);
});

// 声明一个Letao的构造函数
var Letao = function () {

}
// 原型是对象
Letao.prototype = {
  inintSlide: function () {
    var gallery = mui('.mui-slider');
    gallery.slider({
      interval: 2000 //自动轮播周期，若为0则不自动播放，默认为0；
    });
  },


  // 给尺码添加点击事件 然后高亮点击的尺码
  selectSize: function () {
    $('.introduce').on('tap', '.btn-size', function () {
      // console.log(this);
      $(this).addClass('active').siblings().removeClass('active');
    })
  },

  // 通过url的id获取数据 进行渲染页面
  productSlide: function (id) {
    // 通过ajax传递参获取数据
    $.ajax({
      url: '/product/queryProductDetail',
      // id是通过传参数进行获取
      data: {
        id: id
      },
      success: function (data) {
        // console.log(data);
        // 调用模板 生成商品详情页面
        //因为尺码是40-50 字符串的形式 使用split('-')切割
        var start = data.size.split('-')[0] - 0; //从40开始
        var end = data.size.split('-')[1] - 0; //结尾是50
        var arr = []; //声明一个空数组用来存放
        // 使用for循环遍历  
        for (var i = start; i < end; i++) {
          arr.push(i);
        }
        // 把遍历后的数组重新赋值给尺码
        data.size = arr;
        var contentHtml = template('dateilContentTmp', data);
        // console.log(contentHtml);
        $('.introduce').html(contentHtml);
        // 因为尺码是动态生成的 是不能点击 需要再次初始化
        mui('.mui-numbox').numbox();

        // 调用轮播图模板
        var result = template('dateilSildeTmp', data);
        // console.log(result);
        $('.mui-slider').html(result);
        // 这是时候等轮播图渲染完毕后 在开始初始化  通过Letao对象初始化轮播图
        letao.inintSlide();
      }
    })
  },
  // 点击立即购买或者是加入购物车
  addCart: function () {
    // 给添加购物车绑定事件
    $('.btn-cart').on('tap', function () {

      // console.log(this);
      // 获取当前尺码 btn-size 并且是有active类名的
      var size = $('.btn-size.active').data('size');
      // console.log(size);
      //判断当前是否选择了尺码
      if (!size) {
        // toast第一个参数就是提示的内容 第二参数是一个对象duration提示时间 type类型div 
        mui.toast('请选择尺码', {
          duration: 'short',
          type: 'div'
        });
        return;
      }
      //获取当前的购买的数量
      var num = mui('.mui-numbox').numbox().getValue()
      // console.log(num);
      if (!num) {
        // toast第一个参数就是提示的内容 第二参数是一个对象duration提示时间 type类型div 
        mui.toast('请选择购买的数量', {
          duration: 'short',
          type: 'div'
        });
        return;
      }
      // 发送请求 把商品添加到购物车
      $.ajax({
        url: '/cart/addCart',
        data: {
          productId: productid,
          size: size,
          num: num
        },
        type: 'post',
        success: function (data) {
          // console.log(data);
          if (data.success) {
            // 如果都选择了 如果也登录了  那就提示用户是否要去购物车
            mui.confirm('是否要去购物车看看?', '温馨提示', ['是', '否'], function (e) {
              // 回调函数里面就是e.index 当等于0的时候就是点击了左边的  等于1的话就是点击了右边的
              if (e.index == 0) {
                // console.log('正在进入购物车');
                window.location.href = 'cart.html';
              } else if (e.index == 1) {
                console.log('请继续选择尺码或者数量');
              }
            })
          }else{
            window.location.href='login.html';
          }
        }
      })



    });


  }
}

// 获取url栏上的所带的id的值
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  } else {
    return null;
  }
}