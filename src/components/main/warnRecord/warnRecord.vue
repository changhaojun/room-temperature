<template>
    <div class="warn-record">
        <div class="record-main">
            <div class="main-tool">
                <conditions-tools :date='date' :group=true :manager=true @current-change='reload' @group-change='group'></conditions-tools>
            </div>
            <div class="main-table">
                <table-page :initData='initData' :columns='columns' manager=true :pageNumber='conditions.page_number' :pageSize='conditions.page_size' :type=2 @page-change='pageChange' @read-change='readChange'></table-page>
            </div>
        </div>
    </div>
</template>

<script>
import ConditionsTools from './conditionsTools.vue';
import TablePage from './../onlineMonitor/tablePage.vue';
import moment from 'moment';
export default {
    components: {ConditionsTools, TablePage},
    data() {
        return {
            date: [moment().subtract(3,'days'), moment()],

            conditions: {
                type: 6,
                start_time: moment(moment().subtract(2,'days')).format('YYYY-MM-DD'),
                end_time: moment().add(1,"day").format('YYYY-MM-DD'),
                key: '',
                page_size: 6,
                page_number: 1,
                read_state: null,
                config_type: null
            },
            initData: {
                total: 0,
                datas: []
            },
            columns: [
                {
                    label: "阅读状态",
                    prop: "read_state"
                },
                {
                    label: "公司名称",
                    prop: "company_name"
                },
                {
                    label: "小区名称",
                    prop: "community_name"
                },
                {
                    label: "楼名称",
                    prop: "building_name"
                },
                {
                    label: "住户",
                    prop: "user_number"
                },
                {
                    label: "告警类型",
                    prop: "alarm_type"
                },
                {
                    label: "室外温度(℃)",
                    prop: "weather"
                },
                {
                    label: "室内温度(℃)",
                    prop: "data_value"
                },
                {
                    label: "触发类型",
                    prop: "config_type"
                },
                {
                    label: "时间",
                    prop: "data_time"
                }
            ]   
        }
    },
    methods: {
        // 获取告警列表
        async getWarnList() {
            if(!this.conditions.key) {
                delete this.conditions.key;
            }
            if(this.conditions.read_state === null) {
                delete this.conditions.read_state;
            }
            if(this.conditions.config_type === null) {
                delete this.conditions.config_type;
            }
            // console.log(this.conditions);
            const { result: { rows, total } } = await this.$http('warn/getWarn', {data: this.conditions});
            const weather = await this.getWeather();
            for (const row of rows) {
                row.weather = weather.temp;
                row.read_state  = row.read_state === 0 ? '未读' : row.read_state === 1 ? '已读' : '';
                row.config_type = row.config_type === 1 ? '系统告警' : row.config_type === 2 ? '用户告警' : '';
                row.alarm_type = row.alarm_type === 1 ? '高温告警' : row.alarm_type === 2 ? '低温告警' :  row.alarm_type === 3 ? '低电告警' : row.alarm_type === 4 ? '信号告警' : '';
            }
            this.initData.datas = rows;
            this.initData.total = total;
            console.log(this.initData);
        },
        //换页
        pageChange(current) {
            this.conditions.page_number = current.data;
            this.getWarnList();
        },
        // 修改阅读状态
        async readChange(params) {
            // console.log(params.data);
            const res = await this.$http.put('warn/upDateWarn', params.data);
            this.$message({
                message: '阅读状态修改成功', 
                type: 'success'
            })
            this.getWarnList();
        },

        reload(params) {
            this.conditions.start_time = params.startTime;
            this.conditions.end_time = params.endTime;
            this.conditions.key = params.key;
            this.conditions.page_number = 1;
            this.getWarnList();
        },
        group(params) {
            // console.log(params);
            this.conditions.read_state = params.readState === '全部' ? null : params.readState === '未读' ? 0 : 1;
            this.conditions.config_type = params.configType === '全部' ? null : params.configType === '用户' ? 2 : 1;
            this.conditions.page_number = 1;
            this.getWarnList();
        },
        async getWeather() {
            const {result} = await this.$http('weather/getWeather');
            console.log(result)
            return result;
        },
        getPageSize() {
            const rowHeight = 60;
            const block = document.querySelector('.record-main').offsetHeight;
            const rowCount = Math.floor((block - 234) / rowHeight);
            this.conditions.page_size = rowCount;
        }
    },
    mounted() {
        this.getPageSize();
        this.getWarnList();
    }
}
</script>

<style lang="scss">
@import "./warnRecord.scss";
</style>
