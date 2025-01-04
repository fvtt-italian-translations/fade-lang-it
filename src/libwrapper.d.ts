declare class LibWrapper {
  static get is_fallback(): boolean;
  static get WRAPPER(): "WRAPPER";
  static get MIXED(): "MIXED";
  static get OVERRIDE(): "OVERRIDE";
  static register(
    package_id: string,
    target: string,
    fn: (...args: any[]) => any,
    type?: "MIXED" | "WRAPPER" | "OVERRIDE" | 1 | 2 | 3,
    opts?: { chain?: any; bind?: any[] }
  ): void;
}

export const libWrapper: typeof LibWrapper;
