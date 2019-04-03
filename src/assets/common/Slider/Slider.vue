<template>
    <div :style="{display:'inline-block',width:width+'%',height:'100%',display:'flex',alignItems: 'center',marginLeft:'20px'}" class="slider">
        <div class="block" :style="{width:width+'%'}">
            <el-slider
                v-model="select"
                range
                :max="max"
                :show-tooltip="true"
                @change="tempChange"
            >
            </el-slider>
            
        </div>
        <span style="margin-left:10px;">当前选择的温度区间：{{select[0]}}℃ ~ {{select[1]}}℃</span>
    </div>
</template>
<script>
export default {
    props:['tempArr','width','max'],
    data(){
        return{
            select:[]
        }
    },
    watch:{
        tempArr(value){
            this.select= value
        }
    },
    methods:{
        tempChange(arr){
            // this.tempArr = arr;
            this.$emit("tempChange",arr)
        }
    },
    mounted(){
        this.select=this.tempArr;
    }
}
</script>
<style lang="scss">
.el-slider__button{
    border: 2px solid #f59f6c;
}
</style>


