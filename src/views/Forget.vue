<template>
    <el-form :model="ruleForm" status-icon :rules="rules2" ref="ruleForm" label-position="center" label-width="80px"
             class="demo-ruleForm login-container">
        <i class="el-icon-back" @click="toLogin()"></i>
        <h3 class="title">重置密码</h3>
        <el-form-item label="邮箱" prop="mail">
            <el-input type="text" v-model="ruleForm.mail" auto-complete="off" placeholder="请输入需要重置密码的用户的邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password" v-if="showCode">
            <el-input type="password" v-model="ruleForm.password" auto-complete="off"
                      placeholder="只能输入6-20个字母、数字、下划线"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" v-if="showCode">
            <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :inline="true" label="验证码" prop="code" v-if="showCode">
            <el-input type="text" style="width:63%;" v-model="ruleForm.code" auto-complete="off"></el-input>
            <el-button type="primary" style="width:35%;float: right;" @click="countDown()" :loading="logining_code">
                {{content}}
            </el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="forget()" :loading="logining">确认修改
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import { Message} from 'element-ui';
    import {forgetPassword} from '../api/api';
    import {getVerificationCode} from '../api/api';
    //import NProgress from 'nprogress'
    export default {
        data() {
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
                content: '获取邮箱验证码',  // 按钮里显示的内容
                totalTime: 30,     //记录具体倒计时时间
                canClick: true, //添加canClick
                logining: false,
                logining_code: false,
                showCode: false,
                ruleForm: {
                    mail: '',
                    password: '',
                    checkPass: '',
                    code: ''
                },
                rules2: {
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
            countDown() {
                if (!this.canClick) return

                //改动的是这两行代码
                this.getCode();

                this.canClick = false
                this.content = this.totalTime + 's后重新发送'
                let clock = window.setInterval(() => {
                    this.totalTime--
                    this.content = this.totalTime + 's后重新发送'
                    if (this.totalTime < 0) {
                        window.clearInterval(clock)
                        this.content = '重新发送验证码'
                        this.totalTime = 10
                        this.canClick = true  //这里重新开启
                    }
                }, 1000)
            },
            handleReset2() {
                this.$refs.ruleForm.resetFields();
            },
            forget(ev) {
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
                        forgetPassword(params).then(data => {
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
                        }).catch(err => {
                            this.logining = false;
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
                let params = {user_mail: this.ruleForm.mail, type: 'reset_password'};
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
                }).catch(err => {
                    this.logining_code = false;
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