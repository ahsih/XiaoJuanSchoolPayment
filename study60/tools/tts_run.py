"""用 Kokoro 生成美式发音音频：只生成网站 study60/audio/ 里还没有的文件，已存在的跳过。
官网仓库里音频目录是 ../xiaojuanschoolpayment.client/public/study60/audio/
用法（在仓库的 study60/ 目录运行）：python3 tools/tts_run.py
依赖：pip install kokoro-onnx soundfile；系统需要 ffmpeg；
模型放在 tools/kokoro/：kokoro-v1.0.onnx、voices-v1.0.bin
（下载：https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0）"""
import json, os, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
K = 'tools/kokoro/'
OUT = '../xiaojuanschoolpayment.client/public/study60/audio/'
TMP = 'tools/_wav/'
k = Kokoro(K + 'kokoro-v1.0.onnx', K + 'voices-v1.0.bin')
M = json.load(open('tools/clips_manifest.json', encoding='utf8'))
os.makedirs(TMP, exist_ok=True); os.makedirs(OUT, exist_ok=True)

def mp3(wav, out):  # 去掉首尾静音，末尾留 0.25 秒，单声道 48kbps
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', wav, '-af',
                    'silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,apad=pad_dur=0.25',
                    '-ac', '1', '-ar', '24000', '-b:a', '48k', out], check=True)

n = 0
for fn, (text, voice, speed) in M['jobs'].items():
    if os.path.exists(OUT + fn): continue
    s, sr = k.create(text, voice=voice, speed=speed, lang='en-us')
    wav = TMP + fn.replace('.mp3', '.wav'); sf.write(wav, s, sr); mp3(wav, OUT + fn); n += 1
    print('made', fn, flush=True)

# 最终测试听力：一整段（考试本身就是一段录音），句子之间留停顿
if not os.path.exists(OUT + 'final-listening.mp3'):
    parts = []
    for i, (voice, text) in enumerate(M['listen']):
        s, sr = k.create(text, voice=voice, speed=0.92, lang='en-us')
        nxt = M['listen'][i + 1][1] if i + 1 < len(M['listen']) else ''
        parts += [s, np.zeros(int(sr * (1.6 if nxt.startswith('Part') else 0.7)), dtype=s.dtype)]
    sf.write(TMP + 'final-listening.wav', np.concatenate(parts), sr)
    mp3(TMP + 'final-listening.wav', OUT + 'final-listening.mp3'); n += 1
print('done, generated', n)
