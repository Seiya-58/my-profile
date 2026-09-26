export const DURATIONS = { work: 25 * 60, break: 5 * 60 };

export const initialState = {
  mode: 'work', remaining: DURATIONS.work, running: false,
  deadline: null, completed: 0, message: '',
};

// 終了予定時刻との差で計算し、タブが非表示の間の遅延にも対応する。
export function secondsLeft(deadline, now) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

function finish(state) {
  const wasWork = state.mode === 'work';
  const mode = wasWork ? 'break' : 'work';
  return {
    ...state, mode, remaining: DURATIONS[mode], running: false, deadline: null,
    completed: state.completed + (wasWork ? 1 : 0),
    message: wasWork
      ? '25分の作業が終了しました。お疲れさま！ 休憩を開始できます。'
      : '5分の休憩が終了しました。次の作業を開始できます。',
  };
}

export function timerReducer(state, action) {
  switch (action.type) {
    case 'start':
      if (state.running) return state;
      return { ...state, running: true, deadline: action.now + state.remaining * 1000, message: '' };
    case 'tick':
    case 'pause': {
      if (!state.running) return state;
      const remaining = secondsLeft(state.deadline, action.now);
      if (remaining === 0) return finish(state);
      return { ...state, remaining,
        running: action.type === 'tick',
        deadline: action.type === 'tick' ? state.deadline : null };
    }
    case 'reset':
      return { ...state, remaining: DURATIONS[state.mode], running: false, deadline: null, message: '' };
    case 'switch':
      if (action.mode === state.mode) return state;
      return { ...state, mode: action.mode, remaining: DURATIONS[action.mode], running: false, deadline: null, message: '' };
    default:
      return state;
  }
}
