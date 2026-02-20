/**
 * Just for reference.
 *
 * SnakeCase:  harry_potter
 * CamelCase:  harryPotter
 * PascalCase: HarryPotter
 * kababCase:  harry-potter
 */

/* ---------------------- */

/**
 * NejiHyuga => neji_hyuga
 */
export function PascaleToSnakeCase(str) {
  return str
    .replaceAll(/[A-Z]/g, '_$&')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * NejiHyuga => neji-hyuga
 */
export function PascaleToKababCase(str) {
  return str
    .replaceAll(/[A-Z]/g, '-$&')
    .replace(/^-/, "")
    .toLowerCase();
}
