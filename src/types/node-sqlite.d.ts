declare module "node:sqlite" {
  export class DatabaseSync {
    constructor(path: string);
    exec(sql: string): void;
    prepare(sql: string): {
      all(...params: Array<string | number | null>): Record<string, unknown>[];
      run(...params: Array<string | number | null>): { changes: number };
    };
    close(): void;
  }
}
