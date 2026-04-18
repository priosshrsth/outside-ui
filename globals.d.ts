// Ambient module declarations for non-code asset imports.
//
// These cover:
//   import "./styles.css"            — side-effect import (no binding)
//   import styles from "./a.css"     — default-binding import
//   import { foo } from "./b.css"    — named binding (CSS modules)
//
// Without the explicit body, tsgo and some flavours of typescript-eslint
// raise TS2882 ("Cannot find module or type declarations for side-effect
// import") because the bare `declare module "*.css";` form is treated as
// a declaration-only stub rather than a module shape.

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.avif" {
  const src: string;
  export default src;
}
