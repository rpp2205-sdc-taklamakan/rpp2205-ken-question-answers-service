import http from 'k6/http';
import {sleep, check} from 'k6';
import {counter} from 'k6';

export let options = {
  vus: 1000, 
  duration: "30s"
}

export default function() {
  const BASE_URL = "http://localhost/3001";

  const response = http.batch([
    ['GET', `${BASE_URL}/qa/questions/71698`],
    ['GET', `${BASE_URL}/qa/questions/252168/answers`]
  ])

  check(response[0], {
    'GET /qa/questions/:product_id' : (r) => r.status === 200
    'GET /qa/questions/:question_id/answers' (r) = r.status === 200
  })

  sleep(1)
}