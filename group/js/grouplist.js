/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-18
 * Time: 上午9:57
 */
(function(){
    var grouplist = {
        $table:$("#table"),
        init:function(){
            this.renderPage();
            this.bindEvent();
        },
        bindEvent:function(){
            var _this = this;
            this.$table.on('click','.j_toggle',function(e){//是否显示游戏组内的小组
                e.preventDefault();
                _this.toggleSub($(this))
            });

            this.$table.on('click','.delete',function(e){//删除游戏组
                e.preventDefault();
                _this.deleteItems($(this));
            });

            this.$table.on('click','.add-history',function(e){//添加历史记录
                e.preventDefault();
                _this.addHistory($(this));
            });

            //结束经营
            this.$table.on('click','.gameover',function(e){
                e.preventDefault();
                var the = $(this);
                DIALOG.confirm("是否结束该组经营？",function(){
                    var userUnique = the.closest('tr').attr('data-mark');
                    var groupName = the.closest('.sub-tr').attr('data-name');
                    var data = {
                        userUnique:userUnique,
                        groupName:groupName
                    }
                    $.post('/GameGroupManagerAction!endPlayGame.action',data,function(res){//
                        if(res.code == 0){
                            TIP('经营结束成功！','success',2000);
                            the.parent().html('已结束');
                        }else{
                            TIP('经营结束失败！','error',2000);
                        }
                    },'json');
                });
            });


            //结束订单选择
            this.$table.on('click','.chooseorder-end',function(e){
                e.preventDefault();
                var the = $(this);
                var userUnique = the.closest('tr').attr('data-mark');
                var data = {
                    userUnique:userUnique
                }
                DIALOG.confirm('是否结束该组订单选择',function(){
                    $.post('js/status.json',data,function(res){ //
                        if(res.code == 0){
                            TIP('结束订单选择成功！','success',2000);
                            the.parent().html('已完成订单选择');
                        }else{
                            TIP('结束订单选择失败！','error',2000);
                        }
                    },'json');
                });
            });

            //结束投广告
            this.$table.on('click','.adver-end',function(e){
                e.preventDefault();
                var the = $(this);
                var userUnique = the.closest('tr').attr('data-mark');
                var data = {
                    userUnique:userUnique
                }
                DIALOG.confirm('是否结束该组广告投放',function(){
                    $.post('/GameGroupManagerAction!endAdvertising.action',data,function(res){//
                        if(res.code == 0){
                            TIP('结束广告投放成功！','success',2000);
                            the.parent().html('广告已结束');
                        }else{
                            TIP('结束广告投放失败！','error',2000);
                        }
                    },'json');
                });
            });

            //推进下一周期
            this.$table.on('click','.next-period',function(e){
                e.preventDefault();
                var the = $(this);
                var userUnique = the.closest('tr').attr('data-mark');
                var data = {
                    userUnique:userUnique
                }
                DIALOG.confirm('是否推进下一周期',function(){
                    $.post('/GameGroupManagerAction!ForwarPeriod.action',data,function(res){ //
                        if(res.code == 0){
                            TIP('推进下一周期成功！','success',2000);
                            var tr = the.parent();
                            var current = parseInt(tr.attr('data-curyear')) + 1;
                            var per = parseInt(tr.attr('data-peryear'));
                            var year = parseInt(tr.attr('data-year'));
                            var p = current % per ;
                            var time = '';
                            if(p>0){
                                time += '当前：第'+ (parseInt(current/per)+1) +"年" + " 第"+ p +"期 ";
                            }else{
                                time += '当前：第'+ parseInt(current/per) +"年" + " 第"+ per +"期 ";
                            }
                            if(current < per*year){
                                time += '<a href="#" class="next-period">推进下一周期</a>';
                            }
                            tr.attr('data-curyear',current);
                            tr.html(time);
                        }else{
                            TIP('推进下一周期失败！','error',2000);
                        }
                    },'json');
                });
            });
        },
        renderPage:function(){
            this.table = new Table({
                table: this.$table,
                tableArea: $("#table-area"),
                showIndex:true,
                pageSize:10,
                showIndexContent:'编号'
            });
            this.extendFun();
            //this.table.loadData('/GameGroupManagerAction!showGameGroups.action','GameGroups');
            this.table.loadData('js/table.json','group');
        },
        extendFun:function(){
            $.extend(true,Table.prototype,{
                setTableData:function(){//设置setTableData函数
                    var _this = this;
                    var option = this.option;
                    var res = option.res;
                    var curr = option.currPage;
                    option.table.find("tr:has(td)").remove();
                    for(var i = curr*option.pageSize; i<res.length && i<option.pageSize + curr*option.pageSize ; i++){
                        var trdata = res[i];
                        var tr1 = "<tr id='"+trdata.groupname+"' data-name = '"+trdata.groupname+"'>";
                        var tr2 = $("<tr class='sub-tr hide'  data-name = '"+trdata.groupname+"'><td colspan="+$('#table>tbody>tr>th').length+">" +
                            "<span class='icon-spin5 animate-spin'></span>加载中...</td></tr>");
                        tr1 +='<td>'+
                            '<span class="icon-plus-squared j_toggle"></span>'+
                            '</td>';
                        tr1 += '<td class="groupname">'+trdata.groupname+'</td>' +
                            '<td>'+trdata.leader+'</td>' +
                            '<td>'+trdata.num+'</td>' +
                            '<td>'+trdata.year+'</td>' +
                            '<td>'+trdata.quarter+'</td>' +
                            '<td>'+trdata.now+'</td>'+
                            '<td>'+
                            '<a href="#" class="delete"><span class="icon-trash-empty"></span>删除</a>'+
                            '<a href="#" class="add-history"><span class="icon-history"></span>加入历史记录</a>'+
                            '</td></tr>';
                        option.table.append(tr1);
                        option.table.append(tr2);

                    }
                    _this.setPage();
                }
            });
        },
        addHistory:function(the){
            var _this = this;
            var tr = the.closest('tr');
            var groupName = tr.attr('data-name');
            var groupname = tr.find('.groupname').text();
            var data = {
                groupName:groupName
            };
            DIALOG.confirm('确定将游戏组'+groupname+"加入历史记录！",function(){
                $.post('js/status.json',data,function(res){// /GameGroupManagerAction!deteleGameGroup.action
                    if(res.code == 0){
                        TIP('添加成功！','success',2000);
                        _this.table.loadData('js/table.json','group');// /GameGroupManagerAction!showGameGroups.action
                    }else{
                        TIP('添加失败！(可能该游戏组中还存在正在进行游戏的小组)','error',2000);
                    }
                },'json');
            });
        },
        toggleSub:function(the){
            var tr = the.closest('tr').next('tr');
            var groupName = the.closest('tr').attr('data-name');
            if(tr.hasClass('sub-tr')){
                if(tr.hasClass('hide')){
                    $.post('js/table1.json',{groupName:groupName},function(res){// /GameGroupManagerAction!findGameGroupMemberStatusByGroupName.action
                        if(res.code == 0){
                            var items = res.GameGroupMemberStatuss;
                            if(items){
                                var table ='<table>' +
                                    '<tr>' +
                                    '<th>标识符</th>' +
                                    '<th>时间</th>' +
                                    '<th>游戏状态</th>' +
                                    '<th>广告状态</th>' +
                                    '<th>订单状态</th>' +
                                    '</tr>';

                                $(items).each(function(index){
                                    var tr = items[index];
                                        if(tr.status !=0 && tr.status != 2){
                                            var orderText = tr.finishOrderFlag  == 0 ? "<a href='#' class='chooseorder-end'>" +
                                                "结束订单选择</a>" : "已完成订单选择";
                                            var advertisText = tr.finishAdFlag == 0 ?"<a href='#' class='adver-end'>" +
                                                "结束投放广告</a> ":"广告已投放";
                                        }else{
                                            var orderText = tr.finishOrderFlag  == 0 ? "订单选择中" : "已完成订单选择";
                                            var advertisText = tr.finishAdFlag == 0 ? "广告投放中":"广告已投放";
                                        }

                                    var status = '';
                                    if(tr.status == 0){
                                        status = "已破产";
                                    }else if(tr.status == 1){
                                        status = "进行中 <a href='#' class='gameover'>结束经营</a>";
                                    }else{
                                        status = "已结束";
                                    }
                                    var time = '';
                                    var p = tr.currentPeriod % tr.periodsOfOneYear ;
                                        if(p>0){
                                            time +="当前：第"+ (parseInt((tr.currentPeriod) / (tr.periodsOfOneYear))+1) +"年";
                                            time += "第"+ p +"期 ";
                                        }else{
                                            time +="当前：第"+ parseInt((tr.currentPeriod) / (tr.periodsOfOneYear)) +"年";
                                            time += "第"+tr.periodsOfOneYear +"期";
                                        }
                                    if(tr.currentPeriod < tr.periodsOfOneYear*tr.year && tr.status !=0 && tr.status != 2){
                                        time += '<a href="#" class="next-period">推进下一周期</a>';
                                    }
                                    var opt;
                                        table += '<tr data-mark="'+tr.userUnique+'">' +
                                        '<td>'+tr.userUnique+'</td>' +
                                        '<td data-curyear="'+tr.currentPeriod+'" data-year="'+tr.year+'" data-peryear="'+tr.periodsOfOneYear+'">' +
                                             time+'</td>' +
                                        '<td>'+status+'</td>' +
                                        '<td>'+advertisText+'</td>' +
                                        '<td>'+orderText+'</td>' +
                                        '</tr>';
                                });
                                table += '</table>';
                                tr.find('>td').html(table);

                            }
                        }
                    },'json');
                    tr.fadeIn(300,function(){
                        tr.removeClass('hide');
                    })
                    the.removeClass('icon-plus-squared').addClass('icon-minus-squared');
                }else{
                    tr.fadeOut(300,function(){
                        tr.addClass('hide');
                        tr.find('>td').html("<span class='icon-spin5 animate-spin'></span>加载中...");
                    });
                    the.removeClass('icon-minus-squared').addClass('icon-plus-squared');
                }
            }
        },
        deleteItems:function(the){//删除
            var _this = this;
            var tr = the.closest('tr');
            var groupName = tr.attr('data-name');
            var groupname = tr.find('.groupname').text();
            var data = {
                groupName:groupName
            };
            DIALOG.confirm('确定删除游戏组'+groupname+"删除后将结束游戏！",function(){
                $.post('js/status.josn',data,function(res){// /GameGroupManagerAction!deteleGameGroup.action
                    if(res.code == 0){
                        TIP('删除成功！','success',2000);
                        _this.table.loadData('table2.json','group');// /GameGroupManagerAction!showGameGroups.action
                    }else{
                        TIP('删除失败！(可能该游戏组中还存在正在进行游戏的小组)','error',2000);
                    }
                },'json');
            });
        }
    }
    grouplist.init();
})();