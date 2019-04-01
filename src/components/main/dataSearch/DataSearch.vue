<template>
    <div class="data-search">
        <div class="menu">
            <data-search-menu @clickedItem="getClickedItem"></data-search-menu>
        </div>
        <el-scrollbar class="main-scrollbar">
            <div class="main">
                <div class="main-top">
                    <!-- typeOfID=0代表是小区id，typeOfID=1代表是楼id -->
                    <data-search-top :ID="ID" :typeOfID="typeOfID" :typeOfComponent=0></data-search-top>
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
                ID: '',
                typeOfID: '',
                //typeOfID=-1代表是公司id，typeOfID=0代表是小区id，typeOfID=1代表是楼id
            }
        },
        methods: {
            //itemType=0代表公司，itemType=1代表小区，itemType=2代表楼
            getClickedItem(clickedItem) {
                this.ID = clickedItem.itemID;
                this.typeOfID = clickedItem.itemType - 1;
            }

        },
        mounted() {},
    }

</script>

<style lang="scss">
    @import "./DataSearch.scss";

</style>
