<template>
    <div class="amap-page-container">

        <div class="header">
            <mu-button round :class="[!allActive?'normal':'active']"  @click="selectAll()">全部</mu-button>
            <div class="temp-select">
                <span class="label">温度区间选择</span>
                  <!-- <div class="user-bar unonline-bar">  
                    </div> 
                    <div class="bar" style="position:relative;width:500px" id="rang">
                        <span class="iconfont iconzhijiao-triangle1" ref="iconzhijiao-triangle1" style="position:absolute;left:-10px;"  @mousedown="ondragstart"  @keydown.up.prevent="onDragEnd">{{data.low}}</span>
                        <span class="iconfont iconzhijiao-triangle" ref="iconzhijiao-triangle"  style="position:absolute;left:2px;" @mousedown="ondragstart" >{{data.high}}</span>
                    </div> -->
                    <!-- <div class="user-bar online-bar">
                        <div class="bar" :class="[activeIndex===index?'clickBar':'']" v-for="(item,index) in tempSelect" :key="index+'m'" :style="{width:item.value/communityCount*100+ '%',background:item.name==='cool'?'#33ABF1':item.name==='normal'?'#FFA509':'#FF716A'}" @click="selectTemp(index)">
                            <span v-if="item.value">{{item.value}}</span>
                        </div>
                    </div> -->
                <!-- <div style="display:inline-block;width:60%;height:100%;display:flex;align-items: center;margin-left:20px;" >
                  
                    <div class="block" style="width:60%;">
                        <el-slider
                            v-model="tempArr"
                            range
                            :max="30"
                            :show-tooltip="true"
                            @change="tempChange"
                        >
                        </el-slider>
                        
                    </div>
                    <span style="margin-left:10px;">当前选择的温度区间：{{tempArr[0]}}℃ ~ {{tempArr[1]}}℃</span>
                </div> -->
                <slider :tempArr="tempArr" :max="30" :width="60" @tempChange="tempChange"></slider>
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
            </div>
        </div>
       <el-amap vid="amap-demo" ref="map" class="amap-demo" id="container" :center="center" :zooms="zooms" :zoom="zoom" map-style="amap://styles/3b77fc3578a70a921c30f4ecd84f2973" :events="events">
           <el-amap-marker v-for="(marker,index) in markers" :key="index+'a'"  :position="marker.center" :template="marker.template"></el-amap-marker>
       </el-amap>
       <el-dialog
            :title="dialogParams.title"
            :visible.sync="dialogParams.dialogVisible"
            width="100%"
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
            DataDialog :()=> import ('./../onlineMonitor/dataDialog.vue'),
            slider :()=> import ('../../../assets/common/Slider/Slider.vue')
        },
        data() {
            return {
                // currentParentClientX:0,
                // currentParentRightClientX:0,
                // initLeftbarLeft:-10,
                // initRightbarLeft:2,
                // data:{
                //     low:10,
                //     high:10,
                //     tempSection:[10,40]
                // },
                // clientX:"",
                activeIndex:-1,
                allActive:true,
                tempArr:[0,30],
                search:'',
                zoom: 11,
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
                        this.analysisData()
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
        //    ondragstart(event){
        //         const {left,right}=event.currentTarget.parentElement.getBoundingClientRect();
        //         this.currentParentLeftClientX = parseInt(left);
        //         this.currentParentRightClientX = right;
        //         this.currentdom=event.target.className;
        //         window.addEventListener('mousemove', this.onDragging);
        //         window.addEventListener('mouseup', this.onDragEnd);
        //    },
        //    onDragging(event){
        //     //    console.log(event.clientX,this.currentParentLeftClientX)
        //         if(this.currentdom.includes('iconzhijiao-triangle1')){
        //             if(event.clientX  > this.currentParentLeftClientX-10 && event.clientX < this.currentParentRightClientX-10){
        //                  if( Number(this.$refs['iconzhijiao-triangle1'].style.left.split("px")[0])+13+'px'===this.$refs['iconzhijiao-triangle'].style.left){
        //                     this.$refs['iconzhijiao-triangle1'].style.left=  Number(this.$refs['iconzhijiao-triangle1'].style.left.split("px")[0])+'px';
        //                 }
        //                 this.$refs['iconzhijiao-triangle1'].style.left=(event.clientX-this.currentParentLeftClientX-5)+'px';
                       
        //                 this.data.low =parseInt(Number(this.data.tempSection[0])+ (((event.clientX+29)-this.currentParentLeftClientX)/500)*20)
        //                 console.log(Number(this.$refs['iconzhijiao-triangle1'].style.left.split("px")[0])+10+'px',this.$refs['iconzhijiao-triangle'].style.left)
                       
        //             }
        //         }else{
        //              if(event.clientX  > this.currentParentLeftClientX+2 && event.clientX < this.currentParentRightClientX){
        //                 this.$refs['iconzhijiao-triangle'].style.left=(event.clientX-this.currentParentLeftClientX-5)+'px';
        //                 this.data.high =parseInt(Number(this.data.tempSection[0])+ (((event.clientX+19)-this.currentParentLeftClientX)/500)*20)
        //                 if(this.data.low===this.data.high){
        //                   return;
        //                 }
        //              }
        //         }
                
        //    },
        //    onDragEnd(){
        //         window.removeEventListener('mouseup', this.onDragEnd);
        //         window.removeEventListener('mousemove', this.onDragging);
        //    },
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
                this.tempArr = [0,30] 
            },
            tempChange(value){
                this.tempArr=value;
                this.allActive = false;
                this.analysisData()
            },
            //搜索小区
            onSearchResult(data) {
                this.zoom = 14;
                this.center = [Number(data.split(",")[0]),Number(data.split(",")[1])]
                this.analysisData();
                //  this.getcommunityDistribute();
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
                let dom = '';
                let data ='';
                let accessKey='';
                let align='';
                data = this.zoom<13? this.companyData.filter((item)=>{return (item.data_value>this.tempArr[0]&&item.data_value<this.tempArr[1])}):this.communityData.filter((item)=>{return (item.data_value>this.tempArr[0]&&item.data_value<this.tempArr[1])});
                for(let i=0;i<data.length;i++){
                    if(this.zoom<13){     
                        dom = `<div class="marker-box"  @click="clickCompanyCenter($event)">
                                        <div class="circle-box"  accessKey="${data[i].location}" style="background:${data[i].data_value<16?'rgba(51,171,241,1)':data[i].data_value>25?'rgba(255,113,106,1)':'rgba(255,165,9,1)'}">${Math.floor(data[i].data_value)}</div>
                                        <div class="marker-text" accessKey="${data[i].location}">${data[i].company_name}</div>
                                </div>`
                    }else{
                        dom = `<div class="marker-box"  @click="dialogShow($event)">
                                <div class="circle-box"  accessKey="${data[i].community_id }" align="${data[i].community_name}" style="background:${data[i].data_value<16?'rgba(51,171,241,1)':data[i].data_value>25?'rgba(255,113,106,1)':'rgba(255,165,9,1)'}">${Math.floor(data[i].data_value)}</div>
                                <div class="marker-text" accessKey="${data[i].community_id }" align="${data[i].community_name}">${data[i].community_name}</div>
                                </div>`
                    }
                    markers.push({
                        center: [Number(data[i].location.split(",")[0]),Number(data[i].location.split(",")[1])],
                        template: dom,
                        data_value:data[i].data_value,
                    });
                }
                this.markers = markers;
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
                const company_location = event.target.accessKey;
                _this.center = [Number(company_location.split(",")[0]),Number(company_location.split(",")[1])];
                _this.zoom =14;
                _this.analysisData();
                // _this.getcommunityDistribute();
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
            // this.companyDistribute();
        },
        beforeCreate(){
            _this = this;
        }
    };
</script>
<style lang="scss">
    @import "./Map.scss";
</style>
