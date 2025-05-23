/* eslint-disable */
/* prettier-ignore */
// biome-ignore format: off
// biome-ignore lint: off
// @ts-nocheck

declare module '~virtual/svg-component' {
  const SvgIcon: import("vue").DefineComponent<{
      name: {
          type: import("vue").PropType<"dashboard" | "fullscreen-exit" | "fullscreen" | "keyboard-down" | "keyboard-enter" | "keyboard-esc" | "keyboard-up" | "search">;
          default: string;
          required: true;
      };
  }, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
      name: {
          type: import("vue").PropType<"dashboard" | "fullscreen-exit" | "fullscreen" | "keyboard-down" | "keyboard-enter" | "keyboard-esc" | "keyboard-up" | "search">;
          default: string;
          required: true;
      };
  }>>, {
      name: "dashboard" | "fullscreen-exit" | "fullscreen" | "keyboard-down" | "keyboard-enter" | "keyboard-esc" | "keyboard-up" | "search";
  }>;
  export const svgNames: ["dashboard", "fullscreen-exit", "fullscreen", "keyboard-down", "keyboard-enter", "keyboard-esc", "keyboard-up", "search"];
  export type SvgName = "dashboard" | "fullscreen-exit" | "fullscreen" | "keyboard-down" | "keyboard-enter" | "keyboard-esc" | "keyboard-up" | "search";
  export default SvgIcon;
}
