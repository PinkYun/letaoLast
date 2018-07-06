var letao;
var text;
var page =1;
$(function () {
    // 声明letao new一个乐淘对象
    letao = new Letao();
    // 上拉加载 下拉刷新
    letao.downRefresh();
    // 搜索商品
    letao.searchProduct();
    // 调用排序栏方法
    letao.getSortProduct();
    //把获取到的url的值 赋值给text
    text =getQueryString("text");
    // 在进入商品列表就立马刷新一次
    letao.getProductList({
        proName: text,
    }, function (data) {
        // 把数据调用生成模板 
        var result = template('searchProductTmp', data);
        // console.log(result);
        // 把数据模板绑定到商品列表内容中
        $('.content .productlist').html(result);
    })
})


// 创建一个乐淘的构造函数
var Letao = function () {};
// 通过原型 是对象
Letao.prototype = {
    // 实现下拉刷新
    downRefresh: function () {
        mui.init({
            pullRefresh: {
                container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    height: 50, //可选,默认50.触发下拉刷新拖动距离,
                    auto: false, //可选,默认false.首次加载自动下拉刷新一次
                    contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    callback: function () {
                        // 设置了一个定时器 让它在1.5秒后执行刷新完毕
                        setTimeout(function () {
                            // 在下拉刷新的时候把搜索内容再次渲染一次
                            letao.getProductList({
                                proName: text,
                            }, function (data) {
                                // console.log("下拉刷新完成");
                                // 再次调用模板引擎  重新刷新页面
                                // 把数据调用生成模板 
                                var result = template('searchProductTmp', data);
                                // console.log(result);
                                // 把数据模板绑定到商品列表内容中  
                                $('.content .productlist').html(result);
                                // 数据加载完毕之后  就停止刷新
                                mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh()
                                // 每次下拉刷新的时候 要重置上拉加载更多
                                mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
                                // 同时也要把页面重设为1
                                page= 1;
                            });
                        }, 1500);
                    }
                },
                container: ".mui-scroll-wrapper", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                up: {
                    height: 50, //可选,默认50.触发下拉刷新拖动距离,
                    auto: false, //可选,默认false.首次加载自动下拉刷新一次
                    contentdown: "上拉加载", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    contentover: "释放立即加载", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh: "在下给不了你更多了..", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    callback: function () {
                        // 设置了一个定时器 让它在1.5秒后执行刷新完毕
                        setTimeout(function () {
                            // 同理 在上拉加载中 也要去重新把搜索内容加载一次 
                            letao.getProductList({
                                proName:text,
                                // page 是当前的页码数 每次要先加加
                                page:++page,
                            },function(data){
                                // console.log("上拉加载完成");
                                // 把数据调用生成模板 
                                var result = template('searchProductTmp', data);
                                // console.log(result);
                                // 把数据模板追加到商品列表
                                $('.content .productlist').append(result);
                                // 当数据请求完毕之后 结束上拉加载
                                if(data.data.length>0){
                                    mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
                                }else{
                                    mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                                }
                            });
                        }, 1500);
                    }
                }
            }
        });
    },
    searchProduct: function () {
        $(".btn-search").on('tap', function () {
            text = $('.form-search').val();
            // console.log(text);
            // 调用获取商品列表的API搜索商品
            letao.getProductList({
                proName: text,
            }, function (data) {
                // 把数据调用生成模板 
                var result = template('searchProductTmp', data);
                // console.log(result);
                // 把数据模板绑定到商品列表内容中
                $('.content .productlist').html(result);
            })

        })
    },
    getProductList: function (obj, callback) {
        $.ajax({
            url: '/product/queryProduct',
            data: {
                page: obj.page || 1,
                pageSize: obj.pageSize || 2,
                proName: obj.proName,
                price:obj.price,
                num: obj.num
            },
            success: function (data) {
                // console.log(data);
                // 判断数据传递了就调用
                if (callback) {
                    // 数据渲染结束后就可以下拉刷新
                    callback(data);
                }

            }
        })
    },
    // 商品排序列表
    getSortProduct:function(){
        //1.给排序栏绑定点击事件
        $(".list-top").on("tap",'a',function(){
            // console.log(this);
            //2. 获取当前点击的a的data-sort-type的值 
            var sortType =$(this).data('sort-type');
            // console.log(sortType)
            //3.获取当前a的data-sort的排序的顺序
            var sort = $(this).data('sort');
            // console.log(sort);
            // 4.判断当前的sort是1还是2  如果是1的话就改为2 是2的话就改为1
            if(sort ==1){
                // 如果是1的话 表示当前是升序 点击后就sort=2
                sort=2;
            }else{
                // 如果是2的话 表示当前为降序 点击后就改为sort=1
                sort=1;
            }
            // 5.把当前改完排序的值 重新设置到a的data-sort属性
            // 注意一点: data属性是只能取值不能赋值  如果要赋值的话 使用attr来赋值
            $(this).attr("data-sort",sort);
            // 6.判断当前的排序类型
            if(sortType =="price"){
                // 说明当前是价格排序
                // 调用getProductList的方法重新渲染页面,
                letao.getProductList({
                    proName: text,
                    price: sort,
                }, function (data) {
                    // 把数据调用生成模板 
                    var result = template('searchProductTmp', data);
                    // console.log(result);
                    // 把数据模板绑定到商品列表内容中
                    $('.content .productlist').html(result);
                })
            }
            // 7.判断排序类型是否是num
            if(sortType =="num"){
                // 说明当前是销量排序
                 // 调用getProductList的方法重新渲染页面,
                 letao.getProductList({
                    proName: text,
                    price: sort,
                }, function (data) {
                    // 把数据调用生成模板 
                    var result = template('searchProductTmp', data);
                    // console.log(result);
                    // 把数据模板绑定到商品列表内容中
                    $('.content .productlist').html(result);
                })
            }
        })


    }
}
// 获取url栏上的所带的search的值
 function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if ( r != null ){
       return decodeURI(r[2]);
    }else{
       return null;
    } 
 }