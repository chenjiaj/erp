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
            this.$table.on('click','.j_toggle',function(){
                var the = $(this);
                var tr = the.closest('tr').next('tr');
                if(tr.hasClass('sub-tr')){
                    if(tr.hasClass('hide')){
                        tr.fadeIn(500,function(){
                            tr.removeClass('hide');
                        })
                        the.removeClass('icon-plus-squared').addClass('icon-minus-squared');
                    }else{
                        tr.fadeOut(1000,function(){
                            tr.addClass('hide');
                        });
                        the.removeClass('icon-minus-squared').addClass('icon-plus-squared');
                    }
                }
            });
        },
        renderPage:function(){
            var Jtable = new Table({
                table: this.$table,
                tableArea: $("#table-area"),
                showIndex:true,
                pageSize:10,
                showIndexContent:'编号'
            });
            this.extendFun();
            Jtable.loadData('js/table.json','table');
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
                        var tr1 = $("<tr></tr>");
                        var tr2 = $("<tr class='sub-tr hide'><td colspan="+$('#table>tbody>tr>th').length+"></td></tr>");
                        tr1.append('<td>'+
                            '<span class="icon-plus-squared j_toggle"></span>'+
                            '</td>');
                        $(trdata).each(function(index){
                            if(index == 0 && option.showIndex){
                                tr1.append('<td>'+(i+1)+'</td>');
                            }
                            tr1.append('<td>'+trdata[index]+'</td>');
                        });
                        tr1.append('<td>'+

                            '<a href="#"><span class="icon-trash-empty"></span>删除</a>'+
                            '</td>');
                        option.table.append(tr1);
                        try{
                            var items = trdata[trdata.length-1].item
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
                                    table += '<tr>';
                                    $(items[index]).each(function(index1){
                                        table += '<td>'+items[index][index1]+'</td>';
                                    });
                                    table+='</tr>';
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
        }
    }
    grouplist.init();
})();