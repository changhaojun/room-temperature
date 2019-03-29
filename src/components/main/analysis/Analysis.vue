<template>
    <div class="analysis">
        <div class="menu">
            <DataSearchMenu @clickBuliding="getClickedBuilding" @clickCommunity="getClickedCommunity"></DataSearchMenu>
        </div>
        <div class="main">
            <el-scrollbar>
                <div class="main-top"></div>
                <div class="main-data">
                    <DataSearchTop :ID="ID" :typeOfID="typeOfID"></DataSearchTop>
                </div>
                <div class="main-histogram"></div>
                <div class="main-linechart"></div>
            </el-scrollbar>

        </div>
    </div>
</template>

<script>
    import DataSearchTop from '../../../assets/common/DataSearchTop/DataSearchTop.vue';
    import DataSearchMenu from '../../../assets/common/DataSearchMenu/DataSearchMenu.vue';
    export default {
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
                console.log(this.ID);
            },
            getClickedCommunity(clickedCommunity) {
                this.ID = clickedCommunity.community_id;
                this.typeOfID = 0;
                console.log(this.ID);
            },
        },
        components: {
            DataSearchTop,
            DataSearchMenu,
        }
    }

</script>

<style lang="scss">
    @import "./Analysis.scss";

</style>
