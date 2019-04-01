<template>
    <div class="data-search-top">
        <div class="main-chart-datas">
            <div class="main-chart-datas-top">
                <div class="main-chart-datas-top-households" v-if="typeOfComponent==0">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont iconziyuanxhdpi orange" style="font-size:32px;"></i>
                        </div>
                        <div class="card-right">
                            <div class="card-right-top">
                                <div class="card-right-top-left">{{info.monitor_house_count}}/{{info.house_count}}</div>
                                <div class="card-right-top-right">户</div>
                            </div>
                            <div class="card-right-bottem">监测用户率</div>
                        </div>
                    </div>
                </div>
                <div class="main-chart-datas-top-monitoredHouseholds" v-if="typeOfComponent==0">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont icongaojing1 red" style="font-size:24px;"></i>
                        </div>
                        <div class="card-right">
                            <div class="card-right-top">
                                <div class="card-right-top-left">{{info.alarm_count}}</div>
                                <div class="card-right-top-right">户</div>
                            </div>
                            <div class="card-right-bottem">告警用户数</div>
                        </div>
                    </div>
                </div>
                <div class="main-chart-datas-top-type11" v-if="typeOfComponent==1">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont icondashaxiaoqudizhi01 blue" style="font-size:24px;"></i>
                        </div>
                        <div class="card-right">
                            <div class="card-right-top">
                                <div class="card-right-top-left">{{info.community_count}}</div>
                                <div class="card-right-top-right">户</div>
                            </div>
                            <div class="card-right-bottem">小区数量</div>
                        </div>
                    </div>
                </div>
                <div class="main-chart-datas-top-type12" v-if="typeOfComponent==1">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont iconziyuanxhdpi orange" style="font-size:24px;"></i>
                        </div>
                        <div class="card-right">
                            <div class="card-right-top">
                                <div class="card-right-top-left">{{info.monitor_house_count}}/{{info.house_count}}</div>
                                <div class="card-right-top-right">户</div>
                            </div>
                            <div class="card-right-bottem">监测用户率</div>
                        </div>
                    </div>
                </div>
                <div class="main-chart-datas-top-type13" v-if="typeOfComponent==1">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont icongaojing1 red" style="font-size:24px;"></i>
                        </div>
                        <div class="card-right">
                            <div class="card-right-top">
                                <div class="card-right-top-left">{{info.alarm_count}}</div>
                                <div class="card-right-top-right">户</div>
                            </div>
                            <div class="card-right-bottem">告警用户数</div>
                        </div>
                    </div>
                </div>
                <div class="main-chart-datas-top-households" v-if="typeOfComponent==2">
                        <div class="card">
                            <div class="card-left">
                                <i slot="suffix" class="iconfont iconfangzi222 green" style="font-size:32px;"></i>
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
                <div class="main-chart-datas-top-monitoredHouseholds" v-if="typeOfComponent==2">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont iconziyuanxhdpi orange" style="font-size:24px;"></i>
                        </div>
                        <div class="card-right">
                            <div class="card-right-top">
                                <div class="card-right-top-left">{{info.monitor_house_count}}/{{info.house_count}}</div>
                                <div class="card-right-top-right">户</div>
                            </div>
                            <div class="card-right-bottem">监测用户率</div>
                        </div>
                    </div>
                </div>
                

            </div>
            <div class="main-chart-datas-bottem">
                <div class="main-chart-datas-bottem-averageTemperature">
                    <div class="card">
                        <div class="card-left">
                            <i slot="suffix" class="iconfont iconwendu yellow" style="font-size:32px;"></i>
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
                            <i slot="suffix" class="iconfont iconwendu red" style="font-size:32px;"></i>
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
                            <i slot="suffix" class="iconfont iconwendu blue" style="font-size:32px;"></i>
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
            <div class="device-count">
                <dl>
                    <dt><span
                            style="color:#F9BB50">{{info.online_count}}</span>/<span>{{info.monitor_house_count}}</span>
                    </dt>
                    <dd>设备在线率</dd>
                </dl>
            </div>
            <div class="device-chart" ref="myChart">

            </div>
        </div>
    </div>
</template>

<script>
    import {
        pieCharts,
        pieCharts2
    } from '@charts/charts'
    //
    export default {
        data() {
            return {
                info: {},
                normalPerc: '',
                coolPerc: '',
                hotPerc: '',

            }
        },
        //typeOfID=-1代表是公司id，typeOfID=0代表是小区id，typeOfID=1代表是楼id
        //typeOfComponent=0代表查询数据，=1代表统计分析分公司，=2代表统计分析
        props: ['ID', 'typeOfID', 'typeOfComponent'],
        watch: {
            ID: {
                handler() {
                    this.getInfo();

                }
            }
        },
        methods: {
            async getInfo() {
                let res = '';
                if (this.typeOfID == -1) {
                    res = await this.$http.get(
                        'company/getCompanyInfo', {
                            data: {
                                company_id: this.ID,
                                house_count: 1,
                                monitor_house_count: 1,
                                avg_data: 1,
                                max_data: 1,
                                min_data: 1,
                                room_tempera: 1,
                                is_online: 1,
                                alarm_count: 1,
                                community_count: 1
                            }
                        });
                } else if (this.typeOfID == 0) {
                    res = await this.$http.get(
                        'community/getCommunityInfo', {
                            data: {
                                community_id: this.ID,
                                house_count: 1,
                                monitor_house_count: 1,
                                avg_data: 1,
                                max_data: 1,
                                min_data: 1,
                                room_tempera: 1,
                                is_online: 1,
                                alarm_count: 1
                            }
                        });
                } else if (this.typeOfID == 1) {
                    res = await this.$http.get(
                        'building/getBuildingInfo', {
                            data: {
                                building_id: this.ID,
                                house_count: 1,
                                monitor_house_count: 1,
                                avg_data: 1,
                                max_data: 1,
                                min_data: 1,
                                room_tempera: 1,
                                is_online: 1,
                                alarm_count: 1
                            }
                        });
                }

                this.info = res.result;
                this.drawPie(this.info.online_count, this.info.monitor_house_count);


            },
            drawPie(online, total) {
                pieCharts2(this.$refs['myChart'], {
                    value: online
                }, {
                    value: total
                });
                this.$emit('topLoadingCompleted');
            }

        },
        mounted() {
            
        },
    }

</script>

<style lang="scss">
    @import "./DataSearchTop.scss";

</style>
