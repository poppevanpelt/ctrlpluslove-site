// A failed upload stays at the head of the queue. Never skip a meeting segment.
export class MeetingQueue<T> {
  private items: T[] = [];
  private running = false;
  private blocked = false;
  private cancelled = false;
  private process: (item: T) => Promise<void>;
  private changed: (pending: number, blocked: boolean) => void;
  constructor(process: (item: T) => Promise<void>, changed: (pending: number, blocked: boolean) => void) { this.process = process; this.changed = changed; }
  get pending() { return this.items.length; }
  get paused() { return this.blocked; }
  add(item: T) { if (this.cancelled) return; this.items.push(item); this.changed(this.pending, this.blocked); void this.pump(); }
  retry() { this.blocked = false; void this.pump(); }
  cancel() { this.cancelled = true; this.items = []; }
  private async pump() {
    if (this.running || this.blocked || this.cancelled) return;
    this.running = true;
    try {
      while (this.items.length && !this.cancelled) {
        try { await this.process(this.items[0]); }
        catch { this.blocked = true; break; }
        if (!this.cancelled) this.items.shift();
        this.changed(this.pending, this.blocked);
      }
    } finally { this.running = false; if (!this.cancelled) this.changed(this.pending, this.blocked); }
  }
}
