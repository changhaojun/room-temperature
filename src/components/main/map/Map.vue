<template>
    <div class="amap-page-container">
        
        <div class="header">
            <el-button round :class="[!allActive?'normal':'active']" @click="selectAll()">全部</el-button>
             
            <div class="temp-select">
                <span class="label">温度区间选择</span>
                 <!-- <div class="user-bar unonline-bar"></div>  -->
                <div class="user-bar online-bar">
                    <div class="bar" :style="{width:tempDistribute.cool+ '%',background:'#33ABF1'}" @click="selectLow($event)">
                        <span v-if="tempDistribute.cool">{{tempDistribute.cool}}</span>
                    </div>
                    <div class="bar" :style="{width:tempDistribute.normal+ '%',background:'#FFA509'}" @click="selectNormal($event)">
                        <span v-if="tempDistribute.normal">{{tempDistribute.normal}}</span>
                    </div>
                    <div class="bar" :style="{width:tempDistribute.hot + '%',background:'#FF716A'}" @click="selectHigh($event)">
                        <span v-if="tempDistribute.hot">{{tempDistribute.hot}}</span>
                    </div>
                </div>
               
            </div>
            <div>
                <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
            </div>
            
        </div>
       <el-amap vid="amap-demo"  class="amap-demo" :center="center"  :zoom="zoom">
           <el-amap-marker v-for="(marker,index) in markers" :key="index+'a'"  :position="marker.center" :template="marker.template"></el-amap-marker>
            <!-- <el-amap-circle-marker v-for="(marker,index) in markers" :key="index+'a'" :center="marker.center" :radius="marker.radius" :stroke-weight="marker.strokeWeight" :fill-color="marker.fillColor" :fill-opacity="marker.fillOpacity" :stroke-color="marker.strokeColor" :events="marker.events" :z-index='9999' :content="marker.index"></el-amap-circle-marker>
            <el-amap-text v-for="(marker,index) in markers" :key="index+'b'" :text="marker.text" :position="marker.center" :events="marker.events" :z-index='100' :offset="[42,0]"></el-amap-text> -->
       </el-amap>
    </div>
  </template>
  <script>
  import VueAMap  from 'vue-amap';
    export default {
        data() {
            return {
                allActive:true,
                search:'',
                zoom: 11,
                center: [108.939621,34.343147], 
                markers:[], 
                // marker: [
                //     {
                //         center: [108.939621,34.342347],
                //         fillColor: 'rgba(255,165,9,1)',
                //         index:21,
                //         text:"零壹广场",
                //         events: {
                //             click: () => {
                //             alert('click');
                //             }
                //         }
                //     },
                //     {
                //         center: [108.943621,34.344547],
                //         fillColor: 'rgba(255,113,106,1)',
                //         index:22,
                //         text:"旺座现代",
                //         events: {
                //             click: () => {
                //             alert('click');
                //             }
                //         }
                //     },{
                //         center: [108.929621,34.342378],
                //         fillColor: 'rgba(51,171,241,1)',
                //         index:23,
                //         text:"西安软件",
                //         events: {
                //             click: () => {
                //             alert('click');
                //             }
                //         }
                //     }
                // ],
                searchOption: {
                    city: '陕西',
                    citylimit: true
                },
                tempSelect:[
                    {
                        value:20,
                        color:'#33ABF1'
                    },
                    {
                        value:45,
                        color:'#33ABF1'
                    },
                    {
                        value:23,
                        color:'#FF716A'
                    }
                ]
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
            },
            async getcommunityDistribute(){
                const {result} = await this.$http('community/communityDistribute');
                this.tempDistribute = result;
            },
            selectAll(){
                this.allActive = true;
                this.getAllCommunity();
            },
            selectLow(event){
                this.allActive = false;
            },
            selectNormal(event){
                this.allActive = false;
            },
            selectHigh(){
                this.allActive = false;
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
                const {result:{rows}} = await this.$http(`community/getCommunity`)
                this.analysisData(rows)
            },
            //分析小区数据
            analysisData(data){
                const markers =[];
                const location = [];
                for(let i=0;i<data.length;i++){
                    markers.push({
                        center: [Number(data[i].location.split(",")[0]),Number(data[i].location.split(",")[1])],
                        template: `<div class="marker-box" @click="dialogShow()">
                                        <div class="circle-box" style="background:${data[i].data_value<16?'rgba(51,171,241,1)':data[i].data_value>25?'rgba(255,113,106,1)':'rgba(255,165,9,1)'}">${i}</div>
                                        <div class="marker-text">${data[i].community_name}</div>
                                    </div>`
                    }); 
                }
                this.markers = markers
            },
            dialogShow(){
                console.log(1111)
            },

        },
        created(){
           if(!window.AMap && !window.AMapUI){
                this.initMap()
           }
           this.getAllCommunity();
           this.getcommunityDistribute();
           console.log(this.markers)
        }
    };
</script>
<style lang="scss">
    @import "./Map.scss";
</style>
