var letao;
$(function(){
    letao =new Letao();
    letao.getUserData();
    letao.changeStatus();
    letao.getPage();
})

var Letao =function(){};
var page= 1;
var pageSize =4;
Letao.prototype={
        //获取用户的信息
        getUserData:function(){
            $.ajax({
                url:'/user/queryUser',
                data:{
                    page:page,
                    pageSize: pageSize
                },
                success:function(data){
                    // console.log(data);
                    data.pageTotal=data.rows.length;
                    // 因为需要生成分页 把它存在一个数组中 然后遍历
                    var arr =[];    
                    for(var i=1;i<data.pageTotal;i++){
                        arr.push(i);
                    }
                    // pageCount是页码数 就用总条数/每页显示的条数 使用数组存起来
                    
                    data.pageCount=arr;
                    // console.log(data.paeCount)
                    var html1 =template('pagingTmp',data);
                    
                    $('.paging').html(html1);
                    var html=template('userTmp',data);
                    $('.user-table tbody').html(html);
                }
            })
        },
        // 给分页跳转绑定点击事件
        getPage:function(){
            // 给上一页绑定点击事件
            // $('.right-content').on('click','.preview',function(){
            //     // console.log(this);
            //     page =$(this).parent().data('page');
            //     // console.log(page);
            //     letao.getUserData();
            // });
            //  // 给下一页绑定点击事件
            //  $('.right-content').on('click','.next',function(){
            //     // console.log(this);
            //     page =$(this).parent().data('page');
            //     // console.log(page);    
            //     letao.getUserData();            
            // });
            //  // 给每一页绑定点击事件  跳转到当前页
            //  $('.right-content').on('click','.page',function(){
            //     // console.log(this);
               
            //     page =$(this).data('page');
            //     // console.log(page);
            //     letao.getUserData();                
               
            // });
            $('.right-content').on('click','a',function(){
                page =$(this).data('page');
                // console.log(page);    
                letao.getUserData();
            })
        },
        // 给表格中按钮添加点击事件  改变当前的状态
        changeStatus:function(){
            $('.user-tbody').on('click','button',function(){
                // console.log(this);
                // 获取当前点击的id  还isdelete的值  并判断
                var isdelete =$(this).parent().data('isdelete');
                if(isdelete ==1){
                    isdelete=0;
                }else{
                    isdelete =1;
                }
                var id =$(this).parent().data('id');
                $.ajax({
                    url:'/user/updateUser',
                    data:{
                        id: id,
                        isDelete:isdelete 
                    },
                    type:'post',
                    success:function(data){
                        // console.log(data);
                        if(data.success){
                            // 如果成功的话就提示用户
                            mui.toast('恭喜你成功了',{ duration:'long', type:'div' }) ;
                            letao.getUserData();
                        }
                    }
                })
            })
        }

}