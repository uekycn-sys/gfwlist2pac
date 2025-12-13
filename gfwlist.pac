var MainProxy = "SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080; DIRECT;";

var AgentProxy = "\x50\x52\x4F\x58\x59\x20\x61\x67\x65\x6E\x74\x2E\x62\x61\x69\x64\x75\x2E\x63\x6F\x6D\x3A\x38\x38\x39\x31\x3B\x20\x44\x49\x52\x45\x43\x54\x3B";

var Direct = "DIRECT;";


var rules = [
    {
        proxy: AgentProxy,
        domains: [
            "gemini.google.com",
            "aistudio.google.com"
        ]
    },
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
    {
        proxy: MainProxy,
        domains: [
            "google.com",
            "twitter.com",
            "youtube.com",
            "chatgpt.com"
        ]
    }
];


function FindProxyForURL(url, host) {
    for (var i = 0; i < rules.length; i++) {
        var group = rules[i];
        var proxyStr = group.proxy;
        var list = group.domains;

        for (var j = 0; j < list.length; j++) {
            var rule = list[j];

            if (rule.indexOf('*') !== -1) {
                if (shExpMatch(host, rule)) {
                    return proxyStr;
                }
            }
            else {
                if (host === rule || host.endsWith("." + rule)) {
                    return proxyStr;
                }
            }
        }
    }

    return Direct;
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}
