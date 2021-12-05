import http from "k6/http";
import { check } from "k6";
const tokens = open('token.json'); // Cannot import this in the cypress way
export let options = {
  insecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
	  {duration: "10s", target: 10},
	  {duration: "12h", target: 250},
	  {duration: "10s", target: 10},

  ],
  thresholds: {
    http_req_duration: ["p(90) < 4000", "p(95) < 6000", "p(99.9) < 8000"],
    http_req_failed: ["rate<0.01"],
  },
};
export default function() {
    let token = JSON.parse(tokens)
    let res = http.get(
      "https://cypress-api.vivifyscrum-stage.com/api/v2/my-organizations"
    , {
        headers : {
            Authorization : `${token.admin}`
        }
    });
    check(res, {
        "status is 200": (r) => r.status === 200
    })
}

// k6 run getOrganisation.js