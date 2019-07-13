<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-table :data=rightsList border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="authName"></el-table-column>
        <el-table-column label="路劲" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
            <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">标签一</el-tag>
            <el-tag v-else-if="scope.row.level==='1'" type="success">标签二</el-tag>
            <el-tag v-else type="danger">标签三</el-tag>
            </template>
        </el-table-column>
        </el-table>
    </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            rightsList:[]
        }
    },
    created(){
       this.getRightsLsta()
    },
    methods:{
      async getRightsLsta(){
        const {data:res}= await this.$http.get("rights/list")
// console.log(res);

        if (res.meta.status !==200) {
            this.$.message.error("请求失败");
        }
        this.rightsList=res.data
        console.log(this.rightsList);
  
        }
    }
}
</script>

<style lang="less" scoped>

</style>


