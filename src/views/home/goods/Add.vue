<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        center
        show-icon
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        align-center
        :active="active - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 侧边导航和form表单 -->
      <el-form
        :model="AddForm"
        label-position="top"
        :rules="AddFormrules"
        ref="AddFormref"
        label-width="100px"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="active"
          :before-leave="beforetableave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="AddForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="AddForm.goods_price" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="AddForm.goods_weight" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="AddForm.goods_number" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="AddForm.goods_cat"
                :options="CategoriesList"
                expandTrigger="hover"
                :props="CateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, index) in item.attr_vals"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <!-- 渲染item的列表 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"> </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编译器 -->
            <quill-editor v-model="AddForm.goods_introduce"> </quill-editor>
            <!-- 添加按钮 -->
            <el-button class="Addbtn" type="primary" @click="Addcate"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览的对话框 -->
      <el-dialog title="图片预览" :visible.sync="PreviewVisible" width="50%">
        <img :src="previewPath" alt="" class="prveviewimg" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 深拷贝lodash
import _ from 'lodash'
export default {
  data() {
    return {
      // 步骤条
      active: 0,
      // 侧边导航
      tabPosition: 'left',
      // 双向数据绑定form表单
      AddForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类数据列表
        goods_cat: [],
        // 图片上传的临时路径是个数组
        pics: [],
        // 数据双向绑定富文本编译器
        goods_introduce: '',
        // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
        attrs: []
      },
      // 表单的验证规则
      AddFormrules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请输入商品分类',
            trigger: 'blur'
          }
        ]
      },
      // 获取分类的数据
      CategoriesList: [],
      // 级联选择器
      CateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 动态参数获取
      manyData: [],
      // 静态的参数列表数据
      onlyData: [],
      // 图片上传的url地址
      uploadUrl: 'https://www.liulongbin.top:8888/api/private/v1/upload',
      // 图片上传是否成功，都要手动的设置请求头header
      headerObj: {
        // 必须要设置手动的获取token值才能显示图片上传成功
        Authorization: window.sessionStorage.getItem('token')
      },
      // 设置图片的真实路径
      previewPath: '',
      // 图片预览的对话框的显示与隐藏
      PreviewVisible: false
    }
  },
  created() {
    // 获取商品分类请求
    this.GetCategories()
  },
  methods: {
    // 获取商品分类请求
    async GetCategories() {
      const { data: res } = await this.$http.get('categories')
      //   console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }

      this.CategoriesList = res.data
      //   console.log(this.CategoriesList)
    },
    // 监听级联选择器发生改变的时候
    handleChange() {
      // console.log(this.AddForm.goods_cat)
      if (this.AddForm.goods_cat.length !== 3) {
        this.AddForm.goods_cat = []
      }
    },
    // 监听在页面跳转之前触发事件
    beforetableave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.AddForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 监听动态参数列表的跳转
    async tabClick() {
      // console.log(this.active)
      // 证明访问的是动态参数
      if (this.active === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('动态参数获取失败')
        }
        // console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyData = res.data
      } else if (this.active === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态数据失败')
        }
        this.onlyData = res.data
        // console.log(this.onlyData)
      }
    },
    // 监听上传图片预览的事件
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.PreviewVisible = true
    },
    // 监听图片删除的事件
    handleRemove(file) {
      // console.log(file)
      // 1. 获取将要删除的图片的临时路径
      const filePath = this.file.response.data.tmp_path
      // 2. 从pics数组中，找到这个图片对应的索引值
      const i = this.AddForm.pics.findIndex(item => {
        item.pic === filePath
      })
      // 3. 调用数组的 splice 方法，把图片信息对象，从pics 数组中移除
      this.AddForm.pics.splice(i, 1)
      // console.log(this.AddForm)
    },
    // 监听图片是否上传成功
    handleSuccess(response) {
      // console.log(response)
      // 1. 拼接得到一个图片信息对象
      const PicInfo = {
        pic: response.data.tmp_path
      }
      // 2. 将图片信息对象，push到pics数组中
      this.AddForm.pics.push(PicInfo)
      // console.log(this.AddForm)
    },
    // 监听表单验证的单击事件
    Addcate() {
      this.$refs.AddFormref.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项!')
        }
        // 执行添加的业务逻辑
        // 深拷贝的goods_cat，不然会报错    lodash cloneDeep(obj)
        const formadd = _.cloneDeep(this.AddForm)
        formadd.goods_cat = formadd.goods_cat.join(',')
        // 遍历attrs数组里面的参数many 和 only
        // 处理动态的属性
        this.manyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.AddForm.attrs.push(newInfo)
        })
        // 处理静态的属性
        this.onlyData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.AddForm.attrs.push(newInfo)
        })
        formadd.attrs = this.AddForm.attrs
        // console.log(formadd)
        // 发起请求
        // 商品名称必须是唯一的
        const { data: res } = await this.$http.post('goods', formadd)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('创建商品失败')
        }
        
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.AddForm.goods_cat.length === 3) {
        return this.AddForm.goods_cat[2]
      }
    }
  }
}
</script>

<style>
.active {
  color: #000;
}
.el-steps {
  margin: 15px 0px;
}
.el-step__title {
  font-size: 13px;
}
.el-tabs__content {
  line-height: 40px;
}
.prveviewimg {
  width: 100%;
  height: 100%;
}
.Addbtn {
  margin-top: 15px;
}
</style>
