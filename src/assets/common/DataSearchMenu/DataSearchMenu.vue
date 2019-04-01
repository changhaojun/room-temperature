<template>
    <div class="data-search-menu">
        <div class="menu-search">
            <el-select v-model="searchKey" filterable placeholder="搜索" @change="clickCommunity">
                <!-- <i slot="suffix" class="iconfont iconsousuo" @click="clickSearch"></i> -->
                <el-option v-for="community in communityList" :key="community.community_id"
                    :label="community.community_name" :value="community.community_id">
                </el-option>
            </el-select>
        </div>
        <div class="menu-list">
            <el-scrollbar class="menu-scrollbar">
                <transition-group>
                    <div v-for="(company,index) in displayCompanyList" :key="company.company_name+index" class="company">
                        <div class="company-name"
                            :class="{clickedItem: clickedItem.itemType==0 && clickedItem.itemID==company.company_id}">
                            <i class="el-icon-caret-bottom" @click="expandItem(0,company.company_id)"
                                v-if="expandedCompanyList.includes(company.company_id)"></i>
                            <i class="el-icon-caret-right" @click="expandItem(0,company.company_id)" v-else></i>
                            <span class="company-span" @click="clickItem(0,company.company_id,-1,-1)"
                                :class="{parentCompany: parentCompanyID==company.company_id}">
                                {{company.company_name}}
                            </span>
                        </div>
                        <div v-if="expandedCompanyList.includes(company.company_id)" class="communityList">
                            <div class="community" v-for="(community,index) in company.communities"
                                :key="community.community_name+index">
                                <div class="community-name"
                                    :class="{clickedItem: clickedItem.itemType==1 && clickedItem.itemID==community.community_id}">
                                    <i class="el-icon-caret-bottom" @click="expandItem(1,community.community_id)"
                                        v-if="expandedCommunityList.includes(community.community_id)"></i>
                                    <i class="el-icon-caret-right" @click="expandItem(1,community.community_id)"
                                        v-else></i>
                                    <span class="community-span"
                                        @click="clickItem(1,community.community_id,company.company_id,-1)"
                                        :class="{parentCommunity: parentCommunityID==community.community_id}">
                                        {{community.community_name}}
                                    </span>
                                </div>
                                <div v-if="expandedCommunityList.includes(community.community_id)" class="buildingList">
                                    <div class="building" v-for="(building,index) in community.buildings"
                                        :key="building.building_name+index"
                                        :class="{clickedItem: clickedItem.itemType==2 && clickedItem.itemID==building.building_id}">
                                        <span class="building-span"
                                            @click="clickItem(2,building.building_id,company.company_id,community.community_id)">{{building.building_name}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </el-scrollbar>
        </div>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                searchKey: '',
                chosenCommunity: {
                    CompanyID: '',
                    CommunityID: '',
                },
                displayCompanyList: [],
                companyList: [],
                communityList: [],
                expandedCompanyList: [],
                expandedCommunityList: [],
                parentCompanyID: '',
                parentCommunityID: '',
                clickedItem: {
                    itemType: '',
                    itemID: ''
                },
            }
        },
        methods: {
            clickCommunity() {
                //this.displayCompanyList = [];
                this.expandedCompanyList = [];
                this.expandedCommunityList = [];
                this.clickedItem.itemType = '';
                this.clickedItem.itemID = '';
                for (let i = 0; i < this.communityList.length; i++) {
                    if (this.communityList[i].community_id == this.searchKey) {
                        this.chosenCommunity.CompanyID = this.communityList[i].company_id;
                        this.chosenCommunity.CommunityID = this.communityList[i].community_id;
                        break;
                    }
                }
                //this.displayCompanyList = this.companyList.filter(this.filterCompanyList);
                //this.displayCompanyList[0].communities = this.displayCompanyList[0].communities.filter(this.filterCommunityList);
                this.expandedCompanyList.push(this.chosenCommunity.CompanyID);
                this.expandedCommunityList.push(this.chosenCommunity.CommunityID);
                this.clickedItem.itemType = 1;
                this.clickedItem.itemID = this.chosenCommunity.CommunityID;
                this.$emit('clickedItem', this.clickedItem);
            },
            clickItem(itemType, itemID, parentCompanyID, parentCommunityID) {
                //itemType=0代表公司，itemType=1代表小区，itemType=2代表楼
                //如果点击公司，则parentCompanyID=-1，parentCommunityID=-1
                //如果点击小区，则parentCompanyID=该小区所在的公司id，parentCommunityID=-1
                //如果点击楼，则parentCompanyID=该小区所在的公司id，parentCommunityID=该小区所在的公司id
                this.clickedItem.itemType = itemType;
                this.clickedItem.itemID = itemID;
                this.parentCompanyID = -1;
                this.parentCommunityID = -1;
                if (itemType == 1) {
                    this.parentCompanyID = parentCompanyID;
                } else if (itemType == 2) {
                    this.parentCompanyID = parentCompanyID;
                    this.parentCommunityID = parentCommunityID;
                }
                this.$emit('clickedItem', this.clickedItem);
            },
            expandItem(itemType, itemID) {
                //itemType=0代表公司，itemType=1代表小区，itemType=2代表楼
                if (itemType == 0) {
                    if (this.expandedCompanyList.indexOf(itemID) == -1) {
                        this.expandedCompanyList.push(itemID);
                    } else {
                        this.expandedCompanyList.splice(this.expandedCompanyList.indexOf(itemID), 1);
                    }
                } else if (itemType == 1) {
                    if (this.expandedCommunityList.indexOf(itemID) == -1) {
                        this.expandedCommunityList.push(itemID);
                    } else {
                        this.expandedCommunityList.splice(this.expandedCommunityList.indexOf(itemID), 1);
                    }
                }
            },
            async getCommunityList() {
                const res = await this.$http.get(
                    'community/getCommunity', {
                        data: {
                            map: 1
                        }
                    });
                this.communityList = res.result.rows;
            },
            async getCompanyList() {
                const res = await this.$http.get(
                    'company/getCompany', {
                        data: {
                            key: this.searchKey
                        }
                    });
                let list = res.result.rows;
                let resCommunity = '';
                let resBuilding = '';
                for (let i = 0; i < list.length; i++) {
                    resCommunity = await this.$http.get(
                        'community/getCommunity', {
                            data: {
                                company_id: list[i].company_id
                            }
                        });
                    list[i].communities = resCommunity.result.rows;
                    for (let j = 0; j < list[i].communities.length; j++) {
                        resBuilding = await this.$http.get(
                            'building/getBuilding', {
                                data: {
                                    community_id: list[i].communities[j].community_id
                                }
                            });
                        list[i].communities[j].buildings = resBuilding.result.rows;
                    }
                }
                this.companyList = list;
                this.displayCompanyList = this.companyList;
                this.clickedItem.itemType = 0;
                this.clickedItem.itemID = this.companyList[0].company_id;
                this.clickItem(0, this.clickedItem.itemID, -1, -1);
                this.$emit('menuLoadingCompleted');
            }
        },
        mounted() {
            this.getCompanyList();
            this.getCommunityList();
        },
    }

</script>

<style lang="scss">
    @import "./DataSearchMenu.scss";

</style>
