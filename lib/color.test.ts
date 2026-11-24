import { strict as assert } from "node:assert";
import { test } from "node:test";
import { canAdjustChannels, decValue, incValue, type RGB } from "./color";

const allActive = { red: true, green: true, blue: true };
const noneActive = { red: false, green: false, blue: false };

test("adjustment availability follows the lower and upper limits", () => {
  const black: RGB = { red: 0, green: 0, blue: 0 };
  const white: RGB = { red: 255, green: 255, blue: 255 };

  assert.equal(canAdjustChannels(black, allActive, 16, decValue), false);
  assert.equal(canAdjustChannels(black, allActive, 16, incValue), true);
  assert.equal(canAdjustChannels(white, allActive, 16, decValue), true);
  assert.equal(canAdjustChannels(white, allActive, 16, incValue), false);
});

test("only active channels determine whether an adjustment is available", () => {
  const rgb: RGB = { red: 0, green: 255, blue: 128 };
  const redOnly = { red: true, green: false, blue: false };
  const greenOnly = { red: false, green: true, blue: false };

  assert.equal(canAdjustChannels(rgb, redOnly, 16, decValue), false);
  assert.equal(canAdjustChannels(rgb, redOnly, 16, incValue), true);
  assert.equal(canAdjustChannels(rgb, greenOnly, 16, decValue), true);
  assert.equal(canAdjustChannels(rgb, greenOnly, 16, incValue), false);
  assert.equal(canAdjustChannels(rgb, allActive, 16, decValue), true);
  assert.equal(canAdjustChannels(rgb, allActive, 16, incValue), true);
  assert.equal(canAdjustChannels(rgb, noneActive, 16, decValue), false);
  assert.equal(canAdjustChannels(rgb, noneActive, 16, incValue), false);
});

test("increasing reaches 255 when the next step would exceed it", () => {
  assert.equal(incValue(0, 16), 15);
  assert.equal(incValue(250, 16), 255);
  assert.equal(incValue(255, 16), 255);
});

test("a step of one can increase from zero", () => {
  assert.equal(incValue(0, 1), 1);
  assert.equal(
    canAdjustChannels({ red: 0, green: 0, blue: 0 }, allActive, 1, incValue),
    true
  );
});
