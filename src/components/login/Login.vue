<template>
    <div class="user-login">
        <div class="login-logo"></div>
        <div class="login-main">
            <div class="form-contanier">
                <h2>
                    <span>Hey!</span><br/>
                    <i>欢迎来到</i><span style="color:#FFA509">大同热力室温监测</span><i>平台</i>
                </h2>
                <mu-form ref="form" class="mu-demo-form" :model="user">
                    <mu-form-item label="账号" prop="username" :rules="usernameRules">
                        <mu-text-field v-model="user.username" prop="username"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label="密码" prop="password" :rules="passwordRules" style="margin-top:-10px">
                        <mu-text-field type="password" v-model="user.password" prop="password"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item style="margin-top:-10px">
                        <mu-checkbox v-model="remember" value="记住密码" label="记住密码"></mu-checkbox>
                    </mu-form-item>
                    <mu-form-item style="margin-top:-10px">
                        <mu-button  round small color="#FFA509" @click="submitBtn">{{btnTxt}}</mu-button>
                    </mu-form-item>
                </mu-form>
            </div>
            <div class="login-bg">

            </div>
        </div>
        <div class="login-company">
            <p>北京智信远景软件技术有限公司</p>
        </div>

    </div>
</template>

<script>
export default {
    name: 'UserLogin',

    data() {
        return {
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

    methods: {

        submitBtn() {
            this.$refs['form'].validate().then(async valid => {
                if (valid) {
                    await this.login();
                }
            });
        },

        async login() {
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
            const { result: { fullname, user_id, address } } = res;
            sessionStorage.setItem('userInfo', JSON.stringify(Object.assign({ fullname, user_id }, this.user)));
            localStorage.setItem('address', address);
            this.$router.push({ path: '/main/firstPage' });
        }
    },
    created() {
        if (localStorage.getItem('remember') === 'true') {
            this.remember = true;
            const user = JSON.parse(localStorage.getItem('userInfo'));
            this.user = user;
        }
        else {
            this.remember = false;
        }
    },
    mounted() {

    }
};
</script>

<style lang="scss">
@import "./Login.scss";
</style>
