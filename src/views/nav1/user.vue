<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.mail" placeholder="邮箱"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="user_name" label="昵称" width="130" sortable>
				</el-table-column>
				<el-table-column prop="user_mail" label="邮箱" width="500" sortable>
				</el-table-column>
				<el-table-column prop="is_admin" label="类型" width="100" :formatter="formatType" sortable>
				</el-table-column>
				<el-table-column prop="status" label="状态" width="130" :formatter="formatStatus" sortable>
				</el-table-column>
				<el-table-column prop="create_time" label="创建时间" min-width="180" sortable>
				</el-table-column>
				<el-table-column label="操作" width="180px" align="center">
					<template slot-scope="scope">
						<el-button type="primary" size="small" @click="modifyValid(scope.$index, scope.row)">{{scope.row.status?'停用':'启用'}}</el-button>
						<el-button type="primary" size="small" @click="resetPass(scope.$index, scope.row)">重置密码</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
				</el-pagination>
			</el-col>
		</template>

	</section>
</template>
<script>
	import { getUserList,modifyUser,resetPassword } from '../../api/api';
	//import NProgress from 'nprogress'
	export default {
		data() {
			return {
				filters: {
					mail: ''
				},
				total: 0,
				page: 1,
				pageSize: 2,
				loading: false,
				users: [
				]
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUser();
			},
			formatType: function (row, column) {
				return row.is_admin ? '管理员' : '普通用户';
			},
			formatStatus: function (row, column) {
				return row.status ? '正常' : '禁用';
			},
			//获取用户列表
			getUser: function () {
				let para = {
					pageNumber: this.page,
					pageSize: this.pageSize,
					user_mail: this.filters.mail
				};
				this.loading = true;
				//NProgress.start();
				getUserList(para).then((data) => {
					//NProgress.done();
					let {msg, status, result} = data;
					if (status !== 'success') {
						this.$message({
							message: msg,
							type: 'error'
						});
					} else {
						this.total = result.totalRow;
						this.users = result.list.map(e=>e.columns);
						this.loading = false;
					}
				});
			},
			//启动/停用
			modifyValid: function (index, row) {
				this.loading = true;
				//NProgress.start();
				let para = {user_id: row.user_id};
				modifyUser(para).then((data) => {
					//NProgress.done();
					let {msg, status, result} = data;
					if (status !== 'success') {
						this.$message({
							message: msg,
							type: 'error'
						});
					} else {
						this.loading = false;
						//NProgress.done();
						this.$message({
							message: '操作成功',
							type: 'success'
						});
						this.getUser();
					}
				});
			},
			//重置密码
			resetPass: function (index, row) {
				this.$confirm('确认重置密码吗?', '提示(默认密码:88888888)', {
					type: 'warning'
				}).then(() => {
					this.loading = true;
					//NProgress.start();
					let para = {user_id: row.user_id};
					resetPassword(para).then((data) => {
						//NProgress.done();
						let {msg, status, result} = data;
						if (status !== 'success') {
							this.$message({
								message: msg,
								type: 'error'
							});
						} else {
							this.loading = false;
							//NProgress.done();
							this.$message({
								message: '重置成功',
								type: 'success'
							});
							this.getUser();
						}
					});
				}).catch(() => {

				});
			},
		},
		mounted() {
			this.getUser();
		}
	};

</script>

<style scoped>

</style>