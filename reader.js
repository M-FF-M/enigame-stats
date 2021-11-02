const fs = require('fs');

function getIndentString(num) {
  let res = '';
  for (let i = 0; i < num; i++) {
    res += ' ';
  }
  return res;
}

function getProps(obj, indent = 0) {
  if (obj instanceof Array) {
    let res = [];
    // console.log(getIndentString(indent) + '[array] length: ' + obj.length);
    let ma = (10 < obj.length) ? 10 : obj.length;
    for (let i = 0; i < ma; i++)
      res.push(getProps(obj[i], indent));
    return res;
  } else if (typeof obj === 'object') {
    let res = {};
    for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        // console.log(getIndentString(indent) + prop);
        res[prop] = getProps(obj[prop], indent + 2);
      }
    }
    return res;
  } else {
    // console.log(getIndentString(indent) + '-> value: ' + JSON.stringify(obj));
    return obj;
  }
}

// TODO: STATS FILE NAMES HERE
const STATS_FILE_NAME_IN = 'stats_2021_spaced_out_pretty.json';
const STATS_FILE_NAME_OUT = 'stats_simplified_spacedout2021';

let json_text = fs.readFileSync(STATS_FILE_NAME_IN, 'utf8');
console.log(json_text.length);
let json_obj = JSON.parse(json_text);
json_obj = json_obj.data.event;

let eps = json_obj.episodes;
let taskArray = [];
let episodes = [];
for (let i = 0; i < eps.length; i++) {
  console.log(`Episode ${(i + 1)}: ${eps[i].name}`);
  let tasks = eps[i].episodeTasks;
  episodes.push({
    name: eps[i].name,
    startIdx: taskArray.length
  });

  if (typeof tasks[0].task === 'object' && tasks[0].task !== null && typeof tasks[0].task.name === 'string') {
    for (let j = 0; j < tasks.length; j++) {
      console.log(`  ${(j + 1)}: ${tasks[j].task.name}`);
      let progr = tasks[j].progressions;
      let cnt = 0; let avgcnt = 0;
      let cnt20 = 0; let avgcnt20 = 0;
      for (let k = 0; k < progr.length; k++) {
        if ((typeof progr[k].started === 'string') && (typeof progr[k].solved === 'string')
            && (progr[k].started.length == 20) && (progr[k].solved.length == 20)) {
          avgcnt += Math.floor(((new Date(progr[k].solved)).getTime() - (new Date(progr[k].started)).getTime()) / 1000);
          cnt++;
          if (cnt20 < 20) {
            avgcnt20 += Math.floor(((new Date(progr[k].solved)).getTime() - (new Date(progr[k].started)).getTime()) / 1000);
            cnt20++;
          }
        }
      }
      avgcnt /= cnt;
      avgcnt20 /= cnt20;
      taskArray.push({
        title: tasks[j].task.name,
        avgTime: Math.floor(avgcnt),
        avgTimeBest: Math.floor(avgcnt20),
        episode: i + 1,
        taskNo: j + 1,
        totalNo: taskArray.length + 1,
      });
      avgcnt /= 60;
      avgcnt20 /= 60;
      console.log(`    ${Math.floor(avgcnt * 1000) / 1000} min`);
      console.log(`    only best 20 teams: ${Math.floor(avgcnt20 * 1000) / 1000} min`);
    }
    episodes[episodes.length - 1].endIdx = taskArray.length;
  } else {
    console.log('unknown stats format');
    process.exit(0);
  }
}

let teamMap = {};
let tms = json_obj.ranking;
let teamArray = [];
console.log(`Length of ranking array: ${tms.length}`);
for (let i = 0; i < tms.length; i++) {
  teamMap[tms[i].name] = i;
  // console.log(tms[i].name);
  let prog = tms[i].progressions;
  let progArray = [];
  for (let j = prog.length - 1, j2 = 1; j >= 0; j--, j2++) {
    progArray.push({
      timeStart: (new Date(prog[j].started)).getTime(),
      timeEnd: (new Date(prog[j].solved)).getTime(),
      totalNo: j2,
      rank: prog[j].rank,
    })
  }
  teamArray.push({
    rank: i + 1,
    name: tms[i].name,
    progression: progArray,
  });
}

let res_obj = { tasks: taskArray, teams: teamArray, teamMap, episodes };
let res = JSON.stringify(res_obj);
console.log(res.length);
fs.writeFileSync(`${STATS_FILE_NAME_OUT}.json`, res, 'utf8');
let resb = `const stats = JSON.parse(${JSON.stringify(res)});`;
fs.writeFileSync(`${STATS_FILE_NAME_OUT}.js`, resb, 'utf8');
