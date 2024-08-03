<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="98px"
    >
      <el-form-item label="母鸡IP" prop="superIp">
        <!-- <el-input v-model="queryParams.superIp" placeholder="请输入母鸡IP" clearable @keyup.enter.native="handleQuery" /> -->
        <el-autocomplete
          @keyup.enter.native="handleQuery"
          popper-class="my-autocomplete"
          v-model="queryParams.superIp"
          :fetch-suggestions="querySearchIp"
          placeholder="请输入母鸡IP"
          @select="handleQuerySelect"
        >
          <i
            class="el-icon-edit el-input__icon"
            slot="suffix"
            @click="handleQuerySelect"
          >
          </i>
          <template slot-scope="{ item }">
            <div class="name">{{ item.name }}|{{ item.tag }}</div>
            <span class="addr">{{ item.ip }}</span>
          </template>
        </el-autocomplete>
      </el-form-item>
      <!-- <el-form-item :span="4" label="母鸡名称" prop="name">
                <el-input
                    v-model="queryParams.name"
                    placeholder="请输入小鸡名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item> -->
      <el-form-item label="小鸡名称" prop="childName">
        <el-input
          v-model="queryParams.childName"
          placeholder="请输入小鸡名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="小鸡标签" prop="tag">
        <el-input
          v-model="queryParams.tag"
          placeholder="请输入小鸡标签"
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
      <el-form-item label="开始端口" prop="portStart">
        <el-input
          v-model="queryParams.portStart"
          placeholder="请输入开始端口"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结束端口" prop="portEnd">
        <el-input
          v-model="queryParams.portEnd"
          placeholder="请输入结束端口"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="占用状态" prop="state">
        <el-select
          v-model="queryParams.state"
          placeholder="请选择小鸡占用状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.lxc_state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="小鸡状态" prop="lxcStatus">
        <el-select
          v-model="queryParams.lxcStatus"
          placeholder="请选择小鸡状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.lxc_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="创建时间" prop="superDate">
                <el-date-picker class="my-date-picker"
                    v-model="queryParams.superDate"
                    clearable
                    @keyup.enter.native="handleQuery"
                    value-format="yyyy-MM-dd"
                    type="date"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="死亡时间" prop="superDead">
                <el-date-picker class="my-date-picker"
                    v-model="queryParams.superDead"
                    clearable
                    @keyup.enter.native="handleQuery"
                    value-format="yyyy-MM-dd"
                    type="date"
                ></el-date-picker>
            </el-form-item> -->
      <el-form-item label-width="200px">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['lxc-machine:lxc:add']">新增</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddText" v-hasPermi="['lxc-machine:lxc:add']">批量添加</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['lxc-machine:lxc:edit']">修改</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['lxc-machine:lxc:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['lxc-machine:lxc:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="lxcList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="" align="center" prop="id" v-if="true"/> -->
      <el-table-column align="center" width="55">
        <template slot-scope="scope">
          <v-icon
            class="fi mr-3"
            :class="`fi-${scope.row.tag}`"
            dark
            size="35"
            style="background-color: #f3f4f6; height: 33px !important"
          />
        </template>
      </el-table-column>
      <el-table-column label="母鸡名称" align="center" prop="name" />

      <el-table-column width="130" label="母鸡IP" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
            <router-link :to="{path:'/superLxc',query:{ip:scope.row.superIp}}" class="link-type">
              <span>{{ scope.row.superIp }}</span>
            </router-link>
          </template>
      </el-table-column>
      <el-table-column label="IPV6" align="center" prop="ipv6Addr" />
      <el-table-column label="小鸡名称" align="center" prop="childName" />
      <!-- <el-table-column label="小鸡标签" align="center" prop="tag" /> -->
      <el-table-column label="ssh端口" align="center" prop="sshPort" />
      <el-table-column min-width="97" label="初始密码" align="center" prop="password" />
      <el-table-column label="开始端口" align="center" prop="portStart" />
      <el-table-column label="结束端口" align="center" prop="portEnd" />
      <el-table-column min-width="140" label="创建时间" align="center" prop="createTime" />
      <!-- <el-table-column min-width="95" label="到期时间" align="center" prop="superDead" /> -->
      <el-table-column label="小鸡状态" align="center" prop="lxcStatus">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.lxc_status"
            :value="scope.row.lxcStatus"
          />
        </template>
      </el-table-column>
      <el-table-column label="占用状态" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.lxc_state" :value="scope.row.state" />
        </template>
      </el-table-column>
      <el-table-column min-width="100"  label="领取人TGID" align="center"  >
        <template slot-scope="scope">
            <router-link v-if="scope.row.lxcQueue" :to="{path:'/system/user',query:{tgId:scope.row.lxcQueue.tgId}}" class="link-type">
                <span>{{ scope.row.lxcQueue.tgId }}</span>
              </router-link>
              <span v-else>待领取</span>
          </template>
        </el-table-column>

      <el-table-column
        label="操作"
        min-width="150"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['lxc-machine:lxc:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['lxc-machine:lxc:remove']"
            >删除</el-button
          >
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:user:resetPwd', 'system:user:edit']">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="viewLogs" icon="el-icon-document"
                v-hasPermi="['lxc:lxc:list']">查看创建日志</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 日志查看 -->
    <el-drawer
    :append-to-body="true"
      v-if="initLogs"
      :withHeader="false"
      :visible.sync="logDrawer"
      size="60%">
      <di class="h-full theme-github-dark" v-loading="logLoading">
       <pre ><code class="hljs" v-html="highlightedCode(initLogs)"></code></pre>
       <!-- <highlightjs autodetect :code="code" /> -->
      </di>
    </el-drawer>

    <!-- 添加或修改小鸡信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="小鸡名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入小鸡名称" />
        </el-form-item>
        <el-form-item label="小鸡标签" prop="tag">
          <el-input v-model="form.tag" placeholder="请输入小鸡标签" />
        </el-form-item>
        <el-form-item label="母鸡IP" prop="superIp">
          <el-input v-model="form.superIp" placeholder="请输入母鸡IP" />
        </el-form-item>
        <el-form-item label="IPV6" prop="ipv6Addr">
          <el-input v-model="form.superIp" placeholder="请输入IPV6" />
        </el-form-item>
        <el-form-item label="子级标签" prop="childName">
          <el-input v-model="form.childName" placeholder="请输入子级标签" />
        </el-form-item>
        <el-form-item label="ssh端口" prop="sshPort">
          <el-input v-model="form.sshPort" placeholder="请输入ssh端口" />
        </el-form-item>
        <el-form-item label="小鸡密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入小鸡密码" />
        </el-form-item>
        <el-form-item label="开始端口" prop="portStart">
          <el-input v-model="form.portStart" placeholder="请输入开始端口" />
        </el-form-item>
        <el-form-item label="结束端口" prop="portEnd">
          <el-input v-model="form.portEnd" placeholder="请输入结束端口" />
        </el-form-item>
        <el-form-item label="创建时间" prop="superDate">
          <el-date-picker
            v-model="form.superDate"
            style="width: 380px"
            value-format="yyyy-MM-dd"
            type="date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="到期时间" prop="superDead">
          <el-date-picker
            v-model="form.superDead"
            style="width: 380px"
            value-format="yyyy-MM-dd"
            type="date"
          ></el-date-picker>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="占用状态">
              <el-radio-group v-model="form.state">
                <el-radio
                  v-for="dict in dict.type.lxc_state"
                  :key="dict.value"
                  :label="parseInt(dict.value)"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小鸡状态">
              <el-select v-model="form.lxcStatus" placeholder="请选择小鸡状态">
                <el-option
                  v-for="dict in dict.type.lxc_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 批量添加小鸡信息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="openText"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rulesText" label-width="80px">
        <el-form-item label="母鸡IP" prop="superIp">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="form.superIp"
            :fetch-suggestions="querySearchIp"
            placeholder="请输入内容"
            @select="handleSelect"
          >
            <i
              class="el-icon-edit el-input__icon"
              slot="suffix"
              @click="handleSelect"
            >
            </i>
            <template slot-scope="{ item }">
              <div class="name">{{ item.name }}|{{ item.tag }}</div>
              <span class="addr">{{ item.ip }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="关联角色" prop="roleIds">
          <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.roleName + ' ｜ 配额 ' + item.roleQuota"
              :value="item.roleId"
              :disabled="item.status == 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小鸡列表" prop="lxcText">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 20 }"
            placeholder="请输入内容"
            v-model="form.lxcText"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :loading="buttonLoading"
          type="primary"
          @click="submitTextForm"
          >确 定</el-button
        >
        <el-button @click="cancelText">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser } from "@/api/system/user";
import { listLxc, getLxc, delLxc, addLxc, updateLxc } from "@/api/lxc/lxcAdmin";
// import { listBaseInfoAll } from "@/api/lxc/superLxc";
import { listBaseInfoAll, addLxcMulti } from "@/api/lxc/superLxc";
import { getInitLog } from "@/api/lxc/queue";
//导入hljs，调用registerLanguage函数注册语言，单独引入语言而不引入整个highlight包能减少占用
import hljs from 'highlight.js/lib/core';
// import hljs from "highlight.js/lib/highlight";
// import "highlight.js/styles/github-dark.css"; 
import basicLanguage from "highlight.js/lib/languages/basic";
// hljs.registerLanguage("basic", require("highlight.js/lib/languages/basic"));
hljs.registerLanguage("basic", basicLanguage);


export default {
  name: "Lxc",
  dicts: ["lxc_state", "lxc_status", "sys_normal_disable", "sys_user_sex"],
  data() {
    return {
      // 日志查看
      logDrawer: false,
      initLogs: null,
      // 按钮loading
      buttonLoading: false,
      // 遮罩层
      loading: true,
      // 遮罩层
      logLoading: true,
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
      // 小鸡信息表格数据
      lxcList: [],
      // 弹出层标题
      title: "",
      // 角色选项
      roleOptions: [],
      // 是否显示弹出层
      open: false,
      openText: false,
      timeout: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        tag: undefined,
        superIp: undefined,
        childName: undefined,
        sshPort: undefined,
        password: undefined,
        portStart: undefined,
        portEnd: undefined,
        superDate: undefined,
        superDead: undefined,
        state: undefined,
        lxcStatus: undefined,
      },
      // 表单参数
      form: {
        roleIds: [],
      },
      // 表单校验
      rules: {
        id: [{ required: true, message: "不能为空", trigger: "blur" }],
        name: [
          {
            required: true,
            message: "小鸡名称不能为空",
            trigger: "blur",
          },
        ],
        tag: [
          {
            required: true,
            message: "小鸡标签不能为空",
            trigger: "blur",
          },
        ],
        superIp: [
          {
            required: true,
            message: "母鸡IP不能为空",
            trigger: "blur",
          },
        ],
        childName: [
          {
            required: true,
            message: "子级标签不能为空",
            trigger: "blur",
          },
        ],
        sshPort: [
          {
            required: true,
            message: "ssh端口不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "小鸡密码不能为空",
            trigger: "blur",
          },
        ],
        portStart: [
          {
            required: true,
            message: "开始端口不能为空",
            trigger: "blur",
          },
        ],
        portEnd: [
          {
            required: true,
            message: "结束端口不能为空",
            trigger: "blur",
          },
        ],
        superDate: [{ required: true, message: "不能为空", trigger: "blur" }],
        superDead: [{ required: true, message: "不能为空", trigger: "blur" }],
        state: [
          {
            required: true,
            message: "小鸡占用状态不能为空",
            trigger: "blur",
          },
        ],
      },
      rulesText: {
        lxcText: [
          {
            required: true,
            message: "小鸡信息不能为空",
            trigger: "blur",
          },
        ],
        superIp: [
          {
            required: true,
            message: "母鸡IP不能为空",
            trigger: "change",
          },
        ],
        roleIds: [
          {
            required: true,
            message: "关联角色不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    const superIp = this.$route.query && this.$route.query.ip;
    this.queryParams.superIp = superIp;
    this.getList();
  },
  methods: {
    /** 高亮显示 */
    highlightedCode() {
      let code = '';
      let i = 1;
      this.initLogs.forEach(element => {
          code+=i+++': '+element+'\r\n';
      });
    
      const result = hljs.highlight('basic', code || "", true);
      // setTimeout(() => {
      //       this.$nextTick(() => {
      //         let blocks = document.querySelectorAll('pre code'); // querySelectorAll可以根据自己的富文本生成的代码做调整 我这里默认刚好
      //         blocks.forEach(block => {
      //         console.log(block.innerHTML, "block是", block);
      //         try {
      //           let str = block.innerHTML;
      //           let lang = "vim";

      //           // 得到经过highlight.js之后的html代码
      //           const preCode = hljs.highlight(lang, str, true).value;

      //           // 以换行进行分割
      //           // const lines = preCode.split(/\n/).slice(0, -1);
      //           const linesLength = preCode.split("<br></br>").length;

      //           // 生成行号 aria-hidden 对浏览器语义化隐藏
      //           let linesNum = '<span aria-hidden="true" class="line-numbers-rows">';
      //           for (let index = 0; index < linesLength + 1; index++) {
      //             linesNum = linesNum + "<span></span>";
      //           }
      //           linesNum += "</span>";

      //           let html = preCode;

      //           // 右上角语言说明
      //           // if (linesLength) {
      //           //     html += '<b class="name">' + lang + "</b>";
      //           // }

      //           html =
      //             '<pre class="hljs"><code>' + html + "</code>" + linesNum + "</pre>";

      //           block.parentNode.parentNode.innerHTML = html;
      //         } catch (__) {
      //           console.log("执行错误", __);
      //         }
      //       });
      //       });
      //     }, 1000);
      return result.value || '&nbsp;';
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "viewLogs":
          // this.viewLogs(row);
          this.logDrawer = true;
          this.logLoading = true;
          this.getInitLog(row);
          
          break;
        default:
          break;
      }
    },
    getInitLog(row) {
      this.initLogs = null;
      getInitLog(row.id).then((response) => {
        this.initLogs = response.data;
      }).finally(() => {
        this.logLoading = false;
      });
    },
    /** 查询小鸡信息列表 */
    getList() {
      this.loading = true;
      listLxc(this.queryParams).then((response) => {
        this.lxcList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelText() {
      this.openText = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        tag: undefined,
        superIp: undefined,
        lxcText: undefined,
        childName: undefined,
        ipv6Addr: undefined,
        sshPort: undefined,
        password: undefined,
        portStart: undefined,
        portEnd: undefined,
        superDate: undefined,
        superDead: undefined,
        state: undefined,
        lxcStatus: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        roleIds: [],
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
    },
    /** 批量新增按钮操作 */
    handleAddText() {
      this.reset();
      getUser().then((response) => {
        this.roleOptions = response.data.roles;
        this.openText = true;
        this.title = "批量添加小鸡信息";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getLxc(id).then((response) => {
        this.loading = false;
        this.form = response.data;
        this.open = true;
        this.title = "修改小鸡信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateLxc(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addLxc(this.form)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          }
        }
      });
    },
    /** 提交按钮 */
    submitTextForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          addLxcMulti(this.form)
            .then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.openText = false;
              this.getList();
            })
            .finally(() => {
              this.buttonLoading = false;
            });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除小鸡信息编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delLxc(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "lxc-machine/lxc/export",
        {
          ...this.queryParams,
        },
        `lxc_${new Date().getTime()}.xlsx`
      );
    },
    async querySearchIp(queryString, cb) {
      // 调用 callback 返回建议列表的数据
      listBaseInfoAll({ search: queryString }).then((response) => {
        cb(response ? response : []);
      });
    },
    handleSelect(item) {
      this.form.superIp = item.ip;
    },
    handleQuerySelect(item) {
      // console.log(item);
      this.queryParams.superIp = item.ip;
    },
  },
};
</script>
<style lang="scss" scoped>
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}

.my-date-picker {
  width: 188px;
}

.theme-github-dark{
  color: #c9d1d9;
  background: #0d1117;
  
  .hljs {
    display: inline-block;
    text-align: left;
    padding: 10px 40px;
  }
}
</style>
