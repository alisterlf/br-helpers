import type { MaskSlot } from './identifiers';

const ASCII_TABLE_SIZE = 128;

export class DocumentMask {
  readonly slots: ReadonlyArray<MaskSlot>;
  readonly positionBitmap: number;
  readonly symbolCodeTable: Uint8Array;

  constructor(slots: ReadonlyArray<MaskSlot>) {
    let positionBitmap = 0;
    const symbolCodeTable = new Uint8Array(ASCII_TABLE_SIZE);

    for (const [position, symbol] of slots) {
      positionBitmap |= 1 << position;

      for (let idx = 0; idx < symbol.length; idx += 1) {
        symbolCodeTable[symbol.charCodeAt(idx)] = 1;
      }
    }

    this.slots = slots;
    this.positionBitmap = positionBitmap;
    this.symbolCodeTable = symbolCodeTable;
  }
}
