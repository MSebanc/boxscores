function getGameData(gamePk) {
  return fetch(`https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live`);
}

function getSchedule(date) {
  return fetch(`https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=${date}`);
}

function getlinescore(gamePk) {
  return fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/linescore`);
}

function getPitcherBoxScore(team, data) {
  let tableCode = "<table class='boxscore'><thead><tr><th class='name noLeftBorder' style='text-align: left'>" + data["teams"][team]["team"]["name"] + " Pitchers</th> ";
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
  let tableCode = "<table class='boxscore'><thead><tr><th class='name noLeftBorder' style='text-align: left'>" + data["teams"][team]["team"]["name"] + " Batters</th> ";
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

function getGameLinescore(data, homeTeam, awayTeam, gameState) {
  let num_innings = Math.max(data["innings"].length, data["scheduledInnings"])
  let linescoreCode = "<table class='linescore'><thead><tr><th class='noLeftBorder'></th>";
  for (let i = 0; i < num_innings; i++) {
    linescoreCode += "<th>" + (i + 1).toString() + "</th>"
  }
  linescoreCode += "<th class='strongLeftBorder'>R</th><th>H</th><th>E</th></tr></thead><tbody>";
  linescoreCode += "<tr><td class='noLeftBorder' style='text-align: left'>" + awayTeam + "</td>";
  for (let i = 0; i < num_innings; i++) {
    let makeGray = "";
    if (gameState !== "F" && data["currentInning"] === i + 1 && data["isTopInning"]) {
      makeGray = " class='gray'";
    }
    if (i < data["innings"].length && "runs" in data["innings"][i]["away"]) {
      linescoreCode += "<td"+ makeGray +">" + data["innings"][i]["away"]["runs"] + "</td>";
    } else if (gameState === "F") {
      linescoreCode += "<td> X </td>";
    } else {
      linescoreCode += "<td"+ makeGray +"> &nbsp </td>";
    }
  }
  if ("runs" in data["teams"]["away"] && "hits" in data["teams"]["away"] && "errors" in data["teams"]["away"]) {
    linescoreCode += "<td class='strongLeftBorder'>" + data["teams"]["away"]["runs"] + "</td>";
    linescoreCode += "<td>" + data["teams"]["away"]["hits"] + "</td>";
    linescoreCode += "<td>" + data["teams"]["away"]["errors"] + "</td></tr>";
  } else {
    linescoreCode += "<td class='strongLeftBorder'> &nbsp </td>";
    linescoreCode += "<td> &nbsp </td>";
    linescoreCode += "<td> &nbsp </td></tr>";
  }
  linescoreCode += "<tr><td class='noLeftBorder noBottomBorder' style='text-align: left'>" + homeTeam + "</td>";
  for (let i = 0; i < num_innings; i++) {
    let makeGray = "";
    if (gameState !== "F" && data["currentInning"] === i + 1 && !data["isTopInning"]) {
      makeGray = " gray";
    }
    if (i < data["innings"].length && "runs" in data["innings"][i]["home"]) {
      linescoreCode += "<td class='noBottomBorder"+ makeGray +"'>" + data["innings"][i]["home"]["runs"] + "</td>";
    } else if (gameState === "F") {
      linescoreCode += "<td class='noBottomBorder'> X </td>";
    } else {
        linescoreCode += "<td class='noBottomBorder"+ makeGray +"'> &nbsp </td>";
    }
  }
  if ("runs" in data["teams"]["home"] && "hits" in data["teams"]["home"] && "errors" in data["teams"]["home"]) {
    linescoreCode += "<td class='noBottomBorder strongLeftBorder'>" + data["teams"]["home"]["runs"] + "</td>";
    linescoreCode += "<td class='noBottomBorder'>" + data["teams"]["home"]["hits"] + "</td>";
    linescoreCode += "<td class='noBottomBorder'>" + data["teams"]["home"]["errors"] + "</td></tr></tbody></table><br>";
  } else {
    linescoreCode += "<td class='noBottomBorder strongLeftBorder'> &nbsp </td>";
    linescoreCode += "<td class='noBottomBorder'> &nbsp </td>";
    linescoreCode += "<td class='noBottomBorder'> &nbsp </td></tr></tbody></table><br>";
  }

  return linescoreCode;
}

function generateBoxScore(data) {
  let boxscoreCode = "<div id='" + data["gameData"]["game"]["pk"] + "'>";
  boxscoreCode += getGameTitle(data["liveData"]["boxscore"]);
  boxscoreCode += getGameLinescore(
      data["liveData"]["linescore"],
      data["gameData"]["teams"]["home"]["name"],
      data["gameData"]["teams"]["away"]["name"],
      data["gameData"]["status"]["abstractGameCode"]);
  boxscoreCode += getBatterBoxScore("away", data["liveData"]["boxscore"]);
  boxscoreCode += getBattingNotes("away", data["liveData"]["boxscore"]);
  boxscoreCode += getTeamBatFieldInfo("away", data["liveData"]["boxscore"]);
  boxscoreCode += getBatterBoxScore("home", data["liveData"]["boxscore"]);
  boxscoreCode += getBattingNotes("home", data["liveData"]["boxscore"]);
  boxscoreCode += getTeamBatFieldInfo("home", data["liveData"]["boxscore"]);
  boxscoreCode += getPitcherBoxScore("away", data["liveData"]["boxscore"]);
  boxscoreCode += "<br>"
  boxscoreCode += getPitcherBoxScore("home", data["liveData"]["boxscore"]);
  boxscoreCode += getGeneralGameStats(data["liveData"]["boxscore"]);
  boxscoreCode += "<br></div>";
  return boxscoreCode;
}

async function generateTeamScore(game, linescore) {
  return new Promise((resolve) => {
    let teamBoxCode = "";
    let promisesAPI = [];
    let promisesJSON = [];
    console.log(game);
    let inningsMessage = game["status"]["detailedState"];
    if (game["status"]["abstractGameCode"] === "L") {
      if (linescore["inningState"] === "Middle") {
        inningsMessage = "Mid " + linescore["currentInning"];
      } else if (linescore["isTopInning"]) {
        inningsMessage = "Top " + linescore["currentInning"];
      } else {
        inningsMessage = "Bot " + linescore["currentInning"];
      }
    }
    if (inningsMessage === "Completed Early") {
      inningsMessage = "Final/" + linescore["currentInning"];
    }
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
        if ((game["status"]["abstractGameCode"] === "F" || game["status"]["abstractGameCode"] === "L")
            && game["status"]["detailedState"] !== "Postponed") {
          teamBoxCode += game["teams"]["away"]["score"];
        }
        teamBoxCode += "</td><td>" + inningsMessage + "</td></tr>";
        teamBoxCode += "<tr><td>" + homeTeam["teams"][0]["abbreviation"] + "</td><td>";
        if ((game["status"]["abstractGameCode"] !== "F" && game["status"]["abstractGameCode"] !== "L")
            || game["status"]["detailedState"] === "Postponed") {
          teamBoxCode += "</td>"
        } else {
          teamBoxCode += game["teams"]["home"]["score"];
        }
        teamBoxCode += "</td><td></td></tr></tbody></table></div></a>"
        resolve(teamBoxCode);
      });
    })
  });
}

async function generateDayScores(games) {
  const goodTeams = ["Boston Red Sox", "Chicago Cubs", "Kansas City Royals", "Seattle Mariners"];
  let node = document.getElementById('scoreboard');
  for (let i = 0; i < games.length; i++) {
    getlinescore(games[i]["gamePk"]).then((res) => {
      return res.json();
    }).then((linescore) => {
      if (goodTeams.includes(games[i]["teams"]["home"]["team"]["name"])) {
          generateTeamScore(games[i], linescore).then((res) => {
            let id = games[i]["teams"]["home"]["team"]["name"].replace(/\s+/g, '') + "Scoreboard";
            let teamNode = document.getElementById(id);
            teamNode.innerHTML += "" + res;
            node = document.getElementById('scoreboard');
          });
      } else if (goodTeams.includes(games[i]["teams"]["away"]["team"]["name"])) {
        generateTeamScore(games[i], linescore).then((res) => {
          let id = games[i]["teams"]["away"]["team"]["name"].replace(/\s+/g, '') + "Scoreboard";
          let teamNode = document.getElementById(id);
          teamNode.innerHTML += "" + res;
        });
      } else {
        generateTeamScore(games[i], linescore).then((res) => {
          node.innerHTML += "<div class='teamScoreboard'>" + res + "</div>";
        });
      }
    });
  }
}

async function generateBoxScoreTeams(games) {
  for (let i = 0; i < games.length; i++) {
    if (games[i]["status"]["detailedState"] === "Postponed") {
      continue;
    }
    const goodTeams = ["Boston Red Sox", "Chicago Cubs", "Kansas City Royals", "Seattle Mariners"];
    getGameData(games[i]["gamePk"]).then((res) => {
      return res.json();
    }).then((data) => {
      const homeTeamName = data["gameData"]["teams"]["home"]["name"];
      const awayTeamName = data["gameData"]["teams"]["away"]["name"];
      if (goodTeams.includes(homeTeamName)) {
        let id = homeTeamName.replace(/\s+/g, '') + "Box";
        let teamNode = document.getElementById(id);
        teamNode.innerHTML += generateBoxScore(data);
      } else if (goodTeams.includes(awayTeamName)) {
        let id = awayTeamName.replace(/\s+/g, '') + "Box";
        let teamNode = document.getElementById(id);
        teamNode.innerHTML += generateBoxScore(data);
      } else {
        let node = document.getElementById("boxscore");
        node.innerHTML += "<div class='teamBoxscore'>" + generateBoxScore(data) + "</div>";
      }
    });
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
    let games = data["dates"][0]["games"];
    generateDayScores(games).then(() => {
      console.log("Loaded");
    });
    generateBoxScoreTeams(games).then(() => {
      console.log("Loaded");
    });
  }
}

function getDateString(date) {
  let month = date.getUTCMonth() + 1;
  if (month < 10) {
    month = "0" + month.toString();
  }
  let day = date.getUTCDate();
  if (day < 10) {
    day = "0" + day.toString();
  }
  return date.getUTCFullYear() + "-" + month + "-" + day;
}

function getDateToday() {
  let date = new Date();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month.toString();
  }
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day.toString();
  }
  return date.getFullYear() + "-" + month + "-" + day;
}

function dateCode(date) {
  let maxDate = getDateToday();
  let curPageDay = new Date(date);
  let prevDay = new Date(curPageDay.getTime() - (24 * 60 * 60 * 1000));
  let nextDay = new Date(curPageDay.getTime() + (24 * 60 * 60 * 1000));
  let node = document.getElementById('date');
  let dateCode = "<form action=javascript:handleDateSelect()>";
  dateCode += `<a href="./?date=${getDateString(prevDay)}" class="previous round">&#8249;</a>`;
  dateCode += "<input type='date' id='dateSelect' name='dateSelect' value='" + date + "' max='" + maxDate + "' />";
  if (date.localeCompare(maxDate) !== 0) {
    dateCode += `<a href="./?date=${getDateString(nextDay)}" class="next round">&#8250;</a>`;
  }
  dateCode += "<button>Submit</button></form>";
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
