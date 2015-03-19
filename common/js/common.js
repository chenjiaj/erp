(function(){
    var common = {
        $exit:$('.exit'),
        $refresh:$('.j_refresh'),
        $modifyPass:$('.j_modifypass'),
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
                window.location.reload();
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
            DIALOG.confirm('确定退出？',function(){
                console.log('true');
            },function(){
                console.log('false');
            });
        },
        modifyPass:function(){
            if(!this.dialog){
                this.createDialog();
            }
            this.dialog.open();
        },
        createDialog:function(){
            this.dialog = new DIALOG({
                title: '修改密码',
                content: '<div class="dialog-body">' +
                    '<form class="wrapper">' +
                        '<div class="input-div clear-fix">' +
                            '<label class="label-div"><span class="start">*</span>原密码</label>' +
                            '<div class="label-input">' +
                            '<input type="text" class="form-control" data-validation="required"' +
                            ' data-validation-error-msg="请输入原密码" name="type"/>' +
                            '</div>' +
                        '</div>'+
                        '<div class="input-div clear-fix">' +
                            '<label class="label-div"><span class="start">*</span>新密码</label>' +
                            '<div class="label-input">' +
                            '<input type="password" data-validation="strength" class="form-control" data-validation-strength="1"' +
                            'name="password"/>' +
                            '</div>' +
                        '</div>'+
                        '<div class="input-div clear-fix">' +
                            '<label class="label-div"><span class="start">*</span>确认新密码</label>' +
                            '<div class="label-input">' +
                            '<input type="password" data-validation-confirm="password" class="form-control"' +
                            'data-validation-error-msg="两次密码不一致" data-validation="confirmation"/>' +
                            '</div>' +
                        '</div>' +
                    '</form>'+
                    '</div>'+
                    '<div class="dialog-footer">' +
                    '<button type="button" class="btn">保存</button>' +
                    '<button type="button" class="btn">取消</button>' +
                    '</div>',
                beforeClose: null,
                closeBtn: true,
                className: '',
                cache: true, //是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
                width: '500px' //窗口宽度，默认为40%
            });
            $.validate();
        }

    }
    common.init();
})();

/*****************************************自定义组件************************************************/
//对话框
var DIALOG = null;
;(function(){
    /**
     * @Class Dialog
     * @Desc 对话框模块
     * 可以用j_dlg_close来标记关闭按钮
     * ui-dialog-bd代表容器主体，具有20px的margin
     * ui-dialog-btn代表btn的容器，具有20px的padding和灰色背景。这个容器里的所有.button类都有右边距15px
     * */
    function Dialog(options){
        this._options = $.extend(true, {
            title: '',
            content: '',
            beforeClose: null,
            closeBtn: true,
            className: '',
            cache: true, //是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
            width: '40%' //窗口宽度，默认为40%
        }, options);

        this._init();
    }

    $.extend(Dialog.prototype, {
        _init: function(){
            this._build();
            this._bindEvent();
        },
        /**
         * 创建对话框html
         * */
        _build: function(){
            var options = this._options;
            var style = 'width: ' + options.width;
            var html = '<div class="reveal-modal ui-dialog ' + options.className + '" style="' + style + '">' +
                (options.title ? '<div class="ui-dialog-tit yahei">' + options.title + '</div>' : '');
            if(options.closeBtn){
                html += '<a class="reveal-modal-close j_dlg_close">&#215;</a>' +
                    '</div>';
            }
            this.$root = $(html).appendTo(document.body);
            this.$root.append($(options.content || ''));
            this.mask = $('<div class="reveal-modal-bg"></div>').appendTo(document.body);
        },
        _bindEvent: function(){
            var _this = this;
            var options = this._options;
            this.$root.on('click', '.j_dlg_close', function(e){
                e.preventDefault();
                //beforeClose执行结果为false,说明关闭时间被阻止了
                if(options.beforeClose && options.beforeClose.apply(_this) === false){
                    return false;
                }
                _this.close();
                if(options.onclose){
                    options.onclose.apply(this);
                }
            }).on('click', '.j_dlg_ok', function(){

                });
        },
        /**
         * 打开对话框
         * */
        open: function(){
            this.$root.css({
                'margin-left': -(this.$root.width() / 2)
            });
            this.$root.animate({
                top:'100px'
            },500);
            this.mask.show();
        },
        /**
         * 关闭对话框
         * */
        close: function(){
            this.$root.animate({
                top:'-1000px'
            },500);
            if(this._options.cache === false){ //设置不缓存
                this.$root.remove();
            }
            this.mask.hide();
        },
        /**
         * 设置标题
         * */
        setTitle: function(title){
            this.$root.find('.ui-dialog-tit').html(title);
        },
        /**
         * 设置内容
         * */
        setContent: function(content){
            this.$root.find('.ui-dialog-bd').html(content);
        }
    });

    Dialog.confirm = function(message, ok, cancel){
        var content = '<div class="ui-dialog-bd">' + message + '</div>';
        content += '<div class="dialog-footer"><button class="btn j_ok" href="#">确定</button><button class="btn j_cancel" href="#">取消</button></div>';
        var confirmDialog = new DIALOG({
            className: 'ui-dialog-confirm',
            width: '450px',
            content: content,
            cache: false,
            closeBtn: false
        });
        confirmDialog.$root.on('click', '.btn', function(e){
            e.preventDefault();
            var $target = $(this);
            if($target.hasClass('j_ok')){
                ok && ok.call(this);
            }else{
                cancel && cancel.call(this);
            }
            confirmDialog.close();
        });
        confirmDialog.open();
    }

    DIALOG = Dialog;
})();

//tip
/**
 * Created with JetBrains PhpStorm.
 * Desc: tips提示
 * Author: limengjun
 * Date: 14-8-19
 * Time: 上午11:01
 */
var TIP = null;
(function(){
    function Tips(options){
        this.content = options.content;
        this.type = options.type;
        this.width = options.width;
        this._config = {
            iconFont: {
                'info': 'icon-info-circled',
                'error': 'icon-cancel-circled',
                'warning': 'icon-attention-circled',
                'success': 'icon-ok-circled'
            },
            className: {
                'info': 'info',
                'error': 'error',
                'warning': 'warning',
                'success': 'success'
            }
        };
    }
    Tips.prototype = {
        create: function(){
            var ctml=[];
            ctml = ['<div class="alert-box alert-box-pop '+ this._config.className[this.type] +'">'];
            ctml.push('<i class="' + this._config.iconFont[this.type] + '"></i>');
            ctml.push(this.content);
            ctml.push('</div>');

            var objHtml = $(ctml.join(''));
            objHtml.appendTo(document.body);
            return objHtml;
        },
        resetPosition: function(obj){
            var width = obj.width();
            var height = obj.height();
            var scroll = $(window).height() / 2;
            obj.css({
                'margin-left':-width/2-45/2,
                'top': -height/2+scroll+15,
                position: 'fixed',
                left: '50%'
            });
            obj.animate({
                top:-height/2+scroll
            },400);
        },
        hideClose: function(obj){
            obj.remove();
        }
    };
    //创建弹窗主体
    //外部可以扩展
    TIP = function(content, type, timeout){
        timeout = timeout || 2000;
        if(/^\s*$/.test(content) || !content) return false;
        var tip = new Tips({content:content,type:type || "success",timeout:timeout});
        tip.hideClose($('.tisp-'+type));
        var html = tip.create();
        tip.resetPosition(html);
        setTimeout(function(){
            tip.hideClose(html);
        }, timeout);
    };
})();
