const groupTints = [
  "bg-(--group-tint-1)",
  "bg-(--group-tint-2)",
  "bg-(--group-tint-3)",
  "bg-(--group-tint-4)",
  "bg-(--group-tint-5)",
]

const ruleTints = [
  "bg-(--rule-tint-1)",
  "bg-(--rule-tint-2)",
  "bg-(--rule-tint-3)",
  "bg-(--rule-tint-4)",
  "bg-(--rule-tint-5)",
]

function getTintIndex(id: string) {
  return [...id].reduce((total, char) => total + char.charCodeAt(0), 0) % 5
}

export function getGroupTint(id: string) {
  return groupTints[getTintIndex(id)]
}

export function getRuleTint(id: string) {
  return ruleTints[getTintIndex(id)]
}
