<template>
    <div class="analysis">
        <div class="menu">
            <DataSearchMenu></DataSearchMenu>
        </div>
        <div class="main">
            <el-scrollbar>
                <div class="main-top"></div>
                <div class="main-data"></div>
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
            }
        },
        methods: {
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
