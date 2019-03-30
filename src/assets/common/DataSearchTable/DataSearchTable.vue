<template>
    <div class="data-search-table">
        <div class="main-table-title">
            <div class="title">住户列表</div>
            <div class="title-search">
                <el-input placeholder="搜索" v-model="searchUser" @keyup.enter.native="searchUserList">
                    <i slot="suffix" class="iconfont iconsousuo" @click="searchUserList"></i>
                </el-input>
            </div>
        </div>
        <div class="main-table-table">
            <table-page :initData='tableData' :columns='columns' :manager=true :pageNumber='conditions.page_number' :type=1
                @page-change='pageChange' :mapdialog="mapdialog" @select="select">
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
                        label: "编号",
                        prop: "user_number"
                    },
                    {
                        label: "户主名称",
                        prop: "user_house_id"
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
                        prop: "data_value"
                    },
                    {
                        label: "室内温度(℃)",
                        prop: "data_value"
                    },
                    {
                        label: "时间",
                        prop: "data_time"
                    }
                ],
                conditions: {
                    community_id: null,
                    user_number: null,
                    page_size: 8,
                    page_number: 1
                },
                searchUser: ''
            }
        },
        props: ['ID', 'typeOfID','mapdialog'],
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
                console.log(this.searchUser);
                this.tableData.total = 0;
                this.tableData.datas = [];
                this.conditions.page_number = 1;
                this.getTableData();
            },
            pageChange(current) {
                this.conditions.page_number = current.data;
                this.getTableData();
            },
            async getTableData() {
                let res = '';
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
                } else {
                    res = await this.$http.get(
                        'building/getHouse', {
                            data: {
                                building_id: this.ID,
                                user_number: this.searchUser,
                                page_size: 10,
                                page_number: 1,
                            } 

                        });
                }

                this.tableData.total = res.result.total;
                this.tableData.datas = res.result.rows;
                console.log('this.tableData', this.tableData);

            },
            select(item){
               this.$emit("select",item)
            }
        },
        mounted() {
             this.getTableData();
            //console.log('this.building', this.buildingID);
        },
    }

</script>

<style lang="scss">
    @import "./DataSearchTable.scss";

</style>
