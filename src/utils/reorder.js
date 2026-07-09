// Splices a reordered subset back into its original positions within the
// full array. `oldSubsetOrder` must be the subset's items in the same
// relative order they appear in `fullArray` (e.g. a filtered/visible list).
export function reorderSubset(fullArray, oldSubsetOrder, newSubsetOrder) {
  const subsetIds = new Set(oldSubsetOrder.map((item) => item.id))
  let i = 0
  return fullArray.map((item) => {
    if (subsetIds.has(item.id)) {
      const replacement = newSubsetOrder[i]
      i += 1
      return replacement
    }
    return item
  })
}
