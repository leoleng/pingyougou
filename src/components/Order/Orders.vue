<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 输入框和按钮 -->

      <el-row :gutter="20">
        <el-col :span="7">
          <div>
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              clearable
              v-model="queryInfo.query"
            >
              <el-button slot="append" @click="getOrdersList">
                <i class="el-icon-search"></i>
              </el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>

      <!-- 表单 -->
      <el-table :data="ordersList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单总价"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay=='1'">已付款</el-tag>
            <el-tag v-else type="success">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="update_time" label="下单时间">
          <template slot-scope="scope">{{scope.row.update_time |dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-edit" size="mini" @click="selectCitydata"></el-button>
            <el-button type="primary" icon="el-icon-share" size="mini" @click="showDialogVisible"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 物流信息 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in processInfo"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
      <!-- 选择省市区 -->

      <el-dialog title="提示" :visible.sync="dialogVisibleCitydata" width="50%">
        <el-cascader
          v-model="showCitydata"
          :options="citydata"
          :props="propsData"
          @change="handleChange"
        ></el-cascader>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleCitydata = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisibleCitydata = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>


<script>
import citydata from './citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      ordersList: [],
      total: 0,
      dialogVisible: false,
      processInfo: [],
      showCitydata: [],
      propsData: {
        value: 'value',
        label: 'label',
        children: 'children',
        expandTrigger: 'hover'
      },
      dialogVisibleCitydata: false,
      citydata
    }
  },
  created() {
    this.getOrdersList()
  },
  watch:{
    queryInfo:{
        handler(){
          this.getOrdersList()
      },
      deep:true
    }
  },
  computed:{

  },
  methods: {
    //   初始化数据
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败')
      }
      this.ordersList = res.data.goods
      this.total = res.data.total
      // console.log(res)
    },
    async showDialogVisible() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      //   console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error('请求失败')
      }
      this.processInfo = res.data
      this.dialogVisible = true
    },
    // 分页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // this.getOrdersList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      // this.getOrdersList()
    },
    // 省市区联动
    handleChange() {},
    selectCitydata() {
      this.dialogVisibleCitydata = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 200px!important;
}
</style>

