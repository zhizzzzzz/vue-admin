<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="应用名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getConfigs">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="configs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="app_id"label="应用ID" width="160" fixed="left">
			</el-table-column>
			<el-table-column prop="package_name" label="包名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="app_name" label="App名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="app_version" label="强更类型" width="160" :formatter="formatType" sortable>
			</el-table-column>
			<el-table-column prop="web_url" label="web地址" min-width="160" sortable>
			</el-table-column>
			<el-table-column prop="force_update_url" label="强更地址" min-width="160" sortable>
			</el-table-column>
			<el-table-column prop="add_status" label="广告开关" width="120" :formatter="formatStatus" sortable>
			</el-table-column>
            <el-table-column prop="start_add_status" label="启动页-广告开关" width="120" :formatter="formatStatus" sortable>
            </el-table-column>
			<el-table-column label="操作" width="240px" align="center" fixed="right">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="primary" size="small" @click="handleView(scope.$index, scope.row)">预览</el-button>
					<el-button type="primary" size="small" @click="handleTransfer(scope.$index, scope.row)">转移</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" @close="clears()" width="60%">
			<el-form :inline="true" :model="editForm" label-width="160px" :rules="editFormRules" ref="editForm">
				<el-form-item label="包名" prop="package_name">
					<el-input v-model="editForm.package_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="APP名称" prop="app_name">
					<el-input v-model="editForm.app_name" auto-complete="off"></el-input>
				</el-form-item>
<!--				<el-form-item label="公司名称" prop="company">-->
<!--					<el-input v-model="editForm.company" auto-complete="off"></el-input>-->
<!--				</el-form-item>-->
<!--				<el-form-item label="APP简介" prop="introduction">-->
<!--					<el-input v-model="editForm.introduction" auto-complete="off"></el-input>-->
<!--				</el-form-item>-->
				<el-form-item label="强更类型" prop="app_version">
					<el-select v-model="editForm.app_version" placeholder="请选择App版本">
						<el-option label="进入App内部" value="0"></el-option>
						<el-option label="进入不带导航栏的webview" value="1"></el-option>
						<el-option label="强更 安卓专用" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="web地址" prop="web_url">
					<el-input v-model="editForm.web_url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="强制更新地址" prop="force_update_url">
					<el-input v-model="editForm.force_update_url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item></el-form-item>
				<el-form-item label="广告地址" prop="ad_url">
					<el-input v-model="editForm.ad_url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="广告跳转类型" prop="ad_go_type">
					<el-select v-model="editForm.ad_go_type" placeholder="请选择App版本">
						<el-option label="进入App内部" value="0"></el-option>
						<el-option label="进入不带导航栏的webview" value="1"></el-option>
						<el-option label="强更 安卓专用" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="广告开关" prop="ad_status">
					<el-select v-model="editForm.ad_status" placeholder="请选择">
						<el-option label="关闭" value="0"></el-option>
						<el-option label="开启" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="广告图片链接">
					<el-upload
							action="/api/appConfig/upload"
							list-type="picture-card"
							:limit="1"
							:file-list="fileList"
							:on-exceed="handleExceed"
							:on-preview="handlePictureCardPreview"
							:on-remove="handleRemove"
							:on-change="handleChange"
							:on-success="handleSuccess"
							:on-error="handleError"
							:beforeUpload="beforeAvatarUpload">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="启动页-广告地址" prop="ad_url">
					<el-input v-model="editForm.start_ad_url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="启动页-广告跳转类型" prop="ad_go_type">
					<el-select v-model="editForm.start_ad_go_type" placeholder="请选择App版本">
						<el-option label="进入App内部" value="0"></el-option>
						<el-option label="进入不带导航栏的webview" value="1"></el-option>
						<el-option label="强更 安卓专用" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="启动页-广告开关" prop="ad_status">
					<el-select v-model="editForm.start_ad_status" placeholder="请选择">
						<el-option label="关闭" value="0"></el-option>
						<el-option label="开启" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="启动页-广告图片链接">
					<el-upload
							action="/api/appConfig/upload"
							list-type="picture-card"
							:limit="1"
							:file-list="startFileList"
							:on-exceed="handleExceed"
							:on-preview="handlePictureCardPreview"
							:on-remove="startHandleRemove"
							:on-change="handleChange"
							:on-success="startHandleSuccess"
							:on-error="handleError"
							:beforeUpload="beforeAvatarUpload">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" @close="clears()" width="60%">
			<el-form :inline="true" :model="addForm" label-width="160px" :rules="addFormRules" ref="addForm">
				<el-form-item label="包名" prop="package_name">
					<el-input v-model="addForm.package_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="APP名称" prop="app_name">
					<el-input v-model="addForm.app_name" auto-complete="off"></el-input>
				</el-form-item>
<!--				<el-form-item label="APP简介" prop="introduction">-->
<!--					<el-input v-model="addForm.introduction" auto-complete="off"></el-input>-->
<!--				</el-form-item>-->
<!--				<el-form-item label="公司名称" prop="company">-->
<!--					<el-input v-model="addForm.company" auto-complete="off"></el-input>-->
<!--				</el-form-item>-->
				<el-form-item label="强更类型" prop="app_version">
					<el-select v-model="addForm.app_version" placeholder="请选择App版本">
						<el-option label="进入App内部" value="0"></el-option>
						<el-option label="进入不带导航栏的webview" value="1"></el-option>
						<el-option label="强更 安卓专用" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="web地址" prop="web_url">
					<el-input v-model="addForm.web_url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="强制更新地址" prop="force_update_url">
					<el-input v-model="addForm.force_update_url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item></el-form-item>
				<el-form-item label="广告地址" prop="ad_url">
					<el-input v-model="addForm.ad_url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="广告跳转类型" prop="ad_go_type">
					<el-select v-model="addForm.ad_go_type" placeholder="请选择App版本">
						<el-option label="进入App内部" value="0"></el-option>
						<el-option label="进入不带导航栏的webview" value="1"></el-option>
						<el-option label="强更 安卓专用" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="广告开关" prop="ad_status">
					<el-select v-model="addForm.ad_status" placeholder="请选择">
						<el-option label="关闭" value="0"></el-option>
						<el-option label="开启" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="广告图片链接">
					<el-upload
							action="/api/appConfig/upload"
							list-type="picture-card"
							:limit="1"
							:file-list="fileList"
							:on-exceed="handleExceed"
							:on-preview="handlePictureCardPreview"
							:on-remove="handleRemove"
							:on-change="handleChange"
							:on-success="handleSuccess"
							:on-error="handleError"
							:beforeUpload="beforeAvatarUpload">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
				<el-form-item label="启动页-广告地址" prop="ad_url">
					<el-input v-model="addForm.start_ad_url" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="启动页-广告跳转类型" prop="ad_go_type">
					<el-select v-model="addForm.start_ad_go_type" placeholder="请选择App版本">
						<el-option label="进入App内部" value="0"></el-option>
						<el-option label="进入不带导航栏的webview" value="1"></el-option>
						<el-option label="强更 安卓专用" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="启动页-广告开关" prop="ad_status">
					<el-select v-model="addForm.start_ad_status" placeholder="请选择">
						<el-option label="关闭" value="0"></el-option>
						<el-option label="开启" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="启动页-广告图片链接">
					<el-upload
							action="/api/appConfig/upload"
							list-type="picture-card"
							:limit="1"
							:file-list="startFileList"
							:on-exceed="handleExceed"
							:on-preview="handlePictureCardPreview"
							:on-remove="startHandleRemove"
							:on-change="handleChange"
							:on-success="startHandleSuccess"
							:on-error="handleError"
							:beforeUpload="beforeAvatarUpload">
						<i class="el-icon-plus"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="">
					</el-dialog>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>

	import { getConfigListPage, doConfig, delConfig, transferConfig, getConfig } from '../../api/api';

	export default {
		data() {
			return {
				loginUser: {
					sysUserId: '',
					adminUser: ''
				},
				filters: {
					name: ''
				},
				configs: [],
				total: 0,
				page: 1,
				pageSize: 10,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					package_name: [{ required: true, message: '请输入包名', trigger: 'blur' }],
					app_name: [{ required: true, message: '请输入应用名', trigger: 'blur' }],
					app_version: [{ required: true, message: '请选择版本', trigger: 'blur' }],
					web_url: [{ required: true, message: '请输入web地址', trigger: 'blur' }],
					force_update_url: [{ required: true, message: '请输入强更地址', trigger: 'blur' }]
				},
				//编辑界面数据
				editForm: {
					app_id: '',
					package_name: '',
					app_name:'',
					company:'',
					introduction:'',
					app_version: '',
					web_url: '',
					force_update_url: '',
					ad_url: '',
					ad_status: '',
					ad_go_type: '',
					ad_img_url: '',
					start_ad_url: '',
					start_ad_status: '',
					start_ad_go_type: '',
					start_ad_img_url: ''
				},
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					package_name: [{ required: true, message: '请输入包名', trigger: 'blur' }],
					app_name: [{ required: true, message: '请输入应用名', trigger: 'blur' }],
					app_version: [{ required: true, message: '请选择App版本', trigger: 'blur' }],
					web_url: [{ required: true, message: '请输入web地址', trigger: 'blur' }],
					force_update_url: [{ required: true, message: '请输入强更地址', trigger: 'blur' }]
				},
				//新增界面数据
				addForm: {
					package_name: '',
					app_name:'',
					company:'',
					introduction:'',
					app_version: '',
					web_url: '',
					force_update_url: '',
					ad_url:'',
					ad_status:'',
					ad_go_type: '',
					start_ad_url: '',
					start_ad_status: '',
					start_ad_go_type: '',
					start_ad_img_url: ''
				},
				dialogImageUrl: '',
				dialogVisible: false,
				limitCount: 1,
				fileList: [],
				startFileList: [],
				ad_img_url: '',
				start_ad_img_url: '',
			}
		},
		methods: {
			clears(){
				this.fileList = [];
				this.startFileList = [];
			},
			handleRemove(file, fileList) {
				this.ad_img_url = '';
			},
			startHandleRemove(file, fileList) {
				this.start_ad_img_url = '';
			},
			handleChange(file, fileList) {
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleExceed(files, fileList) {
				this.$message.warning(`只能上传单张图片!`);
			},
			handleSuccess(response, file, fileList) {
				let {status, result, msg} = response;
				if (status == 'success') {
					this.ad_img_url = result;
					this.fileList = [{
						'url': this.ad_img_url,
						'uid': file.uid
					}];
				} else {
					this.$message({
						message: msg,
						type: 'error'
					});
				}
				this.addLoading = false;
				this.editLoading = false;
			},
			startHandleSuccess(response, file, fileList) {
				let {status, result, msg} = response;
				if (status == 'success') {
					this.start_ad_img_url = result;
					this.startFileList = [{
						'url': this.start_ad_img_url,
						'uid': file.uid
					}];
				} else {
					this.$message({
						message: msg,
						type: 'error'
					});
				}
				this.addLoading = false;
				this.editLoading = false;
			},
			handleError(err, file, fileList) {
				this.$message({
					message: '图片上传异常',
					type: 'error'
				});
				this.addLoading = false;
				this.editLoading = false;
			},
			beforeAvatarUpload(file) {
				if (['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].indexOf(file.type) === -1) {
					this.$message.error('上传图片只能是 jpg/jpeg/gif/png格式!')
					return false
				}
				this.addLoading = true;
				this.editLoading = true;
			},
			formatType: function (row, column) {
				let version_config = {
					'0': '进入App内部',
					'1': '进入不带导航栏的webview',
					'2': '强更 安卓专用',
				};
				return version_config[row.app_version] || '未知类型';
			},
			formatStatus: function (row, column) {
				let status = {
					'0': '关闭',
					'1': '开启',
				};
				return status[row.ad_status] || '未知类型';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getConfigs();
			},
			//获取配置列表
			getConfigs() {
				let para = {
					pageNumber: this.page,
					pageSize: this.pageSize,
					app_name: this.filters.name,
					user_id: this.loginUser.sysUserId
				};
				this.listLoading = true;
				//NProgress.start();
				getConfigListPage(para).then((data) => {
					//NProgress.done();
					let {msg, status, result} = data;
					if (status !== 'success') {
						this.$message({
							message: msg,
							type: 'error'
						});
					} else {
						this.total = result.totalRow;
						this.configs = result.list.map(e=>e.columns);
						this.listLoading = false;
					}
				});
			},
			//显示预览
			handleView: function (index, row) {
				let para = {app_id: row.app_id};
				getConfig(para).then((data) => {
					//NProgress.done();
					let {msg, status, result} = data;
					if (status !== 'success') {
						this.$message({
							message: msg,
							type: 'error'
						});
					} else {
						let style = 'white-space: pre-wrap !important;word-wrap: break-word !important;*white-space: normal !important;';
						let html = `<pre style="${style}">` + JSON.stringify(data, null, 2) + '</pre>';
						this.$alert(html, '预览', {
							customClass: 'config-result',
							dangerouslyUseHTMLString: true
						});
					}
				});
			},
			//应用转移
			handleTransfer: function (index, row) {
				this.$prompt('请输入用户邮箱', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
					inputErrorMessage: '邮箱格式不正确'
				}).then(({value}) => {

					this.$confirm('此操作将转移应用配置, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let para = {to_user_mail: value, app_id: row.app_id, user_id:this.loginUser.sysUserId};
						transferConfig(para).then((data) => {
							//NProgress.done();
							let {msg, status, result} = data;
							if (status !== 'success') {
								this.$message({
									message: msg,
									type: 'error'
								});
							} else {
								this.$message({
									type: 'success',
									message: '已转移至邮箱: ' + value
								});
								this.getConfigs();
							}
						});
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						});
					});

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				let uid = '';
				let suid = '';
				if(this.fileList.length>0) {
					uid = this.fileList[0].uid;
				}
				if(this.startFileList.length>0) {
					suid = this.startFileList[0].uid;
				}
				this.fileList=[];
				let fromObj = {};
				Object.keys(this.editForm).forEach(function(key){
					fromObj[key] = row[key];
				});
				this.editForm = fromObj;
				if(!!fromObj.ad_img_url) {
					this.fileList = [{
						'url':fromObj.ad_img_url,
						'uid':uid
					}];
				};
				if(!!fromObj.start_ad_img_url) {
					this.startFileList = [{
						'url':fromObj.start_ad_img_url,
						'uid':suid
					}];
				};
				this.editFormVisible = true;
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.ad_img_url = '',
				this.start_ad_img_url = '',
				this.addForm = {
					app_id: '',
					package_name: '',
					app_name:'',
					company:'',
					introduction:'',
					app_version: '',
					web_url: '',
					force_update_url: '',
					ad_url:'',
					ad_status:'0',
					start_ad_url:'',
					start_ad_status:'0'
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.owner_id = this.loginUser.sysUserId;
							para.ad_img_url = this.ad_img_url;
							para.start_ad_img_url = this.start_ad_img_url;
							doConfig(para).then((data) => {
								this.editLoading = false;
								//NProgress.done();
								let {msg, status, result} = data;
								if (status !== 'success') {
									this.$message({
										message: msg,
										type: 'error'
									});
								} else {
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getConfigs();
								}
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.owner_id = this.loginUser.sysUserId
							if(!!this.ad_img_url) {
								para.ad_img_url = this.ad_img_url;
							}
							if(!!this.start_ad_img_url) {
								para.start_ad_img_url = this.start_ad_img_url;
							}
							doConfig(para).then((data) => {
								this.addLoading = false;
								//NProgress.done();
								let {msg, status, result} = data;
								if (status !== 'success') {
									this.$message({
										message: msg,
										type: 'error'
									});
								} else {
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getConfigs();
								}
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.app_id).join("','");
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					delConfig(para).then((data) => {
						this.listLoading = false;
						//NProgress.done();
						let {msg, status, result} = data;
						if (status !== 'success') {
							this.$message({
								message: msg,
								type: 'error'
							});
						} else {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getConfigs();
						}
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getConfigs();
		},
		created() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.loginUser.sysUserId = user.user_id || '';
				this.loginUser.adminUser = user.is_admin;
			}
		}

	}

</script>
<style scoped>
	.config-result {
		width: 600px;
	}
	.el-upload-list--picture-card .el-upload-list__item-actions:hover span:first-child {
		display: none;
	}
	.el-upload-list--picture-card .el-upload-list__item-actions span+span {
		margin-left: 0px;
	}
	.el-dialog .el-form-item {
		width: 400px;
	}
</style>
<style scoped>

</style>