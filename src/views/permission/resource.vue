<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddResource">New Resource</el-button>

    <el-table :data="resourcesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Resource Key" width="220">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Resource Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Description">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Resource':'New Resource'">
      <el-form :model="resource" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="resource.name" placeholder="Resource Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="resource.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Resource Description"
          />
        </el-form-item>
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmResource">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getResources } from '@/api/resource'

export default {
  data() {
    return {
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
      this.resourcesList = res.data
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
