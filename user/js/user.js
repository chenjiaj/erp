/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-17
 * Time: 下午3:49
 */
(function(){
    var user = {
        init:function(){
            this.renderPage();
        },
        renderPage:function(){
            var Jtable = new Table({
                table: $("#table"),
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
                        var tr = $("<tr></tr>");
                        tr.append('<td>'+
                            '<input type="checkbox"/>'+
                            '</td>');
                        $(trdata).each(function(index){
                            if(index == 0 && option.showIndex){
                                tr.append('<td>'+(i+1)+'</td>');
                            }
                            tr.append('<td>'+trdata[index]+'</td>');
                        });
                        tr.append('<td>'+
                            '<a href="#"><span class="icon-edit"></span>修改</a>'+
                            '<a href="#"><span class="icon-trash-empty"></span>删除</a>'+
                            '</td>');
                        option.table.append(tr);
                    }
                    _this.setPage();
                }
            });
        }
    }
    user.init();



})();