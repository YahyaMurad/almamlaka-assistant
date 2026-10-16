// Models commonly emit LaTeX-style \( \) and \[ \] delimiters instead of the
// $ $ / $$ $$ syntax remark-math expects. Convert them before parsing.
export function normalizeMath(text) {
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, expr) => `$$${expr}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, expr) => `$${expr}$`);
}
