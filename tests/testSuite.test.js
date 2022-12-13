const axios = require('axios')
const request = require('supertest');
const express = require('express');
const moxios = require('moxios');
require("dotenv").config();
const app = require('../server/index.js');
const http = require('k6')

describe('respond with 200 for getting questions', (done) => {
  test('It should return 200 for all questions GET request', async () => {
    moxios.stubRequest(`http://localhost:3001/qa/questions`, {
      status: 200
    })
  })
})

describe('All answers', (done) => {
  test('respond with 200 for getting questions', async () => {
    moxios.stubRequest(`http://localhost:3001/qa/questions/1/answers`, {
      status: 200
    })
  })
})

describe('should do a thing', () => {
  it('should actually give me some code coverage', async () => {
    const res = await request(app).http.get('/qa/questions/:product_id')
    expect (response.body).toBe(true)
  })
})