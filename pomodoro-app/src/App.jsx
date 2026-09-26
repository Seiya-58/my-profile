import { useEffect, useReducer, useState } from 'react';
import { DURATIONS, initialState, timerReducer } from './timer';
import TaskApp from '../../posse-task-app/src/App.jsx';
import { isDarkTime, parseTasks, mergeTasks } from './preferences';

export default function App() {
  const [timer, dispatch] = useReducer(timerReducer, initialState);
  const [dark, setDark] = useState(() => isDarkTime());
  const [tasks, setTasks] = useState(() => {
    try { return parseTasks(localStorage.getItem('posse-tasks')); }
    catch { return []; }
  });
  const [selectedId, setSelectedId] = useState('');
  const [showTasks, setShowTasks] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const availableTasks = tasks.filter(task => !task.done);
  const selectedTask = availableTasks.find(task => String(task.id) === selectedId);

  useEffect(() => {
    const update = () => setDark(isDarkTime());
    const interval = window.setInterval(update, 1000);
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  useEffect(() => {
    const sync = (event) => {
      if (event.key === 'posse-tasks' || event.key === null) {
        try { setTasks(parseTasks(localStorage.getItem('posse-tasks'))); }
        catch { setImportMessage('保存されたタスクを読み込めませんでした。'); }
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  async function importTasks(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const imported = parseTasks(await file.text());
      const merged = mergeTasks(parseTasks(localStorage.getItem('posse-tasks')), imported);
      localStorage.setItem('posse-tasks', JSON.stringify(merged));
      setTasks(merged);
      setImportMessage('タスクを読み込みました。同じIDのタスクは重複追加しません。');
    } catch {
      setImportMessage('読み込めませんでした。タスクアプリから書き出したJSONファイルを選んでください。');
    }
  }
  const { mode, remaining, running, completed, message } = timer;
  const isWork = mode === 'work';
  const duration = DURATIONS[mode];
  const progress = (duration - remaining) / duration;
  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');
  const color = isWork ? (dark ? '#cf6952' : '#b64d39') : (dark ? '#508f7c' : '#387363');
  const buttonStyle = 'cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-700';

  useEffect(() => {
    if (!running) return;
    const tick = () => dispatch({ type: 'tick', now: Date.now() });
    const interval = window.setInterval(tick, 250);
    window.addEventListener('focus', tick);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', tick);
    };
  }, [running]);

  useEffect(() => {
    document.title = `${minutes}:${seconds} ${isWork ? '作業' : '休憩'} | ひと区切り`;
  }, [minutes, seconds, isWork]);

  return (
    <div className={`${dark ? 'dark bg-stone-950 text-stone-100' : 'bg-[#faf7f2] text-stone-800'} min-h-screen px-4 py-8 font-sans sm:px-8 sm:py-10`}>
      <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-stone-200 pb-5">
        <a href="./" className="flex items-center gap-2 text-lg font-bold tracking-wider">
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#b64d39]" />ひと区切り
        </a>
        <span className="text-xs text-stone-500">{dark ? '夜のダークモード' : 'ライトモード'} · 17時に自動切替</span>
      </header>

      <main className="mx-auto max-w-xl pt-9 sm:pt-12">
        <div className="mb-7 text-center">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-stone-500">ひとつずつ、自分のペースで。</p>
          <h1 className="text-2xl font-bold sm:text-3xl">集中と休憩に、心地よいリズムを。</h1>
        </div>

        <section aria-label="取り組むタスク" className="mb-5 rounded-2xl border border-stone-200 bg-white p-5">
          <label htmlFor="focus-task" className="mb-2 block text-sm font-bold">取り組むタスク</label>
          <select id="focus-task" value={selectedTask ? selectedId : ''} onChange={event => setSelectedId(event.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white p-3">
            <option value="">タスクを選択せずに取り組む</option>
            {availableTasks.map(task => <option key={task.id} value={String(task.id)}>{task.text}</option>)}
          </select>
          <p aria-live="polite" className="mt-3 break-words text-sm text-stone-500">
            {selectedTask ? `取り組むタスク：${selectedTask.text}` : availableTasks.length ? '未完了のタスクから選べます。' : '未完了のタスクがありません。タスク管理から追加できます。'}
          </p>
          <button type="button" aria-expanded={showTasks} onClick={() => setShowTasks(!showTasks)} className="mt-3 cursor-pointer text-sm underline">
            {showTasks ? 'タスク管理を閉じる' : 'タスクを追加・管理する'}
          </button>
          {showTasks ? <TaskApp onTasksChange={setTasks} /> : (
            <details className="mt-4 text-sm text-stone-500">
              <summary className="cursor-pointer">別のタスクアプリから引き継ぐ</summary>
              <p className="my-3">元のタスクアプリで「ポモドーロ用にタスクを書き出す」を押し、そのファイルを選んでください。読み込み後は、この画面のタスク管理で編集できます。</p>
              <input type="file" accept=".json,application/json" aria-label="タスクのJSONファイルを読み込む" onChange={importTasks} className="w-full" />
              <p role="status" className="mt-2">{importMessage}</p>
            </details>
          )}
        </section>

        <section aria-label="ポモドーロタイマー" className="rounded-[2rem] border border-stone-200 bg-white px-5 py-7 shadow-sm sm:px-10">
          <div role="group" aria-label="モードの選択" className="mx-auto flex max-w-xs gap-1 rounded-full bg-stone-100 p-1">
            {[
              { value: 'work', label: '作業', time: '25分' },
              { value: 'break', label: '休憩', time: '5分' },
            ].map((item) => (
              <button key={item.value} type="button" aria-pressed={mode === item.value}
                onClick={() => dispatch({ type: 'switch', mode: item.value })}
                className={`${buttonStyle} flex-1 py-2.5 text-sm ${mode === item.value ? 'bg-white font-bold shadow-sm' : 'text-stone-500 hover:bg-stone-200'}`}>
                {item.label}<span className="ml-2 text-xs font-normal">{item.time}</span>
              </button>
            ))}
          </div>

          <div className="relative mx-auto my-7 aspect-square w-full max-w-72">
            <div role="progressbar" aria-label="経過時間" aria-valuemin={0} aria-valuemax={duration}
              aria-valuenow={duration - remaining} aria-valuetext={`残り${Number(minutes)}分${Number(seconds)}秒`}
              className="absolute inset-0 rounded-full p-2.5"
              style={{ background: `conic-gradient(${color} ${progress * 360}deg, ${dark ? '#57534e' : '#eeeae4'} 0deg)` }}>
              <div className="h-full w-full rounded-full bg-white" />
            </div>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ color }} className="mb-2 text-sm font-medium">{isWork ? '集中する時間' : 'ひと息つく時間'}</span>
              <p role="timer" aria-label={`残り${Number(minutes)}分${Number(seconds)}秒`} className="text-6xl font-light tracking-tight tabular-nums sm:text-7xl">{minutes}:{seconds}</p>
              <p className="mt-3 text-xs text-stone-500">{running ? 'タイマー実行中' : remaining < duration ? '一時停止中' : '準備ができたら、スタート'}</p>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button type="button" onClick={() => dispatch({ type: running ? 'pause' : 'start', now: Date.now() })}
              style={{ backgroundColor: color }} className={`${buttonStyle} min-w-36 px-7 py-3.5 font-bold text-white hover:opacity-90`}>
              {running ? '一時停止' : remaining < duration ? '再開' : 'スタート'}
            </button>
            <button type="button" onClick={() => dispatch({ type: 'reset' })}
              className={`${buttonStyle} border border-stone-200 px-5 py-3.5 text-sm hover:bg-stone-100`}>リセット</button>
          </div>
          <p className="mt-5 text-center text-xs leading-relaxed text-stone-500">モードを切り替えると、タイマーは初期時間に戻ります。</p>
          <div role="status" className={`mt-5 rounded-xl px-4 py-3 text-center text-sm leading-relaxed ${message ? 'bg-amber-50 text-amber-900' : 'bg-stone-50 text-stone-500'}`}>
            {message || (isWork ? '今はひとつのことに、ゆっくり集中。' : '肩の力を抜いて、少しリフレッシュ。')}
          </div>
        </section>

        <section aria-label="完了した作業" className="mt-5 flex items-center justify-between rounded-2xl border border-stone-200 bg-[#f1ece4] dark:bg-stone-800 px-6 py-5">
          <div><h2 className="text-sm font-bold">今回の完了回数</h2><p className="mt-1 text-xs text-stone-500">25分の作業を終えるたびに記録</p></div>
          <p className="text-3xl font-semibold tabular-nums">{completed}<span className="ml-2 text-sm font-normal">回</span></p>
        </section>
        <p className="mt-5 text-center text-xs leading-6 text-stone-500">作業25分 → 休憩5分。終了後は、次のスタートを待ちます。<br />ページを再読み込みすると、タイマーと完了回数はリセットされます。</p>
      </main>
    </div>
  );
}
