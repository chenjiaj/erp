/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-17
 * Time: 下午3:49
 */
(function(){
    var user = {
        $table:$('.tableStyle'),
        $tableArea:$('#table-area'),
        $btnWrapper:$('.page-wrapper'),
        init:function(){
            this.renderPage();
            this.bindEvent();
        },
        bindEvent:function(){
            var _this = this;
            //全选
            this.$table.on('change',':checkbox',function(){
                _this.checkAll($(this));
            });


            //修改
            this.$table.on('click','.edit',function(e){
                e.preventDefault();
                _this.editItem($(this));
            });

            //批量删除
            this.$tableArea.on('click','.deletes',function(e){
                e.preventDefault();
                _this.deteteItems();
            });

            //删除
            this.$table.on('click','.delete',function(e){
                e.preventDefault();
                _this.deleteItem($(this));
            });
        },
        renderPage:function(){
            this.table = new Table({
                table: $("#table"),
                tableArea: $("#table-area"),
                showIndex:true,
                pageSize:10,
                showIndexContent:'编号'
            });
            this.extendFun();
            this.table.loadData('js/table.json','user');
            this.$btnWrapper.append('<a href="#" class="form-control btn deletes">批量删除</a>');
        },
        extendFun:function(){
            var _this = this;
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
                            '<a href="#" class="edit"><span class="icon-edit"></span>修改</a>'+
                            '<a href="#" class="delete"><span class="icon-trash-empty"></span>删除</a>'+
                            '</td></tr>';
                        option.table.append(tr);
                    }
                    _this.setPage();
                }
            });
        },
        checkAll:function(the){
            if(the.hasClass('check-all')){
                if(the.prop('checked')){
                    this.$table.find(':checkbox').prop('checked',true);
                }else{
                    this.$table.find(':checkbox').prop('checked',false);
                }
            }else{
                if(the.prop('checked')){
                    var mark = 0;
                    this.$table.find('td :checkbox').each(function(){
                        if(!$(this).prop('checked')){
                            mark = 1;
                        }
                    });
                    if(mark == 0){
                        this.$table.find('.check-all').prop('checked',true);
                    }
                }else{
                    this.$table.find('.check-all').prop('checked',false);
                }
            }

        },
        editItem:function(the){
            var _this = this;
            var tr = the.closest('tr');
            var id = tr.attr('id');
            var name = tr.find('.name');
            var major = tr.find('.major');
            var grade = tr.find('.grade');
            var stuid = tr.find('.grade');
            this.dialog = new DIALOG({
                title: '修改用户信息',
                content: '<div class="dialog-body" id="modifyItem-wrapper">' +
                    '<form class="wrapper" id="modifyItem">' +
                    '<div class="input-div clear-fix">' +
                    '<label class="label-div"><span class="start">*</span>用户名ID</label>' +
                    '<div class="label-input">' +
                    '<input type="text" class="form-control" name="id" readonly="readonly" style="cursor: not-allowed"' +
                    'value="'+id+'"/>' +
                    '</div>' +
                    '</div>'+
                    '<div class="input-div clear-fix">' +
                    '<label class="label-div"><span class="start">*</span>姓名</label>' +
                    '<div class="label-input">' +
                    '<input type="text" class="form-control modify-elem name" name="name"' +
                    'data-validation-error-msg="姓名不能为空" data-validation="required" value="'+name.text()+'"/>' +
                    '</div>' +
                    '</div>'+
                    '<div class="input-div clear-fix">' +
                    '<label class="label-div"><span class="start">*</span>专业</label>' +
                    '<div class="label-input">' +
                    '<input type="text" class="form-control modify-elem major" name="major"' +
                    'data-validation-error-msg="专业不能为空" data-validation="required" value= "'+major.text()+'"/>' +
                    '</div>' +
                    '</div>'+
                    '<div class="input-div clear-fix">' +
                    '<label class="label-div"><span class="start">*</span>班级</label>' +
                    '<div class="label-input">' +
                    '<input type="text" class="form-control modify-elem grade" name="garde"' +
                    'data-validation-error-msg="班级不能为空" data-validation="required" value = "'+grade.text()+'"/>' +
                    '</div>' +
                    '</div>'+
                    '<div class="input-div clear-fix">' +
                    '<label class="label-div"><span class="start">*</span>学号</label>' +
                    '<div class="label-input">' +
                    '<input type="text" class="form-control modify-elem stuid" name="stuid"' +
                    'data-validation-error-msg="学号不能为空" data-validation="required" value="'+stuid.text()+'"/>' +
                    '</div>' +
                    '</div>'+
                    '</form>'+
                    '<div class="dialog-footer">' +
                    '<a type="button" class="btn save">保存</a>' +
                    '<a type="button" class="btn cancel">取消</a>' +
                    '</div>'+
                    '</div>',
                beforeClose: null,
                closeBtn: true,
                className: '',
                cache: false, //是否缓存。若为false则close的时候会remove掉对话框对应的dom元素
                width: '500px' //窗口宽度，默认为40%
            });
            $.validate();
            this.dialog.open();

            var form = $('#modifyItem');
            var wrapper = $('#modifyItem-wrapper');
            //标记信息是否改变
            var index = 0;
            form.find('.modify-elem').change(function(){
                index ++;
            });

            //保存信息
            wrapper.find('.save').click(function(e){
                e.preventDefault();
                if(index>0){

                    var newName = form.find('.name').val();
                    var newMajor = form.find('.major').val();
                    var newGrade = form.find('.grade').val();
                    var newStuid = form.find('.stuid').val();
                    if(!BTN.isLoading($('.save')) && form.isValid()){
                        BTN.addLoading($('.save'),'保存中','loading');
                        $.post('js/delete.json',form.serialize(),function(res){
                            BTN.removeLoading($('.save'),'保存');
                            if(res.code == 0){
                                TIP('保存成功','success',2000);
                                name.text(newName);
                                major.text(newMajor);
                                grade.text(newGrade);
                                stuid.text(newStuid);
                                _this.dialog.close();
                            }else{
                                TIP('保存失败！','error',2000);
                            }
                        },'json');
                    }
                }else{
                    TIP('没有任何修改任何内容','warning',2000);
                }

            });

            //取消保存
            wrapper.find('.cancel').click(function(e){
                e.preventDefault();
                _this.dialog.close();
            });
        },
        deleteItem:function(the){
            var _this = this;
            var tr = the.closest('tr');
            var id = tr.attr('id');
            var name = tr.find('.name').text();
            var data = {
                id:[id]
            }
            DIALOG.confirm('是否删除 ID为'+id+'、用户名为'+name+' 的用户？',function(){
                _this.deleteFun(data)
            });

        },
        deteteItems:function(){
            var _this = this;
            var arr=new Array();
            var checked = this.$table.find('td :checked');
            if(checked.length<=0){
                TIP('请选择用户！','warning',2000);
                return;
            }
            checked.each(function(index){
                arr[index] = $(this).closest('tr').attr('id');
            });
            var data = {
                id:arr
            }
            DIALOG.confirm('是否删除所有选中用户？',function(){
                _this.deleteFun(data)
            });
        },
        deleteFun:function(data){
            var _this = this;
            $.post('js/delete.json',data,function(res){
                if(res.code == 0){
                    TIP('删除成功','success',2000);
                    _this.table.loadData('js/table1.json','user');
                    _this.$table.find('th :checkbox').prop('checked',false);
                }else{
                    TIP('删除失败','error',2000);
                }
            },'json');
        }
    }
    user.init();

})();