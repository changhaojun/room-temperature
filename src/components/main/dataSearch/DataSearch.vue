<template>
    <div class="data-search">
        <div class="menu">
            <data-search-menu @clickBuliding="getClickedBuilding" @clickCommunity="getClickedCommunity"></data-search-menu>
        </div>
        <el-scrollbar class="main-scrollbar">
            <div class="main">
                <div class="main-top">
                    <!-- typeOfID=0代表是小区id，typeOfID=1代表是楼id -->
                    <data-search-top :ID="ID" :typeOfID="typeOfID"></data-search-top>
                </div>
                <div class="main-table">
                    <data-search-table :ID="ID" :typeOfID="typeOfID"></data-search-table>
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
            },
            getClickedCommunity(clickedCommunity) {
                this.ID = clickedCommunity.community_id;
                this.typeOfID = 0;
            },


        },
        mounted() {},
    }

</script>

<style lang="scss">
    @import "./DataSearch.scss";

</style>
