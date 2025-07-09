declare module "keen-slider/react" {
  import { MutableRefObject } from "react";

  export type KeenSliderPlugin = (slider: any) => void;

  export function useKeenSlider<T extends HTMLElement = HTMLElement>(
    options?: any,
    plugins?: KeenSliderPlugin[]
  ): [ (element: T | null) => void, any ];
} 