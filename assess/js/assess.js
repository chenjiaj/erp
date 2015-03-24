/**
 * Created with JetBrains PhpStorm.
 * Desc:
 * Author: chenjiajun
 * Date: 15-3-18
 * Time: 下午3:06
 */
(function(){
    require.config({
        paths: {
            echarts: '../../../erp_manage/common/js'
        }
    });

    var assess = {
        $form:$('#chooseItem'),
        $groupSelete:$('.selete-group'),
        $yearSelete:$('.selete-year'),
        $itemSelete:$('.selete-item'),
        $btn:$('.search'),
        $chart:$('#chart'),
        init:function(){
            this.renderPage();
            this.bindEvent();
        },
        bindEvent:function(){
            var _this = this;
            $(window).resize(function(){
                if(_this.chart){
                    _this.chart.resize();
                }
            });

            this.$groupSelete.change(function(){//选择游戏组后，显示对应的年份
                _this.groupChange();
            });

            this.$btn.click(function(){
                _this.submitForm();
            });
        },
        renderPage:function(){
            var _this = this;
            $.get('js/group.json',function(res){
                _this.groupmap = {};
                _this.analysismap={};
                if(res.code == 0){
                    var groupOpt,itemOpt;
                    $(res.grouplist).each(function(index,item){
                        groupOpt +='<option value="'+item.id+'">'+item.name+'</option>';
                        _this.groupmap[item.id] = {
                            name:item.name,
                            num:item.num
                        };
                    });
                    $(res.analysis).each(function(index,item){
                        itemOpt +='<option value="'+item.id+'">'+item.text+'</option>';
                        _this.analysismap[item.id] = item.text;
                    });
                    _this.$groupSelete.append(groupOpt);
                    _this.$itemSelete.append(itemOpt);
                }
            },'json');
        },
        groupChange:function(){
            var selete = this.$groupSelete;
            var value = selete.val();
            if(value == 'null'){
                return;
            }
            var sum = this.groupmap[value].num;
            var yearOpt=' <option value="null">请选择年份</option>';
            for(var i = 1;i <= sum;i++){
                yearOpt += '<option value="'+i+'">第'+i+'年</option>';
            };
            this.$yearSelete.html(yearOpt);
        },
        submitForm:function(){
            var _this = this;
            var group = this.$groupSelete.val();
            var year = this.$yearSelete.val();
            var item = this.$itemSelete.val();
            if(group != 'null' && year != 'null' && item != 'null'){
                var data = {
                    groupid:group,
                    year:year,
                    item:item
                };
                if(!_this.chart){
                    _this.createChart();
                }
                $.post('js/chart.json',data,function(res){
                    if(res.code == 0){
                        var data = res.chart;
                        if(res.chart.series.length>0){
                            _this.renderChart(data);
                        }else{
                            _this.$chart.height('auto');
                            _this.$chart.html('<p style="text-align: center;margin-top: 40px">暂无数据</p>');
                        }

                    }
                },'json');
            }else{
                var info = '';
                if(group == 'null'){
                    info += '游戏组、';
                }
                if(year == 'null'){
                    info += '查询的年份、';
                }
                if(item == 'null'){
                    info += '需要分析的模块、';
                }
                info = info.substring(0,info.length-1);
                TIP('请选择'+info+"!",'warning',2000);
            }
        },
        createChart:function(){
            var _this = this;
            require(
                [
                    'echarts',
                    'echarts/chart/line',   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
                    'echarts/chart/bar'
                ],
                function (ec) {
                    _this.$chart.height(500);
                    _this.chart = ec.init(document.getElementById('chart'));
                    _this.option = {
                        title : {
                            text: '',
                            subtext: ''
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:[]
                        },
                        toolbox: {
                            show : true,
                            feature : {
                                mark : {show: true},
                                dataView : {show: true, readOnly: false},
                                magicType : {show: true, type: ['line', 'bar']},
                                restore : {show: true},
                                saveAsImage : {show: true}
                            }
                        },
                        calculable : false,
                        xAxis : [
                            {
                                type : 'category',
                                data : []
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                axisLabel : {
                                    formatter: '{value}'
                                }
                            }
                        ],
                        series : []
                    };
                }
            );
        },
        renderChart:function(data){
            var _this = this;
            _this.$chart.height(500);
            var group = this.$groupSelete.val();
            var year = this.$yearSelete.val();
            var item = this.$itemSelete.val();
            this.option.title.text = _this.analysismap[item];
            this.option.title.subtext ="游戏组："+ _this.groupmap[group].name + " 第"+year+"年";
            this.option.xAxis[0].data = data.xAxis;
            var series = data.series;
            var arr  = new Array();//存储series数据
            _this.option.legend.data= [];//清空上一次图例数据
            $(series).each(function(index,item){
                arr[index] = {
                    name:item.name,
                    type:'bar',
                    data:item.data
                }
                _this.option.legend.data.push(item.name);
            });
            this.option.series = arr;
            this.chart.setOption(this.option);
        }
    }
    assess.init();

})();