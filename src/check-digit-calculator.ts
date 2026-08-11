export class Modulo11CheckDigitCalculator {
  readonly firstWeights: readonly number[];
  readonly secondWeights: readonly number[];
  readonly extraDigitWeight: number;

  constructor(baseLength: number) {
    const firstStartWeight = Modulo11CheckDigitCalculator.startWeightFor(baseLength);
    const secondStartWeight = Modulo11CheckDigitCalculator.startWeightFor(baseLength + 1);

    this.firstWeights = Array.from({ length: baseLength }, (_, idx) => Modulo11CheckDigitCalculator.weightAt(firstStartWeight, idx));
    this.secondWeights = Array.from({ length: baseLength }, (_, idx) => Modulo11CheckDigitCalculator.weightAt(secondStartWeight, idx));
    this.extraDigitWeight = Modulo11CheckDigitCalculator.weightAt(secondStartWeight, baseLength);
  }

  checkDigitFor(sum: number): number {
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  private static startWeightFor(effectiveLength: number): number {
    return effectiveLength < 11 ? effectiveLength + 1 : effectiveLength - 7;
  }

  private static weightAt(startWeight: number, idx: number): number {
    return startWeight - idx >= 2 ? startWeight - idx : startWeight + 8 - idx;
  }
}
