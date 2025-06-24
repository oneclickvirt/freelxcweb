<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="小鸡ID" prop="lxcId">
        <el-input
          v-model="queryParams.lxcId"
          placeholder="请输入小鸡ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="母鸡名称" prop="superName">
        <el-input
          v-model="queryParams.superName"
          placeholder="请输入母鸡名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户TG的ID" prop="tgId">
        <el-input
          v-model="queryParams.tgId"
          placeholder="请输入用户TG的ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="小鸡IP地址" prop="ip">
        <el-input
          v-model="queryParams.ip"
          placeholder="请输入小鸡IP地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="ssh端口" prop="sshPort">
        <el-input
          v-model="queryParams.sshPort"
          placeholder="请输入ssh端口"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-input
          v-model="queryParams.endTime"
          placeholder="请输入结束时间"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['lxc-machine:queue:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['lxc-machine:queue:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['lxc-machine:queue:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['lxc-machine:queue:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="queueList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="" align="center" prop="id" v-if="true"/> -->
      <el-table-column label="小鸡ID" align="center" prop="lxcId" />
      <el-table-column label="母鸡名称" align="center" prop="superName" />
      <el-table-column label="用户TG的ID" align="center" prop="tgId" />
      <el-table-column label="小鸡IP地址" align="center" prop="ip" />
      <el-table-column label="ssh端口" align="center" prop="sshPort" />
      <el-table-column label="结束时间" align="center" prop="endTime" />
      <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['lxc-machine:queue:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['lxc-machine:queue:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改小鸡和用户关联表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="小鸡ID" prop="lxcId">
          <el-input v-model="form.lxcId" placeholder="请输入小鸡ID" />
        </el-form-item>
        <el-form-item label="母鸡名称" prop="superName">
          <el-input v-model="form.superName" placeholder="请输入母鸡名称" />
        </el-form-item>
        <el-form-item label="用户TG的ID" prop="tgId">
          <el-input v-model="form.tgId" placeholder="请输入用户TG的ID" />
        </el-form-item>
        <el-form-item label="小鸡IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入小鸡IP地址" />
        </el-form-item>
        <el-form-item label="ssh端口" prop="sshPort">
          <el-input v-model="form.sshPort" placeholder="请输入ssh端口" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-input v-model="form.endTime" placeholder="请输入结束时间" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listQueue, getQueue, delQueue, addQueue, updateQueue } from "@/api/lxc/queue";

export default {
  name: "Queue",
  data() {
    return {
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 小鸡和用户关联表表格数据
      queueList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        lxcId: undefined,
        superName: undefined,
        tgId: undefined,
        ip: undefined,
        sshPort: undefined,
        endTime: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        lxcId: [
          { required: true, message: "小鸡ID不能为空", trigger: "blur" }
        ],
        superName: [
          { required: true, message: "母鸡名称不能为空", trigger: "blur" }
        ],
        tgId: [
          { required: true, message: "用户TG的ID不能为空", trigger: "blur" }
        ],
        ip: [
          { required: true, message: "小鸡IP地址不能为空", trigger: "blur" }
        ],
        sshPort: [
          { required: true, message: "ssh端口不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询小鸡和用户关联表列表 */
    getList() {
      this.loading = true;
      listQueue(this.queryParams).then(response => {
        this.queueList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        lxcId: undefined,
        superName: undefined,
        tgId: undefined,
        ip: undefined,
        sshPort: undefined,
        endTime: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加小鸡和用户关联表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids
      getQueue(id).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改小鸡和用户关联表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateQueue(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addQueue(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除小鸡和用户关联表编号为"' + ids + '"的数据项？').then(() => {
        this.loading = true;
        return delQueue(ids);
      }).then(() => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      }).finally(() => {
        this.loading = false;
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('lxc-machine/queue/export', {
        ...this.queryParams
      }, `queue_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
