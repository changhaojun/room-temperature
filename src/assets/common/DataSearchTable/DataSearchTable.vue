<template>
    <div class="data-search-table">
        <div class="main-table-title">
            <div class="title">住户列表</div>
            <div class="title-search">
                <el-input placeholder="搜索房间号" v-model="searchUser" @keyup.enter.native="searchUserList">
                    <i slot="suffix" class="iconfont iconsousuo" @click="searchUserList"></i>
                </el-input>
            </div>
        </div>
        <div class="main-table-table">
            <table-page :initData="tableData" :columns="columns" :manager=true :pageNumber="conditions.page_number"
                :type=3 @page-change="pageChange" :mapdialog="mapdialog" @select="select">
            </table-page>
        </div>
    </div>
</template>

<script>
    import tablePage from '../../../components/main/onlineMonitor/tablePage.vue';
    export default {
        data() {
            return {
                tableData: {
                    total: 0,
                    datas: []
                },
                columns: [{
                        label: "时间",
                        prop: "data_time",
                        width: 180
                    },
                    {
                        label: "分公司名称",
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
                        label: "编号",
                        prop: "user_number"
                    },
                    {
                        label: "住户名称",
                        prop: "username"
                    },
                    {
                        label: "设备SN",
                        prop: "device_sn",
                        width: 150
                    },
                    {
                        label: "信号",
                        prop: "csq_alarm"
                    },
                    {
                        label: "状态",
                        prop: "status"
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
                        label: "湿度(%)",
                        prop: "humi_data",
                        width: 100
                    },
                    {
                        label: "室外温度(℃)",
                        prop: "weather",
                        width: 100
                    },
                    {
                        label: "室内温度(℃)",
                        prop: "data_value",
                        width: 100
                    },

                ],
                conditions: {
                    community_id: null,
                    user_number: null,
                    page_size: 8,
                    page_number: 1
                },
                searchUser: '',
                weather: ''
            }
        },
        //typeOfID=-1代表是公司id，typeOfID=0代表是小区id，typeOfID=1代表是楼id
        props: ['ID', 'typeOfID', 'mapdialog'],
        watch: {
            ID: {
                handler() {
                    this.conditions.page_number = 1
                    this.getTableData();
                }
            }
        },
        components: {
            tablePage
        },
        methods: {
            searchUserList() {
                this.tableData.total = 0;
                this.tableData.datas = [];
                this.conditions.page_number = 1;
                this.getTableData();
            },
            pageChange(current) {
                this.conditions.page_number = current.data;
                this.getTableData();
            },
            async getWeather() {
                const res = await this.$http.get('weather/getWeather');
                this.weather = res.result.temp;
            },
            async getTableData() {
                let res = '';
                //typeOfID=-1代表是公司id，typeOfID=0代表是小区id，typeOfID=1代表是楼id
                if (this.typeOfID == 0) {
                    res = await this.$http.get(
                        'community/getHouse', {
                            data: {
                                community_id: this.ID,
                                user_number: this.searchUser,
                                page_size: 10,
                                page_number: this.conditions.page_number,
                            }
                        });
                } else if (this.typeOfID == 1) {
                    res = await this.$http.get(
                        'building/getHouse', {
                            data: {
                                building_id: this.ID,
                                user_number: this.searchUser,
                                page_size: 10,
                                page_number: this.conditions.page_number,
                            }

                        });
                } else if (this.typeOfID == -1) {
                    res = await this.$http.get(
                        'company/getHouse', {
                            data: {
                                company_id: this.ID,
                                user_number: this.searchUser,
                                page_size: 10,
                                page_number: this.conditions.page_number,
                            }

                        });
                }
                let rows = res.result.rows;
                for (const row of rows) {
                    row.distance = row.distance === 1 ? '近' : row.distance === 2 ? '中' : row.distance === 3 ? '远' :
                        '';
                    row.position = row.position === 1 ? '顶' : row.position === 2 ? '底' : row.position === 3 ? '边' :
                        '';
                    row.csq_alarm = row.csq_alarm === 0 ? '正常' : row.csq_alarm === 1 ? '弱' : '';
                    row.status = row.status === 0 ? '离线' : row.status === 1 ? '在线' : '';

                    row.weather = Number(this.weather.split('℃')[0]);
                };
                this.tableData.total = res.result.total;
                this.tableData.datas = res.result.rows;
                this.$emit('tableLoadingCompleted');
            },
            select(item) {
                this.$emit("select", item)
            }
        },
        mounted() {
            if (this.ID) {
                this.getTableData();
            }
            this.getWeather();
        },
    }

</script>

<style lang="scss">
    @import "./DataSearchTable.scss";

</style>
