<template>
    <div class="amap-page-container">
        
        <div class="header">
            <el-button round :class="[!allActive?'normal':'active']" @click="selectAll()">全部</el-button>
             
            <div class="temp-select">
                <span class="label">温度区间选择</span>
                 <!-- <div class="user-bar unonline-bar"></div>  -->
                <div class="user-bar online-bar">
                    <div class="bar" :class="[activeIndex===index?'clickBar':'']" v-for="(item,index) in tempSelect" :key="index+'m'" :style="{width:item.value/communityCount*100+ '%',background:item.name==='cool'?'#33ABF1':item.name==='normal'?'#FFA509':'#FF716A'}" @click="selectTemp(index)">
                        <span>{{item.value}}</span>
                    </div>
                </div>
            </div>
            <div>
                <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
            </div>
        </div>
       <el-amap vid="amap-demo"  class="amap-demo" id="container" :center="center"  :zoom="zoom" map-style="amap://styles/3b77fc3578a70a921c30f4ecd84f2973">
           <el-amap-marker v-for="(marker,index) in markers" :key="index+'a'"  :position="marker.center" :template="marker.template"></el-amap-marker>
            <!-- <el-amap-circle-marker v-for="(marker,index) in markers" :key="index+'a'" :center="marker.center" :radius="marker.radius" :stroke-weight="marker.strokeWeight" :fill-color="marker.fillColor" :fill-opacity="marker.fillOpacity" :stroke-color="marker.strokeColor" :events="marker.events" :z-index='9999' :content="marker.index"></el-amap-circle-marker>
            <el-amap-text v-for="(marker,index) in markers" :key="index+'b'" :text="marker.text" :position="marker.center" :events="marker.events" :z-index='100' :offset="[42,0]"></el-amap-text> -->
       </el-amap>
       <el-dialog
            :title="dialogParams.title"
            :visible.sync="dialogParams.dialogVisible"
            width="30%"
            custom-class="message-box"
            >
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogParams.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogParams.dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
  </template>
  <script>
  import VueAMap  from 'vue-amap';
//   import AMap from 'vue-amap';
  let _this={}
    export default {
        data() {
            return {
                activeIndex:-1,
                allActive:true,
                search:'',
                zoom: 12,
                center: [108.939621,34.343147], 
                markers:[], 
                communityCount:0,
                searchOption: {
                    city: '陕西',
                    citylimit: true
                },
                copyMarkers:[],
                tempSelect:[],
                dialogParams:{
                    dialogVisible:true,
                    title:""
                },
            };
        },
        methods:{
            initMap(){
                VueAMap .initAMapApiLoader({
                    // 高德key
                    key: 'f2d741c58347b3ac9de107fd34386cb6',
                    // 插件集合 （插件按需引入）
                    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
                });
                // new AMap.Map('container',{
                //     mapStyle: 'amap://styles/3b77fc3578a70a921c30f4ecd84f2973',
                // });
            },
            async getcommunityDistribute(){
                const {result} = await this.$http('community/communityDistribute');
                this.tempSelect =[{name:'cool',value:result.cool},{name:'normal',value:result.normal},{name:'hot',value:result.hot}]
            },
            selectAll(){
                this.allActive = true;
                this.activeIndex = -1;
                this.getAllCommunity();
               
            },
            selectTemp(index){
                this.allActive = false;
                this.activeIndex = index;
                this.markers =  this.copyMarkers.filter((item)=>{return item.status===(index+1)})
            },
            //搜索小区
            onSearchResult(pois) {
                let latSum = 0;
                let lngSum = 0;
                if (pois.length > 0) {
                    pois.forEach(poi => {
                    let {lng, lat} = poi;
                    lngSum += lng;
                    latSum += lat;
                    });
                    let center = {
                    lng: lngSum / pois.length,
                    lat: latSum / pois.length
                    };
                    this.center = [center.lng, center.lat];
                }
            },
            //获取全部小区
            async getAllCommunity(){
                this.markers = [];
                const {result:{rows,total}} = await this.$http(`community/getCommunity`)
                this.analysisData(rows)
                this.communityCount = total;
            },
            //分析小区数据 1:低温 2：常温 3：高温
            analysisData(data){
                const markers =[];
                const location = [];
                for(let i=0;i<data.length;i++){
                    markers.push({
                        center: [Number(data[i].location.split(",")[0]),Number(data[i].location.split(",")[1])],
                        template: `<div class="marker-box" @click="dialogShow($event)">
                                        <div class="circle-box" style="background:${data[i].data_value<16?'rgba(51,171,241,1)':data[i].data_value>25?'rgba(255,113,106,1)':'rgba(255,165,9,1)'}">${Math.floor(data[i].data_value)}</div>
                                        <div class="marker-text">${data[i].community_name}</div>
                                    </div>`,
                        status:data[i].data_value<16?1:data[i].data_value>25?3:2
                    }); 
                }
                this.markers = markers
                this.copyMarkers = markers;
            },
            dialogShow(event){
                // alert("click")
                console.log(_this)
                
                _this.dialogParams.dialogVisible = true;
                // this.dialogParams.title = name;
            },
        },
        created(){
           if(!window.AMap && !window.AMapUI){
                this.initMap()
           }
           console.log(this)
           this.getAllCommunity();
           this.getcommunityDistribute();
        },
         beforeCreate(){
            _this = this;
        }
    };
</script>
<style lang="scss">
    @import "./Map.scss";
</style>
