//const memory = require('../../src/model/data/memory/index');

const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
} = require('../../src/model/data/memory');

const fragment = { ownerId: '123', id: '321', data: {} };
describe('memory', () => {
  test('readFragment() returns the created fragment', async () => {
    await writeFragment(fragment);
    const result = await readFragment(fragment.ownerId, fragment.id);
    expect(result).toEqual(fragment);
  });

  test('writeFragment() returns nothing', async () => {
    const result = await writeFragment(fragment);
    expect(result).toEqual(undefined);
  });

  test('readFragmentData() returns raw data from fragments', async () => {
    const data = Buffer.from([1, 2, 3]);
    await writeFragmentData(fragment.ownerId, fragment.id, data);
    const result = await readFragmentData(fragment.ownerId, fragment.id);
    expect(result).toEqual(data);
  });

  test('writeFragmentData() returns nothing', async () => {
    const data = Buffer.from([1, 2, 3]);
    const result = await writeFragmentData(fragment.ownerId, fragment.id, data);
    expect(result).toEqual(undefined);
  });
});
