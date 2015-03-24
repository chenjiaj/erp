/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-18
 * Time: 上午8:50
 */
(function(){
    var user = {
        $tab:$('.tab'),
        $tabWrapper:$('.toggle-wrapper'),
        $table1:$("#table1"),
        $tableArea1:$("#table-area1"),
        $table2:$("#table2"),
        $tableArea2:$("#table-area2"),
        init:function(){
            this.renderPage();
            this.bindEvent();
            this.renderPageTwo();
        },
        renderPage:function(){//初始化第一页
            this.$table1.attr('data-load',true);
            this.waitTable = new Table({
                table:this.$table1 ,
                tableArea:this.$tableArea1 ,
                showIndex:true,
                pageSize:10,
                showIndexContent:'编号'
            });
            this.extendFun();
            this.waitTable.loadData('js/table.json','user');
        },
        extendFun:function(){
            $.extend(true,Table.prototype,{
                setTableData:function(){
                    var _this = this;
                    var option = this.option;
                    var res = option.res;
                    var curr = option.currPage;
                    option.table.find("tr:has(td)").remove();
                    for(var i = curr*option.pageSize; i<res.length && i<option.pageSize + curr*option.pageSize ; i++){
                        var trdata = res[i];
                        var tr = "<tr id='"+trdata.id+"'>";
                        tr += '<td>'+
                            '<input type="checkbox"/>'+
                            '</td>' +
                            '<td class="id">'+trdata.id+'</td>' +
                            '<td class="name">'+trdata.name+'</td>' +
                            '<td class="major">'+trdata.major+'</td>' +
                            '<td class="grade">'+trdata.grade+'</td>' +
                            '<td class="stuid">'+trdata.stuid+'</td>';

                        tr += '<td>'+
                            '<a href="#" class="agree"><span class="icon-ok-circled"></span>同意</a>'+
                            '<a href="#" class="refuse"><span class="icon-cancel-circled"></span>拒绝</a>'+
                            '</td></tr>';
                        option.table.append(tr);
                    }
                    _this.setPage();
                }
            });
        },
        bindEvent:function(){
            var _this = this;
            //切换tab页面
            this.$tab.on('click','li',function(){
                _this.toggleTab($(this));
            });

            //全选
            $('.tableStyle').on('change',':checkbox',function(){
                _this.checkAll($(this));
            });

            //第一页
            //同意
            this.$table1.on('click','.agree',function(e){
                e.preventDefault();
                _this.oprateItem($(this),'agree','1');
            });

            //拒绝
            this.$table1.on('click','.refuse',function(e){
                e.preventDefault();
                _this.oprateItem($(this),'refuse');
            });

            //批量同意
            this.$tableArea1.on('click','.agree-btn',function(e){
                e.preventDefault();
                _this.agreeItems('1');
            });

            //批量拒绝
            this.$tableArea1.on('click','.refuse-btn',function(e){
                e.preventDefault();
                _this.refuseItems();
            });



            //第二页
            this.$table2.on('click','.agree',function(e){
                e.preventDefault();
                _this.oprateItem($(this),'agree','2');
            });

            //删除
            this.$table2.on('click','.delete',function(e){
                e.preventDefault();
                _this.oprateItem($(this),'delete');
            });

            //批量同意
            this.$tableArea2.on('click','.agree-btn',function(e){
                e.preventDefault();
                _this.agreeItems('2');
            });

            //批量删除
            this.$tableArea2.on('click','.deletes',function(e){
                e.preventDefault();
                _this.deleteItems();
            });
        },
        checkAll:function(the){
            var table = the.closest('table');//找到当前点击的多选框的table
            if(the.hasClass('check-all')){
                if(the.prop('checked')){
                    table.find(':checkbox').prop('checked',true);
                }else{
                    table.find(':checkbox').prop('checked',false);
                }
            }else{
                if(the.prop('checked')){
                    var mark = 0;
                    table.find('td :checkbox').each(function(){
                        if(!$(this).prop('checked')){
                            mark = 1;
                        }
                    });
                    if(mark == 0){
                        table.find('.check-all').prop('checked',true);
                    }
                }else{
                    table.find('.check-all').prop('checked',false);
                }
            }
        },
        toggleTab:function(the){
            var index = the.index();
            if(index == 1){//判断第二页是否加载了，没有加载则加载
                if(!this.$table2.attr('data-load')){
                    this.renderPageTwo();
                }
            }
            this.$tab.find('li').removeClass('active');
            the.addClass('active');
            var w = $('.toggle-div').width();
            var mleft = -(w*index);
            this.$tabWrapper.animate({
                marginLeft:mleft
            },500);

        },
        getChecked:function(mark){
            var table;
            var arr = new Array();
            switch (mark){
                case '1':
                    table = this.$table1;
                    break;
                case '2':
                    table = this.$table2;
                    break;
            }
            var checked = table.find('td :checkbox:checked');
            if(checked.length>0){
                checked.each(function(index){
                    arr[index] = $(this).closest('tr').attr('id');
                });
                var data = {
                    id:arr
                }
                return data;
            }else{
                return false;
            }
        },
        oprateItem:function(the,oprate,mark){
            var _this = this;
            var tr = the.closest('tr');
            var id = tr.attr('id');
            var data = {
                id:[id]
            };
            switch (oprate){
                case 'agree':
                    this.agreeFun(data,mark);
                    break;
                case 'delete':
                    var name = tr.find('.name').text();
                    DIALOG.confirm('是否删除 用户ID为'+id+'、姓名为'+name+' 的用户注册？',function(){
                        _this.deleteFun(data);
                    });
                    break;
                case 'refuse':
                    var name = tr.find('.name').text();
                    DIALOG.confirm('是否拒绝 用户ID为'+id+'、姓名为'+name+' 的用户注册？',function(){
                        _this.refuseFun(data);
                    });
                    break;
            }

        },
        agreeItems:function(mark){//批量同意
            var _this = this;
            var data = this.getChecked(mark);
            if(!data){
                TIP('请选择要同意的用户！','warning',2000);
                return;
            }
            this.agreeFun(data,mark);
        },
        agreeFun:function(data,mark){
            var _this = this;
            switch (mark){
                case '1':
                    $.post('js/status.json',data,function(res){
                        if(res.code == 0){
                            TIP('操作成功！','success',2000);
                            _this.waitTable.loadData('js/table1.json','user');
                            _this.$table1.find('th :checkbox').prop('checked',false);
                        }else{
                            TIP('操作失败！','error',2000);
                        }
                    },'json');
                    break;
                case '2':
                    $.post('js/status.json',data,function(res){
                        if(res.code == 0){
                            TIP('操作成功！','success',2000);
                            _this.refuseTable.loadData('js/table1.json','user',function(){
                                _this.setTableTwo();
                                _this.$table2.find('th :checkbox').prop('checked',false);
                            });
                            _this.$table1.find('th :checkbox').prop('checked',false);
                        }else{
                            TIP('操作失败！','error',2000);
                        }
                    },'json');
                    break;
                default:
                    window.location.reload();
            }

        },
        refuseFun:function(data){
            var _this = this;
            $.post('js/status.json',data,function(res){
                if(res.code == 0){
                    TIP('操作成功！','success',2000);
                    _this.waitTable.loadData('js/table1.json','user');
                    _this.refuseTable.loadData('js/table1.json','user',function(){
                        _this.setTableTwo();
                    });
                    $('th :checkbox').prop('checked',false);
                }else{
                    TIP('操作失败！','error',2000);
                }
            },'json');
        },
        refuseItems:function(){//批量拒绝
            var _this = this;
            var arr = new Array();
            var checked = this.$table1.find('td :checkbox:checked');
            if(checked.length>0){
                DIALOG.confirm('是否拒绝所选用户注册？',function(){
                    checked.each(function(index){
                        arr[index] = $(this).closest('tr').attr('id');
                    });
                    var data = {
                        id:arr
                    }
                    _this.refuseFun(data);
                });
            }else{
                TIP('请选择要拒绝的用户！','warning',2000);
            }

        },
        deleteFun:function(data){
            var _this = this;
            $.post('js/status.json',data,function(res){
                if(res.code == 0){
                    TIP('删除成功！','success',2000);
                    _this.refuseTable.loadData('js/table1.json','user',function(){
                        _this.setTableTwo();
                        _this.$table2.find('th :checkbox').prop('checked',false);
                    });
                }else{
                    TIP('删除失败！','error',2000);
                }
            },'json');
        },
        deleteItems:function(){
            var _this = this;
            var arr = new Array();
            var checked = this.$table2.find('td :checkbox:checked');
            if(checked.length>0){
                DIALOG.confirm('是否删除所选用户注册？',function(){
                    checked.each(function(index){
                        arr[index] = $(this).closest('tr').attr('id');
                    });
                    var data = {
                        id:arr
                    }
                    _this.deleteFun(data);
                });
            }else{
                TIP('请选择要删除的用户！','warning',2000);
            }
        },
        renderPageTwo:function(){
            this.$table2.attr('data-load',true);
            this.refuseTable = new Table({
                table:this.$table2 ,
                tableArea:this.$tableArea2,
                showIndex:true,
                pageSize:10,
                showIndexContent:'编号',
                pageID:'ul2'
            });
            this.extendFun();
            var _this = this;
            this.refuseTable.loadData('js/table.json','user',function(){
                _this.setTableTwo();
            });
        },
        setTableTwo:function(){
            var refuseTable = this.refuseTable;
            var option = refuseTable.option;
            var res = option.res;
            var curr = option.currPage;
            option.table.find("tr:has(td)").remove();
            for(var i = curr*option.pageSize; i<res.length && i<option.pageSize + curr*option.pageSize ; i++){
                var trdata = res[i];
                var tr = "<tr id='"+trdata.id+"'>";
                tr += '<td>'+
                    '<input type="checkbox"/>'+
                    '</td>' +
                    '<td class="id">'+trdata.id+'</td>' +
                    '<td class="name">'+trdata.name+'</td>' +
                    '<td class="major">'+trdata.major+'</td>' +
                    '<td class="grade">'+trdata.grade+'</td>' +
                    '<td class="stuid">'+trdata.stuid+'</td>';

                tr += '<td>'+
                    '<a href="#" class="agree"><span class="icon-ok-circled"></span>同意</a>'+
                    '<a href="#" class="delete"><span class="icon-trash-empty"></span>删除</a>'+
                    '</td></tr>';
                option.table.append(tr);
            }
            refuseTable.setPage();
        }
    }
    user.init();



})();