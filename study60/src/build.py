"""把 src/ 里的 style.css + app.js + data.json 合成一个页面。
官网仓库里直接写到网站静态目录：../xiaojuanschoolpayment.client/public/study60/index.html
用法（在仓库的 study60/ 目录运行）：python3 src/build.py"""
import json
OUT = '../xiaojuanschoolpayment.client/public/study60/index.html'
css = open('src/style.css', encoding='utf8').read()
js = open('src/app.js', encoding='utf8').read()
data = json.dumps(json.load(open('src/data.json', encoding='utf8')), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
TITLE = '菲律宾游学前60天英语学习计划'
body = '<div id="app"></div>\n<script type="application/json" id="course-data">' + data + '</script>\n<script>\n' + js + '\n</script>\n'
html = ('<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
        '<title>' + TITLE + ' | 思达启航</title>\n<meta name="description" content="思达启航菲律宾游学前60天英语学习计划：生活英语、课堂英语、开口表达和入学测试准备。">\n'
        '<style>\n' + css + '\n</style>\n</head>\n<body>\n' + body + '</body>\n</html>\n')
open(OUT, 'w', encoding='utf8', newline='\n').write(html)
print(OUT, len(html), 'bytes')
