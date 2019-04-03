<template>
    <div id="first_page_content">
        <ul class="basic-data">
            <li class="">
                <h4>总平均温度</h4>
                <div ref="average-tem" class="charts-content"></div>
            </li>
            <li class="">
                <ul>
                    <li>
                        <div class="device-count">
                            <dl class="online-count-num">
                                <dt><span style="color:#F9BB50">{{companyInfo.online_count}}</span>/<span>{{companyInfo.monitor_house_count}}</span></dt>
                                <dd>设备在线率</dd>
                            </dl>
                        </div>
                        <div class="device-chart" ref="device-chart">

                        </div>
                    </li>
                    <li>
                        <dl>
                            <dt><i style="color:#FFA509;font-size:34px" class="iconfont iconwendu"></i></dt>
                            <dd class="block-name">
                                <p><span>{{companyInfo.avg_data}}</span><span>℃</span></p>
                                <p>平均室温</p>
                            </dd>
                        </dl>
                    </li>
                    <li>
                        <dl>
                            <dt><i style="color:#FF716A;font-size:30px" class="iconfont icongaojing"></i></dt>
                            <dd class="block-name">
                                <p><span>{{companyInfo.alarm_count}}</span><span>个</span></p>
                                <p>告警用户数</p>
                            </dd>
                        </dl>
                    </li>
                    <li>
                        <dl>
                            <dt><i style="color:#FFA509;font-size:28px" class="iconfont iconziyuanxhdpi"></i></dt>
                            <dd class="block-name">
                                <p><span>{{companyInfo.monitor_house_count}}&nbsp;/&nbsp;{{companyInfo.house_count}}</span><span>个</span></p>
                                <p>监测住户率</p>
                            </dd>
                        </dl>
                    </li>
                    <li>
                        <dl>
                            <dt><i style="color:#1EC2B4;font-size:28px" class="iconfont icondashaxiaoqudizhi01"></i></dt>
                            <dd class="block-name">
                                <p><span>{{companyInfo.community_count}}</span><span>个</span></p>
                                <p>小区数量</p>
                            </dd>
                        </dl>
                    </li>
                </ul>
            </li>
            <li class="">
                <h4>分公司告警TOP</h4>
                <div ref="high-top" class="charts-content"></div>
            </li>
            <li class="">
                <h4>小区告警TOP</h4>
                <div ref="low-top" class="charts-content"></div>
            </li>
        </ul>
    </div>
</template>

<script>
import moment from 'moment';
import {lineCharts, barCharts, pieCharts2} from '@charts/charts'
export default {
    data () {
        return {
            companyInfo: {}
        }
    },
    methods: {
        async getAverage() {
            const {result:{data_value,data_time}} = await this.$http("historyData/getCustomerHistory");
            const {result: {rows}} = await this.$http('weather/getWeatherHistory');
            const dataX = data_time.map(item => {
                return moment(item).format('MM-DD HH') + 'h'
            });
            const dataY1 = data_value;

            const dataY2 = [];
            for(const row of rows) {
                const { temp } = row;
                dataY2.push(Number(temp.split('℃')[0]));
            }
            const num =dataY1.length-dataY2.length
            for(let i=0;i<num;i++){
                dataY2.unshift('')
            }
            const line = lineCharts(this.$refs['average-tem'],{
                left: '5%',
                right: '10%',
                bottom: '10%',
                top: '15%',
                containLabel: true
            },dataX, dataY1, dataY2);
        },

        async getComponyTop() {
            const {result: {rows}} = await this.$http('customer/getAlarmTop', {
                data: {
                    topType: 1
                }
            });
            const dataX = [], dataY = [];
            for(const row of rows) {
                const {company_name, total} = row;
                dataX.push(company_name);
                dataY.push(total);
            }
            const topbar = barCharts(this.$refs['high-top'], {dataX, dataY}, ['#F5C51D','#EFA31F'], 1)
        },
        async getCommunityTop() {
            const {result: {rows}} = await this.$http('customer/getAlarmTop', {
                data: {
                    topType: 2
                }
            });
            const dataX = [], dataY = [];
            for(const row of rows) {
                const {community_name, total} = row;
                dataX.push(community_name);
                dataY.push(total);
            }
            const topbar = barCharts(this.$refs['low-top'], {dataX, dataY}, ['#00F0FF', '#00A8FF'], 1)
        },

        async getBasicInfo() {
            const {result} = await this.$http('customer/getCustomerInfo',{
                data: {
                    community_count: 1,
                    house_count:1,
                    monitor_house_count:1,
                    avg_data:1,
                    alarm_count: 1,
                    is_online:1
                }
            });
            this.companyInfo = result;
            this.drawPie(result.online_count, result.monitor_house_count);
        },

        drawPie(online, total) {
            pieCharts2(this.$refs['device-chart'], {value:online,name:'在线设备'}, {value:total - online,name:'离线设备'})
        }
    },
    mounted() {
        this.getAverage();
        this.getComponyTop();
        this.getCommunityTop();
        this.getBasicInfo();
    }
}
</script>

<style lang="scss">
    @import './firstPage.scss'
</style>
