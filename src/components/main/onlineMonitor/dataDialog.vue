<template>
    <div class="house">
        <div>
            <div style="padding-left: 44px;">
                <conditions-tools :date='date' :manager=false @current-change='reload'></conditions-tools>
            </div>
            <div ref="temp" class="charts-content"></div>
            <div style="padding-left: 20px;">
                <el-table :data="datas" border style="width: 100%;">
                    <el-table-column prop='data_time' label="时间"></el-table-column>
                    <el-table-column prop='data_value_temp' label="室内温度(℃)"></el-table-column>
                    <el-table-column prop='data_value_outTemp' label="室外温度(℃)"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import ConditionsTools from './../warnRecord/conditionsTools.vue';
import {lineCharts, barCharts} from '@charts/charts'
export default {
    components: {ConditionsTools},
    props: ['date', 'conditionsHistory'],
    data() {
        return {
            params: {},
            datas: [],
            grid: {
                left: '0%',
                right: '0%',
                bottom: '10%',
                top: '15%',
                containLabel: true
            }
        }
    },
    methods: {
        // 获取历史数据
        async getHouseHistory() {
            console.log(this.conditionsHistory)
            const {result} = await this.$http('historyData/getHouseHistory', {data: this.conditionsHistory});
            result.data_time.forEach((element,index) => {
                console.log(element)
                let data = {};
                data.data_time = element;
                data.data_value_temp = result.data_value[index];
                data.data_value_outTemp = result.data_value[index];
                this.datas.push(data);
            });
            console.log(this.datas);
            const dataX = result.data_time;
            const dataY1 = result.data_value;
            const dataY2 = result.data_value;
            const line = lineCharts(this.$refs['temp'], this.grid, dataX, dataY1, dataY2);
        },
        
        reload(params) {
            this.conditionsHistory.start_time = params.startTime;
            this.conditionsHistory.end_time = params.endTime;
            this.getHouseHistory();
        },
    },
    mounted() {
        this.getHouseHistory();
    },
    created() {

    }
}
</script>

<style lang="scss">
    .house {
        .charts-content {
            height: 280px;
            margin-top: -18px;
        }
        .el-table th {
            height: 80px !important;
            padding: 0;
            background: rgba(248,248,249,1);
        }
    }
</style>

