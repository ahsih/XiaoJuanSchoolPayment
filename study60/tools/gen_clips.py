"""给每条学习内容分配一个音频文件名，并写出待生成清单。
用法（在交接包根目录运行）：python3 tools/gen_clips.py
读取 src/data.base.json（内容源文件）→ 写出 src/data.json（带音频字段）和 tools/clips_manifest.json"""
import json, re, os, sys, subprocess, time
D = json.load(open('src/data.base.json', encoding='utf8'))
TEACH, STU, NARR = 'am_michael', 'af_heart', 'af_nova'
SLOW, NORMAL = 0.85, 0.95
jobs = {}      # filename -> (text, voice, speed)
seen = {}      # (voice, speed, text) -> filename

def clean(t, generic=False):
    t = t.replace('“', '"').replace('”', '"').replace('’', "'").replace('‘', "'")
    t = re.sub(r'[⺀-鿿＀-￯　-〿]+', ' ', t)
    t = t.replace('✓', ' ').replace('→', ' ')
    t = re.sub(r'\(\s*\)', ' ', t)
    t = re.sub(r'_{2,}', '…', t)
    t = t.replace('...', '…')
    if generic:
        t = t.replace('/', ', ')
        if t.upper() == t: t = t.lower()
    else:
        t = re.sub(r'\s+/\s+', '. ', t)
    t = t.replace('CR', 'C R')
    t = re.sub(r'^\d+\.\s+', '', t)
    t = re.sub(r'…[\s.]*\.', '…', t)
    t = re.sub(r'\s*,\s*', ', ', t)
    t = re.sub(r'\s+', ' ', t).strip(' .,')
    if t and t[-1] not in '.?!…': t += '.'
    return t

def is_en(t):
    a = len(re.findall(r'[A-Za-z]', t)); n = len(re.sub(r'\s', '', t))
    return a >= 4 and n and a / n > 0.6

SAY = {
    'My room number is 305.': 'My room number is three oh five.',
    'Room 305.': 'Room three oh five.',
    'Where is Room 305?': 'Where is Room three oh five?',
    'My class starts at 8:00.': "My class starts at eight o'clock.",
    'Excuse me, is this Room 210?': 'Excuse me, is this Room two ten?',
    'Comf-ta-ble.': 'Comf, ta, ble.',
    'My room number is 305.  /  My phone number is ...': 'My room number is three oh five.',
}
def clip(name, text, voice=STU, speed=SLOW, generic=False):
    tt = clean(SAY.get(text.strip(), text), generic)
    if not re.search(r'[A-Za-z]', tt): return None
    key = (voice, speed, tt)
    if key in seen: return seen[key]
    fn = name + '.mp3'
    seen[key] = fn; jobs[fn] = (tt, voice, speed)
    return fn

for d in D['days']:
    p = 'day%02d' % d['day']
    d['tryA'] = clip(p + '-try', d['tryen'])
    for i, w in enumerate(d['words'], 1): w['a'] = clip('%s-w%d' % (p, i), w['w'])
    d['exA'] = [clip('%s-ex%d' % (p, i), e) for i, e in enumerate(re.split(r'\s+/\s+', ' / '.join(d['examples'])), 1)]
    d['exParts'] = re.split(r'\s+/\s+', ' / '.join(d['examples']))
    for i, s in enumerate(d['sentences'], 1):
        parts = re.split(r'\s+/\s+', s['en'])
        s['a'] = clip('%s-s%d' % (p, i), s['en'])
    for i, l in enumerate(d['dialog'], 1):
        l['a'] = clip('%s-d%d' % (p, i), l['en'], STU if l['who'] == 'STUDENT' else TEACH, NORMAL)
    d.pop('audioA', None); d.pop('audioB', None)

for k, pg in D['pages'].items():
    n = 0
    for b in pg['blocks']:
        if b['kind'] == 'call':
            for l in b['lines']:
                subs = []
                for s in l['t'].split('\n'):
                    a = None
                    if is_en(s) and not s.strip().startswith('□'):
                        n += 1; a = clip('p%s-%d' % (k, n), s, generic=True)
                    subs.append({'t': s, 'a': a})
                l['subs'] = subs
        else:
            c = b['cells']
            first = c[0]['t'].strip()
            if re.fullmatch(r'\d{1,2}', first): continue
            targets = [c[0]] if len(c) > 1 else c
            for cell in targets:
                if is_en(cell['t']) and not cell['t'].strip().startswith('□') and 'PPTX' not in cell['t']:
                    n += 1; cell['a'] = clip('p%s-%d' % (k, n), cell['t'], generic=True)

for gi, g in enumerate(D.get('numbers', []), 1):
    for ii, it in enumerate(g['items'], 1):
        it['a'] = clip('num%d-%d' % (gi, ii), it['en'])

for g in D.get('grammar', []):
    g['exA'] = [clip('g%d-%d' % (g['id'], i), e[0]) for i, e in enumerate(g['ex'], 1)]
for i, l in enumerate(D.get('local', []), 1):
    l['a'] = clip('local-%d' % i, l.get('say', l['ex']))
for gi, p in enumerate(D.get('pron', []), 1):
    p['a'] = [[clip('pron%d-%d%s' % (gi, pi, ab), w) for ab, w in zip('ab', pair)] for pi, pair in enumerate(p['pairs'], 1)]

if D.get('pos'):
    for i, it in enumerate(D['pos']['items'], 1): it['a'] = clip('pos-%d' % i, it['ex'])
    D['pos']['buildA'] = [clip('pos-b%d' % i, ' '.join(seg[0] for seg in ex)) for i, ex in enumerate(D['pos']['build']['ex'], 1)]

FINAL = {}
for i, q in enumerate(['Please introduce yourself.', 'What do you usually do on weekdays?', 'Why do you want to study in the Philippines?',
                       'What is difficult for you in English?', 'What do you want your teacher to help you with?'], 1):
    FINAL['sq%d' % i] = clip('final-sq%d' % i, q, TEACH, NORMAL)
for i, q in enumerate(['Please read paragraph two.', 'Do you understand this word?', 'Your answer is not correct.'], 1):
    FINAL['cq%d' % i] = clip('final-cq%d' % i, q, TEACH, NORMAL)
D['final'] = FINAL

# listening test: written to match the answer key (9:00 / 201 / passport and pen / next to the library / Gate 2 / ABC 532 / 10 min)
LISTEN = [
    (NARR, 'Part one. Listen to the announcement.'),
    (TEACH, 'Good morning, new students, and welcome to the school.'),
    (TEACH, 'Orientation starts at nine o\'clock this morning. Not ten. Nine o\'clock.'),
    (TEACH, 'It is in Room two oh one.'),
    (TEACH, 'Please bring your passport and a pen.'),
    (TEACH, 'Room two oh one is on the second floor, next to the library. See you there.'),
    (NARR, 'Part two. Listen to the phone call.'),
    ('am_eric', 'Hi, is this Jenny? This is your school driver.'),
    (STU, 'Yes, this is Jenny. Where are you?'),
    ('am_eric', 'I\'m outside Gate two. My car is white. The plate number is A, B, C, five, three, two.'),
    (STU, 'Sorry, could you repeat the plate number?'),
    ('am_eric', 'Sure. A, B, C, five, three, two.'),
    (STU, 'Thank you. How long will it take to get to the school?'),
    ('am_eric', 'About ten minutes.'),
]
SHOW = [('Room two oh one', 'Room 201'), ('Gate two', 'Gate 2'), ('A, B, C, five, three, two', 'ABC 532')]
def show(t):
    for a, b in SHOW: t = t.replace(a, b)
    return t
D['listenScript'] = [{'who': {'af_nova': '', TEACH: 'STAFF', STU: 'STUDENT', 'am_eric': 'DRIVER'}[v], 't': show(t)} for v, t in LISTEN]
json.dump(D, open('src/data.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
json.dump({'jobs': jobs, 'listen': LISTEN}, open('tools/clips_manifest.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
print('clips:', len(jobs))
