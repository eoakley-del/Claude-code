export function getTaskCategories(task) {
  if (task.categories) return task.categories
  return task.category ? [task.category] : []
}
