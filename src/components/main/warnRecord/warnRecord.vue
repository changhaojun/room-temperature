<template>
    <div class="warn-record">
        <div class="record-main">
            <div class="main-tool">
                <conditions-tools :date='date' :manager=true @current-change='reload'></conditions-tools>
            </div>
            <div class="main-table">
                <table-page :initData='initData' :columns='columns' :pageNumber='conditions.page_number' :type=2 @page-change='pageChange'></table-page>
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
                start_time: moment(moment().subtract(3,'days')).format('YYYY-MM-DD'),
                end_time: moment().format('YYYY-MM-DD'),
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
                    prop: "user_number"
                },
                {
                    label: "住户",
                    prop: "user_number"
                },
                {
                    label: "告警类型",
                    prop: "user_number"
                },
                {
                    label: "室外温度(℃)",
                    prop: "user_number"
                },
                {
                    label: "室内温度(℃)",
                    prop: "user_number"
                },
                {
                    label: "时间",
                    prop: "user_number"
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
            const { result: { rows, total } } = await this.$http('build/getHouse', {data: this.conditions});
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
            const rowCount = Math.floor((block - 210) / rowHeight);
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
