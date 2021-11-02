
const colors = [
  '#D32F2F', '#00796B', '#C2185B', '#388E3C', '#7B1FA2', '#689F38', '#512DA8', '#AFB42B',
  '#303F9F', '#FBC02D', '#1976D2', '#FFA000', '#0288D1', '#F57C00', '#0097A7', '#E64A19'
];

function showDiagramTime(idxset, ep = '') {
  if (document.getElementById(`enistats${ep}-container`) === null) {
    const nH3 = document.createElement('h3');
    nH3.innerHTML = `Team Progression Episode ${ep}`;
    document.getElementById('team-progr-episodes').appendChild(nH3);
    const nCont = document.createElement('div');
    const nsCont = document.createElement('div');
    nsCont.setAttribute('id', `enistats${ep}-container`);
    nCont.appendChild(nsCont);
    document.getElementById('team-progr-episodes').appendChild(nCont);
  }
  const { tasks, teams, teamMap, episodes } = stats;
  const h3s = document.getElementById('team-progr-episodes').getElementsByTagName('h3');
  for (let i = 0; i < h3s.length; i++) {
    h3s[i].innerHTML = `Team Progression Episode ${i + 1}: ${episodes[i].name}`;
  }
  document.getElementById(`enistats${ep}-container`).innerHTML = `<canvas id="enistats${ep}" width="1200" height="600"></canvas>`;
  const ctx = document.getElementById('enistats' + ep).getContext('2d');
  let labs = [];
  let dsets = [];
  for (let i = 0; i < idxset.length; i++) {
    let i2 = idxset[i];
    let cset = [];
    const p = teams[i2].progression;
    const jmin = ep == '' ? 0 : episodes[parseInt(ep) - 1].startIdx;
    const jmax = ep == '' ? p.length : episodes[parseInt(ep) - 1].endIdx;
    for (let j = jmin; j < jmax && j < p.length; j++) {
      if (j == jmin) {
        labs.push(p[j].timeStart);
        cset.push({ x: new Date(p[j].timeStart), y: 0 });
      }
      labs.push(p[j].timeEnd);
      cset.push({ x: new Date(p[j].timeEnd), y: p[j].totalNo - jmin });
    }
    dsets.push({
      label: teams[i2].name,
      data: cset,
      borderColor: colors[i % colors.length],
      fill: false,
      borderWidth: i == 0 ? 4 : 2
    })
  }
  labs.sort((a, b) => a - b);
  for (let j = labs.length - 1; j > 0; j--) {
    if (labs[j] == labs[j - 1])
      labs.splice(j, 1);
  }
  labs = labs.map(el => new Date(el));
  const data = {
    labels: labs,
    datasets: dsets,
  };
  const chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          type: 'time'
        }],
        gridLines: {
          color: '#f4f5f5'
        }
      },
      elements: {
          line: {
              tension: 0
          },
          point:{
              radius: 0
          }
      }
    }
  });
}

function showDiagramAvgTime(idxset) {
  document.getElementById('enistatsavg-container').innerHTML = '<canvas id="enistatsavg" width="1200" height="600"></canvas>';
  const ctx = document.getElementById('enistatsavg').getContext('2d');
  const { tasks, teams, teamMap } = stats;
  const team = teams[idxset[0]];
  const team1 = teams[idxset[1]];
  const ridName = name => {
    if (name.length <= 15)
      return name;
    else
      return name.substring(0, 15) + '...';
  }
  let labs = tasks.map(t => `${t.totalNo}: ${ridName(t.title)}`);
  let dsets = [];
  dsets.push({
    label: team.name,
    data: team.progression.map(p => (p.timeEnd - p.timeStart) / 1000 / 60),
    backgroundColor: colors[0]
  });
  dsets.push({
    label: team1.name,
    data: team1.progression.map(p => (p.timeEnd - p.timeStart) / 1000 / 60),
    backgroundColor: colors[1]
  });
  dsets.push({
    label: 'Average',
    data: tasks.map(t => t.avgTime / 60),
    backgroundColor: colors[13]
  });
  dsets.push({
    label: 'Best 20 Average',
    data: tasks.map(t => t.avgTimeBest / 60),
    backgroundColor: colors[3]
  });
  const data = {
    labels: labs,
    datasets: dsets,
  };
  const chart = new Chart(ctx, {
    type: 'horizontalBar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
          line: {
              tension: 0
          },
          point:{
              radius: 0
          }
      }
    }
  });
}

function showDiagramRank(idxset) {
  document.getElementById('enistatsrk-container').innerHTML = '<canvas id="enistatsrk" width="1200" height="600"></canvas>';
  const ctx = document.getElementById('enistatsrk').getContext('2d');
  const { tasks, teams, teamMap } = stats;
  const team = teams[idxset[0]];
  const team1 = teams[idxset[1]];
  const team2 = teams[idxset[2]];
  const team3 = teams[idxset[3]];
  const ridName = name => {
    if (name.length <= 15)
      return name;
    else
      return name.substring(0, 15) + '...';
  }
  let labs = tasks.map(t => `${t.totalNo}: ${ridName(t.title)}`);
  let dsets = [];
  dsets.push({
    label: team.name,
    data: team.progression.map(p => p.rank),
    borderColor: colors[0],
    fill:false
  });
  dsets.push({
    label: team1.name,
    data: team1.progression.map(p => p.rank),
    borderColor: colors[1],
    fill:false
  });
  dsets.push({
    label: team2.name,
    data: team2.progression.map(p => p.rank),
    borderColor: colors[2],
    fill:false
  });
  dsets.push({
    label: team3.name,
    data: team3.progression.map(p => p.rank),
    borderColor: colors[3],
    fill:false
  });
  const data = {
    labels: labs,
    datasets: dsets,
  };
  const chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
          line: {
              tension: 0
          }
      }
    }
  });
}

function showStats(idxset) {
  const { tasks, teams, teamMap, episodes } = stats;
  const team = teams[idxset[0]];
  const sumdiv = document.getElementById('summary');
  let text = '';
  text += `<h3>Printing summary for team &quot;${team.name}&quot;</h3>`;
  text += `<i>&quot;${team.name}&quot; finished on rank ${team.rank}</i><br>`;
  // text += 'Riddle rankings:<ol>';
  // for (let i = 0; i < team.progression.length; i++) {
  //   text += `<li>${tasks[i].title} &mdash; rank ${team.progression[i].rank}</li>`;
  // }
  // text += '</ol>';
  text += 'Other teams depicted:';
  for (let i = 1; i < idxset.length; i++) {
    if (i > 1) text += ',';
    text += ` rank <b>${idxset[i] + 1}</b>: &quot;${teams[idxset[i]].name}&quot;`;
  }
  sumdiv.innerHTML = text;
  showDiagramTime(idxset);
  for (let i = 0; i < episodes.length; i++) {
    showDiagramTime(idxset, `${i + 1}`);
  }
  showDiagramAvgTime(idxset);
  showDiagramRank(idxset);
}

function main() {
  const { tasks, teams, teamMap, episodes } = stats;
  Chart.defaults.global.defaultFontFamily = 'Jura';
  Chart.defaults.global.defaultFontColor = '#f4f5f5';
  Chart.defaults.global.defaultColor = '#f4f5f5';
  const addArr = [];
  for (const prop in teamMap) {
    if (teamMap.hasOwnProperty(prop))
      addArr.push([teamMap[prop], prop]);
  }
  addArr.sort((a, b) => a[0] - b[0]);
  for (const [tN, val] of addArr) {
    const option = document.createElement('option');
    option.value = tN;
    option.innerText = val;
    document.getElementById('primary-select').appendChild(option);
  }
  document.getElementById('primary-select').value = 0;
  document.getElementById('primary-select').addEventListener('input', showStatsBasedOnInputs);
  for (const [tN, val] of addArr) {
    const option = document.createElement('option');
    option.value = tN;
    option.innerText = val;
    document.getElementById('secondary-select').appendChild(option);
  }
  document.getElementById('secondary-select').value = 1;
  document.getElementById('secondary-select').addEventListener('input', showStatsBasedOnInputs);
  for (const num of [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]) {
    const option = document.createElement('option');
    option.value = num;
    option.innerText = num;
    document.getElementById('num-select').appendChild(option);
  }
  document.getElementById('num-select').value = 14;
  document.getElementById('num-select').addEventListener('input', showStatsBasedOnInputs);
  showStatsBasedOnInputs();
}

function showStatsBasedOnInputs() {
  const pr = parseInt(document.getElementById('primary-select').value);
  let se = parseInt(document.getElementById('secondary-select').value);
  if (se == pr) se = (pr != 0) ? 0 : 1;
  const num = parseInt(document.getElementById('num-select').value) + 2;
  const idx = [];
  idx.push(pr, se);
  let cpos = -1;
  while (idx.length < num) {
    ++cpos;
    if (cpos == pr || cpos == se) continue;
    idx.push(cpos);
  }
  showStats(idx);
}

window.addEventListener("beforeprint", () => {
  for (let id in Chart.instances) {
      Chart.instances[id].resize();
  }
});

if (window.matchMedia) {
  let mediaQueryList = window.matchMedia('print')
  mediaQueryList.addListener((mql) => {
    if (mql.matches) {
      for (let id in Chart.instances) {
          Chart.instances[id].resize();
      }
    }
  })
}
