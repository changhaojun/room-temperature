<template>
    <div id="warn_config">
        <div class="warn_config_main">
            <div class="config_header">
                <h4>配置告警</h4>
                <div>
                    <el-input
                        size="small"
                        placeholder="搜索"
                        suffix-icon="el-icon-search"
                        v-model="configSearch">
                    </el-input>
                </div>
            </div>
            <div class="config_tabel" ref="config_tabel">
                <el-table
                    border
                    :data="tableData"
                    style="width: 98%">
                    <el-table-column
                        align="center"
                        prop="commu_name"
                        label="小区名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="high"
                        label="高温告警阀值">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="low"
                        label="低温告警阀值">
                    </el-table-column>
                </el-table>
            </div>
            <div class="config_footer">
                <el-pagination
                    :page-size="20"
                    :pager-count="11"
                    layout="prev, pager, next"
                    :total="1000">
                </el-pagination>
                <div class="jump">
                    <span>前往</span><input type="text" :model="jump_page">页
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            configSearch: '',
            tableData: [
                {
                    commu_name: '1112',
                    high: '>24',
                    low: '<16'
                },
                {
                    commu_name: '1112',
                    high: '>24',
                    low: '<16'
                },
                {
                    commu_name: '1112',
                    high: '>24',
                    low: '<16'
                }
            ],
            page:{
                pageSize: 10
            },
            jump_page: 1
        }
    },
    mounted() {

    }
}
</script>

<style lang="scss">
@import './../../../assets/styles/mixin.scss';
#warn_config {
    width: calc(100% - 60px);
    height: calc(100% - 60px);
    margin: 30px;
    background: #fff;
    @include baseShadow;
    >.warn_config_main{
        width: 100%;
        height: 100%;
        >.config_header{
            height: 60px;
            line-height: 60px;
            >h4{
                width: 60%;
                height: 60px;
                float: left;
                text-indent: 20px;
                font-size: 18px;
                font-weight: 900
            }
            >div{
                margin-right: 20px;
                width: 20%;
                height: 60px;
                float: right;
                input {
                    border-radius: 13px;
                    background: rgba(0, 0, 0, .05);
                    border: 0;
                    color: #000
                }
            }
        }
        >.config_tabel{
            width: 100%;
            height: calc(100% - 110px);
            padding-left: 1%;
            thead{
                th{
                    height: 70px;
                    background:rgba(248,248,249,1);
                }
            }
            .el-table{
                height: 100%;
                .el-table__body-wrapper {
                    // height: 100%;d
                    table{
                        height: 100%;
                        tbody{
                            height: 100%;
                            tr{
                                height: 10% !important;
                            }
                        }
                    }
                }
            }
        }

        >.config_footer{
            width: 100%;
            height: 45px;
            line-height: 50px;
            padding-top: 5px;
            position: relative;
            >.jump{
                position: absolute;
                right: 30px;
                top: 0;
                >input{
                    width: 40px;
                    height: 24px;
                    margin: 0 5px;
                    background: rgba(0, 0, 0, .05);
                    border-radius: 4px;
                    border: 1px solid #ccc;
                    outline: none;
                    text-indent: 5px;
                }
            }
        }
    }
}

</style>
