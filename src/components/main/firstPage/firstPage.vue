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
                        <dl>
                            <dt><div><i style="color:#FFA509" class="iconfont iconwendu"></i></div></dt>
                            <dd>
                                <p><span>21</span><span>℃</span></p>
                                <p>平均室温</p>
                            </dd>
                        </dl>
                    </li>
                    <li>
                        <dl>
                            <dt><div><i style="color:#1EC2B4;font-size:28px" class="iconfont icondashaxiaoqudizhi01"></i></div></dt>
                            <dd>
                                <p><span>46</span><span>个</span></p>
                                <p>小区数量</p>
                            </dd>
                        </dl>
                    </li>
                    <li>
                        <dl>
                            <dt><div><i style="color:#FF9C71;" class="iconfont iconfangzi222"></i></div></dt>
                            <dd>
                                <p><span>212</span><span>户</span></p>
                                <p>住户数量</p>
                            </dd>
                        </dl>
                    </li>
                    <li>
                        <dl>
                            <dt><div><i style="color:#FFA509;font-size:28px" class="iconfont iconziyuanxhdpi"></i></div></dt>
                            <dd>
                                <p><span>210</span><span>户</span></p>
                                <p>监测住户数量</p>
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
import {lineCharts, barCharts} from '@charts/charts'
export default {
    data () {
        return {

        }
    },
    methods: {
        async getAverage() {
            const res = await this.$http("community/getCommunity");

            const dataX = ['0h', '12h', '24h', '36h', '48h', '60h', '72h'];
            const dataY1 = [12, 13, 14, 15, 16, 17, 18];
            const dataY2 = [18, 17, 16, 15, 15, 14, 13];
            const line = lineCharts(this.$refs['average-tem'],dataX, dataY1, dataY2);

            const bar = barCharts(this.$refs['high-top'], {dataX, dataY: dataY1}, ['#F5C51D','#EFA31F'])
            const bar2 = barCharts(this.$refs['low-top'], {dataX, dataY: dataY2}, ['#00F0FF', '#00A8FF'])
        }
    },
    mounted() {
        this.getAverage();
    }
}
</script>

<style lang="scss">
    @import './../../../assets/styles/mixin.scss';
    #first_page_content{
        padding: 20px;
        width: calc(100% - 40px);
        height: calc(100% - 40px);
        margin: 20px;
        .basic-data{
            @include fourBlockLayout(30px, 30px);
            >li{
                >h4{
                    width: 60%;
                    height: 30px;
                    line-height: 50px;
                    margin-left: 40px;
                    font-size: 18px;
                    font-weight:600;
                    color:rgba(70,76,91,1);
                }
                >.charts-content{
                    width: 100%;
                    height: calc(100% - 30px);
                }
            }
            >li:nth-child(2){
                background: rgb(245, 245, 245);
                box-shadow: none;
                >ul{
                    @include fourBlockLayout(30px, 22px);
                    >li{
                        >dl{
                            width: 50%;
                            height: 50%;
                            transform: translate(60%, 50%);
                            dt{
                                width: 30%;
                                display: inline-block;
                                height: 100%;
                                overflow: hidden;
                                text-align: center;
                                >div{
                                    width: 100%;
                                    height: 100%;
                                    display:flex;
                                    justify-content:center;
                                    align-items:center;
                                    >i{
                                        font-size: 40px;
                                    }
                                }
                            }
                            dd{
                                width: 60%;
                                display: inline-block;
                                height: 100%;
                                overflow: hidden;
                                >p:nth-child(1){
                                    font-size: 26px;
                                    margin-top: 10px;
                                    >span:nth-child(2){
                                        font-size: 20px
                                    }
                                }
                                >p:nth-child(2){
                                    font-size: 14px;
                                    opacity: 0.6;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
