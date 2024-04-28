<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="98px">
      <el-form-item :span="4" label="母鸡名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入母鸡名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="母鸡标签" prop="tag">
        <el-input v-model="queryParams.tag" placeholder="请输入母鸡标签" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="母鸡IP" prop="ip">
        <el-input v-model="queryParams.ip" placeholder="请输入母鸡IP" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="母鸡端口" prop="sshPort">
        <el-input v-model="queryParams.sshPort" placeholder="请输入母鸡端口" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="母鸡创建时间" prop="date">
        <el-input v-model="queryParams.date" placeholder="请输入母鸡创建时间" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="母鸡过期时间" prop="dead">
        <el-input v-model="queryParams.dead" placeholder="请输入母鸡过期时间" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <!-- <el-form-item label="ssh起始端口" prop="sshPortStart">
        <el-input-number
          v-model="queryParams.sshPortStart"
          placeholder="请输入ssh起始端口"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="内存限制" prop="memoryLimit">
        <el-input-number
          type="number"
          v-model="queryParams.memoryLimit"
          placeholder="请输入内存限制"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="硬盘限制" prop="diskLimit">
        <el-input-number
          type="number"
          v-model="queryParams.diskLimit"
          placeholder="请输入硬盘限制"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="可开小鸡数量" prop="maxQuantity">
        <el-input
          type="number"
          v-model="queryParams.maxQuantity"
          placeholder="请输入最大可开小鸡数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->

      <el-form-item label="可用状态" prop="superStatus">
        <el-select v-model="queryParams.superStatus" placeholder="可用状态" clearable>
          <el-option v-for="dict in dict.type.lxc_super_status" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否到期" prop="expireFlag">
        <el-select v-model="queryParams.expireFlag" placeholder="是否到期" clearable>
          <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['lxc-machine:superLxc:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['lxc-machine:superLxc:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['lxc-machine:superLxc:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['lxc-machine:superLxc:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="superLxcList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="母鸡名称" align="center" prop="name" />
      <!-- <el-table-column label="ID" align="center" prop="id" v-if="true"/> -->
      <el-table-column align="center" width="55">
        <template slot-scope="scope">
          <v-icon class="fi mr-3" :class="`fi-${scope.row.tag}`" dark size="35" style="background-color: #f3f4f6; height: 33px !important" />
        </template>
      </el-table-column>
      <el-table-column label="TAG" align="center" prop="tag" />

      <el-table-column width="130" label="母鸡IP" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="{ path: '/lxc/list', query: { ip: scope.row.ip } }" class="link-type">
            <span>{{ scope.row.ip }}</span>
          </router-link>
        </template>
      </el-table-column>
      <!-- <el-table-column
        width="150"
        label="母鸡密码"
        align="center"
        prop="password"
      /> -->
      <el-table-column label="母鸡端口" align="center" prop="sshPort" />
      <el-table-column label="可开数量" align="center" prop="maxQuantity" />
      <el-table-column label="已领数量" align="center" prop="usedQuantity" />
      <el-table-column label="剩余可开" align="center" prop="freeQuantity" />
      <el-table-column width="120" label="创建时间" align="center" prop="date" />
      <el-table-column width="120" label="到期时间" align="center" prop="dead" />
      <el-table-column label="小鸡名称前缀" align="center" prop="prefix" />
      <el-table-column label="ssh起始端口" align="center" prop="sshPortStart" />
      <el-table-column label="内存限制" align="center" prop="memoryLimit" />
      <el-table-column label="硬盘限制" align="center" prop="diskLimit" />
      <el-table-column label="外网起始端口" align="center" prop="netStartPort" />
      <el-table-column label="分配端口数" align="center" prop="netStep" />
      <el-table-column label="上行速度限制" align="center" prop="upLimit" />
      <el-table-column label="下行速度限制" align="center" prop="downLimit" />
      <el-table-column width="100" label="是否启用IPV6" align="center" prop="ipv6Flag">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.ipv6Flag" />
        </template>
      </el-table-column>
      <el-table-column label="是否可开小鸡" align="center" key="superStatus">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.superStatus" active-value="1" inactive-value="0" @change="handleSuperStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="是否到期" align="center" prop="expireFlag">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.expireFlag" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-s-platform" v-hasPermi="['lxc-machine:superLxc:edit']">
            <router-link :to="{
              path: '/system/terminal/index/' + scope.row.id,
              query: { lxcId: scope.row.id, ip: scope.row.ip, type: 'super', cPath: '/superLxc' },
            }" class="link-type">
              <span>远程</span>
            </router-link>
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['lxc-machine:superLxc:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['lxc-machine:superLxc:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改母鸡信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="母鸡名称" prop="name">
              <el-input clearable v-model="form.name" placeholder="请输入母鸡名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="母鸡标签" prop="tag">
              <el-input clearable v-model="form.tag" placeholder="请输入母鸡标签" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="母鸡IP" prop="ip">
              <el-input clearable v-model="form.ip" placeholder="请输入母鸡IP" />
              <!-- <IpInput @getIp="getIp" @:autoFocus="true" :ipType="'ip'"></IpInput> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="母鸡密码" prop="password">
              <el-input show-password clearable v-model="form.password" placeholder="请输入母鸡密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="母鸡SSH端口" prop="sshPort">
              <el-input-number v-model="form.sshPort" label="请输入母鸡端口"></el-input-number>
              <!-- <el-input-number :size="large" v-model="form.sshPort"  :min="1" :max="65535" label="请输入母鸡端口"></el-input-number> -->
              <!-- <el-input clearable type="number" v-model="form.sshPort" placeholder="请输入母鸡端口" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="小鸡名称前缀" prop="prefix">
              <el-input clearable v-model="form.prefix" placeholder="请输入小鸡名称前缀" />
              <!-- <IpInput @getIp="getIp" @:autoFocus="true" :ipType="'ip'"></IpInput> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="关联角色" prop="roleIds">
              <el-select style="width:100%" v-model="form.roleIds" multiple placeholder="请选择角色">
                <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName + ' ｜ 配额 ' + item.roleQuota" :value="item.roleId" :disabled="item.status == 1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间" prop="date">
              <el-date-picker v-model="form.date" value-format="yyyy-MM-dd" type="date"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到期时间" prop="dead">
              <el-date-picker v-model="form.dead" value-format="yyyy-MM-dd" type="date"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否可开小鸡">
              <el-radio-group v-model="form.superStatus">
                <el-radio v-for="dict in dict.type.lxc_super_status" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否到期">
              <el-radio-group v-model="form.expireFlag">
                <el-radio v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否启用IPV6">
              <el-radio-group v-model="form.ipv6Flag">
                <el-radio v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="可开小鸡数量" prop="maxQuantity">
              <el-input-number :min="1" :step="1" v-model="form.maxQuantity" placeholder="最大可开小鸡数量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ssh起始端口" prop="sshPortStart">
              <el-input-number :min="1" :step="1" v-model="form.sshPortStart" placeholder="默认20000" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="硬盘限制" prop="diskLimit">
              <el-input-number v-model="form.diskLimit" :min="1" placeholder="默认1G" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内存限制" prop="memoryLimit">
              <el-input-number :min="1" v-model="form.memoryLimit" placeholder="默认256MB" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="外网起始端口" prop="netStartPort">
              <el-input-number :min="1" v-model="form.netStartPort" placeholder="默认30000" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分配端口数" prop="netStep">
              <el-input-number :min="1" v-model="form.netStep" placeholder="默认20个" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="上行速度限制" prop="upLimit">
              <el-input-number :min="1" v-model="form.upLimit" placeholder="默认300Mbps" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下行速度限制" prop="downLimit">
              <el-input-number :min="1" v-model="form.downLimit" placeholder="默认300Mbps" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-divider>磁盘限制模板</el-divider>
            <el-form-item label-width="0px" prop="rootLimits">
              <v-jsoneditor v-model="templateJson.rootLimits" :options="jsonEditorOptions" height="400px" @error="onRootLimitsError"></v-jsoneditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-divider>实例模板</el-divider>
            <el-form-item label-width="0px" prop="instanceConfig">
              <v-jsoneditor v-model="templateJson.instanceConfig" :options="jsonEditorOptions" height="400px" @error="onInstanceConfig"></v-jsoneditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-divider>镜像配置</el-divider>
            <el-form-item label-width="0px" prop="sourceConfig">
              <v-jsoneditor v-model="templateJson.sourceConfig" :options="jsonEditorOptions" height="400px" @error="onSourceConfig"></v-jsoneditor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser } from "@/api/system/user";
import {
  listSuperLxc,
  getSuperLxc,
  delSuperLxc,
  addSuperLxc,
  updateSuperLxc,
  changeSpuerStatus,
} from "@/api/lxc/superLxc";
import IpInput from "../../../components/IpInput/index.vue";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import VJsoneditor from 'v-jsoneditor'

export default {
  name: "SuperLxc",
  dicts: [
    "sys_normal_disable",
    "lxc_super_status",
    "sys_yes_no",
    "sys_normal_disable",
  ],
  data() {
    var validateJSON = (rule, value, callback) => {
      // json校验
      try {
        JSON.parse(value);
        callback();
      } catch (error) {
        callback(new Error("请输入正确的JSON"));
      }
    };
    return {
      jsonEditorOptions: { mode: 'code' },
      port: 22,
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
      // 母鸡信息表格数据
      superLxcList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 角色选项
      roleOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        tag: undefined,
        ip: undefined,
        password: undefined,
        sshPort: undefined,
        date: undefined,
        dead: undefined,
        superStatus: undefined,
        sshPortStart: undefined,
        memoryLimit: undefined,
        diskLimit: undefined,
        maxQuantity: undefined,
        expireFlag: undefined,
      },
      // 模板JSON
      templateJson: {
        sourceConfig: [],
        instanceConfig: {},
        rootLimits: {},
      },
      default: {
        templateJson: {
          instanceConfig: {
            "limitsCpuAllowance": "25ms/100ms",
            "limitsCpu": "1"
          },
          rootLimits: {},
          sourceConfig: [
/*             {
                  "type": "image",
                  "alias": "debian/11",
                  "server": "https://mirrors.tuna.tsinghua.edu.cn/lxc-images",
                  "protocol": "simplestreams",
                  "mode": "pull"
              },
              {
                  "type": "image",
                  "alias": "ubuntu/20.04",
                  "server": "https://mirrors.tuna.tsinghua.edu.cn/lxc-images",
                  "protocol": "simplestreams",
                  "mode": "pull"
              },
              {
                  "type": "image",
                  "alias": "almalinux/8",
                  "server": "https://mirrors.tuna.tsinghua.edu.cn/lxc-images",
                  "protocol": "simplestreams",
                  "mode": "pull"
              }*/
              {
                "type": "image",
                "alias": "debian/12",
                "server": "https://images.opsmaru.dev/spaces/9bfad87bd318b8f06012059a",
                "protocol": "simplestreams",
                "mode": "pull"
              },
              {
                "type": "image",
                "alias": "ubuntu/22.04",
                "server": "https://images.opsmaru.dev/spaces/9bfad87bd318b8f06012059a",
                "protocol": "simplestreams",
                "mode": "pull"
              }
          ]
        }
      },
      // 表单参数
      form: {
        sshPort: undefined,
        ip: undefined,

      },
      testJson: {
        "hello": "vue"
      },
      // 表单校验
      rules: {
        id: [{ required: true, message: "不能为空", trigger: "blur" }],
        name: [
          {
            required: true,
            message: "母鸡名称不能为空",
            trigger: "blur",
          },
        ],
        tag: [
          {
            required: true,
            message: "母鸡标签不能为空",
            trigger: "blur",
          },
        ],
        ip: [
          {
            required: true,
            message: "请完善母鸡IP",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "母鸡密码不能为空",
            trigger: "blur",
          },
        ],
        sshPort: [
          {
            required: true,
            message: "母鸡端口不能为空",
            trigger: "blur",
          },
        ],
        date: [
          {
            required: true,
            message: "母鸡创建时间不能为空",
            trigger: "blur",
          },
        ],
        dead: [
          {
            required: true,
            message: "母鸡过期时间不能为空",
            trigger: "blur",
          },
        ],
        superStatus: [
          {
            required: true,
            message: "可用状态不能为空",
            trigger: "blur",
          },
        ],
        sshPortStart: [
          {
            required: true,
            message: "ssh起始端口不能为空",
            trigger: "blur",
          },
        ],
        memoryLimit: [
          {
            required: true,
            message: "内存限制，默认256m不能为空",
            trigger: "blur",
          },
        ],
        diskLimit: [
          {
            required: true,
            message: "硬盘限制，默认1G不能为空",
            trigger: "blur",
          },
        ],
        maxQuantity: [
          {
            required: true,
            message: "最大可开小鸡数量不能为空",
            trigger: "blur",
          },
        ],
        expireFlag: [
          {
            required: true,
            message: "是否到期不能为空",
            trigger: "blur",
          },
        ],
        netStartPort: [
          {
            required: true,
            message: "外网起始端口不能为空",
            trigger: "blur",
          },
        ],
        netStep: [
          {
            required: true,
            message: "外网分配端口数不能为空",
            trigger: "blur",
          },
        ],
        prefix: [
          {
            required: true,
            message: "小鸡名称前缀不能为空",
            trigger: "blur",
          },
        ],
        upLimit: [
          {
            required: true,
            message: "上行限制不能为空",
            trigger: "blur",
          },
        ],
        downLimit: [
          {
            required: true,
            message: "下行限制不能为空",
            trigger: "blur",
          },
        ],
        ipv6Flag: [
          {
            required: true,
            message: "是否启用IPV6",
            trigger: "blur",
          },
        ],
        rootLimits: [
          {
            // 必须为JSON
            required: true,
            message: "磁盘限制模板不能为空",
            trigger: "blur",
          },
          { validator: validateJSON, trigger: "blur" },
        ],
        instanceConfig: [
          {
            // 必须为JSON
            required: true,
            message: "实例模板不能为空",
            trigger: "blur",
          },
          { validator: validateJSON, trigger: "blur" },
        ],
        sourceConfig: [
          {
            // 必须为JSON
            required: true,
            message: "镜像配置不能为空",
            trigger: "blur",
          },
          { validator: validateJSON, trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    "templateJson.rootLimits": {
      handler: function (val, oldVal) {
        console.log('val:', val);
        try {
          this.form.rootLimits = JSON.stringify(val);
        } catch (error) {
          this.form.rootLimits = this.default.templateJson.rootLimits;
        }
      },
      deep: true,
    },
    "templateJson.instanceConfig": {
      handler: function (val, oldVal) {
        try {
          this.form.instanceConfig = JSON.stringify(val);
        } catch (error) {
          this.form.instanceConfig = this.default.templateJson.instanceConfig;
        }
      },
      deep: true,
    },
    "templateJson.sourceConfig": {
      handler: function (val, oldVal) {
        try {
          this.form.sourceConfig = JSON.stringify(val);
        } catch (error) {
          console.log(error);
          this.form.sourceConfig = this.default.templateJson.sourceConfig;
        }
      },
      deep: true,
    },
  },
  components: {
    IpInput,
    VueJsonPretty,
    VJsoneditor
  },
  created() {
    const ip = this.$route.query && this.$route.query.ip;
    this.queryParams.ip = ip;
    this.getList();
  },
  beforeRouteLeave(to, from, next) {
    //to是当前页面,from是从哪里来,next是放行
    if (to.name === "superTerminal") {
      to.meta.title = to.query.ip; //获取从上个页面传过来的name再进行修改
    }
    next(); //切记操作完一定要记得放行,否则无法正常跳转页面
  },
  methods: {
    onRootLimitsError(value) {
      this.form.rootLimits = "{";
    },
    onInstanceConfig(value) {
      this.form.instanceConfig = "{";
    },
    onSourceConfig(value) {
      this.form.sourceConfig = "{";
    },
    /** 查询母鸡信息列表 */
    getList() {
      this.loading = true;
      listSuperLxc(this.queryParams).then((response) => {
        this.superLxcList = response.rows;
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
      // this.templateJson = Object.assign(this.$data.templateJson, this.$options.data().templateJson);
      this.templateJson.rootLimits = this.default.templateJson.rootLimits;
      this.templateJson.instanceConfig = this.default.templateJson.instanceConfig;
      this.templateJson.sourceConfig = this.default.templateJson.sourceConfig;
      this.form = {
        id: undefined,
        name: undefined,
        tag: undefined,
        ip: undefined,
        password: undefined,
        sshPort: 22,
        date: undefined,
        dead: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        superStatus: "1",
        expireFlag: "N",
        sshPortStart: 20000,
        memoryLimit: 256,
        diskLimit: 1,
        maxQuantity: undefined,
        netStartPort: 30000,
        netStep: 20,
        upLimit: 300,
        downLimit: 300,
        ipv6Flag: "N",
        prefix: undefined,
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
    // 用户状态修改
    handleSuperStatusChange(row) {
      let text = row.superStatus === "0" ? "禁止" : "放开";
      this.$modal
        .confirm('确认要"' + text + '" "' + row.name + '" 领取小鸡吗？')
        .then(function () {
          return changeSpuerStatus(row.id, row.superStatus);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.superStatus = row.superStatus === "0" ? "1" : "0";
        });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getUser().then((response) => {
        this.roleOptions = response.data.roles;
        this.open = true;
        this.title = "添加母鸡信息";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.loading = true;
      this.reset();
      const id = row.id || this.ids;
      getSuperLxc(id).then((response) => {
        this.form = response.data;
        this.templateJson.rootLimits = JSON.parse(response.data.rootLimits);
        this.templateJson.instanceConfig = JSON.parse(response.data.instanceConfig);
        this.templateJson.sourceConfig = JSON.parse(response.data.sourceConfig);
        getUser().then((response) => {
          this.roleOptions = response.data.roles;
          this.open = true;
          this.title = "修改母鸡信息";
          this.loading = false;
        });
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$forceUpdate();
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id != null) {
            updateSuperLxc(this.form)
              .then((response) => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              })
              .finally(() => {
                this.buttonLoading = false;
              });
          } else {
            addSuperLxc(this.form)
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除母鸡信息编号为"' + ids + '"的数据项？')
        .then(() => {
          this.loading = true;
          return delSuperLxc(ids);
        })
        .then(() => {
          this.loading = false;
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => { })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "lxc-machine/superLxc/export",
        {
          ...this.queryParams,
        },
        `superLxc_${new Date().getTime()}.xlsx`
      );
    },
    getIp(data) {
      // console.log(data);
      if (data.flag) {
        this.form.ip = data.ip;
      }
    },
    toSSH(row) {
      this.$router.push({ path: "/system/dict-data/index/" + row.dictId });
      // this.$router.push({ name: "Terminal" });
    },
  }
};
</script>
