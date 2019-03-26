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
                <el-dropdown placement="top-start">
                    <div class="user-config"><i class="iconfont iconren"></i><span>设置</span></div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>修改密码</el-dropdown-item>
                        <el-dropdown-item>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </header>

        <div id="main_content">
            <router-view/>
        </div>

        <footer>
            <p>北京智信远景软件技术有限公司</p>
        </footer>
    </div>
</template>

<script>

import FirstPage from './firstPage/firstPage';
import DataSearch from './dataSearch/DataSearch';
import OnlineMonitor from './onlineMonitor/onlineMonitor';
import RoomMap from './map/Map';
import WarnRecord from './warnRecord/warnRecord';
import Analysis from './analysis/Analysis';
export default {
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
        }
    ]
}
</script>

<style lang="scss">
    #main_wrapper{
        width: 100%;
        height: 100%;
        >header{
            box-shadow:0px 4px 16px 0px rgba(56,59,69,0.25);
            height: 60px;
            line-height: 60px;
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
                overflow: hidden;
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
                .user-config{
                    cursor: pointer;
                    i{
                        margin-right: 3px;
                    };
                }
            }

        }

        >#main_content{
            width: 100%;
            height: calc(100% - 100px);
            background: rgb(245,245,245);
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
