import fs from 'fs';
import path from 'path';
import EasyGraphQLTester from 'easygraphql-tester';

const schemaCode = fs.readFileSync(
  path.join(__dirname, '../../../server', 'schema.graphql'),
  'utf8'
);

const mutation = `
        mutation editBenchmarkTestMutation(
          $input: UpdateBenchmarkByRowIdInput!
        ) {
          updateBenchmarkByRowId(input: $input) {
            benchmark {
              rowId
            }
          }
        }
      `;

/** *  MUTATIONS * **/
describe('editBenchmark', () => {
  let tester;
  beforeEach(() => {
    tester = new EasyGraphQLTester(schemaCode);
  });
  it('Should throw an error if input is missing', () => {
    let error;
    try {
      tester.mock(mutation);
    } catch (error_) {
      error = error_;
    }

    expect(error.message).toEqual(
      'Variable "$input" of required type "UpdateBenchmarkByRowIdInput!" was not provided.'
    );
  });
  it('Should throw an error if a variable is missing', () => {
    let error;
    try {
      tester.mock(mutation, {
        input: {
          rowId: 1
        }
      });
    } catch (error_) {
      error = error_;
    }

    expect(error.message).toEqual(
      'Variable "$input" got invalid value { rowId: 1 }; Field benchmarkPatch of required type BenchmarkPatch! was not provided.'
    );
  });
  it('Should return rowId(number) if valid', () => {
    const test = tester.mock(mutation, {
      input: {
        rowId: 1,
        benchmarkPatch: {
          deletedAt: '2017-01-01',
          deletedBy: 'Dylan'
        }
      }
    });

    expect(test).toBeDefined();
    expect(typeof test.data.updateBenchmarkByRowId.benchmark.rowId).toBe(
      'number'
    );
  });
});
