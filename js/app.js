function getGameData(gamePk) {
  return fetch(`https://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`);
}

function getPitcherBoxScore(team, data) {
  let tableCode = "<table><thead><tr><th class='name' style='text-align: left'>" + data["teams"][team]["team"]["clubName"] + " Pitchers</th> ";
  tableCode += "<th class='noLeftBorder'>IP</th> <th>H</th> <th>R</th> <th>ER</th> <th>BB</th> <th>K</th> <th>HR</th> <th>ERA</th></tr></thead><tbody>";
  let td = "<td>";
  let tdName = "<td class='name' style='text-align: left'>";
  let tdNoLeft = "<td class='noLeftBorder'>"
  for (let i = 0; i < data["teams"][team]["pitchers"].length; i++) {
    if (i === data["teams"][team]["pitchers"].length - 1) {
      td = "<td class='noBottomBorder'>";
      tdName = "<td class='name noBottomBorder' style='text-align: left'>"
      tdNoLeft = "<td class='noLeftBorder noBottomBorder'>"
    }
    let pitcherID = "ID" + data["teams"][team]["pitchers"][i];
    tableCode += "<tr>" + tdName + data["teams"][team]["players"][pitcherID]["person"]["fullName"];
    if ("note" in data["teams"][team]["players"][pitcherID]["stats"]["pitching"]) {
      tableCode += " " + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["note"];
    }
    tableCode += "</td>"
    tableCode += tdNoLeft + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["inningsPitched"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["hits"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["runs"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["earnedRuns"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["baseOnBalls"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["strikeOuts"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["stats"]["pitching"]["homeRuns"] + "</td>";
    tableCode += td + data["teams"][team]["players"][pitcherID]["seasonStats"]["pitching"]["era"] + "</td>";
    tableCode += "</tr>"
  }

  tableCode += "<tr><td class='name total' style='text-align: left'><b>Totals</b></td>";
  tableCode += "<td class='noLeftBorder total'>" + data["teams"][team]["teamStats"]["pitching"]["inningsPitched"] + "</td>";
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
  let generalCode = "";
  for (let i = 0; i < data.info.length; i++) {
    generalCode += "<br>"
    generalCode += data.info[i].label;
    if ("value" in data.info[i]) {
      generalCode += ": " + data.info[i].value;
    }
  }
  return generalCode;
}

function getTeamBatFieldInfo(team, data) {
  let teamInfoCode = "";
  for (let i = 0; i < data["teams"][team]["info"].length; i++) {
    teamInfoCode += data["teams"][team]["info"][i]["title"] + "<br>";
    let fieldList = data["teams"][team]["info"][i]["fieldList"];
    for (let j = 0; j < fieldList.length; j++) {
      teamInfoCode += fieldList[j]["label"] + ": " + fieldList[j]["value"] + "<br>";
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
  let tableCode = "<table><thead><tr><th class='name' style='text-align: left'>" + data["teams"][team]["team"]["clubName"] + " Batters</th> ";
  tableCode += "<th class='noLeftBorder'>AB</th> <th>R</th> <th>H</th> <th>RBI</th> <th>BB</th> <th>K</th> <th>LOB</th> <th>AVG</th> <th>OPS</th></tr></thead>";
  let batters = [];
  for (let i = 0; i < data["teams"][team]["batters"].length; i++) {
    let batterID = "ID" + data["teams"][team]["batters"][i];
    if ("battingOrder" in data["teams"][team]["players"][batterID]) {
      batters.push({id: batterID, pos: data["teams"][team]["players"][batterID]["battingOrder"]});
    }
  }
  batters.sort((a, b) => parseInt(a.pos) - parseInt(b.pos));
  let td = "<td>";
  let tdName = "<td class='name' style='text-align: left'>";
  let tdNoLeft = "<td class='noLeftBorder'>"
  let i = 0;
  for (let batter of batters) {
    if (i === batters.length - 1) {
      td = "<td class='noBottomBorder'>";
      tdName = "<td class='name noBottomBorder' style='text-align: left'>"
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
    tableCode += "</td>" + tdNoLeft + data["teams"][team]["players"][batter.id]["stats"]["batting"]["atBats"] + "</td>";
    tableCode += "<td>" + data["teams"][team]["players"][batter.id]["stats"]["batting"]["runs"] + "</td>";
    tableCode += "<td>" + data["teams"][team]["players"][batter.id]["stats"]["batting"]["hits"] + "</td>";
    tableCode += "<td>" + data["teams"][team]["players"][batter.id]["stats"]["batting"]["rbi"] + "</td>";
    tableCode += "<td>" + data["teams"][team]["players"][batter.id]["stats"]["batting"]["baseOnBalls"] + "</td>";
    tableCode += "<td>" + data["teams"][team]["players"][batter.id]["stats"]["batting"]["strikeOuts"] + "</td>";
    tableCode += "<td>" + data["teams"][team]["players"][batter.id]["stats"]["batting"]["leftOnBase"] + "</td>";
    tableCode += "<td>" + data["teams"][team]["players"][batter.id]["seasonStats"]["batting"]["avg"] + "</td>";
    tableCode += "<td>" + data["teams"][team]["players"][batter.id]["seasonStats"]["batting"]["ops"] + "</td>";
    tableCode += "</tr>"
    i++;
  }
  tableCode += "<tr><td class='name total' style='text-align: left'><b>Totals</b></td>"
  tableCode += "<td class='total noLeftBorder'>" + data["teams"][team]["teamStats"]["batting"]["atBats"] + "</td>";
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
  let res = await getGameData(gamePk);
  let data = await res.json();
  let node = document.getElementById('boxscore');
  node.innerHTML += getGameTitle(data);
  node.innerHTML += getBatterBoxScore("away", data);
  node.innerHTML += getBattingNotes("away", data);
  node.innerHTML += getTeamBatFieldInfo("away", data);
  node.innerHTML += getPitcherBoxScore("away", data);
  node.innerHTML += "<br>"
  node.innerHTML += getBatterBoxScore("home", data);
  node.innerHTML += getBattingNotes("home", data);
  node.innerHTML += getTeamBatFieldInfo("home", data);
  node.innerHTML += getPitcherBoxScore("home", data);
  node.innerHTML += getGeneralGameStats(data);
  node.innerHTML += "<br><br>";

}

function getSchedule(date) {
  return fetch(`https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=${date}`);
}

async function generateBoxScoreDay(date) {
  let res = await getSchedule(date);
  let data = await res.json();
  let node = document.getElementById('boxscore');
  dateCode(date);
  node.innerHTML += "<h1>" + date + "</h1>"
  if (data["dates"].length === 0) {
    node.innerHTML += "<h2>No Games Today</h2>"
  } else {
    for (let i = 0; i < data["dates"][0]["games"].length; i++) {
      await generateBoxScore(data["dates"][0]["games"][i]["gamePk"]);
    }
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
    if (d.getUTCMonth() === curDate.getMonth() && d.getUTCDay() > curDate.getDay()) return false;
  }
  let dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0,10) === dateString;
}

function main() {
  let urlParams = new URLSearchParams(window.location.search);
  let date = urlParams.get("date");
  if (!date) {
    date = getDateToday();
  }
  if (!isValidDate(date)) {
    window.open("index.html","_self");
  }
  generateBoxScoreDay(date).then(() => {
    console.log("day loaded");
  });
}

// used for testing
function mockMain() {
  generateBoxScoreDay("2023-09-15").then(() => {
    console.log("day loaded");
  });
}

main();
// mockMain();

