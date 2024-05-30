import { expect } from "@std/expect";
import { Cuid } from "../lib/index.ts";

Deno.test("Cuid2", async () => {
  // Test that the default cuid length is correct
  const id = await Cuid.create();
  expect(id).toBeDefined();
  expect(id.length).toBe(Cuid.defaultLength);

  // // Test that custom cuid lengths work
  // const length = 10;
  // const cuid = init({ length });
  // const id2 = await cuid();
  // expect(id2.length).toBe(length);

  // // Test that large cuid lengths work
  // const length2 = 32;
  // const cuid2 = init({ length: length2 });
  // const id3 = await cuid2();
  // expect(id3.length).toBe(length2);
});

// Deno.test("bufToBigInt", () => {
//   const actual = bufToBigInt(new Uint8Array(2));
//   expect(actual).toBe(BigInt(0));

//   const actual2 = bufToBigInt(new Uint8Array([0xff, 0xff, 0xff, 0xff]));
//   expect(actual2).toBe(BigInt("4294967295"));
// });

// Deno.test("createFingerprint", async () => {
//   const fingerprint = await createFingerprint();
//   expect(fingerprint.length).toBeGreaterThanOrEqual(24);
// });

Deno.test("isCuid", async () => {
  const id = await Cuid.create();
  const actual = Cuid.isCuid(id);
  expect(actual).toBe(true);

  const actual2 = Cuid.isCuid(
    await Cuid.create() + await Cuid.create() + await Cuid.create(),
  );
  expect(actual2).toBe(false);

  const actual3 = Cuid.isCuid("");
  expect(actual3).toBe(false);
});
