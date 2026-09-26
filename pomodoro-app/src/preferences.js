export function isDarkTime(date = new Date()) {
  return date.getHours() >= 17;
}

export function parseTasks(json) {
  const tasks = JSON.parse(json ?? '[]');
  if (!Array.isArray(tasks) || !tasks.every(task => task &&
    (typeof task.id === 'string' || typeof task.id === 'number') &&
    typeof task.text === 'string' && typeof task.done === 'boolean')) {
    throw new Error('Invalid tasks');
  }
  return tasks;
}

export function mergeTasks(current, imported) {
  const ids = new Set(current.map(task => String(task.id)));
  return [...current, ...imported.filter(task => {
    if (ids.has(String(task.id))) return false;
    ids.add(String(task.id));
    return true;
  })];
}
