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
        $groupSelete:$('.selete-group'),//游戏组
        $yearSelete:$('.selete-year'),//年份
        $itemSelete:$('.selete-item'),//分析的项目
        $groupItemSelect:$('.selete-groupitem'),//游戏小组
        $btn:$('.search'),
        $chart:$('#chart'),
        init:function(){
            this.renderPage();
            this.bindEvent();
            this.analysismap={
                1:"广告投入产出分析",
                    2:"综合市场占有率分析",
                    3:"产品市场占有率分析",
                    4:"成本费用占销售比例分析",
                    5:"成本费用占销售比例变化分析",
                    6:"产品贡献利润分析",
                    7:"生产能力分析"
            };
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

            this.$itemSelete.change(function(){
                _this.itemChange();
            });
            this.$btn.click(function(){
                _this.submitForm();
            });
        },
        renderPage:function(){
            var _this = this;
            $.get('js/group.json',function(res){// /EnterpriseEvaluateAction!showGroupMembers.action
                _this.groupmap = {};
                if(res.code == 0){
                    var groupOpt;
                    $(res.allGroupMembers).each(function(index,item){
                        groupOpt +='<option value="'+item.groupNames+'">'+item.groupNames+'</option>';
                        _this.groupmap[item.groupNames] = {
                            name:item.groupNames,
                            num:item.year
                        };
                        if(item.members.length>0){
                            _this.groupmap[item.groupNames].members = new Array();
                            $(item.members).each(function(index){
                                _this.groupmap[item.groupNames].members.push({
                                    userunique:item.members[index].userunique,
                                    userID:item.members[index].userID
                                });
                            });
                        }else{
                            _this.groupmap[item.groupNames].members = [];
                        }
                    });

                    _this.$groupSelete.append(groupOpt);
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
            var items = this.groupmap[value].members;
            if(sum >= 1){
                var yearOpt=' <option value="null">请选择年份</option>';
                for(var i = 1;i <= sum;i++){
                    yearOpt += '<option value="'+i+'">第'+i+'年</option>';
                };
                this.$yearSelete.html(yearOpt);
            }else{
                this.$yearSelete.html('<option value="hasnot">暂无数据</option>');
            }

            if(items.length>0){
                var itemOpt =' <option value="null">请选择小组</option>';
                for(var i=0;i<items.length;i++){
                    itemOpt += '<option value="'+items[i].userunique+'">'+items[i].userID+'</option>';
                }
                this.$groupItemSelect.html(itemOpt);
            }else{
                this.$groupItemSelect.html('<option value="hasnot">暂无数据</option>');
            }
        },
        itemChange:function(){
            var selete = this.$itemSelete;
            var value = Number(selete.val());
            if(value == 'null'){
                return;
            }
            switch(value){
                case 5:
                    this.$yearSelete.addClass('hide').parent().hide();
                    this.$groupItemSelect.removeClass('hide').parent().show();
                    break;
                case 6:
                    this.$yearSelete.removeClass('hide').parent().show();
                    this.$groupItemSelect.removeClass('hide').parent().show();
                    break;
                case 7:
                    this.$yearSelete.addClass('hide').parent().hide();
                    this.$groupItemSelect.addClass('hide').parent().hide();
                    break;
                default :
                    this.$yearSelete.removeClass('hide').parent().show();
                    this.$groupItemSelect.addClass('hide').parent().hide();
                    break;
            }
        },
        submitForm:function(){
            var _this = this;
            var selects = $('.select-wrapper').find('select');
            var mark = 0;
            for(var i = 0;i < selects.length; i++){
                if(selects[i].value == 'null' && !$(selects[i]).hasClass('hide')){
                    mark = 1;
                }
            }
            if(mark == 0){
                var item = Number(this.$itemSelete.val());
                if(!_this.chart){
                    _this.createChart();
                }else{
                    _this.chart.clear();
                }
                switch(item){
                    case 1:
                        _this.renderORatesOfAd();//广告投入产出分析
                        break;
                    case 2:
                        _this.renderMarketShare();//综合市场占有率分析
                        break;
                    case 3:
                        _this.renderProductMarketShare();//产品市场占有率分析
                        break;
                    case 4:
                        _this.renderCostStructure();//成本费用占销售比例分析
                        break;
                    case 5:
                        _this.renderStructureChanges();//成本费用占销售比例变化分析
                        break;
                    case 6:
                        _this.renderProductsProfit();//产品贡献利润分析
                        break;
                    case 7:
                        _this.renderMembersCapacity();//生产能力分析
                        break;
                }
            }else{
                TIP('请选择查询的必要条件!','warning',2000);
            }
        },
        renderORatesOfAd:function(){//广告投入产出分析
            var _this = this;
            var group = this.$groupSelete.val();
            var year = this.$yearSelete.val();
            var data = {
                groupName:group,
                year:year
            };
            $.post('js/1.json',data,function(res){// /EnterpriseEvaluateAction!getUserIORatesOfAd.action
                if(res.code == 0){
                    var data = res.userIORates;
                    if(data.length>0){
                        var x=new Array(),xdata = new Array();
                        $(data).each(function(index,item){
                            x[index]=item.username;
                            xdata[index]=item.rate;
                        });
                        _this.option.xAxis[0].data = x;
                        _this.option.legend.data= [];//清空上一次图例数据
                        _this.option.series = [{
                            name:'',
                            type:'line',
                            data:xdata
                        }];
                        _this.renderChart();
                    }else{
                        _this.$chart.height('auto');
                        _this.$chart.html('<p style="text-align: center;margin-top: 40px">暂无数据</p>');
                    }

                }
            },'json');
        },
        renderMarketShare:function(){//综合市场占有率分析
            var _this = this;
            var group = this.$groupSelete.val();
            var year = this.$yearSelete.val();
            var data = {
                groupName:group,
                year:year
            };
            $.post('js/2.json',data,function(res){// /EnterpriseEvaluateAction!getGeneralMarketShare.action
                if(res.code == 0){
                    var data = res.memberSaleOfMarkets;
                    var members = {};
                    var markets = {};
                    var marketsName = new Array();
                    var membersName = new Array();
                    if(data.length>0){
                         $(data).each(function(index,item){
                             if(!markets[item.marketname]){
                                 markets[item.marketname]=new Array();
                                 marketsName.push(item.marketname);
                             }
                             markets[item.marketname].push({
                                 userID:item.member.userID,
                                 sale:item.sale
                             });

                             if(!members[item.member.userID]){
                                 members[item.member.userID]=new Array();
                                 membersName.push(item.member.userID);
                             }
                             members[item.member.userID].push({
                                 marketname:item.marketname,
                                 sale:item.sale
                             });
                         });
                        _this.option.xAxis[0].data = membersName;
                        _this.option.legend.data= marketsName;//清空上一次图例数据
                        var series = new Array();
                        for(var i in markets){
                            var sales = new Array();
                            for(var j in markets[i])
                            {
                                sales.push(markets[i][j].sale);
                            }
                            series.push({
                                name:i,
                                type:'line',
                                data:sales
                            });
                        }
                        _this.option.series = series;
                        _this.renderChart();
                    }else{
                        _this.$chart.height('auto');
                        _this.$chart.html('<p style="text-align: center;margin-top: 40px">暂无数据</p>');
                    }

                }
            },'json');
        },
        renderProductMarketShare:function(){//产品市场占有率分析
            var _this = this;
            var group = this.$groupSelete.val();
            var year = this.$yearSelete.val();
            var data = {
                groupName:group,
                year:year
            };
            $.post('js/3.json',data,function(res){// /EnterpriseEvaluateAction!getProductMarketShare.action
                if(res.code == 0){
                    var data = res.memberSaleOfProducts;
                    if(data.length>0){
                        var members = {};
                        var products = {};
                        var productsName = new Array();
                        var membersName = new Array();
                        $(data).each(function(index,item){
                            if(!products[item.productName]){
                                products[item.productName]=new Array();
                                productsName.push(item.productName);
                            }
                            products[item.productName].push({
                                userID:item.member.userID,
                                sale:item.sale
                            });

                            if(!members[item.member.userID]){
                                members[item.member.userID]=new Array();
                                membersName.push(item.member.userID);
                            }
                            members[item.member.userID].push({
                                marketname:item.productName,
                                sale:item.sale
                            });
                        });
                        _this.option.xAxis[0].data = membersName;
                        _this.option.legend.data= productsName;//清空上一次图例数据
                        var series = new Array();
                        for(var i in products){
                            var sales = new Array();
                            for(var j in products[i])
                            {
                                sales.push(products[i][j].sale);
                            }
                            series.push({
                                name:i,
                                type:'line',
                                data:sales
                            });
                        }
                        _this.option.series = series;
                        _this.renderChart();
                    }else{
                        _this.$chart.height('auto');
                        _this.$chart.html('<p style="text-align: center;margin-top: 40px">暂无数据</p>');
                    }

                }
            },'json');
        },
        renderCostStructure:function(){//成本费用占销售比例分析
            var _this = this;
            var group = this.$groupSelete.val();
            var year = this.$yearSelete.val();
            var data = {
                groupName:group,
                year:year
            };
            $.post('js/4.json',data,function(res){///EnterpriseEvaluateAction!getCostStructure.action
                if(res.code == 0){
                    var data = res.memberCosts;
                    if(data.length>0){
                        var adCost = new Array();//广告费
                        var depCost = new Array();//折旧成本
                        var interestCost = new Array();//利息
                        var managementCost = new Array();//管理费用
                        var operationCost = new Array();//经营费
                        var productCost = new Array();//直接成本
                        var member = new Array();
                        $(data).each(function(index,item){
                            if(item.totalSale != 0){
                                adCost.push((item.adCost/item.totalSale).toFixed(4));
                                depCost.push((item.depreciationCost/item.totalSale).toFixed(4));
                                interestCost.push((item.interestCost/item.totalSale).toFixed(4));
                                managementCost.push((item.managementCost/item.totalSale).toFixed(4));
                                operationCost.push((item.operationCost/item.totalSale).toFixed(4));
                                productCost.push((item.productCost/item.totalSale).toFixed(4));
                                member.push(item.member.userID);
                            }else{
                                adCost.push(0);
                                depCost.push(0);
                                interestCost.push(0);
                                managementCost.push(0);
                                operationCost.push(0);
                                productCost.push(0);
                                member.push(item.member.userID);
                            }
                        });
                        _this.option.xAxis[0].data = member;
                        _this.option.legend.data= ['直接成本','广告','经营费','管理费','折旧','利息'];
                        _this.option.series = [{
                            name:'直接成本',
                            type:'bar',
                            stack:'成本',
                            data:productCost
                        },{
                            name:'广告',
                            type:'bar',
                            stack:'成本',
                            data:adCost
                        },{
                            name:'经营费',
                            type:'bar',
                            stack:'成本',
                            data:operationCost
                        },{
                            name:'管理费',
                            type:'bar',
                            stack:'成本',
                            data:managementCost
                        },{
                            name:'折旧',
                            type:'bar',
                            stack:'成本',
                            data:depCost
                        },{
                            name:'利息',
                            type:'bar',
                            stack:'成本',
                            data:interestCost
                        }];
                        _this.renderChart();
                    }else{
                        _this.$chart.height('auto');
                        _this.$chart.html('<p style="text-align: center;margin-top: 40px">暂无数据</p>');
                    }

                }
            },'json');
        },
        renderStructureChanges:function(){//成本费用占销售比例变化分析
            var _this = this;
            var group = this.$groupSelete.val();
            var userunique = this.$groupItemSelect.val();
            var data = {
                groupName:group,
                userunique:userunique
            };
            $.post('js/5.json',data,function(res){// /EnterpriseEvaluateAction!getCostStructureChanges.action
                if(res.code == 0){
                    var data = res.memberCosts;
                    if(data.length>0){
                        var adCost = new Array();//广告费
                        var depCost = new Array();//折旧成本
                        var interestCost = new Array();//利息
                        var managementCost = new Array();//管理费用
                        var operationCost = new Array();//经营费
                        var productCost = new Array();//直接成本
                        var year = new Array();
                        $(data).each(function(index,item){
                            if(item.totalSale != 0){
                                adCost.push((item.adCost/item.totalSale).toFixed(4));
                                depCost.push((item.depreciationCost/item.totalSale).toFixed(4));
                                interestCost.push((item.interestCost/item.totalSale).toFixed(4));
                                managementCost.push((item.managementCost/item.totalSale).toFixed(4));
                                operationCost.push((item.operationCost/item.totalSale).toFixed(4));
                                productCost.push((item.productCost/item.totalSale).toFixed(4));
                                year.push(item.year);
                            }else{
                                adCost.push(0);
                                depCost.push(0);
                                interestCost.push(0);
                                managementCost.push(0);
                                operationCost.push(0);
                                productCost.push(0);
                                year.push(item.year);
                            }
                        });
                        _this.option.xAxis[0].data = year;
                        _this.option.legend.data= ['直接成本','广告','经营费','管理费','折旧','利息'];
                        _this.option.series = [{
                            name:'直接成本',
                            type:'line',
                            stack:'成本',
                            data:productCost
                        },{
                            name:'广告',
                            type:'line',
                            stack:'成本',
                            data:adCost
                        },{
                            name:'经营费',
                            type:'line',
                            stack:'成本',
                            data:operationCost
                        },{
                            name:'管理费',
                            type:'line',
                            stack:'成本',
                            data:managementCost
                        },{
                            name:'折旧',
                            type:'line',
                            stack:'成本',
                            data:depCost
                        },{
                            name:'利息',
                            type:'line',
                            stack:'成本',
                            data:interestCost
                        }];
                        _this.renderChart();
                    }else{
                        _this.$chart.height('auto');
                        _this.$chart.html('<p style="text-align: center;margin-top: 40px">暂无数据</p>');
                    }

                }
            },'json');
        },
        renderProductsProfit:function(){//产品贡献利润分析
            var _this = this;
            var group = this.$groupSelete.val();
            var year = this.$yearSelete.val();
            var userunique = this.$groupItemSelect.val();
            var data = {
                groupName:group,
                year:year,
                userunique:userunique
            };
            $.post('js/6.json',data,function(res){// /EnterpriseEvaluateAction!getProductsProfit.action
                if(res.code == 0){
                    var data = res.productProfits;
                    if(data.length>0){
                        var x=new Array(),xdata = new Array();
                        $(data).each(function(index,item){
                            x[index]=item.productname;
                            xdata[index]=item.sale - item.price - item.cost;
                        });
                        _this.option.xAxis[0].data = x;
                        _this.option.legend.data= [];//清空上一次图例数据
                        _this.option.series = [{
                            name:'',
                            type:'bar',
                            data:xdata
                        }];
                        _this.renderChart();
                    }else{
                        _this.$chart.height('auto');
                        _this.$chart.html('<p style="text-align: center;margin-top: 40px">暂无数据</p>');
                    }

                }
            },'json');
        },
        renderMembersCapacity:function(){//生产能力分析
            var _this = this;
            var group = this.$groupSelete.val();
            var data = {
                groupName:group
            };
            $.post('js/7.json',data,function(res){// /EnterpriseEvaluateAction! getMembersCapacity.action
                if(res.code == 0){
                    var data = res.produceCapacities;
                    if(data.length>0){
                        var x=new Array(),xdata = new Array();
                        $(data).each(function(index,item){
                            x[index]=item.member.userID;
                            xdata[index]=item.capacity;
                        });
                        _this.option.xAxis[0].data = x;
                        _this.option.legend.data= [];//清空上一次图例数据
                        _this.option.series = [{
                            name:'',
                            type:'bar',
                            data:xdata
                        }];
                        _this.renderChart();
                    }else{
                        _this.$chart.height('auto');
                        _this.$chart.html('<p style="text-align: center;margin-top: 40px">暂无数据</p>');
                    }

                }
            },'json');

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
                        calculable : true,
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
                        series : [{
                            name:'',
                            type:'line',
                            data:[]
                        }]
                    };
                }
            );
        },
        renderChart:function(){
            var _this = this;
            _this.$chart.height(500);
            var item = this.$itemSelete.val();
            var group = this.$groupSelete.val();
            if(item != 7 ){
                var year = this.$yearSelete.val();
                this.option.title.text = _this.analysismap[item];
                this.option.title.subtext ="游戏组："+ _this.groupmap[group].name + "  第"+year+"年";
                this.chart.setOption(_this.option);
            }else{
                this.option.title.text = _this.analysismap[item];
                this.option.title.subtext ="游戏组："+ _this.groupmap[group].name;
                this.chart.setOption(_this.option);
            }
        }
    }
    assess.init();

})();