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
        init:function(){
            this.renderChart();
            this.bindEvent();
        },
        bindEvent:function(){
            var _this = this;
            $(window).resize(function(){
                _this.chart.resize();
            });
        },
        renderChart:function(){
            var _this = this;
            require(
                [
                    'echarts',
                    'echarts/chart/line',   // 按需加载所需图表，如需动态类型切换功能，别忘了同时加载相应图表
                    'echarts/chart/bar'
                ],
                function (ec) {
                    _this.chart = ec.init(document.getElementById('chart'));
                    _this.option = {
                        title : {
                            text: '广告投入产出分析',
                            subtext: 'xxx游戏组'
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['xiaoming','zhangsan']
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
                                boundaryGap : false,
                                data : ['第一年第一期','第一年第二期']
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
                        series : [
                            {
                                name:'xiaoming',
                                type:'line',
                                data:[11,23],
                                markPoint : {
                                    data : [
                                        {type : 'max', name: '最大值'},
                                        {type : 'min', name: '最小值'}
                                    ]
                                },
                                markLine : {
                                    data : [
                                        {type : 'average', name: '平均值'}
                                    ]
                                }
                            },
                            {
                                name:'zhangsan',
                                type:'line',
                                data:[1,33],
                                markPoint : {
                                    data : [
                                        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                                    ]
                                },
                                markLine : {
                                    data : [
                                        {type : 'average', name : '平均值'}
                                    ]
                                }
                            }
                        ]
                    };
                    _this.chart.setOption(_this.option);
                }
            );
        }
    }
    assess.init();

})();