declare module 'animejs' {
  interface AnimeParams {
    targets: any;
    translateX?: string[] | number[];
    translateY?: number[];
    rotate?: number[];
    scale?: number[];
    duration?: number;
    delay?: number;
    easing?: string;
    direction?: string;
    loop?: boolean;
    complete?: () => void;
  }

  interface AnimeTimelineParams {
    loop?: boolean;
    direction?: string;
    duration?: number;
  }

  interface AnimeTimelineInstance {
    add(params: AnimeParams, timeOffset?: number): AnimeTimelineInstance;
  }

  interface AnimeInstance {
    (params: AnimeParams): void;
    timeline(params?: AnimeTimelineParams): AnimeTimelineInstance;
  }

  const anime: AnimeInstance;
  export default anime;
}