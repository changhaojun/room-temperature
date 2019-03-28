<template>
    <div class="data-search">
        <div class="menu">
            <DataSearchMenu @clickBuliding="getClickedBuilding" @clickCommunity="getClickedCommunity"></DataSearchMenu>
        </div>
        <el-scrollbar class="main-scrollbar">
            <div class="main">
                <div class="main-top">
                    <!-- typeOfID=0代表是小区id，typeOfID=1代表是楼id -->
                    <DataSearchTop :ID="ID" :typeOfID="typeOfID"></DataSearchTop>
                </div>
                <div class="main-table">
                    <DataSearchTable :ID="ID" :typeOfID="typeOfID"></DataSearchTable>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>

    export default {
        components: {
            DataSearchTop: () => import('@common/DataSearchTop/DataSearchTop'),
            DataSearchMenu: () => import('@common/DataSearchMenu/DataSearchMenu'),
            DataSearchTable: () => import('@common/DataSearchTable/DataSearchTable')
        },
        data() {
            return {
                ID: -1,
                typeOfID: -1,
            }
        },
        methods: {
            getClickedBuilding(clickedBuilding) {
                this.ID = clickedBuilding.building_id;
                this.typeOfID = 1;
                /*this.tableData.total = 0;
                this.tableData.datas = [];
                this.searchUser = '';
                this.conditions.page_number = 1;
                this.getTableData();*/
            },
            getClickedCommunity(clickedCommunity) {
                this.ID = clickedCommunity.community_id;
                this.typeOfID = 0;
                /*this.tableData.total = 0;
                this.tableData.datas = [];
                this.searchUser = '';
                this.conditions.page_number = 1;
                this.getTableData();*/
            },


        },
        mounted() {},
    }

</script>

<style lang="scss">
    @import "./DataSearch.scss";

</style>
