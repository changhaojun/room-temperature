<template>
    <div id="main_wrapper">
        <header>
            <h3 class="logo">

            </h3>
            <nav>
                <router-link class="router-nav" to="/main/firstPage" active-class="active-router" exact>首页</router-link>
                <router-link class="router-nav" to="/main/dataSearch" active-class="active-router">查询数据</router-link>
                <router-link class="router-nav" to="/main/onlineMonitor" active-class="active-router">在线监测</router-link>
                <router-link class="router-nav" to="/main/roomMap" active-class="active-router">室温地图</router-link>
                <router-link class="router-nav" to="/main/warnRecord" active-class="active-router">告警记录</router-link>
                <router-link class="router-nav" to="/main/analysis" active-class="active-router">统计分析</router-link>
            </nav>

            <div id="user-menu">
                <el-dropdown placement="top-start" @command="handleCommand">
                    <div class="user-config"><i class="iconfont iconshezhi-shixin"></i><span>设置</span></div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="config">配置告警</el-dropdown-item>
                        <el-dropdown-item command="password">修改密码</el-dropdown-item>
                        <el-dropdown-item command="exit">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </header>

        <div id="main_content">
            <transition name="fade">
                <router-view/>
            </transition>

        </div>

        <footer>
            <p>北京智信远景软件技术有限公司</p>
        </footer>

        <el-dialog
            title="修改密码"
            :visible.sync="changePassword"
            width="30%">
            <!-- <span>这是一段信息</span> -->
            <mu-form ref="form" class="mu-demo-form" :model="changeInfo">
                <mu-form-item label="旧密码" help-text="" prop="old_pwd" :rules="passwordRules">
                    <mu-text-field type="password" v-model="changeInfo.old_pwd" prop="username"></mu-text-field>
                </mu-form-item>
                <mu-form-item label="新密码" prop="new_pwd" :rules="passwordRules">
                    <mu-text-field type="password" v-model="changeInfo.new_pwd" prop="password"></mu-text-field>
                </mu-form-item>
            </mu-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changePassword = false">取 消</el-button>
                <el-button type="primary" @click="modifyPwd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import FirstPage from './firstPage/firstPage';
import DataSearch from './dataSearch/DataSearch';
import OnlineMonitor from './onlineMonitor/onlineMonitor';
import CommunityDetails from './onlineMonitor/communityDetails';
import RoomMap from './map/Map';
import WarnRecord from './warnRecord/warnRecord';
import Analysis from './analysis/Analysis';
import WarnConfig from './warnConfig/warnConfig';
export default {
    data () {
        return {
            passwordRules: [
                { validate: (val) => !!val, message: '必须填写密码'}
            ],
            changeInfo: {
                old_pwd: '',
                new_pwd: ''
            },
            changePassword: false
        }
    },
    methods: {
        handleCommand(command) {
            // console.log(command)
            if(command === 'config') {
                this.$router.push({
                    path: '/main/warnConfig'
                })
            }
            if(command === 'password') {
                this.changePassword = true;
            }
            if(command === 'exit') {
                sessionStorage.removeItem('userInfo');
                this.$router.push({
                    path: '/'
                })
            }
        },
        async modifyPwd() {
            const res = await this.$http.put('user/password',Object.assign(this.changeInfo, {
                user_id: Number(JSON.parse(sessionStorage.getItem('userInfo')).user_id)
            }))
            this.$message({
                message: res.message,
                type: 'success',
                duration: 1000
            })
            this.changePassword = false;
        }
    },
    children: [
        {
            path: '/main/firstPage',
            name: 'firstPage',
            component: FirstPage,
        },
        {
            path: '/main/dataSearch',
            name: 'dataSearch',
            component: DataSearch,
        },
        {
            path: '/main/onlineMonitor',
            name: 'OnlineMonitor',
            component: OnlineMonitor,
        },
        {
            path: '/main/communityDetails',
            name: 'CommunityDetails',
            component: CommunityDetails,
        },
        {
            path: '/main/roomMap',
            name: 'RoomMap',
            component: RoomMap
        },
        {
            path: '/main/warnRecord',
            name: 'WarnRecord',
            component: WarnRecord,
        },
        {
            path: '/main/analysis',
            name: 'Analysis',
            component: Analysis,
        },
        {
            path: '/main/warnConfig',
            name: 'WarnConfig',
            component: WarnConfig
        }
    ]
}
</script>

<style lang="scss">
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    #main_wrapper{
        width: 100%;
        height: 100%;
        >header{
            height: 60px;
            line-height: 60px;
            font-size: 16px;
            background:rgba(255,255,255,1);
            box-shadow:0px 4px 16px 0px rgba(56,59,69,0.25);
            >h3{
                float: left;
                height: 60px;
                background: url('./../../assets/images/logo.png') no-repeat center;
                width: 15%;
            }
            >nav{
                float: left;
                height: 60px;
                width: 45%;
                display: flex;
                flex-direction: row;
                >.router-nav{
                    display: block;
                    color: #000;
                    height: 30px;
                    margin-top: 15px;
                    line-height: 30px;
                    flex: 1;
                    margin-left:30px;
                    text-align: center;
                    color:rgba(80,80,80,0.78);
                    border-radius:15px;
                    transition: all linear 0.3s;
                    &:hover{
                        opacity: 0.78;
                    }
                    &.active-router{
                        background:rgba(255,165,9,1);
                        box-shadow:0px 5px 10px 0px rgba(255,165,9,0.71);
                        border-radius:15px;
                        color: #fff
                    }
                }
            }

            >#user-menu{
                width: 10%;
                height: 30px;
                float: right;
                text-align: center;
                margin-top: 15px;
                line-height: 30px;
                &:hover{
                    opacity: 0.78;
                }
                .user-config{
                    font-size: 16px;
                    cursor: pointer;
                    i{
                        margin-right: 3px;
                    };
                }
            }

        }

        >#main_content{
            width: 100%;
            height: calc(100% - 110px);
            background: rgb(245,245,245);
            overflow: hidden;
            margin-top: 10px;
        }

        >footer{
            height: 40px;
            line-height: 40px;
            text-align: right;
            background: #fff;
            p{
                margin-right: 30px;
                color:rgba(114,114,114,1);
                opacity:0.6;
            }
        }
    }
</style>
