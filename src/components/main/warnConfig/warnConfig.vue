<template>
    <div id="warn_config">
        <el-dialog
            :visible.sync="changeConfigShow"
            top="20%"
            width="380px">
            <div class="change_header">
                <h3>
                    <span>{{dialogTit}}</span>
                    <i class="el-icon-close" @click="changeConfigShow = false"></i>
                </h3>
            </div>
            <div class="input-list" style="padding:20px;">
                <div class="input-item">
                    <span>高温告警阀值：</span>
                    <el-input prefix-icon="el-icon-arrow-left" size="small" v-model="newConfig.high_warn"></el-input>
                </div>
                <div class="input-item">
                    <span>低温告警阀值：</span>
                    <el-input prefix-icon="el-icon-arrow-right" size="small" v-model="newConfig.low_warn"></el-input>
                </div>
            </div>
            <div class="change_footer">
                <el-button type="warning" round size="small" @click="suerChange">提交</el-button>
                <el-button round size="small" style="margin-left:120px;" @click="changeConfigShow = false">取消</el-button>
            </div>
        </el-dialog>
        <div class="warn_config_main">
            <div class="config_header">
                <h4>配置告警</h4>
                <div>
                    <el-input
                        size="small"
                        @change="getConfigList"
                        @keyup.enter.native="getConfigList"
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
                    @row-click="changeConfig"
                    style="width: 98%">
                    <el-table-column
                        prop="community_name"
                        label="小区名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="high_warn"
                        label="高温告警阀值">
                        <template slot-scope="scope">
                            <div :class="scope.row.highclass">{{scope.row.high_warn}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="low_warn"
                        label="低温告警阀值">
                        <template slot-scope="scope">
                            <div :class="scope.row.lowclass">{{scope.row.low_warn}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="config_footer">
                <el-pagination
                    :page-size="page.page_size"
                    layout="prev, pager, next"
                    :total="total">
                </el-pagination>
                <div class="jump" v-if="total > 1">
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
            tableData: [],
            page:{
                page_size: 10,
                page_number: 1
            },
            jump_page: 1,
            total:0,
            changeConfigShow: false,
            dialogTit: '',
            newConfig: {
                high_warn: '',
                low_warn: ''
            },
            changeId: 0
        }
    },

    methods: {
        async getConfigList() {
            const {result:{rows,total}} = await this.$http('warn/config', {
                data: Object.assign(this.page, {key: this.configSearch})
            });
            for(const row of rows) {
                const {high_warn, low_warn} = row;
                if(high_warn === null) {
                    row.high_warn = '未配置';
                    row.highclass = 'nohightConfig'
                }
                if(low_warn === null) {
                    row.low_warn = '未配置'
                    row.lowclass = 'nolowConfig'
                }
            }
            this.tableData = rows;
            this.total = total;
        },

        changeConfig(row, column, event) {
            this.changeConfigShow = true;
            const {community_name,id} = row;
            this.dialogTit = community_name;
            this.changeId = id;
        },
        async suerChange() {
            const res = await this.$http.put('warn/config', {
                id: this.changeId,
                high_warn: '>' + this.newConfig.high_warn,
                low_warn: '<' + this.newConfig.low_warn
            })
            this.$message({
                message: '修改成功',
                type: 'success',
                duration: 1000
            })
            this.changeConfigShow = false;
            this.getConfigList()
        }
    },
    mounted() {
        this.getConfigList();
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
    .el-dialog__header{
        height: 0;
        display: none;
    }
    .el-dialog__body{
        padding: 0
    }
    .change_header{
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid rgba(233,234,236,1);
        position: relative;
        >h3{
            height: 50px;
            text-indent: 20px;
            >span{
                font-size: 18px;
                color: #464c5b;
                font-weight: 600;
            }
            >i{
                position: absolute;
                right: 20px;
                top:18px;
                cursor: pointer;
                transition: all linear 0.5s;
                &:hover{
                    color: skyblue;
                }
            }
        }
    }
    .input-list{
        .input-item{
            margin-bottom: 20px;
            margin-left: 10px;
            >span{
                font-size: 14px;
                color: #464c5b;
                margin-right: 20px;
            }
        }
        .el-input{
            width: 50%;
        }
    }
    .change_footer{
        margin-top: -10px;
        padding: 15px;
        border-top: 1px solid rgba(233,234,236,1);
        button{
            margin-left:20px;
            height:26px;
            line-height:26px;
            padding:0;
            width:90px
        }
    }
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
                .nohightConfig,.nolowConfig{
                    color: #FF716A;
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
