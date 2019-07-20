<template>
  <div>
    <h3>商品列表</h3>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 输入框和按钮 -->
    
        <el-row :gutter="20">
          <el-col :span="7">
            <div>
              <el-input
                placeholder="请输入内容"
                v-model="queryInfo.query"
                class="input-with-select"
                clearable
                @clear="getListData"
              >
                <el-button slot="append" @click="getListData"><i class="el-icon-search"></i></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <div>
              <el-button type="primary" @click="add">主要按钮</el-button>
            </div>
          </el-col>
        </el-row>
      
<!-- 展示数据表格 -->
      <el-table :data="goodsList" border>
         <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名字"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width='130px'></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width='130px'></el-table-column>
        <el-table-column prop="upd_time" label="创建时间" width='180px'>
          <template slot-scope="scope">
            {{scope.row.upd_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column prop="is_promote" label="操作" width='130px'>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size='mini'></el-button>
            <el-button type="danger" icon="el-icon-delete" size='mini' @click="delGoodsList(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="queryInfo.pagenum" 
            :page-sizes="[20, 30, 50, 100]" 
            :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" 
            :total="total">
            </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum:1,
        pagesize:10
      },
      goodsList:[],
      total:0
    }
  },
  created() {
     this.getListData()
  },
  methods: {
     async getListData(){
         const {data:res}= await this.$http.get('goods',{params:this.queryInfo})
            this.goodsList=res.data.goods
            this.total=res.data.total
         console.log(res);
         
      },
    handleCurrentChange(newPage){
        this.queryInfo.pagenum=newPage
        this.getListData()
      },
    handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getListData()
      },
    async delGoodsList(row){
      const resutl = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        
        if (resutl==='confirm') {
          
         const {data:res}= await this.$http.delete(`goods/${row}`)
        
        if (res.meta.status !==200) return this.$message.error('删除失败');
        this.$message.success('删除成功');
         this.getListData()

    }
    },
    add(){
      this.$router.push("/goods/add")
    
   }
},

}
</script>

<style lang="less" scoped>

</style>
