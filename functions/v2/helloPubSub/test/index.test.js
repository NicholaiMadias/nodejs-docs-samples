// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const assert = require('assert');
const sinon = require('sinon');
const supertest = require('supertest');

const functionsFramework = require('@google-cloud/functions-framework/testing');

beforeEach(() => {
  // require the module that includes the functions we are testing
  require('../index');

  // stub the console so we can use it for side effect assertions
  sinon.stub(console, 'log');
  sinon.stub(console, 'error');
});

afterEach(() => {
  // restore the console stub
  console.log.restore();
  console.error.restore();
});

describe('functions_cloudevent_pubsub', () => {
  it('should process a CloudEvent', async () => {
    const event = {
      data: {
        message: 'd29ybGQ=', // 'World' in base 64
      },
    };

    const server = functionsFramework.getTestServer('helloPubSub');
    await supertest(server)
      .post('/')
      .send(event)
      .set('Content-Type', 'application/json')
      .expect(204);
    assert(console.log.calledWith('Hello, World!'));
  });
});
