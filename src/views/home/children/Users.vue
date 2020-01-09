<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->

    <el-card>
      <!-- layou布局 -->
      <el-row :gutter="20">
        <!-- 左边搜索框 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="usersInfo.query"
            clearable
            @clear="getusersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getusersList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 右边按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 添加用户列表对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="30%"
        @close="addialigclose"
      >
        <!-- 主题内容 -->
        <el-form
          :model="AddForm"
          :rules="Addrules"
          ref="AddruleFormref"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="AddForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="AddForm.password"></el-input>
          </el-form-item>
          <el-form-item label="email" prop="email">
            <el-input v-model="AddForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="AddForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 这是底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户的信息"
        :visible.sync="EditdialogVisible"
        width="30%"
        @close="edituserClose"
      >
        <el-form
          :model="editusers"
          :rules="editrules"
          ref="editusersref"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editusers.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="email" prop="email">
            <el-input v-model="editusers.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editusers.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="EditdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editfromvisible">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 表格 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽来进行渲染 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userstatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px" height="100px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEdit(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeuser(scope.row.id)"
            ></el-button>

            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-share"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="usersInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 定义邮箱的正则表达式
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱

        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789)|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      usersInfo: {
        // 获取用户列表的参数对象
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前显示没条数据
        pagesize: 2
      },
      usersList: [],
      total: 0,
      // 控制用户列表的显示于隐藏
      dialogVisible: false,
      AddForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      Addrules: {
        username: [
          { required: true, message: '请输入正确的用户名', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入正确的密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入正确的邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户的对话框
      EditdialogVisible: false,
      editusers: {},
      // 修改表单的验证规则
      editrules: {
        email: [
          { required: true, message: '请输入正确的邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getusersList()
  },
  methods: {
    // 获取数据
    async getusersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.usersInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('数据发生错误')
      }
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 监听分页的数据
    handleSizeChange(newsize) {
      this.usersInfo.pagesize = newsize
    },
    handleCurrentChange(newpage) {
      this.usersInfo.pagenum = newpage
    },
    /* 监听状态按钮发生改变的时候 */
    async userstatus(usersInfo) {
      /* console.log(usersInfo) */
      const { data: res } = await this.$http.put(
        `users/${usersInfo.id}/state/${usersInfo.mg_state}`
      )
      //  console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('数据发生错误')
      }
      this.$message.success('数据成功')
    },
    // 监听表单重置的
    addialigclose() {
      this.$refs.AddruleFormref.resetFields()
    },
    // 监听添加的用户 后台获取表单数据 修改表单的于校验
    adduser() {
      this.$refs.AddruleFormref.validate(async vali => {
        if (!vali) return
        const { data: res } = await this.$http.post('users', this.AddForm)
        /* console.log(res) */
        if (res.meta.status !== 201) {
          return this.$message.error('用户创建失败')
        }
        this.$message.success('用户创建成功')
        // 用户列表的隐藏
        this.dialogVisible = false
        // 刷新用户列表
        this.getusersList()
      })
    },
    // 监听修改用户的对话框
    async showEdit(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      /* console.log(res) */
      if (res.meta.status !== 200) {
        return this.$message.error('查询失败')
      }
      this.editusers = res.data
      this.EditdialogVisible = true
    },
    // 修改表单重置
    edituserClose() {
      this.$refs.editusersref.resetFields()
    },
    editfromvisible() {
      this.$refs.editusersref.validate(async vali => {
        if (!vali) return
        const { data: res } = await this.$http.put(
          `users/${this.editusers.id}`,
          {
            email: this.editusers.email,
            mobile: this.editusers.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新失败')
        }
        // 关闭对话框
        this.EditdialogVisible = false
        // 更新数据
        this.getusersList()
        // 更新成功
        this.$message.success('更新成功')
      })
    },
    // 移除用户id
   async removeuser(id){
     // 弹窗询问用户是否删除数据
     const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        /* console.log(confirmRes) */
        // 如果用户确认了删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回的为字符串 cancel
        if(confirmRes !== 'confirm'){
         return this.$message.info('已取消删除')
        }
      const {data:res} = await this.$http.delete(`users/${id}`)
            if(res.meta.status !== 200){
              return this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getusersList()
    }
  }
}
</script>

<style>
.el-card__body {
  height: 500px;
}
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 14px;
}
.el-card__body .el-row .el-col {
  height: 100px;
  line-height: 100px;
}
/* .el-form-item .el-form-item__label{
  width: 150px !important;
} */
</style>
