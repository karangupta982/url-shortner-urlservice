export class Snowflake {
  constructor(workerId) {
    this.workerId = workerId;
    this.sequence = 0;
    this.lastTimestamp = -1;
  }

  getTimestamp() {
    return Date.now();
  }

  nextId() {
    let timestamp = this.getTimestamp();

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & 0xfff; // 12 bits
      if (this.sequence === 0) {
        while (timestamp <= this.lastTimestamp) {
          timestamp = this.getTimestamp();
        }
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;
    const id = ((timestamp & 0x1FFFFFFFFFF) << 22) | (this.workerId << 12) | this.sequence;
    return id.toString();
  }
}
