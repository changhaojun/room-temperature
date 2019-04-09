<template>
    <div class="conditions-tools">
        <div style="display: flex; align-items: center;">
            <div class="tool-date">
                <el-date-picker
                    v-model="dateArray"
                    type="daterange"
                    range-separator="-"
                    @change="changeDate">
                </el-date-picker>
            </div>
            <div class="tool-buttons">
                <mu-button color="" class="warn" :class="indexActive == index+1 ? 'activeBtn': ''"
                    @click="clickBtn(index+1)" v-for="(btn,index) in btns" :key="index">{{btn}}</mu-button>
            </div>
        </div>
        <div style="display: flex; align-items: center;">
            <div v-if="group" class="tool-radio">
                <el-select v-model="groupParams.configType" @change="changeGroup">
                    <el-option
                        v-for="(item,index) in configType"
                        :key="index"
                        :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="groupParams.readState" @change="changeGroup">
                    <el-option
                        v-for="(item,index) in readState"
                        :key="index"
                        :value="item">
                    </el-option>
                </el-select>
                <el-select v-model="groupParams.alarmType" @change="changeGroup">
                    <el-option
                        v-for="(item,index) in alarmType"
                        :key="index"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
            <div v-if="manager" style="display: flex; align-items: center;" @keydown="search">
                <div class="tool-search">
                    <el-input v-model="currentParams.key"  placeholder="小区名称"></el-input>
                    <span class="iconfont iconsousuo icon" @click="search"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    props: ['date', 'group', 'manager', 'toggle'],
    data() {
        return {
            dateArray: [],
            currentParams: {
                startTime: '',
                endTime: '',
                key: ''
            },
            btns: ['72小时', '近7天', '近30天'],
            indexActive: 1,

            configType: ['触发 (全部)', '用户', '系统'],
            readState: ['状态 (全部)', '未读', '已读'],
            alarmType: ['告警 (全部)', '温度告警', '低电', '信号'],
            groupParams: {
                configType: '触发 (全部)',
                readState: '状态 (全部)',
                alarmType: '告警 (全部)'
            }
        }
    },
    methods: {
        // 日期发生变化
        changeDate() {
            this.currentParams.startTime = moment(this.dateArray[0]).format('YYYY-MM-DD');
            this.currentParams.endTime = moment(this.dateArray[1]).add(1, 'days').format('YYYY-MM-DD');
            this.sendParams();
            this.indexActive = 0;
        },
        search(ev) {
            if (ev.type === 'click' || ev.key === 'Enter') {
                this.sendParams();
            }
        },
        clickBtn(type) {
            let start = null;
            if(type === 1) {
                start = moment(moment().subtract(3,'days'));
            }else if(type === 2) {
                start = moment().subtract('days', 7);
            }else {
                start = moment().subtract('days', 30);
            }
            this.currentParams.startTime = start.format('YYYY-MM-DD HH');
            this.currentParams.endTime = moment().format('YYYY-MM-DD HH');
            this.dateArray = [start, moment()];
            this.indexActive = type;
            this.sendParams();
        },
        sendParams() {
            const {endTime,startTime} = this.currentParams;
            this.$emit('current-change', this.currentParams);
        },
        // 改变组
        changeGroup() {
            this.$emit('group-change', this.groupParams);
        }
    },
    watch: {
        toggle: {
            handler(newVal) {
                this.dateArray = this.date;  // 改变默认时间
                this.indexActive = 1; // 改变按钮状态
            },
            deep: true
        }
    },
    created() {
        this.dateArray = this.date;
        this.currentParams.startTime = moment(this.dateArray[0]).format('YYYY-MM-DD');
        this.currentParams.endTime = moment(this.dateArray[1]).format('YYYY-MM-DD');
    }
}
</script>

<style lang="scss">
    .conditions-tools {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .tool-date {
            .el-range-editor.el-input__inner {
                width: 276px;
            }
            .el-date-editor .el-range-input {
                color: rgba(70,76,91,1);
            }
            .el-date-editor .el-range__close-icon {
                display: none;
            }
            .el-picker-panel__body{
                z-index: 1000
            }
        }
        .tool-buttons {
            .mu-raised-button {
                font-size: 16px;
            }
            button {
                width:87px;
                height:29px;
                border-radius:15px;
                margin-left: 20px;
                font-family:SourceHanSansCN-Normal;
                font-weight:400;
            }
            .warn {
                border:1px solid rgba(148, 148, 148, 1);
                color:rgba(148,148,148,1);
            }
            .activeBtn {
                color: #fff;
                border:1px solid rgba(255,165,9,1);
                background:rgba(255,165,9,1);
                box-shadow:0px 5px 10px 0px rgba(255,165,9,0.71);
            }
        }
        .tool-radio {
            font-family:SourceHanSansCN-Regular;
            font-size:14px;
            .el-select {
                width: 118px;
                margin-right: 20px;
                .el-input__inner {
                    border-radius:15px;
                    height:30px;
                    background:rgba(255,255,255,0);
                    border:1px solid rgba(148, 148, 148, 1);
                }
                .el-input__icon {
                    line-height: 30px;
                }
                .el-input.is-focus .el-input__inner {
                    background:rgba(255,255,255,1);
                    border:1px solid rgba(255, 153, 0, 1);
                }
            }
            .el-select .el-input .el-select__caret {
                color: rgba(110,110,110,1);
            }
            
            // .el-radio-group {
            //     margin-left: 20px;
            // }
            // .el-radio-button__inner {
            //     padding: 0 4px;
            //     font-size: 14px;
            // }
            // .el-radio-button__inner {
            //     border: none !important;
            //     &:hover {
            //         color: #ffa509;
            //     }
            // }
            // .el-radio-button__orig-radio:checked+.el-radio-button__inner {
            //     color: #ffa509;
            //     background-color: transparent !important;
            //     border-color: transparent !important;
            //     box-shadow: -1px 0 0 0 transparent !important;
            // }
        }
        .tool-search {
            position: relative;
            .el-input__inner {
                width:201px;
                height:34px;
                background:rgba(237,239,242,1);
                border-radius:17px;
                padding-right: 30px;
            }
            input::-webkit-input-placeholder {
                font-size:14px;
                font-family:SourceHanSansCN-Regular;
                font-weight:bold;
                color:rgba(114,114,114,1);
                opacity:0.6;
            }
            .icon {
                position: absolute;
                top: 7px;
                right: 10px;
                color:rgba(0,0,0,1);
                opacity:0.4;
                font-size: 14px;
                cursor: pointer;
            }
        }
    }
    .el-select-dropdown__item.selected {
        color:#606266;
        font-weight: 400;
        background:rgba(255,153,0,0.08);
    }
    .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
        background:rgba(255,153,0,0.04);
    }
</style>

