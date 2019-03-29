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
        <div v-if="manager" style="display: flex; align-items: center;" @keydown="search">
            <div class="tool-search">
                <el-input v-model="currentParams.communityName"  placeholder="搜索"></el-input>
                <span class="iconfont iconsousuo icon" @click="search"></span>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    props: ['date', 'manager'],
    data() {
        return {
            dateArray: [],
            currentParams: {
                startTime: '',
                endTime: '',
                communityName: ''
            },
            btns: ['72小时', '本月', '供暖季'],
            indexActive: 1
        }
    },
    methods: {
        // 日期发生变化
        changeDate() {
            this.currentParams.startTime = moment(this.dateArray[0]).format('YYYY-MM-DD');
            this.currentParams.endTime = moment(this.dateArray[1]).format('YYYY-MM-DD');
            this.sendParams();
        },
        search(ev) {
            if (ev.type === 'click' || ev.key === 'Enter') {
                this.sendParams();
            } 
        },
        clickBtn(type) {
            if(type === 1) {
                this.currentParams.startTime = moment(moment().subtract(3,'days')).format('YYYY-MM-DD');
                this.currentParams.endTime = moment().format('YYYY-MM-DD');
            }else if(type === 2) {
                this.currentParams.startTime = moment(moment().month(moment().month()).startOf('month').valueOf()).format('YYYY-MM-DD');
                this.currentParams.endTime = moment().format('YYYY-MM-DD');
            }else {
                this.currentParams.startTime = moment().format('YYYY-11-15');
                this.currentParams.endTime = moment(moment(this.currentParams.startTime).add(4,'month')).format('YYYY-MM-DD');
            }
            this.indexActive = type;
            this.sendParams();
        },
        sendParams() {
            this.$emit('current-change', this.currentParams);
        },
    },
    created() {
        this.dateArray = this.date
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
        }
        .tool-buttons {
            margin-left: 40px;
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

