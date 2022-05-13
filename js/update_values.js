const core = require('@actions/core');
const github = require('@actions/github');
var fs = require('fs');

async function run() {
  try {
    for (let k in F) {
      await gV(k);
    }
    V['now'] = NOW();

    fs.writeFile("jsons/values.json", JSON.stringify(V), function(e) {
      if (e) {
          console.log(e);
      }
    });
  }
  catch (e) {
    core.setFailed(e.message);
  }
}

run();
