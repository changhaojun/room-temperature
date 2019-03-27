<template>
    <div class="community-details">
        <div class="montior-title">
            <span class="all" @click="allCommunity">所有小区 > </span><span class="">{{communityName}}</span>
        </div>
        <div class="montior-main">
            <div class="main-tool">
                <div class="tool-buttons">
                    <mu-button color="warning" class="all">全部</mu-button>
                    <mu-button color="" class="warn">告警</mu-button>
                </div>
                <div style="display: flex; align-items: center;">
                    <div class="tool-search" @keydown="search($event)">
                        <el-input v-model="conditions.user_number" placeholder="搜索"></el-input>
                        <span class="iconfont iconsousuo icon" @click="search($event)"></span>
                    </div>
                </div>
            </div>
            <div class="main-table">
                <table-page :initData='initData' :columns='columns' :pageNumber='conditions.page_number' @page-change='pageChange'></table-page>
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
                page_size: 8,
                page_number: 1
            },
            communityName: '',
            initData: {
                total: 0,
                datas: []
            },
            columns: [
                {
                    label: "编号",
                    prop: "user_number"
                },
                {
                    label: "户主名称",
                    prop: "user_house_id"
                },
                {
                    label: "位置",
                    prop: "building_name"
                },
                {
                    label: "分段",
                    prop: "building_id"
                },
                {
                    label: "室外温度(℃)",
                    prop: "building_id"
                },
                {
                    label: "室内温度(℃)",
                    prop: "building_id"
                },
                {
                    label: "时间",
                    prop: "building_id"
                },
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
            console.log(this.conditions);
            const { result: { rows, total } } = await this.$http('build/getHouse', {data: this.conditions});
            this.initData.datas = rows;
            this.initData.total = total;
            console.log(this.initData);
        },
        //换页
        pageChange(current) {
            this.conditions.page_number = current.data;
            this.getHouseList();
        },
        search(ev) {
            if (ev.type === 'click' || ev.key === 'Enter') {
                if(this.conditions.user_number && !this.conditions.user_number.includes(' ')) {
                    this.conditions.page_number = 1;
                    this.getHouseList();
                }
            } 
        }
    },
    created() {
        this.conditions.community_id = Number(this.$route.query.community_id);
        this.communityName = this.$route.query.community_name;
        this.getHouseList();
    }
}
</script>

<style lang="scss">
@import "./communityDetails.scss";
</style>
