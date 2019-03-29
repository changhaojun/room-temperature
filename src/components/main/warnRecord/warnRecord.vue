<template>
    <div class="warn-record">
        <div class="record-main">
            <div class="main-tool">
                <conditions-tools :date='date' :group=true :manager=true @current-change='reload'></conditions-tools>
            </div>
            <div class="main-table">
                <table-page :initData='initData' :columns='columns' manager=true :pageNumber='conditions.page_number' :type=2 @page-change='pageChange'></table-page>
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
                start_time: moment(moment().subtract(3,'days')).format('YYYY-MM-DD hh:mm:ss'),
                end_time: moment().format('YYYY-MM-DD hh:mm:ss'),
                community_name: '',
                page_size: 6,
                page_number: 1
            },
            initData: {
                total: 0,
                datas: []
            },
            columns: [
                {
                    label: "小区名称",
                    prop: "community_name"
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
                    prop: ""
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
                },
                {
                    label: "阅读状态",
                    prop: "read_state"
                }
            ]   
        }
    },
    methods: {
        // 获取告警列表
        async getWarnList() {
            console.log(this.conditions);
            if(!this.conditions.community_name) {
                delete this.conditions.community_name;
            }
            const { result: { rows, total } } = await this.$http('warn/getWarn', {data: this.conditions});
            for (const row of rows) {
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
        reload(params) {
            this.conditions.start_time = params.startTime;
            this.conditions.end_time = params.endTime;
            this.conditions.community_name = params.communityName;
            this.conditions.page_number = 1;
            this.getWarnList();
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
