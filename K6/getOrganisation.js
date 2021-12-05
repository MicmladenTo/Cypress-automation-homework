import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";
const token = new SharedArray('accounts', function() {
    const data = JSON.parse(open('token.json'));
    return data;
})

//const tokens = open('token.json'); // Cannot import this in the cypress way, k6 does not read JSON files

export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  vus: 10,
  duration: "10s",
  thresholds: {
    http_req_duration: ["p(90) < 5000", "p(95) < 6000", "p(99.9) < 8000"],
    http_req_failed: ["rate < 0.01"],
  },
};
export default function() {
    // let token = JSON.parse(tokens)
    let url = "https://cypress-api.vivifyscrum-stage.com/api/v2/my-organizations";
    const values = Object.values(token[0]);
    let randomToken = values[Math.floor(Math.random() * values.length)];
    const params = {
        headers: {
            Authorization: `Bearer ${randomToken}`
        }
    }
    console.log(randomToken);
    const res = http.get(url, params);
}

// k6 run getOrganisation.js