<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 添加角色列表 -->
      <div class="btn">
        <el-button type="primary">主要按钮</el-button>
      </div>
      <!-- 添加角色表格 -->
      <el-table :data="rolesList" border stripe>
        <!-- 这是下拉列表 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['dbbottom', index1 === 0 ? 'dbtop' : '', 'dbcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级渲染 -->
              <el-col :span="5">
                <el-tag
                  type="primary"
                  closable
                  @close="removeTag(scope.row, item1.id)"
                >
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级渲染 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0 ? '' : 'dbtop', 'dbcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeTag(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级渲染 -->
                  <el-col :span="18">
                    <el-tag
                      :class="[index3 === 0 ? '' : 'dbtop']"
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeTag(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 这是数字 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="level" label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEdit(scope.row)"
              >编译</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-share"
              @click="removeEdit(scope.row)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-delete"
              @click="SetEdit(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="EditdialogVisible"
        width="50%"
        @close="edituserClose"
      >
        <el-form :model="edituses" ref="editusersref" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="edituses.roleName" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="edituses.roleDesc"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer">
          <el-button @click="EditdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editdialogShow">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="SetdialogVisible"
        width="50%"
        @close="Setdialog"
      >
        <!-- 树形结构 -->
        <el-tree
          :data="rightList"
          :props="TreeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="nodeArr"
          ref="treeRef"
        ></el-tree>
        <span slot="footer">
          <el-button @click="SetdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="Allortree">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // 修改用户的对话框
      edituses: {},
      EditdialogVisible: false,
      // 分配权限的对话框
      SetdialogVisible: false,
      rightList: [],
      // 树形结构数据
      TreeProps: {
        label: 'authName',
        children: 'children'
      },
      // 保存树形节点的默认数组key
      nodeArr: [],
      // 当前即将分配权限的id
      roleiid: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表的数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      /* console.log(res) */
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.rolesList = res.data
    },
    // 监听通过id来进行删除列表项
    async removeTag(roles, rightId) {
      const dt = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (dt !== 'confirm') {
        return this.$message.info('您已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${roles.id}/rights/${rightId}`
      )
      /* console.log(res) */
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      roles.children = res.data
    },
    // 编译角色内容
    async showEdit(roles) {
      const { data: res } = await this.$http.post('roles', {
        roleName: roles.roleName,
        roleDesc: ''
      })
      if (res.meta.status !== 201) {
        return this.$message.error('更新失败')
      }
      /* console.log(res) */
      this.edituses = res.data
      this.EditdialogVisible = true
    },
    // 修改表单重置
    edituserClose() {
      this.$refs.editusersref.resetFields()
    },
    async editdialogShow() {
      const { data: res } = await this.$http.put(
        `roles/${this.edituses.roleId}`,
        {
          roleName: this.edituses.roleName,
          roleDesc: this.edituses.roleDesc
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      // 关闭对话框
      this.EditdialogVisible = false
      // 更新数据
      this.getRolesList()
      // 更新成功
      this.$message.success('更新成功')
    },
    // 删除信息列表
    async removeEdit(roles) {
      const removeinfo = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      console.log(removeinfo)
      if (removeinfo !== 'confirm') {
        return this.$message.info('您已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${roles.id}`)
      /* console.log(res) */
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getRolesList()
    },
    // 监听分配权限的
    async SetEdit(roles) {
      this.roleiid = roles.id
      const { data: res } = await this.$http.get('rights/tree')
      /* console.log(res) */
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightList = res.data
      this.getLeafkeys(roles, this.nodeArr)
      this.SetdialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，
    // 并保存到 nodeArr，数组中
    // 定义一个函数
    getLeafkeys(node, arr) {
      // 如果当前属性不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.map(item => this.getLeafkeys(item, arr))
    },
    // 监听对话框关闭事件防止id重复
    Setdialog() {
      this.nodeArr = []
    },
    // 监听分配权限id 来进行添加 值
    async Allortree() {
      const key = [
        // 扩展函数
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const Strkey = key.join(',')
      /* console.log(Strkey) */
      const { data: res } = await this.$http.post(
        `roles/${this.roleiid}/rights`,
        {
          rids: Strkey
        }
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.getRolesList()
      this.SetdialogVisible = false
    }
  }
}
</script>

<style>
.el-main {
  line-height: 0px;
}
.btn {
  display: flex;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.dbtop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-bottom: 1px solid #eee;
}
.dbcenter {
  display: flex;
  align-items: center;
}
</style>
