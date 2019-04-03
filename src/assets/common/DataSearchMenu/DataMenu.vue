<template>
    <div class="data-search-menu">
        <div class="menu-search">
            <el-select v-model="searchKey" filterable placeholder="搜索" @change="clickCommunity">
                <el-option v-for="community in communityList" :key="community.community_id"
                    :label="community.community_name" :value="community.community_id">
                </el-option>
            </el-select>
        </div>
          <div class="menu-list">
              <el-scrollbar class="menu-scrollbar">

                      <div v-for="(company,index) in companyList" :key="index" class="company">
                          <div class="company-name" :class="{clickedItem: clickedItem.itemType==0 && clickedItem.itemID==company.company_id}">
                            <span :class="company.unfold?'el-icon-caret-bottom':'el-icon-caret-right'" @click="company.unfold = !company.unfold"></span>
                            <span class="company-span" @click="clickItem(0,company.company_id)" :class="{parentCompany: parentCompanyId==company.company_id}">
                                {{company.company_name}}
                            </span>
                        </div>
                        <el-collapse-transition>
                         <div class="communityList" v-if="company.unfold">
                            <div class="community" v-for="(community,communityIndex) in company.community" :key="communityIndex">
                                 <div class="community-name"
                                    :class="{clickedItem: clickedItem.itemType==1 && clickedItem.itemID==community.community_id}">
                                    <span :class="community.unfold?'el-icon-caret-bottom':'el-icon-caret-right'" @click="unfoldCommunity(index,communityIndex,community)"></span>
                                    <span class="community-span" @click="clickItem(1,community.community_id,company.company_id)" :class="{parentCommunity: parentCommunityId==community.community_id}">
                                            {{community.community_name}}
                                    </span>
                                 </div>
                                 <el-collapse-transition>
                                <div class="buildingList" v-if="community.unfold">
                                    <div class="building" v-for="(building,buildingIndex) in community.buildingList" :key="buildingIndex" :class="{clickedItem: clickedItem.itemType==2 && clickedItem.itemID==building.building_id}" :loading="true">
                                        <span class="building-span" @click="clickItem(2,building.building_id,community.community_id,company.company_id)" >
                                            {{building.building_name}}
                                        </span>
                                    </div>
                                </div>
                                 </el-collapse-transition>
                            </div>
                        </div>
                        </el-collapse-transition>
                      </div>

              </el-scrollbar>
          </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            searchKey:'',
            companyList:[],
            clickedItem:{
                itemType:0,
                itemID:0
            },
            communityList:[],
            parentCompanyId:0,
            parentCommunityId:0
        }
    },
    methods:{
        async getCompanyList() {
            const res = await this.$http.get('company/getCompanyTree');
            res.result.rows.forEach(item =>{
                item.unfold = false;
                item.community.forEach(community =>{
                    this.communityList.push(community)
                    community.unfold = false
                })
            })
            this.companyList= res.result.rows;
            this.clickedItem.itemID =  this.companyList[0].company_id
           this.$emit('clickedItem', this.clickedItem);
           this.$emit('menuLoadingCompleted');
        },
        async unfoldCommunity(index,communityIndex,community){
            const community_id = community.community_id
            const buildingList = await this.getBuilding(community,community_id)
            community.unfold = !community.unfold;
            this.$set(community,'buildingList',buildingList)
            this.$forceUpdate();
        },
        async getBuilding(community,community_id){
            if(!community.unfold){
                const res= await this.$http.get('building/getBuilding', {
                    data: {
                        community_id: community_id
                    }
                });
                return res.result.rows;
            }
            return []
            
        },
        clickItem(type,id,parentId,company_id){
            this.clickedItem.itemType = type;
            this.clickedItem.itemID = id;
            if(type ===1){
                this.parentCommunityId = 0;
                this.parentCompanyId = parentId;
            }
            if(type ===2){
                this.parentCompanyId = company_id
                this.parentCommunityId = parentId
            }
            if(type ===0){
                this.parentCompanyId = 0
            }
            this.$emit('clickedItem', this.clickedItem);
        },
        clickCommunity(){
            console.log(this.searchKey);
            for(let i=0;i<this.companyList.length;i++){
                for(let j=0;j<this.companyList[i].community.length;j++){
                    if(this.companyList[i].community[j].community_id===this.searchKey){
                        console.log(this.companyList[i].community[j])
                        this.companyList[i].unfold = true;
                        this.clickItem(1,this.companyList[i].community[j].community_id,this.companyList[i].company_id);
                    }
                }
            }
        }
    },
    created() {
        this.getCompanyList();
    },
}
</script>
<style lang="scss">
    @import "./DataSearchMenu.scss";
</style>
