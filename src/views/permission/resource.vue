<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddResource">新建资源</el-button>

    <el-table :data="resourceList" style="width: 100%;margin-top:30px;" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" border>
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
      <el-form :model="resource" label-width="85px" label-position="right">
        <el-form-item label="名称">
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
          <el-cascader v-model="resource.pid" clearable :options="resourceList" :props="{ expandTrigger: 'hover', value: 'id', label: 'name', emitPath: false, checkStrictly: true }" @change="handleChange" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmResource">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getResources } from '@/api/resource'
import { deepClone } from '@/utils'

const resourceTypeOptions = [
  { value: 0, name: '菜单' },
  { value: 1, name: '按钮' },
  { value: 2, name: 'API' }
]

const defaultResource = {
  id: '',
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
      resource: Object.assign({}, defaultResource),
      resourceList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      resourceTypeOptions
    }
  },
  computed: {
  },
  created() {
    this.getResources()
  },
  methods: {
    async getResources() {
      const res = await getResources()
      this.resourceList = res.data
    },
    handleAddResource() {
      this.resource = Object.assign({}, defaultResource)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.resource = deepClone(scope.row)
    },
    confirmResource() {
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
