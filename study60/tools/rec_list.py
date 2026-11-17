# 生成录音清单（在仓库的 study60/ 目录运行）：python3 tools/rec_list.py → study60/录音清单.csv
# 清单是给录音老师用的，官网仓库里不放进网站目录，不公开。
import json, csv
D = json.load(open('src/data.json', encoding='utf8'))
M = json.load(open('tools/clips_manifest.json', encoding='utf8'))['jobs']
rows, done = [], set()
def add(fn, where, text, role):
    if not fn or fn in done: return
    done.add(fn); rows.append([fn, where, text, role])
for d in D['days']:
    p = 'Day %02d' % d['day']
    add(d['tryA'], p + ' 先试试看', d['tryen'], '老师示范')
    for i, w in enumerate(d['words'], 1): add(w['a'], p + ' 单词%d' % i, w['w'], '老师示范（慢速）')
    for i, (e, a) in enumerate(zip(d['exParts'], d['exA']), 1): add(a, p + ' 例句%d' % i, e, '老师示范（慢速）')
    for i, s in enumerate(d['sentences'], 1): add(s['a'], p + ' 第%d句' % i, s['en'], '老师示范（慢速）')
    for i, l in enumerate(d['dialog'], 1): add(l['a'], p + ' 对话第%d句' % i, l['en'], '学生（女声）' if l['who'] == 'STUDENT' else l['who'] + '（男声）')
for k, pg in D['pages'].items():
    for b in pg['blocks']:
        items = [c for c in b.get('cells', []) if c.get('a')] + [s for l in b.get('lines', []) for s in l.get('subs', []) if s.get('a')]
        for c in items: add(c['a'], '资料页：' + pg['title'], c['t'], '老师示范')
for g in D.get('numbers', []):
    for it in g['items']: add(it['a'], '数字速查：' + g['title'], it['en'] + '（' + it['n'] + '）', '老师示范（慢速）')
for g in D.get('grammar', []):
    for e, a in zip(g['ex'], g['exA']): add(a, '语法%d %s' % (g['id'], g['title']), e[0], '老师示范（慢速）')
for l in D.get('local', []): add(l['a'], '菲律宾当地英语：' + l['t'], l['ex'], '老师示范（慢速）')
for p in D.get('pron', []):
    for pair, aa in zip(p['pairs'], p['a']):
        for w, a in zip(pair, aa): add(a, '发音对比：' + p['title'], w, '老师示范（慢速）')
if D.get('pos'):
    for it in D['pos']['items']: add(it['a'], '语法第0课：' + it['zh'], it['ex'], '老师示范（慢速）')
    for ex, a in zip(D['pos']['build']['ex'], D['pos']['buildA']): add(a, '语法第0课：句子组成', ' '.join(s[0] for s in ex), '老师示范（慢速）')
for key, fn in D['final'].items(): add(fn, '最终测试', M[fn][0], '考官（男声）')
rows.append(['final-listening.mp3', '最终测试 听力（整段）', ' / '.join(l['t'] for l in D['listenScript']), '广播员+工作人员+司机+学生'])
with open('录音清单.csv', 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f); w.writerow(['文件名', '位置', '英文内容（照读）', '角色']); w.writerows(rows)
print(len(rows))
