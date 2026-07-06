export function categoryColor(name) {
  if (!name) return null

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 360
  }
  const hue = hash < 0 ? hash + 360 : hash

  return {
    bg: `hsla(${hue}, 65%, 50%, 0.14)`,
    border: `hsla(${hue}, 65%, 50%, 0.7)`,
  }
}
