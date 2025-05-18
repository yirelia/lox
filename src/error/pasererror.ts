export class PaserError extends Error {
  constructor() {
    super("Parse Error");
    this.name = "PaserError";
  }
}
