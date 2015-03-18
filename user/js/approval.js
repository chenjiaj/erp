/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-18
 * Time: 上午8:50
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
                            '<a href="#" class="agree"><span class="icon-ok-circled"></span>同意</a>'+
                            '<a href="#" class="refuse"><span class="icon-cancel-circled"></span>拒绝</a>'+
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