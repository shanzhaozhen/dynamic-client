<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAdd">创建资源</el-button>

    <el-table v-loading="listLoading" :data="resourceList" style="width: 100%;margin-top:30px;" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" border>
      <el-table-column align="center" label="id" width="60">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称" width="120">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="80">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由" width="160">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="可用请求" width="160">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序等级" width="80">
        <template slot-scope="scope">
          {{ scope.row.priority }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑资源':'新建资源'">
      <el-form ref="resourceForm" :model="resource" label-width="100px" label-position="right" :rules="rules">
        <el-row>
          <el-col :span="12"><el-form-item label="名称" prop="name">
            <el-input v-model="resource.name" placeholder="资源名称" />
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由">
              <el-input v-model="resource.path" placeholder="资源路由" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="resource.type" placeholder="请选择资源类型">
                <el-option v-for="item in resourceTypeOptions" :key="item.key" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上级节点">
              <el-cascader v-model="resource.pid" clearable :options="resourceList" :props="{ expandTrigger: 'hover', value: 'id', label: 'name', emitPath: false, checkStrictly: true }" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序等级">
              <el-input-number v-model="resource.priority" :min="1" label="排序等级" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="resource.type === 1">
          <el-col :span="12">
            <el-form-item label="GET请求">
              <el-radio-group v-model="resource.supportGet">
                <el-radio :label="true">开启</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="POST请求">
              <el-radio-group v-model="resource.supportPost">
                <el-radio :label="true">开启</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="resource.type === 1">
          <el-col :span="12">
            <el-form-item label="PUT请求">
              <el-radio-group v-model="resource.supportPut">
                <el-radio :label="true">开启</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="DELETE请求">
              <el-radio-group v-model="resource.supportDelete">
                <el-radio :label="true">开启</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="resource.type === 1">
          <el-col :span="12">
            <el-form-item label="PATCH请求">
              <el-radio-group v-model="resource.supportPatch">
                <el-radio :label="true">开启</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述">
          <el-input v-model="resource.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="资源描述" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="dialogType==='new'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllResourceTree, getAllResourceRootTree, addResource, updateResource, deleteResource } from '@/api/resource'
import { deepClone } from '@/utils'

const resourceTypeOptions = [
  { value: 0, name: '分类' },
  { value: 1, name: 'API' }
]

const defaultResource = {
  id: undefined,
  name: '',
  path: '',
  type: 0,
  priority: 1,
  supportGet: true,
  supportPost: true,
  supportPut: true,
  supportDelete: true,
  supportPatch: true,
  description: ''
}

export default {
  data() {
    return {
      listLoading: true,
      loading: false,
      resource: Object.assign({}, defaultResource),
      resourceList: [],
      resourceRootList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rules: {
        name: [
          { required: true, message: '请输入资源名称', trigger: 'blur' }
        ]
      },
      resourceTypeOptions
    }
  },
  computed: {
  },
  created() {
    this.getAllResourceTree()
  },
  methods: {
    async getAllResourceTree() {
      this.listLoading = true
      const res = await getAllResourceTree().catch(() => {
        this.listLoading = false
      })
      this.resourceList = res.data
      this.listLoading = false
    },
    async getAllResourceRootTree() {
      const res = await getAllResourceRootTree()
      this.resourceRootList = res.data
    },
    async handleAdd() {
      this.loading = false
      this.resource = Object.assign({}, defaultResource)
      this.dialogType = 'new'
      await this.getAllResourceRootTree()
      this.dialogVisible = true
    },
    async handleEdit(scope) {
      this.loading = false
      this.dialogType = 'edit'
      this.resource = deepClone(scope.row)
      await this.getAllResourceRootTree()
      this.dialogVisible = true
    },
    createData() {
      this.$refs.resourceForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await addResource(this.resource).then(res => {
            const { name, description } = this.resource
            this.dialogVisible = false
            this.$notify({
              title: '添加成功',
              dangerouslyUseHTMLString: true,
              message: `
                <div>名称: ${name}</div>
                <div>描述: ${description}</div>
              `,
              type: 'success'
            })
            this.loading = false
            this.getAllResourceTree()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    updateData() {
      this.$refs.resourceForm.validate(async valid => {
        if (valid) {
          this.loading = true
          await updateResource(this.resource).then(res => {
            console.log(res)
            const { name, description } = this.resource
            this.dialogVisible = false
            this.$notify({
              title: '修改成功',
              dangerouslyUseHTMLString: true,
              message: `
                <div>名称: ${name}</div>
                <div>描述: ${description}</div>
              `,
              type: 'success'
            })
            this.loading = false
            this.getAllResourceTree()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    async handleDelete({ row }) {
      console.log(row)
      this.$confirm('确定删除这个资源?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteResource(row.id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getAllResourceTree()
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '操作已取消!'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .resources-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
