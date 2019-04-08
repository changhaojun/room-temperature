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
                <div style="display: flex; align-items: center;">
                    <el-radio-group v-model="groupParams.readState" @change='changeGroup'>
                        <el-radio-button :label="item" v-for="item in radioRead" :key="item"></el-radio-button>
                    </el-radio-group>
                    <el-radio-group v-model="groupParams.configType" @change='changeGroup'>
                        <el-radio-button :label="item" v-for="item in radioUser" :key="item"></el-radio-button>
                    </el-radio-group>
                </div>
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

            radioRead: ['全部', '未读', '已读'],
            radioUser: ['全部', '用户', '系统'],
            groupParams: {
                readState: '全部',
                configType: '全部'
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
                // start = moment(moment().month(moment().month()).startOf('month').valueOf());
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
            console.log(this.currentParams)
            // const dataObj = {
            //     startTime:moment(startTime).add(1,'day').format('YYYY-MM-DD'),
            //     endTime:moment(endTime).add(1,'day').format('YYYY-MM-DD'),
            // }
            // console.log(dataObj)
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
            margin-left: 40px;
            .mu-raised-button {
                font-size: 16px;
            }
            button {
                width:87px;
                height:29px;
                border-radius:15px;
                margin-right: 32px;
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
            margin-right: 40px;
            .el-radio-group {
                margin-left: 20px;
            }
            .el-radio-button__inner {
                padding: 0 4px;
                font-size: 14px;
            }
            .el-radio-button__inner {
                border: none;
                &:hover {
                    color: #ffa509;
                }
            }
            .el-radio-button__orig-radio:checked+.el-radio-button__inner {
                color: #ffa509;
                background-color: transparent;
                border-color: transparent;
                box-shadow: -1px 0 0 0 transparent;
            }
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
</style>

