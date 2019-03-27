<template>
    <div class="data-search">
        <div class="menu">
            <DataSearchMenu @clickBuliding="getClickedBuilding" @clickCommunity="getClickedCommunity"></DataSearchMenu>
        </div>
        <div class="main">
            <div class="main-top">
                <!-- typeOfID=0代表是小区id，typeOfID=1代表是楼id -->
                <DataSearchTop :ID="ID" :typeOfID="typeOfID"></DataSearchTop>
            </div>

            <div class="main-table">

            </div>
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
                typeOfID: -1
            }
        },
        methods: {
            getClickedBuilding(clickedBuilding) {
                this.ID = clickedBuilding.building_id;
                this.typeOfID = 1;
                //console.log('clickedBuilding', clickedBuilding);
            },
            getClickedCommunity(clickedCommunity) {
                this.ID = clickedCommunity.community_id;
                this.typeOfID = 0;
                //console.log('clickedCommunity', clickedCommunity);
            }

        },
        mounted() {},
        components: {
            DataSearchTop,
            DataSearchMenu
        }
    }

</script>

<style lang="scss">
    @import "./DataSearch.scss";

</style>
