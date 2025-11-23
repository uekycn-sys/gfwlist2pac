// ================= 基础变量定义 =================

var MainProxy = "SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080; DIRECT;";

var AgentProxy = "\x50\x52\x4F\x58\x59\x20\x61\x67\x65\x6E\x74\x2E\x62\x61\x69\x64\x75\x2E\x63\x6F\x6D\x3A\x38\x38\x39\x31\x3B\x20\x44\x49\x52\x45\x43\x54\x3B";

var Direct = "DIRECT;";

// ================= 规则配置 =================

var rules = [
    // -------------------------------------------------------
    // 第 1 组：Gemini & AI Studio ->  Agent 
    // -------------------------------------------------------
    {
        proxy: AgentProxy,
        domains: [
            "gemini.google.com",
            "aistudio.google.com",
            "alkalimakersuite-pa.clients6.google.com",
            "generativelanguage.googleapis.com"
        ]
    },
    // -------------------------------------------------------
    // 第 2 组：百度 / 国内域名 / 局域网 -> 走直连
    // -------------------------------------------------------
    {
        proxy: Direct,
        domains: [
            "baidu.com",
            "*.cn",
            "192.168.*",
            "127.0.0.1",
            "localhost",
            "10.*",
            "172.16.*"
        ]
    },
    // -------------------------------------------------------
    // 第 3 组：原有 GFWList 黑名单 -> 走通用代理
    // -------------------------------------------------------
    {
        proxy: MainProxy,
        domains: [
            "google.com",
            "twitter.com",
            "youtube.com"
        ]
    }
];

// ================= 主逻辑函数 =================

function FindProxyForURL(url, host) {
    // 遍历所有规则组
    for (var i = 0; i < rules.length; i++) {
        var group = rules[i];
        var proxyStr = group.proxy;
        var list = group.domains;

        // 遍历组内的域名列表
        for (var j = 0; j < list.length; j++) {
            var rule = list[j];

            // 1. 处理通配符 (如 *.cn)
            if (rule.indexOf('*') !== -1) {
                if (shExpMatch(host, rule)) {
                    return proxyStr;
                }
            }
            // 2. 处理常规域名
            else {
                if (host === rule || host.endsWith("." + rule)) {
                    return proxyStr;
                }
            }
        }
    }

    // ================= 默认兜底 =================
    return MainProxy;
}

// ================= 兼容性 Polyfill =================
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}