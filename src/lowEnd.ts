const nav = navigator as Navigator & { deviceMemory?: number };

export const LOW_END = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;

export const LOW_SPEC = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
