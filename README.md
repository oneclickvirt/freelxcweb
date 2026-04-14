## 项目说明

本项目是基于 Vue 2 的前端管理系统（项目名：SL-LXC）。

对应的后端代码见：https://github.com/oneclickvirt/freelxcserver

## 环境要求

- Node.js：16.x（与项目 `package.json` 保持一致）
- npm：>= 6
- 建议操作系统：Linux（生产环境）

## 本地开发

```bash
# 1) 进入项目目录
cd freelxcweb

# 2) 可选：设置 npm 镜像源（提升下载速度）
npm config set registry https://registry.npmmirror.com

# 3) 安装依赖（推荐）
npm i --legacy-peer-deps

# 4) 启动开发服务
npm run dev
```

启动后访问：
- http://localhost:1024

说明：
- 开发端口在 `vue.config.js` 中配置，当前为 `1024`。
- 若安装依赖报冲突，优先使用 `npm i --legacy-peer-deps`。
- 不建议使用 `cnpm`，避免出现依赖解析差异导致的异常。

## 构建与预览

```bash
# 构建生产包（输出到 dist 目录）
npm run build:prod

# 本地预览构建产物（可选）
npm run preview
```

说明：
- 当前项目有效构建命令为 `build:prod`。
- 文档中的 `build:stage` 并非本项目默认脚本，如需使用请先在 `package.json` 中新增。

## 关键配置说明

### 1. 前端环境变量

- 开发环境：`.env.development`
  - `VUE_APP_BASE_API='/dev-api'`
  - `VUE_APP_CONTEXT_PATH='/'`
- 生产环境：`.env.production`
  - `VUE_APP_BASE_API='/prod-api'`
  - `VUE_APP_CONTEXT_PATH='/'`

### 2. 代理与接口前缀关系

开发环境（`npm run dev`）下：
- 浏览器请求 `/dev-api/*`
- 由 `vue.config.js` 代理到 `http://127.0.0.1:8088/*`

生产环境（Nginx/OpenResty）下：
- 浏览器请求 `/prod-api/*`
- 由 Nginx/OpenResty 反向代理到后端服务

## 生产部署（Nginx）

以下为通用模板，所有 IP/域名已脱敏，请按实际环境替换。

```nginx
# 后端 API 服务（可配置多实例做负载均衡）
upstream backend_api {
    server xxxx:8088;
    # server xxxx:8089;
}

# 监控服务
upstream monitor_admin {
    server xxxx:9200;
}

# xxl-job 服务
upstream xxl_job_admin {
    server xxxx:9100;
}

server {
    # 前端对外访问端口
    listen 80;

    # 对外访问域名（或公网 IP）
    server_name xxxx;

    # 前端静态资源目录（dist 所在目录）
    root /opt/project/freelxc/lxcweb/dist;
    index index.html index.htm;

    # 前端路由回退（history 模式必须保留）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端接口代理
    location /prod-api/ {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 注意：proxy_pass 末尾必须带 /
        # 否则 /prod-api/xxx 可能被错误转发为 /prod-api/xxx（路径不被剥离）
        proxy_pass http://backend_api/;
    }

    # 监控页面代理
    location /monitor/admin/ {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://monitor_admin/admin/;
    }

    # xxl-job 页面代理
    location /xxl-job-admin/ {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://xxl_job_admin/xxl-job-admin/;
    }

    # 限制外网访问 actuator（按需保留）
    location ~ ^(/[^/]*)?/actuator(/.*)?$ {
        return 403;
    }

    # 禁止访问敏感文件
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.env|\.svn|\.project|LICENSE|README.md) {
        return 404;
    }

    # 静态资源缓存策略（按需调整）
    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$ {
        expires 30d;
        access_log off;
        error_log /dev/null;
    }

    location ~ .*\.(js|css)$ {
        expires 12h;
        access_log off;
        error_log /dev/null;
    }
}
```

### 域名绑定说明

- 若使用域名访问，请先保证域名 DNS 已解析到服务器公网 IP。
- 若服务器内部需要固定域名解析，可在 `/etc/hosts` 中增加映射：

```text
xxxx    your.domain.example
```

## 生产部署（OpenResty）

若使用 1Panel/OpenResty，可参考以下模板：

```nginx
server {
    # 按需监听端口，可改为 80/443
    listen 1024 default_server;

    # 对外访问域名或 IP
    server_name xxxx;

    # 前端 dist 目录
    root /www/sites/xxxx/index/dist;
    index index.html index.htm;

    access_log /www/sites/xxxx/log/access.log main;
    error_log  /www/sites/xxxx/log/error.log warn;

    # 前端路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端接口代理
    location /prod-api/ {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 注意：末尾 / 必须保留
        proxy_pass http://xxxx:8088/;
    }

    # 监控页面代理
    location /monitor/admin/ {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://xxxx:9200/admin/;
    }

    # xxl-job 页面代理
    location /xxl-job-admin/ {
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://xxxx:9100/xxl-job-admin/;
    }

    # 限制外网访问 actuator（按需保留）
    location ~ ^(/[^/]*)?/actuator(/.*)?$ {
        return 403;
    }
}
```

## 常见问题排查

### 1. 页面打不开或白屏

- 先确认前端是否已正常构建并部署 `dist` 目录。
- 确认 Nginx/OpenResty 的 `root` 路径指向正确目录。
- 确认 `location /` 中有 `try_files $uri $uri/ /index.html;`。

### 2. 接口 404/500

- 检查前端环境变量中 `VUE_APP_BASE_API` 与代理前缀是否一致。
- 检查 `/prod-api/` 的 `proxy_pass` 是否带末尾 `/`。
- 检查后端服务端口是否可达（8088/9200/9100）。

### 3. HTTPS 下功能异常

- 若页面为 HTTPS，而被代理系统为 HTTP，浏览器可能因混合内容策略拦截请求。
- 解决方案：
  - 统一改为 HTTPS；或
  - 将相关地址改为独立外链页面访问。

## 维护建议

- 升级依赖前先锁定版本并进行测试，尤其是 `echarts` 等容易引发兼容问题的库。
- 线上部署前，先在测试环境验证代理路径是否正确。
- 将真实公网 IP、域名、账号等敏感信息放到私有文档，不写入公开仓库。
