(function(){
    var common = {
        $exit:$('.exit'),
        $refresh:$('.j_refresh'),
        $modifyPass:$('j_modifypass'),
        $siderbarBg:$('.siderbar-ul'),
        $li:$('.has-more'),
        init:function(){
            this.bindEvent();
            this.initPage();
        },
        initPage:function(){//静态初始化页面
            this.$siderbarBg.height(screen.height);
        },
        bindEvent:function(){
            var _this = this;
            //刷新
            this.$refresh.click(function(){

            });

            //退出
            this.$exit.click(function(){
                _this.exitSystem();
            });

            //修改密码
            this.$modifyPass.click(function(){
                _this.modifyPass();
            });

            //siderBar
            this.$li.find('>a').click(function(){
                var speed = 500;
                $(this).closest('li').find('ul').stop().slideToggle(speed);
                //多个
                /*var the = $(this).closest('li');
                if(the.find('ul').hasClass('hide')){
                    _this.$li.find('ul').slideUp(speed,function(){
                        $(this).addClass('hide');
                    });
                    the.find('ul').slideDown(speed,function(){
                        $(this).removeClass('hide');
                    });
                }else{
                    the.find('ul').slideUp(speed,function(){
                        $(this).addClass('hide');
                    });
                }*/

            });
        },
        exitSystem:function(){

        },
        modifyPass:function(){

        }
    }
    common.init();
})();