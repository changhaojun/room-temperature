<template>
    <div class="data-search-top">
        <div class="main-chart-datas">
            <div class="main-chart-datas-top">
                <div class="main-chart-datas-top-households">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont iconfangzi222 green"></i>
                        </div>
                        <div class="card-right">
                            <div class="card-right-top">
                                <div class="card-right-top-left">{{info.house_count}}</div>
                                <div class="card-right-top-right">户</div>
                            </div>
                            <div class="card-right-bottem">住户数量</div>
                        </div>
                    </div>
                </div>
                <div class="main-chart-datas-top-monitoredHouseholds">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont iconziyuanxhdpi orange"></i>
                        </div>
                        <div class="card-right">
                            <div class="card-right-top">
                                <div class="card-right-top-left">{{info.monitor_house_count}}</div>
                                <div class="card-right-top-right">户</div>
                            </div>
                            <div class="card-right-bottem">监测住户数量</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="main-chart-datas-bottem">
                <div class="main-chart-datas-bottem-averageTemperature">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont iconwendu yellow"></i>
                        </div>
                        <div class="card-right">
                            <div class="card-right-top">
                                <div class="card-right-top-left">{{info.avg_data}}</div>
                                <div class="card-right-top-right">℃</div>
                            </div>
                            <div class="card-right-bottem">平均室温</div>
                        </div>
                    </div>
                </div>
                <div class="main-chart-datas-bottem-maxTemperature">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont iconwendu red"></i>
                        </div>
                        <div class="card-right">
                            <div class="card-right-top">
                                <div class="card-right-top-left">{{info.max_data}}</div>
                                <div class="card-right-top-right">℃</div>
                            </div>
                            <div class="card-right-bottem">最高室温</div>
                        </div>
                    </div>
                </div>
                <div class="main-chart-datas-bottem-minTemperature">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont iconwendu blue"></i>
                        </div>
                        <div class="card-right">
                            <div class="card-right-top">
                                <div class="card-right-top-left">{{info.min_data}}</div>
                                <div class="card-right-top-right">℃</div>
                            </div>
                            <div class="card-right-bottem">最低室温</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-chart-pie">
            <div class="pie-left">
                <div class="pie-tips-normal">
                    <div class="pie-tips-top">
                        <div class="pie-tips-top-icon"></div>
                        <div class="pie-tips-top-desc">17~23℃</div>
                    </div>
                    <div class="pie-tips-bottem">
                        {{normalPerc}}
                    </div>
                </div>
            </div>
            <div class="pie-center" ref="myChart"></div>
            <div class="pie-right">
                <div class="pie-tips-cool">
                    <div class="pie-tips-top">
                        <div class="pie-tips-top-icon"></div>
                        <div class="pie-tips-top-desc">＜16℃</div>
                    </div>
                    <div class="pie-tips-bottem">
                        {{coolPerc}}
                    </div>
                </div>
                <div class="pie-tips-hot">
                    <div class="pie-tips-top">
                        <div class="pie-tips-top-icon"></div>
                        <div class="pie-tips-top-desc">＞24℃</div>
                    </div>
                    <div class="pie-tips-bottem">
                        {{hotPerc}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        pieCharts
    } from '@charts/charts'
    export default {
        data() {
            return {
                info: {},
                normalPerc: '',
                coolPerc: '',
                hotPerc: '',
            }
        },
        //typeOfID=0代表是小区id，typeOfID=1代表是楼id
        props: ['ID', 'typeOfID'],
        watch: {
            ID: {
                handler() {
                    //console.log(this.ID);
                    //console.log(this.typeOfID);
                    this.getInfo();

                }
            }


        },
        methods: {
            async getInfo() {
                let res = '';
                if (this.typeOfID == 1) {
                    res = await this.$http.get(
                        'http://121.42.253.149:18859/app/mock/31/GET//v1/building/getBuildingInfo', {
                            data: {
                                building_id: this.ID,
                                house_count: 1,
                                monitor_house_count: 1,
                                avg_data: 1,
                                max_data: 1,
                                min_data: 1,
                                room_tempera: 1
                            }
                        });
                } else {
                    res = await this.$http.get(
                        'http://121.42.253.149:18859/app/mock/31/GET//v1/community/getCommunityInfo', {
                            data: {
                                community_id: this.ID,
                                house_count: 1,
                                monitor_house_count: 1,
                                avg_data: 1,
                                max_data: 1,
                                min_data: 1,
                                room_tempera: 1
                            }
                        });
                }
                if (res.code == 200) {
                    this.info = res.result;
                    let sum = this.info.room_tempera.normal + this.info.room_tempera.cool + this
                        .info.room_tempera.hot;
                    this.normalPerc = Number(this.info.room_tempera.normal / sum * 100).toFixed(
                        2) + '%';
                    this.coolPerc = Number(this.info.room_tempera.cool / sum * 100).toFixed(2) +
                        '%';
                    this.hotPerc = Number(this.info.room_tempera.hot / sum * 100).toFixed(2) +
                        '%';
                    this.drawLine();
                } else {
                    this.$message({
                        message: '网络请求失败',
                        type: 'error',
                        duration: 1000
                    });
                }

            },
            drawLine() {
                const dataNormal = {
                    value: this.info.room_tempera.normal,
                    name: '17 ~ 23℃',
                    color: '#FFCB72'
                };
                const dataCool = {
                    value: this.info.room_tempera.cool,
                    name: '<16℃',
                    color: '#5DC8FF'
                };
                const dataHot = {
                    value: this.info.room_tempera.hot,
                    name: '>24℃',
                    color: '#FF9186'
                };
                const pie = pieCharts(this.$refs['myChart'], dataNormal, dataCool, dataHot);
            }

        },
        mounted() {
             this.getInfo();
            //console.log('this.building', this.buildingID);
        },
    }

</script>

<style lang="scss">
    @import "./DataSearchTop.scss";

</style>
