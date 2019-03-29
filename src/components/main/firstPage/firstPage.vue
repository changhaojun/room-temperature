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
                            <dl>
                                <dt><span style="color:#F9BB50">251</span>/<span>262</span></dt>
                                <dd>设备在线率</dd>
                            </dl>
                        </div>
                        <div class="device-chart" ref="device-chart">

                        </div>
                    </li>
                    <li>
                        <dl>
                            <dt><i style="color:#FFA509;font-size:34px" class="iconfont iconwendu"></i></dt>
                            <dd>
                                <p><span>{{companyInfo.avg_data}}</span><span>℃</span></p>
                                <p>平均室温</p>
                            </dd>
                        </dl>
                    </li>
                    <li>
                        <dl>
                            <dt><i style="color:#FF716A;font-size:30px" class="iconfont icongaojing"></i></dt>
                            <dd>
                                <p><span>{{companyInfo.community_count}}</span><span>个</span></p>
                                <p>告警用户数</p>
                            </dd>
                        </dl>
                    </li>
                    <li>
                        <dl>
                            <dt><i style="color:#FFA509;font-size:28px" class="iconfont iconziyuanxhdpi"></i></dt>
                            <dd>
                                <p><span>{{companyInfo.monitor_house_count}}&nbsp;/&nbsp;{{companyInfo.house_count}}</span><span>个</span></p>
                                <p>监测住户率</p>
                            </dd>
                        </dl>
                    </li>
                    <li>
                        <dl>
                            <dt><i style="color:#1EC2B4;font-size:28px" class="iconfont icondashaxiaoqudizhi01"></i></dt>
                            <dd>
                                <p><span>{{companyInfo.community_count}}</span><span>个</span></p>
                                <p>小区数量</p>
                            </dd>
                        </dl>
                    </li>
                </ul>
            </li>
            <li class="">
                <h4>高温TOP</h4>
                <div ref="high-top" class="charts-content"></div>
            </li>
            <li class="">
                <h4>低温TOP</h4>
                <div ref="low-top" class="charts-content"></div>
            </li>
        </ul>
    </div>
</template>

<script>
import {lineCharts, barCharts, pieCharts2} from '@charts/charts'
export default {
    data () {
        return {
            companyInfo: {}
        }
    },
    methods: {
        async getAverage() {
            const res = await this.$http("community/getCommunity");

            const dataX = ['0h', '12h', '24h', '36h', '48h', '60h', '72h'];
            const dataY1 = [12, 13, 14, 15, 16, 17, 18];
            const dataY2 = [18, 17, 16, 15, 15, 14, 13];
            const line = lineCharts(this.$refs['average-tem'],{
                left: '5%',
                right: '10%',
                bottom: '10%',
                top: '15%',
                containLabel: true
            },dataX, dataY1, dataY2);
        },

        async getHightTop() {
            const {result: {rows}} = await this.$http('company/hotTop');
            const dataX = [], dataY = [];
            for(const row of rows) {
                const {community_name, data_value} = row;
                dataX.push(community_name);
                dataY.push(data_value);
            }
            const topbar = barCharts(this.$refs['high-top'], {dataX, dataY}, ['#F5C51D','#EFA31F'],1)
        },
        async getCoolTop() {
            const {result: {rows}} = await this.$http('company/coolTop');
            const dataX = [], dataY = [];
            for(const row of rows) {
                const {community_name, data_value} = row;
                dataX.push(community_name);
                dataY.push(data_value);
            }
            const topbar = barCharts(this.$refs['low-top'], {dataX, dataY}, ['#00F0FF', '#00A8FF'],1)
        },

        async getBasicInfo() {
            const {result} = await this.$http('company/getCompanyInfo',{
                data: {
                    community_count: 1,
                    house_count:1,
                    monitor_house_count:1,
                    avg_data:1
                }
            });
            this.companyInfo = result;
        },

        drawPie() {
            const data1 = {
                value: 210,
                color: 'red'
            }
            const data2 = {
                value: 9,
                color: 'yellow'
            }
            pieCharts2(this.$refs['device-chart'], data1, data2)
        }
    },
    mounted() {
        this.getAverage();
        this.getHightTop();
        this.getCoolTop();
        this.getBasicInfo();
        this.drawPie();
    }
}
</script>

<style lang="scss">
    @import './firstPage.scss'
</style>
