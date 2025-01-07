export function removeMismatchingTypes(fallback: any, other: any = {}) {
  for (let k of Object.keys(other)) {
    const replacement = other[k];
    const replacementType = foundry.utils.getType(replacement);

    if (!fallback.hasOwnProperty(k)) {
      delete other[k];
      continue;
    }

    const original = fallback[k];
    const originalType = foundry.utils.getType(original);

    if (replacementType === "Object" && originalType === "Object") {
      removeMismatchingTypes(original, replacement);
      continue;
    }

    if (originalType !== "undefined" && replacementType !== originalType) {
      delete other[k];
    }
  }

  return fallback;
}
