<template>
    <div class="data-search-menu">
        <div class="menu-search">
            <el-input placeholder="搜索" v-model="searchKey" @keyup.enter.native="clickSearch">
                <i slot="suffix" class="iconfont iconsousuo" @click="clickSearch"></i>
            </el-input>
        </div>
        <div class="menu-list">
            <el-scrollbar class="menu-scrollbar">
                <div v-for="(community,key) in communityList" class="community"
                    :class="{ clickedCommunity: expandedCommunityList.includes(community)}">
                    <div class="community-name">
                        <i class="el-icon-caret-bottom" v-if="expandedCommunityList.includes(community)"
                            @click="expandCommunity(community)"></i>
                        <i class="el-icon-caret-right" v-else @click="expandCommunity(community)"></i>
                        <span :class="{ clickedCommunity: clickedCommunity == community}"
                            @click="clickCommunity(community)">{{community.community_name}}</span>
                    </div>
                    <div v-if="expandedCommunityList.includes(community)" class="blank"></div>
                    <div v-for="(building,key) in community.buildings" v-if="expandedCommunityList.includes(community)"
                        class="building" :class="{ clickedBuilding: clickedBuilding == building}">
                        <div class="building-name" @click="clickBuliding(building)">
                            {{building.building_name}}
                        </div>

                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                isActive: true,
                hasError: true,
                searchKey: '',
                communityList: [],
                expandedCommunityList: [],
                clickedCommunity: {},
                clickedBuilding: {},
                defaultProps: {
                    children: 'building',
                    label: 'community_name'
                }
            }
        },
        methods: {
            clickSearch() {
                //console.log('click');
                this.getCommunityList();
            },
            expandCommunity(community) {
                if (this.expandedCommunityList.indexOf(community) == -1) {
                    this.expandedCommunityList.push(community);
                } else {
                    this.expandedCommunityList.splice(this.expandedCommunityList.indexOf(community), 1);
                }
            },
            clickCommunity(community) {
                if (this.clickedCommunity != community) {
                    this.clickedCommunity = community;
                    this.clickedBuilding = {};
                    console.log('this.clickedCommunity', this.clickedCommunity);
                    console.log('this.clickedBuilding', this.clickedBuilding);
                    this.$emit('clickCommunity', this.clickedCommunity);
                }
            },
            clickBuliding(building) {
                if (this.clickedBuilding != building) {
                    this.clickedBuilding = building;
                    this.clickedCommunity = {};
                    console.log('this.clickedCommunity', this.clickedCommunity);
                    console.log('this.clickedBuilding', this.clickedBuilding);
                    this.$emit('clickBuliding', this.clickedBuilding);
                }
                //console.log(this.clickedBuilding);
            },
            async getCommunityList() {
                const res = await this.$http.get(
                    'community/getCommunity', {
                        data: {
                            key: this.searchKey
                        }
                    });
                let list = [];
                //console.log('已获取小区列表');

                list = res.result.rows;
                //console.log(list);
                for (let i = 0; i < list.length; i++) {
                    const res2 = await this.$http.get(
                        'building/getBuilding', {
                            data: {
                                community_id: list[i].community_id
                            }
                        });

                    list[i].buildings = res2.result.rows;
                    if (i == list.length - 1) {
                        this.communityList = list;
                        if (this.communityList.length != 0) {
                            this.clickCommunity(this.communityList[0]);
                        }
                    }

                }

            },
        },
        mounted() {
            this.getCommunityList();
        },
    }

</script>

<style lang="scss">
    @import "./DataSearchMenu.scss";

</style>
