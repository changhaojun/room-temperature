<template>
    <div class="house">
        <div>
            <div style="padding-left: 44px;">
                <conditions-tools :date='date' :group=false :manager=false :toggle='toggle' @current-change='reload'></conditions-tools>
            </div>
            <div ref="temp" class="charts-content"></div>
            <div style="padding-left: 20px;">
                <el-table :data="datas" border style="width: 100%;">
                    <el-table-column prop='data_time' label="时间"></el-table-column>
                    <el-table-column prop='data_value_hum' label="湿度( % )"></el-table-column>
                    <el-table-column prop='data_value_temp' label="室内温度(℃)">
                        <template slot-scope="scope">
                            <div :class="scope.row.data_value_temp > scope.row.high ? 'warnHigh' : scope.row.data_value_temp < scope.row.low ? 'warnLow' : ''">
                                {{scope.row.data_value_temp}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop='data_value_outTemp' label="室外温度(℃)"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import ConditionsTools from './../warnRecord/conditionsTools.vue';
import {moreLineCharts} from '@charts/charts';
import moment from 'moment';
export default {
    components: {ConditionsTools},
    props: ['date', 'conditionsHistory'],
    data() {
        return {
            params: {},

            datas: [],
            dataX: [],
            dataY1: [],
            dataY2: [],
            dataY3: [],
            grid: {
                left: '0%',
                right: '1%',
                bottom: '10%',
                top: '15%',
                containLabel: true
            },
            hsitoryParams: {
                house_id: null,
                start_time: '',
                end_time: ''
            },

            toggle: true
        }
    },
    methods: {
        // 获取历史数据
        async getHouseHistory() {
            this.datas = [];
            console.log(this.hsitoryParams);
            const {result} = await this.$http('historyData/getHouseHistory', {data: this.hsitoryParams});
            console.log(result.data_time);
                result.data_time.forEach((element,index) => {
                    let data = {};
                    data.data_time = element;
                    data.data_value_temp = result.temp_value[index];
                    data.data_value_outTemp = result.temp_value[index];
                    data.data_value_hum = result.hum_value[index];
                    data.high = Number(result.high_warn.split('>')[1]);
                    data.low = Number(result.low_warn.split('<')[1]);
                    this.datas.push(data);
                });
                this.dataX = result.data_time;
                this.dataY1 = result.temp_value;
                this.dataY2 = result.temp_value;
                this.dataY3 = result.hum_value;
                const moreLine = moreLineCharts(this.$refs['temp'], this.grid, this.dataX, this.dataY1, this.dataY2, this.dataY3);
        },
        reload(params) {
            console.log(1111)
            this.hsitoryParams.start_time = params.startTime;
            this.hsitoryParams.end_time = params.endTime;
            this.getHouseHistory();
        },
    },
    watch: {
        conditionsHistory: {
            handler(newVal) {
                this.hsitoryParams.house_id = this.conditionsHistory.house_id;
                this.hsitoryParams.start_time = moment(this.date[0]).format('YYYY-MM-DD');
                this.hsitoryParams.end_time = moment(this.date[1]).format('YYYY-MM-DD');
                this.toggle = !this.toggle; // 为使子组件监听有变化而改变默认日期和按钮状态
                this.getHouseHistory();
            },
            deep: true
        }
    },
    mounted() {
        this.getHouseHistory();
    },
    created() {
        this.hsitoryParams.house_id = this.conditionsHistory.house_id;
        this.hsitoryParams.start_time = this.conditionsHistory.start_time;
        this.hsitoryParams.end_time = this.conditionsHistory.end_time;
    }
}
</script>

<style lang="scss">
    .house {
         *, :before, :after{
            z-index: 0;
        }
        .charts-content {
            height: 280px;
        }
        .el-table th {
            height: 80px !important;
            padding: 0;
            background: rgba(248,248,249,1);
        }
        .warnHigh {
            color:rgba(255,113,106,1) !important;
            height: 100%;
            background:rgba(255,113,106,0.1);
        }
        .warnLow {
            color:rgba(0,168,255,1) !important;
            height: 100%;
            background:rgba(51,171,241,0.1);
        }
        .el-table td,.el-table td div{
            padding: 0;
            line-height: 60px;
        }
    }
</style>

