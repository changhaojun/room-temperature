<template>
    <div class="online-monitor" v-loading.fullscreen.lock="loading">
        <div class="montior-title">
            <span>所有小区</span>
        </div>
        <div class="montior-main">
            <div class="main-tool">
                <div class="tool-buttons">
                    <mu-button class="warn" :class="indexActive == index+1 ? 'activeBtn': ''"
                        @click="clickBtn(index+1)" v-for="(btn,index) in btns" :key="index">{{btn}}</mu-button>
                </div>
                <div style="display: flex; align-items: center;">
                    <div class="refresh">
                        <span>自动刷新</span>
                        <el-switch v-model="refresh" active-color="#FFA509" inactive-color="#949494" :width="33" @change='changeRefresh'></el-switch>
                    </div>
                    <div class="tool-search" @keydown="search($event)">
                        <el-input v-model="communityName" placeholder="搜索"></el-input>
                        <span class="iconfont iconsousuo icon" @click="search($event)"></span>
                    </div>
                </div>
            </div>
            <div class="main-table">
                <el-table :data="initData.datas" style="width: 100%; margin-bottom: 24px;">
                    <el-table-column prop="company_name" label="公司名称">
                        <template slot-scope="scope">
                            <div style="text-align: left; padding: 0px 12px !important;">{{scope.row.company_name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="community_name" label="小区名称">
                        <template slot-scope="scope">
                            <div style="text-align: left; padding: 0px 12px !important; cursor: pointer;" @click="details(scope.row,'community')">{{scope.row.community_name}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="avg_data" label="平均温度(℃)" >
                        <template slot-scope="scope">
                                <div style="cursor: pointer;"  @click="details(scope.row,'community')">
                                    {{scope.row.avg_data}}
                                </div>
                            </template>
                    </el-table-column>
                    <el-table-column prop="weather.temp" label="室外温度(℃)" >
                        <template slot-scope="scope">
                                <div style="cursor: pointer;"  @click="details(scope.row,'community')">
                                    {{scope.row.weather.temp}}
                                </div>
                            </template>
                    </el-table-column>
                    <el-table-column label="前段 ( 温度℃ )">
                        <el-table-column prop="befor.top.data_value" label="顶">
                            <template slot-scope="scope">
                                <div style="cursor: pointer;" :class="scope.row.befor.top.status === 1 ? 'warnHigh' : scope.row.befor.top.status === 2 ? 'warnLow' : ''" @click="details(scope.row,'1-1')">
                                    {{scope.row.befor.top.data_value}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="befor.bottom.data_value" label="底" >
                            <template slot-scope="scope">
                                <div style="cursor: pointer;" :class="scope.row.befor.bottom.status === 1 ? 'warnHigh' : scope.row.befor.bottom.status === 2 ? 'warnLow' : ''" @click="details(scope.row,'1-2')">
                                    {{scope.row.befor.bottom.data_value}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="befor.side.data_value" label="边" >
                            <template slot-scope="scope">
                                <div style="cursor: pointer;" :class="scope.row.befor.side.status === 1 ? 'warnHigh' : scope.row.befor.side.status === 2 ? 'warnLow' : ''" @click="details(scope.row,'1-3')">
                                    {{scope.row.befor.side.data_value}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="中段 ( 温度℃ )">
                        <el-table-column prop="middle.top.data_value" label="顶" >
                            <template slot-scope="scope">
                                <div style="cursor: pointer;" :class="scope.row.middle.top.status === 1 ? 'warnHigh' : scope.row.middle.top.status === 2 ? 'warnLow' : ''"@click="details(scope.row,'2-1')">
                                    {{scope.row.middle.top.data_value}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="middle.bottom.data_value" label="底" >
                            <template slot-scope="scope">
                                <div style="cursor: pointer;" :class="scope.row.middle.bottom.status === 1 ? 'warnHigh' : scope.row.middle.bottom.status === 2 ? 'warnLow' : ''" @click="details(scope.row,'2-2')">
                                    {{scope.row.middle.bottom.data_value}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="middle.side.data_value" label="边" >
                            <template slot-scope="scope">
                                <div style="cursor: pointer;" :class="scope.row.middle.side.status === 1 ? 'warnHigh' : scope.row.middle.side.status === 2 ? 'warnLow' : ''" @click="details(scope.row,'2-3')">
                                    {{scope.row.middle.side.data_value}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="末段 ( 温度℃ )">
                        <el-table-column prop="back.top.data_value" label="顶" >
                            <template slot-scope="scope">
                                <div style="cursor: pointer;" :class="scope.row.back.top.status === 1 ? 'warnHigh' : scope.row.back.top.status === 2 ? 'warnLow' : ''" @click="details(scope.row,'3-1')">
                                    {{scope.row.back.top.data_value}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="back.bottom.data_value" label="底" >
                            <template slot-scope="scope">
                                <div style="cursor: pointer;" :class="scope.row.back.bottom.status === 1 ? 'warnHigh' : scope.row.back.bottom.status === 2 ? 'warnLow' : ''" @click="details(scope.row,'3-2')">
                                    {{scope.row.back.bottom.data_value}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="back.side.data_value" label="边">
                            <template slot-scope="scope" >
                                <div style="cursor: pointer;" :class="scope.row.back.side.status === 1 ? 'warnHigh' : scope.row.back.side.status === 2 ? 'warnLow' : ''" @click="details(scope.row,'3-3')">
                                    {{scope.row.back.side.data_value}}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
                <el-pagination v-if="initData.datas.length > 0"
                    layout="prev, pager, next, jumper"
                    @current-change='pageChange'
                    prev-click='pageChange'
                    next-click='pageChange'
                    :current-page.sync="page_number"
                    :total="initData.total"
                    :page-size="page_size">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import CommunityDetails from './communityDetails.vue';
export default {
    components: {CommunityDetails},
    data() {
        return {
            loading:true,

            communityName: '' ,
            page_size: 0,
            page_number: 1,
            initData: {
                allDatas: [],
                allTotal: 0,
                total: 0,
                datas: [],
                warnData: [],
                warnTotal: 0
            },
            refresh: true,
            btns: ['全部', '告警'],
            indexActive: 1,

            timer: null
        }
    },
    methods: {
        // 获取小区数据报表
        async getCommunityTable() {
            this.loading = true;
            const { result: { rows, total } } = await this.$http('community/getCommunityTable');
            const weather = await this.getWeather();
            rows.forEach(row => {
                row.weather = weather;
            });
            this.initData.allDatas = rows;
            this.initData.allTotal = total;
            this.initData.total = total;
            this.pageChange(1);
            this.loading = false;
        },
        //换页
        pageChange(current) {
            if(this.indexActive == 1) {
                this.initData.total = this.initData.allTotal;
                let n = Math.ceil(this.initData.total / this.page_size);
                let end = current*this.page_size;
                this.page_number = current;
                if(n === this.page_number) {
                    end = this.initData.total;
                }
                this.initData.datas = this.initData.allDatas.slice((current-1)*this.page_size, end);
            }else {
                this.initData.total = this.initData.warnTotal;
                let n = Math.ceil(this.initData.total / this.page_size);
                let end = current*this.page_size;
                this.page_number = current;
                if(n === this.page_number) {
                    end = this.initData.total;
                }
                this.initData.datas = this.initData.warnData.slice((current-1)*this.page_size, end);
            }

        },
        search(ev) {
            if (ev.type === 'click' || ev.key === 'Enter') {
                this.page_number = 1;
                let datas = [];
                if(this.indexActive == 1) {
                    if(!this.communityName) {
                        this.pageChange(1);
                    }else {
                        this.initData.allDatas.forEach(data => {
                            if(data.community_name.includes(this.communityName)) {
                                datas.push(data);
                            }
                        });
                        this.initData.total = datas.length;
                        this.initData.datas = datas;
                    }
                }else {
                    if(!this.communityName) {
                        this.pageChange(1);
                    }else {
                        this.initData.warnData.forEach(data => {
                            if(data.community_name.includes(this.communityName)) {
                                datas.push(data);
                            }
                        });
                        this.initData.total = datas.length;
                        this.initData.datas = datas;
                    }
                }
            }
        },
        clickBtn(type) {
            this.indexActive = type;
            this.communityName = '';
            if(type === 1) {
                this.pageChange(1);
            }else {
                this.page_number = 1;
                let datas = [];
                this.initData.allDatas.forEach(data => {
                    if(data.status === 1) {
                        datas.push(data);
                    }
                });
                this.initData.warnData = datas;
                this.initData.warnTotal = datas.length;
                this.initData.total = datas.length;
                this.pageChange(1)
            }
        },
        // 小区详情
        details(row,type) {
            const temp = row.weather.temp;
            const buildQuery = {
                community_id: row.community_id,
                ommunity_name: row.community_name,
                temp: temp
            }
            const otherQuery = {}
            if(type !=='community'){
                otherQuery.distance = Number(type.split('-')[0]),
                otherQuery.position = Number(type.split('-')[1])
            }
            const query = Object.assign(buildQuery,otherQuery);
            this.$router.push({
                name: 'CommunityDetails',
                query
            })
        },
        getPageSize() {
            const rowHeight = 60;
            const block = document.querySelector('.montior-main').offsetHeight;
            const rowCount = Math.floor((block - 228) / rowHeight);
            this.page_size = rowCount;
        },
        autoRefresh() {
            this.timer = setInterval(() => {
                this.getCommunityTable();
            },1800000);
        },
        changeRefresh() {
            if(!this.refresh) {
                clearInterval(this.timer);
            }else {
                this.autoRefresh();
            }
        },
        async getWeather() {
            const {result} = await this.$http('weather/getWeather');
            return result;
        }
    },
    mounted() {
        this.getPageSize();
        this.getCommunityTable();
        this.autoRefresh();
        document.querySelector('nav').querySelectorAll('a')[1].classList.add('active-router');
    },
    destroyed(){
        if(this.timer) { //如果定时器在运行则关闭
            clearInterval(this.timer);
        }
        document.querySelector('nav').querySelectorAll('a')[1].classList.remove('active-router');
    }
}
</script>

<style lang="scss">
@import "./onlineMonitor.scss";
</style>
