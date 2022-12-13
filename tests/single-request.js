import http from 'k6/http';
import {sleep, check} from 'k6';
import {counter} from 'k6';

export const req = new Counter('http_reqs')