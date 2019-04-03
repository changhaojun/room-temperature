<template>
    <div class="analysis" v-loading="loading.topLoading || loading.menuLoading">
        <div class="menu">
            <data-search-menu @clickedItem="getClickedItem" @menuLoadingCompleted="componentLoading(2)">
            </data-search-menu>
        </div>
        <div class="main">
            <el-scrollbar>
                <div class="main-data">
                    <data-search-top :ID="ID" :typeOfID="typeOfID" :typeOfComponent=1 v-if="typeOfID==-1"
                        @topLoadingCompleted="componentLoading(1)">
                    </data-search-top>
                    <data-search-top :ID="ID" :typeOfID="typeOfID" :typeOfComponent=2 v-else
                        @topLoadingCompleted="componentLoading(1)"></data-search-top>
                </div>
                <div class="main-temperature" v-if="typeOfID==-1">
                    <div class="high-temperature">
                        <h4>小区高温TOP</h4>
                        <div class="chart" ref="high-top"></div>
                    </div>
                    <div class="low-temperature">
                        <h4>小区低温TOP</h4>
                        <div class="chart" ref="low-top"></div>
                    </div>
                </div>

                <div class="main-histogram">
                    <h4>室温分布</h4>
                    <div class="chart" ref="distribution"></div>
                </div>

                <div class="main-top">
                    <div class="main-top-title">选择日期</div>
                    <div class="main-top-tools">
                        <conditions-tools :date='date' :manager=false @current-change='reload'></conditions-tools>
                    </div>

                </div>
                <div class="main-linechart">
                    <h4>总平均温度</h4>
                    <div class="chart" ref="average-tem"></div>
                </div>
            </el-scrollbar>

        </div>
    </div>
</template>

<script>
    import DataSearchTop from '../../../assets/common/DataSearchTop/DataSearchTop.vue';
    import DataSearchMenu from '../../../assets/common/DataSearchMenu/DataMenu.vue';
    import ConditionsTools from '../warnRecord/conditionsTools.vue';
    import moment from 'moment';
    import {
        lineCharts,
        barCharts
    } from '@charts/charts'
    export default {
        data() {
            return {
                ID: '',
                typeOfID: '',
                date: [moment().subtract(3, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                loading: {
                    topLoading: false,
                    menuLoading: false,
                },
                first: false,
            }
        },
        methods: {
            //topLoading:type=1,
            //menuLoading:type=2,
            //chartLoading:type=3,
            componentLoading(type) {
                if (type == 1) {
                    this.loading.topLoading = false;
                } else if (type == 2) {
                    this.loading.menuLoading = false;
                }
            },
            //itemType=0代表公司，itemType=1代表小区，itemType=2代表楼
            //typeOfID=-1代表是公司id，typeOfID=0代表是小区id，typeOfID=1代表是楼id
            getClickedItem(clickedItem) {
                this.ID = clickedItem.itemID;
                this.typeOfID = clickedItem.itemType - 1;
                if (this.typeOfID == -1) {
                    this.getHighTemperature();
                    this.getLowTemperature();
                }
                this.getTemperatureDistribution();
                this.getAverage();
            },
            reload(params) {
                this.date[0] = params.startTime;
                this.date[1] = params.endTime;
                this.getAverage();
            },
            async getHighTemperature() {
                const {
                    result: {
                        rows
                    }
                } = await this.$http('company/hotTop', {
                    data: {
                        company_id: this.ID,
                    }
                });
                const dataX = [],
                    dataY = [];
                for (const row of rows) {
                    const {
                        community_name,
                        data_value
                    } = row;
                    dataX.push(community_name);
                    dataY.push(data_value);
                }
                const topbar = barCharts(this.$refs['high-top'], {
                    dataX,
                    dataY
                }, ['#F5C51D', '#EFA31F'], 0, '温度(°C)');
            },
            async getLowTemperature() {
                const {
                    result: {
                        rows
                    }
                } = await this.$http('company/coolTop', {
                    data: {
                        company_id: this.ID,
                    }
                });
                const dataX = [],
                    dataY = [];
                for (const row of rows) {
                    const {
                        community_name,
                        data_value
                    } = row;
                    dataX.push(community_name);
                    dataY.push(data_value);
                }
                const topbar = barCharts(this.$refs['low-top'], {
                    dataX,
                    dataY
                }, ['#00F0FF', '#00A8FF'], 0, '温度(°C)');
            },
            async getTemperatureDistribution() {
                let res = '';
                if (this.typeOfID == -1) {
                    res = await this.$http('company/getRoomTemperaBar', {
                        data: {
                            company_id: this.ID,
                        }
                    });
                } else if (this.typeOfID == 0) {
                    res = await this.$http('community/getRoomTemperaBar', {
                        data: {
                            community_id: this.ID,
                        }
                    });
                } else if (this.typeOfID == 1) {
                    res = await this.$http('building/getRoomTemperaBar', {
                        data: {
                            building_id: this.ID,
                        }
                    });
                }

                let rows = res.result.rows;
                const dataX = [],
                    dataY = [];
                for (let i = 0; i < rows.length; i++) {
                    dataX.push(i);
                    dataY.push(rows[i]);
                }
                const topbar = barCharts(this.$refs['distribution'], {
                    dataX,
                    dataY
                }, ['#00F0FF', '#00A8FF'], 2, '户数');
            },
            async getAverage() {
                let senDate = {};
                if (this.first) {
                    senDate = {
                        start_time: moment(this.date[0]).add(1, 'day').format('YYYY-MM-DD'),
                        end_time: moment(this.date[1]).add(1, 'day').format('YYYY-MM-DD')
                    }
                } else {
                    senDate = {
                        start_time: this.date[0],
                        end_time: this.date[1]
                    }
                }

                let res = '';
                const {
                    result: {
                        rows
                    }
                } = await this.$http('weather/getWeatherHistory', {
                    data: senDate
                });
                if (this.typeOfID == -1) {
                    senDate.company_id = this.ID
                    res = await this.$http('historyData/getCompanyHistory', {
                        data: senDate
                    });
                } else if (this.typeOfID == 0) {
                    senDate.community_id = this.ID
                    res = await this.$http('historyData/getCommunityHistory', {
                        data: senDate
                    });
                } else if (this.typeOfID == 1) {
                    senDate.building_id = this.ID
                    res = await this.$http('historyData/getBuildingHistory', {
                        data: senDate
                    });
                }
                let dataX = res.result.data_time.map(item => {
                    return moment(item).format('MM-DD HH')
                });
                const dataY1 = res.result.data_value;
                const dataY2 = [];
                for (let i = 0; i < dataX.length; i++) {
                    dataY2.push(0);
                }
                let index = -1;
                for (const row of rows) {
                    index = dataX.indexOf(moment(row.data_time).format('MM-DD HH'));
                    dataY2[index] = Number(row.temp.split('℃')[0]);
                }
                for (let j = 0; j < dataX.length; j++) {
                    dataX[j] = dataX[j] + 'h';
                }
                const line = lineCharts(this.$refs['average-tem'], {
                    left: '5%',
                    right: '10%',
                    bottom: '10%',
                    top: '15%',
                    containLabel: true
                }, dataX, dataY1, dataY2);
                this.first = false;
            },
        },
        components: {
            DataSearchTop,
            DataSearchMenu,
            ConditionsTools
        },
        mounted() {
            this.first = true;
        },
    }

</script>

<style lang="scss">
    @import "./Analysis.scss";

</style>
