function getGameData(gamePk) {
  return fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`);
}

function getSchedule(date) {
  return fetch(`https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=${date}`);
}

function getPitcherBoxScore(team, data) {
  let tableCode = "<table class='boxscore'><thead><tr><th class='name' style='text-align: left'>" + data["teams"][team]["team"]["clubName"] + " Pitchers</th> ";
  tableCode += "<th>IP</th> <th>H</th> <th>R</th> <th>ER</th> <th>BB</th> <th>K</th> <th>HR</th> <th>ERA</th></tr></thead><tbody>";
  let td = "<td>";
  let tdName = "<td class='noLeftBorder' style='text-align: left'>";
  let tdNoLeft = "<td class='noLeftBorder'>"
  for (let i = 0; i < data["teams"][team]["pitchers"].length; i++) {
    if (i === data["teams"][team]["pitchers"].length - 1) {
      td = "<td class='noBottomBorder'>";
      tdName = "<td class='noLeftBorder noBottomBorder' style='text-align: left'>"
      tdNoLeft = "<td class='noLeftBorder noBottomBorder'>"
    }
    let pitcherID = "ID" + data["teams"][team]["pitchers"][i];
    tableCode += "<tr>" + tdName + data["teams"][team]["players"][pitcherID]["person"]["fullName"];
    if ("note" in data["teams"][team]["players"][pitcherID]["stats"]["pitching"]) {
      tableCode += " " + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["note"];
    }
    tableCode += "</td>"
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["inningsPitched"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["hits"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["runs"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["earnedRuns"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["baseOnBalls"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["strikeOuts"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["homeRuns"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["seasonStats"]["pitching"]["era"] + "</td>";
    tableCode += "</tr>"
  }

  tableCode += "<tr><td class='noLeftBorder total' style='text-align: left'><b>Totals</b></td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["pitching"]["inningsPitched"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["pitching"]["hits"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["pitching"]["runs"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["pitching"]["earnedRuns"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["pitching"]["baseOnBalls"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["pitching"]["strikeOuts"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["pitching"]["homeRuns"] + "</td><td class='total'></td></tr>";

  tableCode += "</tbody></table>";
  return tableCode;
}

function getGeneralGameStats(data) {
  let generalCode = "<br><div class='title'>OTHER INFO</div>";
  for (let i = 0; i < data.info.length; i++) {
    if ("value" in data.info[i]) {
      generalCode += "<div class='subtitle'>" + data.info[i].label + "</div>: " + data.info[i].value + "<br>";
    } else {
      generalCode += "<div class='subtitle'>Day:</div> " + data.info[i].label;
    }
  }
  return generalCode;
}

function getTeamBatFieldInfo(team, data) {
  let teamInfoCode = "";
  for (let i = 0; i < data["teams"][team]["info"].length; i++) {
    teamInfoCode += "<div class='title'>" + data["teams"][team]["info"][i]["title"] + "</div>";
    let fieldList = data["teams"][team]["info"][i]["fieldList"];
    for (let j = 0; j < fieldList.length; j++) {
      teamInfoCode += "<div class='subtitle'>" + fieldList[j]["label"] + ":</div> " + fieldList[j]["value"] + "<br>";
    }
    teamInfoCode += "<br>";
  }
  return teamInfoCode;
}

function getBattingNotes(team, data) {
  let notesCode = "";
  if ("note" in data["teams"][team]) {
    for (let i = 0; i < data["teams"][team]["note"].length; i++) {
      notesCode += data["teams"][team]["note"][i]["label"] + "-" + data["teams"][team]["note"][i]["value"] + "<br>";
    }
    notesCode += "<br>"
  }
  return notesCode;
}

function getBatterBoxScore(team, data) {
  let tableCode = "<table class='boxscore'><thead><tr><th class='name' style='text-align: left'>" + data["teams"][team]["team"]["clubName"] + " Batters</th> ";
  tableCode += "<th>AB</th> <th>R</th> <th>H</th> <th>RBI</th> <th>BB</th> <th>K</th> <th>LOB</th> <th>AVG</th> <th>OPS</th></tr></thead>";
  let batters = [];
  for (let i = 0; i < data["teams"][team]["batters"].length; i++) {
    let batterID = "ID" + data["teams"][team]["batters"][i];
    if ("battingOrder" in data["teams"][team]["players"][batterID]) {
      batters.push({id: batterID, pos: data["teams"][team]["players"][batterID]["battingOrder"]});
    }
  }
  batters.sort((a, b) => parseInt(a.pos) - parseInt(b.pos));
  let td = "<td>";
  let tdName = "<td class='noLeftBorder' style='text-align: left'>";
  let tdNoLeft = "<td class='noLeftBorder'>"
  let i = 0;
  for (let batter of batters) {
    if (i === batters.length - 1) {
      td = "<td class='noBottomBorder'>";
      tdName = "<td class='noLeftBorder noBottomBorder' style='text-align: left'>"
      tdNoLeft = "<td class='noLeftBorder noBottomBorder'>"
    }
    tableCode += "<tbody><tr>" + tdName;
    if (batter.pos % 100 !== 0) {
      tableCode += "&nbsp&nbsp&nbsp&nbsp";
      if ("note" in data["teams"][team]["players"][batter.id]["stats"]["batting"]) {
        tableCode += data["teams"][team]["players"][batter.id]["stats"]["batting"]["note"];
      }
    }
    tableCode += data["teams"][team]["players"][batter.id]["person"]["fullName"] + "  ";
    for (let i = 0; i < data["teams"][team]["players"][batter.id]["allPositions"].length; i++) {
      if (i > 0) {
        tableCode += "-";
      }
      tableCode += data["teams"][team]["players"][batter.id]["allPositions"][i]["abbreviation"];
    }
    tableCode += "</td>" + td + data["teams"][team]["players"][batter.id]["stats"]["batting"]["atBats"] + "</td>";
    tableCode += td + data["teams"][team]["players"][batter.id]["stats"]["batting"]["runs"] + "</td>";
    tableCode += td + data["teams"][team]["players"][batter.id]["stats"]["batting"]["hits"] + "</td>";
    tableCode += td + data["teams"][team]["players"][batter.id]["stats"]["batting"]["rbi"] + "</td>";
    tableCode += td + data["teams"][team]["players"][batter.id]["stats"]["batting"]["baseOnBalls"] + "</td>";
    tableCode += td + data["teams"][team]["players"][batter.id]["stats"]["batting"]["strikeOuts"] + "</td>";
    tableCode += td + data["teams"][team]["players"][batter.id]["stats"]["batting"]["leftOnBase"] + "</td>";
    tableCode += td + data["teams"][team]["players"][batter.id]["seasonStats"]["batting"]["avg"] + "</td>";
    tableCode += td + data["teams"][team]["players"][batter.id]["seasonStats"]["batting"]["ops"] + "</td>";
    tableCode += "</tr>"
    i++;
  }
  tableCode += "<tr><td class='noLeftBorder total' style='text-align: left'><b>Totals</b></td>"
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["batting"]["atBats"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["batting"]["runs"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["batting"]["hits"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["batting"]["rbi"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["batting"]["baseOnBalls"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["batting"]["strikeOuts"] + "</td>";
  tableCode += "<td class='total'>" + data["teams"][team]["teamStats"]["batting"]["leftOnBase"] + "</td>";
  tableCode += "<td class='total'></td><td class='total'></td></tr></tbody></table>"

  return tableCode;
}

function getGameTitle(data) {
  let titleCode = "<h2>" + data["teams"]["away"]["team"]["name"] + " (" + data["teams"]["away"]["teamStats"]["batting"]["runs"];
  titleCode += ") @ " + data["teams"]["home"]["team"]["name"] + " (" + data["teams"]["home"]["teamStats"]["batting"]["runs"] + ")</h2>";
  return titleCode;
}

async function generateBoxScore(gamePk) {
  return new Promise((resolve) => {
    getGameData(gamePk).then((res) => {
      res.json().then((data) => {
        let boxscoreCode = "<div id='" + gamePk + "'>";
        boxscoreCode += getGameTitle(data);
        boxscoreCode += getBatterBoxScore("away", data);
        boxscoreCode += getBattingNotes("away", data);
        boxscoreCode += getTeamBatFieldInfo("away", data);
        boxscoreCode += getBatterBoxScore("home", data);
        boxscoreCode += getBattingNotes("home", data);
        boxscoreCode += getTeamBatFieldInfo("home", data);
        boxscoreCode += getPitcherBoxScore("away", data);
        boxscoreCode += "<br>"
        boxscoreCode += getPitcherBoxScore("home", data);
        boxscoreCode += getGeneralGameStats(data);
        boxscoreCode += "<br></div>";
        resolve(boxscoreCode);
      });

    });
  });
}

function sortGames(games) {
  return games.sort((g1, g2) => {
    let g1Home = g1["teams"]["home"]["team"]["name"];
    let g1Away = g1["teams"]["away"]["team"]["name"];
    let g2Home = g2["teams"]["home"]["team"]["name"];
    let g2Away = g2["teams"]["away"]["team"]["name"]
    const goodTeams = ["Boston Red Sox", "Chicago Cubs", "Kansas City Royals", "Seattle Mariners"]
    if ((goodTeams.includes(g1Home) || goodTeams.includes(g1Away))
        && (goodTeams.includes(g2Home) || goodTeams.includes(g2Away))) {
      for (let team of goodTeams) {
        if (team === g1Home || team ===  g1Away) return -1;
        if (team === g2Home || team ===  g2Away) return 1;
      }
    }
    if (goodTeams.includes(g1Home) || goodTeams.includes(g1Away)) return -1;
    if (goodTeams.includes(g2Home) || goodTeams.includes(g2Away)) return 1;
    return 0;
  });
}

async function generateTeamScore(game) {
  return new Promise((resolve) => {
    let teamBoxCode = "";
    let promisesAPI = [];
    let promisesJSON = [];
    let awayTeamName = game["teams"]["away"]["team"]["name"];
    promisesAPI.push(fetch("https://statsapi.mlb.com" + game["teams"]["away"]["team"]["link"]));
    promisesAPI.push(fetch("https://statsapi.mlb.com" + game["teams"]["home"]["team"]["link"]));

    Promise.all(promisesAPI).then((results) => {
      for (let res of results) {
        promisesJSON.push(res.json());
      }

      Promise.all(promisesJSON).then((teams) => {
        let awayTeam;
        let homeTeam;
        if (teams[0]["teams"][0]["name"] === awayTeamName) {
          awayTeam = teams[0];
          homeTeam = teams[1];
        } else {
          awayTeam = teams[1];
          homeTeam = teams[0];
        }
        teamBoxCode+= "<a class='scoreboardLink' href='#" + game["gamePk"] + "'>"
            + "<div class='score'><table><tbody>";
        teamBoxCode += "<tr><td>" + awayTeam["teams"][0]["abbreviation"] + "</td><td>";
        if (game["status"]["detailedState"] !== "Postponed") {
          teamBoxCode += game["teams"]["away"]["score"];
        }
        teamBoxCode += "</td><td>" + game["status"]["detailedState"] + "</td></tr>";
        teamBoxCode += "<tr><td>" + homeTeam["teams"][0]["abbreviation"] + "</td><td>";
        if (game["status"]["detailedState"] === "Postponed") {
          teamBoxCode += "</td>"
        } else {
          teamBoxCode += game["teams"]["home"]["score"];
        }
        teamBoxCode += "</td><td></td></tr></tbody></table></div></a>"
        resolve(teamBoxCode)
      });
    })
  });
}

async function generateDayScores(games) {
  const goodTeams = ["Boston Red Sox", "Chicago Cubs", "Kansas City Royals", "Seattle Mariners"];
  let node = document.getElementById('scoreboard');
  for (let i = 0; i < games.length; i++) {
    if (goodTeams.includes(games[i]["teams"]["home"]["team"]["name"])) {
      let id = games[i]["teams"]["home"]["team"]["name"].replace(/\s+/g, '') + "Scoreboard";
      let teamNode = document.getElementById(id)
      generateTeamScore(games[i]).then((res) => {
        teamNode.innerHTML = res;
      });
    } else if (goodTeams.includes(games[i]["teams"]["away"]["team"]["name"])) {
      let id = games[i]["teams"]["away"]["team"]["name"].replace(/\s+/g, '') + "Scoreboard";
      let teamNode = document.getElementById(id)
      generateTeamScore(games[i]).then((res) => {
        teamNode.innerHTML = res;
      });
    } else {
      generateTeamScore(games[i]).then((res) => {
        node.innerHTML += "<div class='teamScoreboard'>" + res + "</div>";
      });
    }
  }
}

async function generateBoxScoreTeams(games) {
  for (let i = 0; i < games.length; i++) {
    if (games[i]["status"]["detailedState"] === "Postponed") {
      continue;
    }
    const goodTeams = ["Boston Red Sox", "Chicago Cubs", "Kansas City Royals", "Seattle Mariners"];
    let node = document.getElementById("boxscore");
    if (goodTeams.includes(games[i]["teams"]["home"]["team"]["name"])) {
      let id = games[i]["teams"]["home"]["team"]["name"].replace(/\s+/g, '') + "Box";
      let teamNode = document.getElementById(id);
      generateBoxScore(games[i]["gamePk"]).then((res) => {
        teamNode.innerHTML = res;
      });
    } else if (goodTeams.includes(games[i]["teams"]["away"]["team"]["name"])) {
      let id = games[i]["teams"]["away"]["team"]["name"].replace(/\s+/g, '') + "Box";
      let teamNode = document.getElementById(id);
      generateBoxScore(games[i]["gamePk"]).then((res) => {
        teamNode.innerHTML = res;
      });
    } else {
      generateBoxScore(games[i]["gamePk"]).then((res) => {
        node.innerHTML += "<div class='teamBoxscore'>" + res + "</div>";
      });

    }
  }
}

async function generateBoxScoreDay(date) {
  let res = await getSchedule(date);
  let data = await res.json();
  let title = document.getElementById('dayTitle');
  let node = document.getElementById('dayTitle');
  dateCode(date);
  let d = new Date(date);
  let dateArray = date.split("-");
  d.setUTCFullYear(dateArray[0]);
  d.setUTCMonth((dateArray[1] - 1));
  d.setUTCDate(dateArray[2]);
  let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: "UTC"
  };
  title.innerHTML += "<h1>" + d.toLocaleDateString("default", options) + "</h1>"
  if (data["dates"].length === 0) {
    node.innerHTML += "<h2>No Games Today</h2>"
  } else {
    let games = sortGames(data["dates"][0]["games"]);
    generateDayScores(games).then(() => {
      console.log("Loaded")
    });
    generateBoxScoreTeams(games).then(() => {
      console.log("Loaded")
    });
  }
}

function getDateToday() {
  let curDate = new Date();
  let month = curDate.getMonth() + 1;
  if (month < 10) {
    month = "0" + month.toString();
  }
  let day = curDate.getDate();
  if (day < 10) {
    day = "0" + day.toString();
  }
  return curDate.getFullYear() + "-" + month + "-" + day;
}

function dateCode(date) {
  let maxDate = getDateToday();
  let node = document.getElementById('date');
  let dateCode = "<form action=javascript:handleDateSelect()>";
  dateCode += "<input type='date' id='dateSelect' name='dateSelect' value='" + date + "' max='" + maxDate + "' />"
  dateCode += "<button>Submit</button></form>"
  node.innerHTML = dateCode;
  node = document.getElementById('title');
  node.innerHTML = "Box Scores " + date;
}

// https://stackoverflow.com/questions/18758772/how-do-i-validate-a-date-in-this-format-yyyy-mm-dd-using-jquery
function isValidDate(dateString) {
  let regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  // Invalid format
  let d = new Date(dateString);
  let curDate = new Date();
  if (d.getUTCFullYear() > curDate.getFullYear()) return false;
  if (d.getFullYear() === curDate.getFullYear()) {
    if (d.getUTCMonth() > curDate.getMonth()) return false;
    if (d.getUTCMonth() === curDate.getMonth() && d.getUTCDate() > curDate.getDate()) return false;
  }
  let dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  if (isNaN(d.getTime())) return false;
  return d.toISOString().slice(0,10) === dateString;
}

function main() {
  let urlParams = new URLSearchParams(window.location.search);
  let date = urlParams.get("date");
  if (!date) {
    date = getDateToday();
  }
  if (!isValidDate(date)) {
    window.open("./","_self");
  }
  generateBoxScoreDay(date).then(() => {
    console.log("Loaded");
  });
}

// used for testing
function mockMain() {
  generateBoxScoreDay("2023-09-15").then(() => {
    console.log("Loaded");
  });
}

main();
// mockMain();
