<template>
    <div class="online-monitor">
        <div class="montior-title">
            <span>所有小区</span>
        </div>
        <div class="montior-main">
            <div class="main-tool">
                <div class="tool-buttons">
                    <mu-button color="warning" class="all">全部</mu-button>
                    <mu-button color="" class="warn">告警</mu-button>
                </div>
                <div style="display: flex; align-items: center;">
                    <div class="refresh">
                        <span>自动刷新</span>
                        <el-switch v-model="refresh" active-color="#FFA509" inactive-color="#949494" :width="33"></el-switch>
                    </div>
                    <div class="tool-search" @keydown="search($event)">
                        <el-input v-model="conditions.key" placeholder="搜索"></el-input>
                        <span class="iconfont iconsousuo icon" @click="search($event)"></span>
                    </div>
                </div>
            </div>
            <div class="main-table">
                <el-table :data="initData.datas" style="width: 100%; margin-bottom: 24px;">
                    <el-table-column prop="community_name" label="小区名称" width="180"></el-table-column>
                    <el-table-column prop="result.avg_data" label="平均温度(℃)" ></el-table-column>
                    <el-table-column prop="result.min_data" label="室外温度(℃)" ></el-table-column>
                    <el-table-column label="前段 ( 温度℃ )">
                        <el-table-column prop="result.avg_data" label="顶" ></el-table-column>
                        <el-table-column prop="result.avg_data" label="底" ></el-table-column>
                        <el-table-column prop="result.avg_data" label="边" ></el-table-column>
                    </el-table-column>
                    <el-table-column label="中端 ( 温度℃ )">
                        <el-table-column prop="result.avg_data" label="顶" ></el-table-column>
                        <el-table-column prop="result.avg_data" label="底" ></el-table-column>
                        <el-table-column prop="result.avg_data" label="边" ></el-table-column>
                    </el-table-column>
                    <el-table-column label="末端 ( 温度℃ )">
                        <el-table-column prop="result.avg_data" label="顶" ></el-table-column>
                        <el-table-column prop="result.avg_data" label="底" ></el-table-column>
                        <el-table-column prop="result.avg_data" label="边" ></el-table-column>
                    </el-table-column>
                </el-table>
                <el-pagination
                    layout="prev, pager, next, jumper"
                    @current-change='pageChange'
                    prev-click='pageChange' 
                    next-click='pageChange'
                    :current-page.sync="conditions.page_number"
                    :total="initData.total"
                    :page-size="2">
                </el-pagination>
            </div>
        </div>       
    </div>
</template>

<script>
export default {
    data() {
        return {
            conditions: {
                key: '',
                page_size: 8,
                page_number: 1
            },
            initData: {
                total: 0,
                datas: []
            },
            refresh: true
        }
    },
    methods: {
        // 获取小区列表
        async getCommunityList() {
            if(!this.conditions.key) {
                delete this.conditions.key;
            }
            console.log(this.conditions);
            const { result: { rows, total } } = await this.$http('community/getCommunity', {data: this.conditions});
            if(rows.length > 0) {
                let params = {
                    community_id: null,
                    avg_data: 1,
                    max_data: 1,
                    min_data: 1
                }
                for(let row of rows) {
                    params.community_id = row.community_id;
                    row.result = await this.getCommunityInfo(params);
                }
            }
            this.initData.datas = rows;
            this.initData.total = total;
            console.log(this.initData);
        },
        // 获取小区信息
        async getCommunityInfo(params) {
            const {result}  = await this.$http('community/getCommunityInfo', {data: params});
            return result;
        },
        //换页
        pageChange(current) {
            this.conditions.page_number = current;
            this.getCommunityList();
        },
        search(ev) {
            if (ev.type === 'click' || ev.key === 'Enter') {
                if(this.conditions.key && !this.conditions.key.includes(' ')) {
                    this.conditions.page_number = 1;
                    this.getCommunityList();
                }
            } 
        },
    },
    created() {
        this.getCommunityList();
    }
}
</script>

<style lang="scss">
@import "./onlineMonitor.scss";
</style>
