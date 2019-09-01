<template>
    <el-form :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-position="center" label-width="80px"
             class="demo-ruleForm login-container">
        <i class="el-icon-back" @click="toLogin()"></i>
        <h3 class="title">用户注册</h3>
        <el-form-item label="昵称" prop="account">
            <el-input type="text" v-model="ruleForm.account" auto-complete="off"
                      placeholder="支持中英文,长度为2到20位"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
            <el-input type="text" v-model="ruleForm.mail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off"
                      placeholder="只能输入6-20个字母、数字、下划线"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :inline="true" label="验证码" prop="code" v-if="showCode">
            <el-input type="text" style="width:63%;" v-model="ruleForm.code" auto-complete="off"></el-input>
            <el-button type="primary" style="width:35%;float: right;" @click="getCode()" :loading="logining_code">
                获取邮箱验证码
            </el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="register()" :loading="logining">注册
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import { Message} from 'element-ui';
    import {requestRegister} from '../api/api';
    import {getVerificationCode} from '../api/api';
    //import NProgress from 'nprogress'
    export default {
        data() {
            let validateAccount = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入昵称'));
                } else {
                    let regAccount = /^[a-zA-Z\u4E00-\u9FA5]{2,20}$/;
                    if (!regAccount.test(this.ruleForm.account)) {
                        callback(new Error('昵称格式不正确'));
                    } else {
                        callback();
                    }
                }
            };
            let validateEmail = (rule, value, callback) => {
                this.showCode = false;
                let regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                if (value === '') {
                    callback(new Error('请输入邮箱'));
                }
                if (!regEmail.test(this.ruleForm.mail)) {
                    callback(new Error('邮箱格式不正确'));
                } else {
                    this.showCode = true;
                    callback();
                }
            }
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    let regAccount = /^(\w){6,20}$/;
                    if (!regAccount.test(this.ruleForm.password)) {
                        callback(new Error('密码格式不正确'));
                    }
                    if (this.ruleForm.checkPass !== '') {
                        this.$refs.ruleForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                logining: false,
                logining_code: false,
                showCode: false,
                ruleForm: {
                    account: '雨落长安',
                    mail: '',
                    password: 'kpx360',
                    checkPass: 'kpx360',
                    code: ''
                },
                rules2: {
                    account: [
                        {validator: validateAccount}
                    ],
                    mail: [
                        {validator: validateEmail}
                    ],
                    password: [
                        {validator: validatePass}
                    ],
                    checkPass: [
                        {validator: validatePass2}
                    ],
                    code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
                },
                checked: true
            };
        },
        methods: {
            handleReset2() {
                this.$refs.ruleForm.resetFields();
            },
            register(ev) {
                var _this = this;
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        //_this.$router.replace('/table');
                        this.logining = true;
                        //NProgress.start();
                        var params = {
                            user_name: this.ruleForm.account,
                            user_mail: this.ruleForm.mail,
                            password: this.ruleForm.checkPass,
                            code: this.ruleForm.code
                        };
                        requestRegister(params).then(data => {
                            this.logining = false;
                            //NProgress.done();
                            let {msg, status, result} = data;
                            if (status !== 'success') {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            } else {
                                sessionStorage.setItem('user', JSON.stringify(result));
                                this.$router.push({path: '/table'});
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            toLogin() {
                this.$router.push({path: '/login'});
            },
            getCode() {
                this.logining_code = true;
                let params = {user_mail: this.ruleForm.mail, type: 'active'};
                getVerificationCode(params).then(data => {
                    this.logining_code = false;
                    //NProgress.done();
                    let {msg, status, result} = data;
                    if (status !== 'success') {
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    } else {
                        Message({message: msg, type: 'success'});
                    }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 150px auto;
        width: 550px;
        padding: 35px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;

        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }

        .remember {
            margin: 0px 0px 35px 0px;
        }

        .el-icon-back {
            font-weight: bolder;
            font-size: 20px;
            position: absolute;
            z-index: 999;
        }
    }
</style>