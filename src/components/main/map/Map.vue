<template>
    <div class="amap-page-container">
        
        <div class="header">
            <!-- <el-button round  @click="selectAll()">全部</el-button> -->
            <mu-button round :class="[!allActive?'normal':'active']"  @click="selectAll()">全部</mu-button>
            <div class="temp-select">
                <span class="label">温度区间选择</span>
                 <!-- <div class="user-bar unonline-bar"></div>  -->
                <div class="user-bar online-bar">
                    <div class="bar" :class="[activeIndex===index?'clickBar':'']" v-for="(item,index) in tempSelect" :key="index+'m'" :style="{width:item.value/communityCount*100+ '%',background:item.name==='cool'?'#33ABF1':item.name==='normal'?'#FFA509':'#FF716A'}" @click="selectTemp(index)">
                        <span v-if="item.value">{{item.value}}</span>
                    </div>
                </div>
            </div>
            <div>
                <el-select
                v-model="searchData.inputText"
                filterable
                remote
                placeholder='搜索小区'
                :remote-method="remoteMethod"
                popper-class="search-box"
                @change='onSearchResult'
                @blur='blur'
                >
                <el-option
                  v-for="item in searchData.searchResult"
                  :key="item.community_id"
                  :label="item.community_name"
                  :value="item.location">
                </el-option>
              </el-select>
                <!-- <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box> -->
            </div>
        </div>
       <el-amap vid="amap-demo" ref="map" class="amap-demo" id="container" :center="center" :zooms="zooms" :zoom="zoom" map-style="amap://styles/3b77fc3578a70a921c30f4ecd84f2973" :events="events">
           <el-amap-marker v-for="(marker,index) in markers" :key="index+'a'"  :position="marker.center" :template="marker.template"></el-amap-marker>
            <!-- <el-amap-circle-marker v-for="(marker,index) in markers" :key="index+'a'" :center="marker.center" :radius="marker.radius" :stroke-weight="marker.strokeWeight" :fill-color="marker.fillColor" :fill-opacity="marker.fillOpacity" :stroke-color="marker.strokeColor" :events="marker.events" :z-index='9999' :content="marker.index"></el-amap-circle-marker>
            <el-amap-text v-for="(marker,index) in markers" :key="index+'b'" :text="marker.text" :position="marker.center" :events="marker.events" :z-index='100' :offset="[42,0]"></el-amap-text> -->
       </el-amap>
       <el-dialog
            :title="dialogParams.title"
            :visible.sync="dialogParams.dialogVisible"
            width="60%"
            custom-class="message-box"
            @close="close"
            >
           <!-- <el-scrollbar style="height:100%"> -->
               <div class="communityBox" v-if="!dialogParams.tempHistory">
                    <div class="main-top">
                        <data-search-top  :ID="dialogParams.community_id" :typeOfID="0" :typeOfComponent='0'></data-search-top>
                    </div>
                    <div style="box-shadow:0px 0px 10px 0px rgba(0, 0, 0, 0.22);margin:0 10px;margin-top:30px;margin-bottom:20px;">
                        <data-search-table :ID="dialogParams.community_id" :typeOfID="0" @select="select" :mapdialog="dialogParams.mapdialog"></data-search-table>
                    </div>
               </div>
               <div v-if="dialogParams.tempHistory" class="communityBox" style="padding-right:20px;padding-left:10px;z-index:999999">
                   <div class="temp-header" >
                       <span @click="allCommunity()">{{dialogParams.title}} &gt;</span>
                       <span>温度变化曲线</span>
                       <div style="margin-top:10px;">
                           <data-dialog :date='dialogParams.date' :conditionsHistory='dialogParams.conditionsHistory'></data-dialog>
                       </div>
                       
                   </div>
               </div>
           <!-- </el-scrollbar> -->
        </el-dialog>
    </div>
  </template>
  <script>
  import VueAMap  from 'vue-amap';
  import moment from 'moment';
  let _this={}
    export default {
        components:{
            DataSearchTop: ()=> import ('../../../assets/common/DataSearchTop/DataSearchTop.vue'),
            DataSearchTable :()=> import ('../../../assets/common/DataSearchTable/DataSearchTable.vue'),
            DataDialog :()=> import ('./../onlineMonitor/dataDialog.vue')
        },
        data() {
            return {
                activeIndex:-1,
                allActive:true,
                search:'',
                zoom: 12,
                zooms:[9,30],
                center: [localStorage.getItem('address').split(",")[0],localStorage.getItem('address').split(",")[1]],  
                markers:[], 
                event:null,
                communityData:[],
                companyData:[],
                initlocation:"",
                events: {
                    init: (o) => { 
                        this.event = o ;
                    },
                    mousewheel:()=>{
                        const zoom =this.event.getZoom()
                        this.zoom = zoom;
                        if(zoom<=13){
                           this.analysisData()
                           this.companyDistribute();
                        }else{
                            this.analysisData();
                           this.getcommunityDistribute();
                            
                        }
                    }
                },
                communityCount:0,
                copyMarkers:[],
                tempSelect:[],
                dialogParams:{
                    dialogVisible:false,
                    title:"",
                    community_id:'',
                    mapdialog:true,
                    tempHistory:false,
                    date: [moment().subtract(3,'days'), moment()],
                    conditionsHistory: {
                        house_id: null,
                        start_time: moment(moment().subtract(3,'days')).format('YYYY-MM-DD'),
                        end_time: moment().format('YYYY-MM-DD')
                    }
                },
                searchData:{
                    placeholder:"搜索小区",
                    searchResult:[],
                    total:-1 ,
                    inputText:""
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
            },
            async getcommunityDistribute(){
            
                const {result} = await this.$http('community/communityDistribute');
                this.tempSelect =[{name:'cool',value:result.cool},{name:'normal',value:result.normal},{name:'hot',value:result.hot}]
            },
            async companyDistribute(){
           
                const {result} = await this.$http("company/companyDistribute");
                 this.tempSelect =[{name:'cool',value:result.cool},{name:'normal',value:result.normal},{name:'hot',value:result.hot}]
            },
            selectAll(){
                this.allActive = true;
                this.activeIndex = -1;
                if(this.zoom<=12){
                    this.getCompany();
                }else{
                    this.getAllCommunity();
                }  
            },
            selectTemp(index){
                this.allActive = false;
                this.activeIndex = index;
                this.markers =  this.copyMarkers.filter((item)=>{return item.status===(index+1)}) 
            },
            //搜索小区
            onSearchResult(data) {
                this.zoom = 14;
                this.center = [Number(data.split(",")[0]),Number(data.split(",")[1])]
                this.analysisData();
                 this.getcommunityDistribute();  
            },
            // 获取分公司列表
            async getCompany(){
                const {result:{rows}} = await this.$http(`company/getCompany`,{data:{map:1}})
                this.companyData = rows; 
                this.analysisData();
                this.getAllCommunity();
            },  
            //获取全部小区
            async getAllCommunity(){
                const {result:{rows,total}} = await this.$http(`community/getCommunity`,{data:{map:1}})
                this.communityData = rows;
                this.analysisData();
            },
           
            //分析小区数据 1:低温 2：常温 3：高温
            analysisData(){
                const markers =[];
                const location = [];
                let dom = '';
                let data ='';
                if(this.zoom<=13){
                    data = this.companyData;
                }else{
                    data = this.communityData;
                }
                for(let i=0;i<data.length;i++){
                    if(this.zoom<=13){
                        // console.log(data)
                        dom = `<div class="marker-box"  @click="clickCompanyCenter($event)">
                                        <div class="circle-box"  align="${data[i].location}" style="background:${data[i].data_value<16?'rgba(51,171,241,1)':data[i].data_value>25?'rgba(255,113,106,1)':'rgba(255,165,9,1)'}">${Math.floor(data[i].data_value)}</div>
                                        <div class="marker-text" align="${data[i].location}">${data[i].company_name}</div>
                                </div>`
                    }else{
                        dom = `<div class="marker-box"  @click="dialogShow($event)">
                                        <div class="circle-box"  accessKey="${data[i].community_id}" align="${data[i].community_name}" style="background:${data[i].data_value<16?'rgba(51,171,241,1)':data[i].data_value>25?'rgba(255,113,106,1)':'rgba(255,165,9,1)'}">${Math.floor(data[i].data_value)}</div>
                                        <div class="marker-text" accessKey="${data[i].community_id}" align="${data[i].community_name}">${data[i].community_name}</div>
                                </div>`
                    }
                    markers.push({
                        center: [Number(data[i].location.split(",")[0]),Number(data[i].location.split(",")[1])],
                        template: dom,
                        status:data[i].data_value<16?1:data[i].data_value>25?3:2
                    }); 
                }
                this.markers = markers
                this.copyMarkers = markers;
                this.communityCount = data.length;
            },
            dialogShow(event){
                const community_id =  event.target.accessKey;
                const community_name = event.target.align;
                _this.dialogParams.dialogVisible = true;
                _this.dialogParams.title = community_name;
                _this.dialogParams.community_id = community_id;
           
            },
            clickCompanyCenter(event){
                const company_location = event.target.align;
                _this.center = [Number(company_location.split(",")[0]),Number(company_location.split(",")[1])];
                _this.zoom =14;
                _this.analysisData();
                _this.getcommunityDistribute();
            },
            select(id){
                this.dialogParams.tempHistory = true;
                this.dialogParams.conditionsHistory.house_id = id;
            },
            close(){
                this.dialogParams.tempHistory = false;
            },
            allCommunity(){
                this.dialogParams.tempHistory = false;
            },
            blur(){
                this.searchData.inputText ='';
            },
            remoteMethod(query){
                if(query !==''){
                    this.searchData.searchResult = this.communityData.filter((item)=>{return item.community_name.includes(query)}) 
                }else{
                    this.searchData.searchResult=[]
                }
            }
        },
        created(){
           if(!window.AMap && !window.AMapUI){
                this.initMap()
           }
           this.center=[localStorage.getItem('address').split(",")[0],localStorage.getItem('address').split(",")[1]] 
        },
        mounted(){
            this.getCompany()
            this.getAllCommunity();  
            this.companyDistribute();      
        },
         beforeCreate(){
            _this = this;
        }
    };
</script>
<style lang="scss">
    @import "./Map.scss";
</style>
