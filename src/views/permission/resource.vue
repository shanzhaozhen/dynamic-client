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
      <el-table-column align="center" label="图标" width="80">
        <template slot-scope="scope">
          {{ scope.row.icon }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序等级" width="80">
        <template slot-scope="scope">
          {{ scope.row.priority }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="隐藏菜单" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.hidden" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="打开固钉" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.affix" type="success">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
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
      <el-form ref="resourceForm" :model="resource" label-width="85px" label-position="right" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="resource.name" placeholder="资源名称" />
        </el-form-item>
        <el-form-item label="路由">
          <el-input v-model="resource.path" placeholder="资源路由" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="图标">
              <el-input v-model="resource.icon" placeholder="资源图标" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="resource.type" placeholder="请选择资源类型">
                <el-option v-for="item in resourceTypeOptions" :key="item.key" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序等级">
              <el-input-number v-model="resource.priority" :min="1" label="排序等级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="隐藏菜单">
              <el-radio-group v-model="resource.hidden">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="打开固钉">
              <el-radio-group v-model="resource.affix">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总是显示">
              <el-radio-group v-model="resource.alwaysShow">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="启动缓存">
              <el-radio-group v-model="resource.noCache">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="打开面包屑">
              <el-radio-group v-model="resource.breadcrumb">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述">
          <el-input v-model="resource.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="资源描述" />
        </el-form-item>
        <el-form-item label="父子节点">
          <el-cascader v-model="resource.pid" clearable :options="resourceList" :props="{ expandTrigger: 'hover', value: 'id', label: 'name', emitPath: false, checkStrictly: true }" />
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
import { getAllResourceTree, addResource, updateResource } from '@/api/resource'
import { deepClone } from '@/utils'
import { deleteResource } from '../../api/resource'

const resourceTypeOptions = [
  { value: 0, name: '菜单' },
  { value: 1, name: '按钮' },
  { value: 2, name: 'API' }
]

const defaultResource = {
  id: undefined,
  name: '',
  description: '',
  type: 0,
  path: '',
  pid: undefined,
  icon: '',
  priority: 1,
  hidden: false,
  alwaysShow: false,
  noCache: true,
  affix: false,
  breadcrumb: true
}

export default {
  data() {
    return {
      listLoading: true,
      loading: false,
      resource: Object.assign({}, defaultResource),
      resourceList: [],
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
    handleAdd() {
      this.loading = false
      this.resource = Object.assign({}, defaultResource)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.loading = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.resource = deepClone(scope.row)
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
