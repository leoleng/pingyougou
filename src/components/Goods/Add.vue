
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>

      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏切换 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <!-- tab栏一 -->
          <el-tab-pane label="基本信息" name="0">
            <h3>基本信息</h3>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <!-- 联动 -->
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="showCateList"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- tab栏二 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- tab栏三 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- tab栏四 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="successUrl"
              >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- tab栏五 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="add" class="bntAddForm">提交按钮</el-button>
                </el-tab-pane>
       
        </el-tabs>
       </el-form>
     </el-card>

    <!-- 显示大图 -->
    <el-dialog title="图片提交" :visible.sync="dialogVisibleImg" width="50%">
      <img :src="handlePreviewImg" alt class="showImg" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: 'aaa',
        goods_price: '1',
        goods_number: '1',
        goods_weight: '1',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 验证
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      },
      // 联动数据
      cateList: [],
      showCateList: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //   动态参数
      manyList: [],
      onlyList: [],
      //   给上传图片设置请求头
      headersObj: {
        Authorization: sessionStorage.getItem('token')
      },
      handlePreviewImg: '',
      dialogVisibleImg: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
      console.log(this.cateList)
    },
    // 联动发生改变
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return
      }
    },
    // 阻止页面切换
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择第三级分类')
        return false
      }
      if (activeName-oldActiveName!=1 && activeName>oldActiveName) {
       
        this.$message.error('请按顺序填写')
         return false
      }
      let flag = false
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          flag = true
          this.$message.error('输入框不能为空')
        }
      })
      if (flag) {
        return false
      }
    },
    // 点击加载切换
    async tabClick() {
      // 商品参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )
        if (res.meta.status !== 200) return
        res.data.forEach(element => {
          element.attr_vals =
            element.attr_vals.length === '0' ? [] : element.attr_vals.split(' ')
        })
        console.log(res)
        return (this.manyList = res.data)
      } else if (this.activeIndex === '2') {
        //商品属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } }
        )
        if (res.meta.status !== 200) return
        console.log(res)
        this.onlyList = res.data
      }
    },
    // 点击显示图片
    handlePreview(file) {
      // console.log(file);
      this.handlePreviewImg = file.response.data.url
      this.dialogVisibleImg = true
    },
    // 点击移除图片
    handleRemove(file) {
      const fileData = file.response.data.tmp_path
      // findIndex找到数组里所有数据
      const i = this.addForm.pics.findIndex(x => x.pic === fileData)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 监听图片加载完成后的处理
    successUrl(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      // console.log( this.addForm);
    },
    async add() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('获取错误')
        }
      })
      const form = _.cloneDeep(this.addForm)

      form.goods_cat = form.goods_cat.join(',')
      console.log(form)
      // 动态数据传递给数组
      this.manyList.forEach(item => {
        const addInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }

        this.addForm.attrs.push(addInfo)
      })
      // 静态数据传递给数组
      this.onlyList.forEach(item => {
        const addInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }

        this.addForm.attrs.push(addInfo)
      })
      // 赋值给克隆表单
      form.attrs = this.addForm.attrs

      const { data: res } = await this.$http.post('goods', form)
      //  console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error('输入框不能为空')
      }
      this.$message.success('提交成功')
    }
  },
  //   计算属性
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.showImg {
  width: 100%;
}
.bntAddForm {
  margin: 10px 0;
}
</style>


