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
            this.$table.on('click','.j_toggle',function(){//是否显示游戏组内的小组
                _this.toggleSub($(this))
            });

            this.$table.on('click','.delete',function(e){//删除游戏组
                e.preventDefault();
                _this.deleteItems($(this));
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
                        var tr1 = "<tr id='"+trdata.id+"'>";
                        var tr2 = $("<tr class='sub-tr hide'><td colspan="+$('#table>tbody>tr>th').length+"></td></tr>");
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
                            '</td></tr>';
                        option.table.append(tr1);
                        try{
                            var items = trdata.items;
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
                                    table += '<tr>' +
                                        '<td>'+tr.mark+'</td>' +
                                        '<td>'+tr.time+'</td>' +
                                        '<td>'+tr.status+'</td>' +
                                        '<td>'+tr.advertise+'</td>' +
                                        '<td>'+tr.order+'</td>' +
                                        '</tr>';
                                });
                                table += '</table>';
                            }
                            tr2.find('td').append(table);
                            option.table.append(tr2);
                        }catch(e){
                        }
                    }
                    _this.setPage();
                }
            });
        },
        toggleSub:function(the){
            var tr = the.closest('tr').next('tr');
            if(tr.hasClass('sub-tr')){
                if(tr.hasClass('hide')){
                    tr.fadeIn(300,function(){
                        tr.removeClass('hide');
                    })
                    the.removeClass('icon-plus-squared').addClass('icon-minus-squared');
                }else{
                    tr.fadeOut(300,function(){
                        tr.addClass('hide');
                    });
                    the.removeClass('icon-minus-squared').addClass('icon-plus-squared');
                }
            }
        },
        deleteItems:function(the){//删除
            var _this = this;
            var tr = the.closest('tr');
            var id = tr.attr('id');
            var groupname = tr.find('.groupname').text();
            var data = {
                id:id
            };
            DIALOG.confirm('确定删除游戏组'+groupname+"删除后将结束游戏！",function(){
                $.post('js/status.json',data,function(res){
                    if(res.code == 0){
                        TIP('删除成功！','success',2000);
                        _this.table.loadData('js/table1.json','group');
                    }else{
                        TIP('删除失败！','error',2000);
                    }
                });
            });
        }
    }
    grouplist.init();
})();