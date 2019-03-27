<template>
    <div class="user-login">
        <div class="user-login-bg" :style="{'background-image':`url(${backgroundImage})`}"></div>
        <div class="content-wrapper">
        <h2 class="slogan">
            欢迎使用
            <br>
            <span style="color:red">室内温度</span> 系统
        </h2>
        <div class="form-container" style="padding:0 60px">
            <h4 class="form-title" style="margin-top:20px">登录</h4>
            <mu-form ref="form" class="mu-demo-form" :model="user">
            <mu-form-item label="用户名" prop="username" :rules="usernameRules">
                <mu-text-field v-model="user.username" prop="username"></mu-text-field>
            </mu-form-item>
            <mu-form-item label="密码" prop="password" :rules="passwordRules">
                <mu-text-field type="password" v-model="user.password" prop="password"></mu-text-field>
            </mu-form-item>
            <mu-form-item>
                <mu-checkbox v-model="remember" value="记住账号" label="记住账号"></mu-checkbox>
            </mu-form-item>
            <mu-form-item>
                <mu-button color="primary" @click="submitBtn">{{btnTxt}}</mu-button>
            </mu-form-item>
            </mu-form>
        </div>
        </div>
    </div>
</template>

<script>
const backgroundImage ='https://img.alicdn.com/tfs/TB1zsNhXTtYBeNjy1XdXXXXyVXa-2252-1500.png';
export default {
    name: 'UserLogin',

    data() {
        return {
        backgroundImage: backgroundImage,
        user: {
            username: '',
            password: '',
        },
        btnTxt: '登   录',
        remember: true,
        disable: false,
        usernameRules: [
            { validate: (val) => !!val, message: '用户名不能为空' },
        ],
        passwordRules: [
            { validate: (val) => !!val, message: '密码不能为空' },
        ],
        };
    },

    created() { },

    methods: {

        submitBtn() {
            this.$refs['form'].validate().then(async valid => {
                if (valid) {
                this.btnTxt = '登陆中...'
                this.disable = true;
                const res = await this.$http.post('user/login', this.user);
                this.$message({
                    message: '登录成功',
                    type: 'success',
                    duration: 1000
                })
                if (this.remember) {
                    localStorage.setItem('remember', true);
                    localStorage.setItem('userInfo', JSON.stringify(this.user));
                } else {
                    localStorage.setItem('remember', false);
                    localStorage.removeItem('userInfo');
                }
                const { result: { actk, fullname, user_id } } = res;
                sessionStorage.setItem('actk', actk);
                sessionStorage.setItem('fullname', fullname);
                sessionStorage.setItem('user_id', user_id);
                sessionStorage.setItem('userInfo', JSON.stringify(this.user));
                this.$router.push({ path: '/main/firstPage' });
                }
            });
        },
    },
    created() {
        if (localStorage.getItem('remember') === 'true') {
        this.remember = true;
        const user = JSON.parse(localStorage.getItem('userInfo'));
        this.user = user;
        } else {
        this.remember = false;
        }
    }
};
</script>

<style lang="scss">
@import "./Login.scss";
</style>
