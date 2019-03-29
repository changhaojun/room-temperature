<template>
    <div class="analysis">
        <div class="menu">
            <data-search-menu @clickBuliding="getClickedBuilding" @clickCommunity="getClickedCommunity">
            </data-search-menu>
        </div>
        <div class="main">
            <el-scrollbar>
                <div class="main-top">
                    <div class="main-top-title">选择日期</div>
                    <div class="main-top-tools">
                        <conditions-tools :date='date' :manager=false @current-change='reload'></conditions-tools>
                    </div>

                </div>
                <div class="main-data">
                    <data-search-top :ID="ID" :typeOfID="typeOfID"></data-search-top>
                </div>
                <div class="main-histogram">
                    <h4>室温分布</h4>
                    <div class="chart" ref="distribution"></div>
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
    import DataSearchMenu from '../../../assets/common/DataSearchMenu/DataSearchMenu.vue';
    import ConditionsTools from '../warnRecord/conditionsTools.vue';
    import moment from 'moment';
    import {
        lineCharts,
        barCharts
    } from '@charts/charts'
    export default {
        data() {
            return {
                ID: -1,
                typeOfID: -1,
                date: [moment().subtract(3, 'days'), moment()],
            }
        },
        methods: {
            getClickedBuilding(clickedBuilding) {
                this.ID = clickedBuilding.building_id;
                this.typeOfID = 1;
                this.getTemperatureDistribution();
                this.getAverage();
            },
            getClickedCommunity(clickedCommunity) {
                this.ID = clickedCommunity.community_id;
                this.typeOfID = 0;
                this.getTemperatureDistribution();
                this.getAverage();
            },
            reload(params) {
                console.log('params', params);
            },
            async getTemperatureDistribution() {
                const {
                    result: {
                        rows
                    }
                } = await this.$http('community/getRoomTemperaBar');
                console.log(rows);
                const dataX = [],
                    dataY = [];
                for (let i = 0; i < rows.length; i++) {
                    dataX.push(i);
                    dataY.push(rows[i]);
                }
                const topbar = barCharts(this.$refs['distribution'], {
                    dataX,
                    dataY
                }, ['#00F0FF', '#00A8FF'], 0);
            },
            async getAverage() {
                const res = await this.$http("community/getCommunity");
    
                const dataX = ['0h', '12h', '24h', '36h', '48h', '60h', '72h'];
                const dataY1 = [12, 13, 14, 15, 16, 17, 18];
                const dataY2 = [18, 17, 16, 15, 15, 14, 13];
                const line = lineCharts(this.$refs['average-tem'],dataX, dataY1, dataY2);
            },
        },
        components: {
            DataSearchTop,
            DataSearchMenu,
            ConditionsTools
        }
    }

</script>

<style lang="scss">
    @import "./Analysis.scss";

</style>
