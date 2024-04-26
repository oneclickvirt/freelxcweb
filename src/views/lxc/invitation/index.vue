<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="TGID" prop="tgId">
        <el-input
          v-model="queryParams.tgId"
          placeholder="请输入TGID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邀请码" prop="invitationCode">
        <el-input
          v-model="queryParams.invitationCode"
          placeholder="请输入邀请码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否使用" prop="configType">
        <el-select v-model="queryParams.used" placeholder="是否使用" clearable>
          <el-option
            v-for="dict in dict.type.sys_yes_no"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['system:invitation:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:invitation:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:invitation:export']"
        >导出邀请码到剪切板</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="invitationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="邀请码" align="center" prop="invitationCode" />
      <el-table-column width="50" label="是否使用" align="center" prop="TGID">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.tgId?'Y':'N'" />
        </template>
      </el-table-column>
      <el-table-column width="150"  label="TGID" align="center" prop="tgId" />
      <el-table-column width="150"  label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:invitation:edit']"
          >修改</el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:invitation:remove']"
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

    <!-- 添加或修改邀请码对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="生成个数" prop="count">
          <el-input  type="number" v-model="form.count" placeholder="请输入生成个数" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="邀请码" prop="invitationCode">
          <el-input v-model="form.invitationCode" placeholder="请输入邀请码" />
        </el-form-item>
        <el-form-item :required="false" label="TGID" prop="tgId">
          <el-input v-model="form.tgId" placeholder="请输入TGID" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { listInvitation, getInvitation, delInvitation, addInvitation, updateInvitation } from "@/api/lxc/invitation";

export default {
  name: "Invitation",
  dicts: [
    "sys_yes_no",
  ],
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
      // 邀请码表格数据
      invitationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tgId: undefined,
        invitationCode: undefined,
        used: 'N'
      },
      // 表单参数
      form: {
        count: undefined,
      },
      // 表单校验
      rules: {
        tgId: [
          { required: false, message: "TGID不能为空", trigger: "blur" }
        ],
        invitationCode: [
          { required: true, message: "邀请码不能为空", trigger: "blur" }
        ],
        count: [
          { required: true, message: "生成个数不能为空", trigger: "blur" },
          { min: 1, message: "生成个数不能小于1" },
          { max: 999, message: "生成个数不能大于999" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询邀请码列表 */
    getList() {
      this.loading = true;
      listInvitation(this.queryParams).then(response => {
        this.invitationList = response.rows;
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
        tgId: undefined,
        invitationCode: undefined,
        count: undefined,
        createTime: undefined,
        updateTime: undefined,
        updateBy: undefined,
        createBy: undefined
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
      this.ids = selection.map(item => item.invitationCode)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加邀请码";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const invitationCode = this.invitationCode
      getInvitation(invitationCode).then(response => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改邀请码";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.tgId != null) {
            updateInvitation(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).finally(() => {
              this.buttonLoading = false;
            });
          } else {
            addInvitation(this.form).then(response => {
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
      const invitationCodes = row.invitationCode || this.ids;
      this.$modal.confirm('是否确认删除邀请码编号为"' + invitationCodes + '"的数据项？').then(() => {
        this.loading = true;
        return delInvitation(invitationCodes);
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
      // this.download('system/invitation/export', {
      //   ...this.queryParams
      // }, `invitation_${new Date().getTime()}.xlsx`)
      // 导出到剪切板
      if(this.ids.length===0) {
        this.$modal.msgError('请先选择要导出的数据')
        return
      }

      this.$copyText(this.ids.join('\n')).then(() => {
        this.$modal.msgSuccess('导出成功')
      }).catch(() => {
        this.$modal.msgError('导出失败')
      })
    }
  }
};
</script>
