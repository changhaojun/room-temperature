<template>
    <div class="community-details">
        <div class="montior-title">
            <span class="all" @click="allCommunity">所有小区 > </span><span class="">{{communityName}}</span>
        </div>
        <div class="montior-main">
            <div class="main-tool">
                <div class="tool-buttons">
                    <mu-button class="warn" :class="indexActive == index+1 ? 'activeBtn': ''"
                        @click="clickBtn(index+1)" v-for="(btn,index) in btns" :key="index">{{btn}}</mu-button>
                </div>
                <div style="display: flex; align-items: center;">
                    <div class="tool-search" @keydown="search($event)">
                        <el-input v-model="conditions.user_number" placeholder="房间号"></el-input>
                        <span class="iconfont iconsousuo icon" @click="search($event)"></span>
                    </div>
                </div>
            </div>
            <div class="main-table">
                <table-page :initData='initData' :columns='columns' :manager=true :pageNumber='conditions.page_number' :type=1
                    @page-change='pageChange'>
                </table-page>
            </div>
        </div>
    </div>
</template>

<script>
import OnlineMonitor from './onlineMonitor.vue';
import TablePage from './tablePage.vue';

export default {
    components: {OnlineMonitor, TablePage},
    data() {
        return {
            conditions: {
                community_id: null,
                user_number: null,
                warn: null,
                distance:null,
                position:null,
                page_size: 6,
                page_number: 1
            },
            communityName: '',
            temp: '',
            initData: {
                total: 0,
                datas: []
            },
            btns: ['全部', '告警'],
            indexActive: 1,

            columns: [
                {
                    label: "时间",
                    prop: "data_time"
                },
                // {
                //     label: "楼名称",
                //     prop: "building_name"
                // },
                // {
                //     label: "编号",
                //     prop: "user_number"
                // },
                {
                    label: "地址",
                    prop: "address"
                },
                {
                    label: "户主名称",
                    prop: "username"
                },
                {
                    label: "位置",
                    prop: "position"
                },
                {
                    label: "分段",
                    prop: "distance"
                },
                {
                    label: "室外温度(℃)",
                    prop: "temp"
                },
                {
                    label: "室内温度(℃)",
                    prop: "data_value"
                }
            ]
        }
    },
    methods: {
        allCommunity() {
            this.$router.push({
                name: 'OnlineMonitor'
            })
        },
        // 获取小区房间列表
        async getHouseList() {
            if(!this.conditions.user_number) {
                delete this.conditions.user_number;
            }
            if(this.conditions.warn === null) {
                delete this.conditions.warn;
            }
            const { result: { rows, total } } = await this.$http('community/getHouse', {data: this.conditions});
            for (const row of rows) {
                row.temp = this.temp;
                row.distance  = row.distance === 1 ? '近' : row.distance === 2 ? '中' : row.distance === 3 ? '远' : '';
                row.position  = row.position === 1 ? '顶' : row.position === 2 ? '底' : row.position === 3 ? '边' : '';
            }
            this.initData.datas = rows;
            this.initData.total = total;
        },
        //换页
        pageChange(current) {
            this.conditions.page_number = current.data;
            this.getHouseList();
        },
        search(ev) {
            if (ev.type === 'click' || ev.key === 'Enter') {
                this.conditions.page_number = 1;
                this.getHouseList();
            }
        },
        clickBtn(type) {
            this.indexActive = type;
            this.conditions.user_number = '';
            this.conditions.page_number = 1;
            if(type === 1) {
                this.conditions.warn = null;
            }else {
                this.conditions.warn = 1;
            }
            this.getHouseList();
        },
        getPageSize() {
            const rowHeight = 60;
            const block = document.querySelector('.montior-main').offsetHeight;
            const rowCount = Math.floor((block - 228) / rowHeight);
            this.conditions.page_size = rowCount;
        }
    },
    mounted() {
        this.getPageSize();
        this.getHouseList();
        document.querySelector('nav').querySelectorAll('a')[1].classList.add('active-router');
    },
    created() {
        this.conditions.community_id = Number(this.$route.query.community_id);
        this.communityName = this.$route.query.community_name;
        this.temp = this.$route.query.temp;
        this.conditions.distance = this.$route.query.distance
        this.conditions.position = this.$route.query.position
    },
    destroyed(){
        document.querySelector('nav').querySelectorAll('a')[1].classList.remove('active-router');
    }
}
</script>

<style lang="scss">
@import "./communityDetails.scss";
</style>
