
var canH, canW;
var gameState = 0;

var sortingBtn, shopBtn, trackerBtn, quizBtn;
var logoutBtn, backBtn, sdgBtn;
var menuImg, menuBtn;
var bgImg;

var totalWaste = 0;
var avgWaste = 0;
var currentStreak = 0;
var recentEntries = [];
var ecoTipIndex = 0;
var userName=null;

var menuOverlay, tempOverlay;
var analyticsCanvas;
var tipsArea;
var currentChartType = "bar";
var wasteData = {};  // for charting
var tips = [
    "Reduce, Reuse, Recycle! It's the core of sustainability.",
    "Compost your food scraps.",
    "Say no to single-use plastics like straws.",
    "Buy in bulk to reduce packaging waste.",
    "Repair items instead of replacing them.",
    "Donate old clothes and electronics.",
    "Choose products with minimal or recyclable packaging.",
    "Plan your meals to avoid food waste.",
    "Support brands committed to sustainable production.",
    "Refill, not landfill. Carry a reusable bottle.",
    "Skip plastic cutlery. Use your own utensils.",
    "Carry a cloth bag while shopping.",
    "Use rechargeable batteries when possible.",
    "Upcycle old t-shirts into cleaning rags."
];

var entriesPerPage = 5;
var currentEntryPage = 0;
var leftArrow, rightArrow;

function preload() {
  bgImg=loadImage("./assets/images/bg3.gif");
}

function setup() {

        // Firebase user data
  auth.onAuthStateChanged(function(user){
    if(user){
      var uid = user.uid;
      var userRef = database.ref('users/'+uid);

      userRef.once('value').then(snapshot=>{
        var data = snapshot.val() || {};
        userName = data.name || "Friend";

        var currentCount = data.loginCount || 0;
        loginCount = currentCount + 1;

        // update login count in DB
        userRef.update({ 
          loginCount: loginCount 
        });
      });

      database.ref('users/'+uid+'/wasteLog').on('value', function(snapshot){
        var logs = snapshot.val() || {};
        updateStatsFromLogs(logs);
      });
    }
    else{
      window.location.replace("index.html");
    }
  });
  
  var isMobile= /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    canW= displayWidth;
    canH= displayHeight;
    createCanvas(displayWidth+100, displayHeight+200);
  }
  else{
    canW= windowWidth;
    canH= windowHeight;
    createCanvas(windowWidth, windowHeight-5);
  }

    // Inputs & buttons
  wasteInput = createInput("");
  wasteInput.attribute("placeholder", "Weight (kg)");
  wasteInput.position(canW*0.1, canH*0.62);
  wasteInput.size(canW/7,40);

  wasteTypeDropdown = createSelect();
  wasteTypeDropdown.position(canW*0.1, canH * 0.73);
  wasteTypeDropdown.size(canW/7, 40);
  wasteTypeDropdown.option('Select Waste Type');
  wasteTypeDropdown.option('Plastic');
  wasteTypeDropdown.option('Paper');
  wasteTypeDropdown.option('Food Waste');
  wasteTypeDropdown.option('Other');

  logButton = createButton("+ Log Waste");
  logButton.class("special-btn");
  logButton.position(canW*0.28, canH*0.63);
  logButton.mousePressed(logWaste);

  leftArrow = createButton("←");
  leftArrow.class("arrow-btn");
  leftArrow.position(canW/2+200, canH * 0.6);
  leftArrow.mousePressed(() => {
    if (currentEntryPage > 0) {
      currentEntryPage--;
      updateArrowStates();
    }
  });

  rightArrow = createButton("→");
  rightArrow.class("arrow-btn");
  rightArrow.position(canW/2+250, canH * 0.6);
  rightArrow.mousePressed(() => {
    let totalPages = Math.ceil(recentEntries.length / entriesPerPage);
    if (currentEntryPage < totalPages - 1) {
      currentEntryPage++;
      updateArrowStates();
    }
  });


  tempOverlay = createDiv();
  tempOverlay.position(0, 0);
  tempOverlay.size(canW, canH);
  tempOverlay.style("background-color", "rgba(255, 255, 255, 1)");
  tempOverlay.hide();

  menuOverlay = createDiv();
  menuOverlay.position(0, 0);
  menuOverlay.size(canW, canH);
  menuOverlay.style("background-color", "rgba(198, 204, 188, 0.81)");
  menuOverlay.hide();
  menuOverlay.id("menuOverlay");

  let buttons = [
    { label: "View Analytics", action: () => openAnalytics() },
    { label: "Eco Tips & Alternatives", action: () => openTips() },
  ];

  buttons.forEach((btnData, i) => {
    let btn = createButton(btnData.label);
    btn.class("btn");
    btn.position(canW/4, canH * 0.4 + i * 100);
    btn.size(canW/2)
    btn.mousePressed(() => {
      closeMenu();
      btnData.action();
    });
  menuOverlay.child(btn);
  });

  // Analytics Canvas (hidden by default)
  analyticsCanvas = createDiv().id("analyticsArea").style("display", "none");
  analyticsCanvas.position(0, 0);
  analyticsCanvas.size(canW, canH);
  analyticsCanvas.class("analytics")

  let chartCanvas = createElement('canvas');
  chartCanvas.class("chart")
  chartCanvas.id('wasteChart');
  analyticsCanvas.child(chartCanvas);

  let toggleChartBtn = createButton("Toggle Chart");
  toggleChartBtn.class("toggleBtn")
  toggleChartBtn.position(canW - 220, canH - 60);
  toggleChartBtn.mousePressed(toggleChartType);
  analyticsCanvas.child(toggleChartBtn);

  // Tips Area Setup
  tipsArea = createDiv();
  tipsArea.id("tipsArea");
  tipsArea.style("display", "none");
  tipsArea.position(0, 0);
  tipsArea.size(canW, canH);
  tipsArea.class("tips")

  let tipTitle = createElement('h2', "Tips for Sustainable Living");
  tipTitle.class("tips-title")
  tipsArea.child(tipTitle);

  tipBox = createDiv(tips[ecoTipIndex])
  tipBox.id("tipText");
  tipBox.class("tips-box");

  tipBox.mousePressed(() => {
    ecoTipIndex = (ecoTipIndex + 1) % tips.length;
    tipBox.html(tips[ecoTipIndex]);
  });

  tipsArea.child(tipBox);

  createLogout();
  createBack();
  createSDG12();
  createMenuBtn();
}

function draw() {
      //background("#ddf5e7ff");
      
    background(bgImg);
    fill("#ffffffbe");
    rect(0,0,canW,canH)
    fill("#2d3b29");
    textFont('Montserrat')
    textAlign(CENTER);
    textSize(canW*0.05);
    if (userName && loginCount) {
      if (loginCount === 1) {
        text("Welcome " + userName + " !", canW/2, canW*0.06);
      } else {
        text("Welcome back " + userName + "!", canW/2, canW*0.06);
      }
    } else {
      text("Loading your profile...", canW/2, canW*0.06);
    }

      textSize(canW*0.02);
      textFont('Montserrat')
      if (userName && loginCount) {
      text("Join the movement towards Sustainable Consumption", canW/2, canW*0.1);
      }
      else {
        text("Welcome to ZeroTrack", canW/2, canW*0.1);
      }

    drawCard(canW*0.1, canW*0.13, canW*0.3, 100, "Total Waste Tracked", nf(totalWaste,1,2)+" kg");
    drawCard(canW*0.45, canW*0.13, canW*0.2, 100, "Average Waste Production", nf(avgWaste,1,2)+" kg");
    drawCard(canW*0.7, canW*0.13, canW*0.2, 100, "Current Streak", currentStreak+" days");

    // Log card title
    textAlign(LEFT);
    textSize(25);
    text("Log Today's Waste", canW*0.1, canH*0.6);

    // Recent Entries Title
    textSize(25);
    text("Recent Entries", canW/2, canH * 0.62);

    // Table Headers
    textSize(18);
    text("No.", canW/2, canH * 0.67);
    text("Date", canW /2+100, canH * 0.67);
    text("Amount (kg)", canW/2+300, canH * 0.67);
    text("Type", canW/2+500, canH * 0.67);

    let startIdx = currentEntryPage * entriesPerPage;
    let endIdx = min(startIdx + entriesPerPage, recentEntries.length);
    let yStart = canH * 0.72;

    for (let i = startIdx; i < endIdx; i++) {
      let entry = recentEntries[i];
      let y = yStart + (i - startIdx) * 30;

      let srNo = recentEntries.length - i;
      text(srNo, canW/2, y);

      text(entry.date, canW/2+100, y);
      text(nf(entry.amount, 1, 2), canW/2+300, y);
      text(entry.type, canW/2+500, y);
    }

  drawSprites();
}

//FUNCTIONS

function createLogout(){
  logoutBtn = createButton("LOGOUT");
  logoutBtn.position(20, 20);
  logoutBtn.class("logbtn");
  logoutBtn.mousePressed(()=>{
    window.location.replace("logout.html");
  });
}

function createBack(){
  backBtn = createButton("BACK");
  backBtn.position(70, 70);
  backBtn.class("backbtn");
  backBtn.mousePressed(()=>{
    backBtn.hide();
    hideMenu();
  });
  backBtn.hide();
}

function createSDG12(){
  sdgBtn = createImg("https://www.un.org/sites/un2.un.org/files/field/image/e_gif_12.gif", "SDG 12");
  sdgBtn.position(canW - 210, 10);
  sdgBtn.size(100, 100);
  sdgBtn.style("cursor", "pointer");
  sdgBtn.mousePressed(()=>{
    window.open("https://sdgs.un.org/goals/goal12", "_blank");
  });
}

function createMenuBtn(){
  menuBtn = createImg("https://cdn-icons-png.flaticon.com/512/2801/2801909.png", "menu icon");
  menuBtn.position(canW*0.95,20);
  menuBtn.size(50, 50);
  menuBtn.style("cursor", "pointer");
  menuBtn.mousePressed(()=>{
    showMenu();
    backBtn.show();
  });
  
}

function drawCard(x,y,w,h,title,value){
  fill("#f6fff9");
  stroke("#d5e8d4");
  strokeWeight(2);
  rect(x,y,w,h,20);
  fill("#2d3b29");
  noStroke();
  textSize(18);
  textAlign(CENTER);
  text(title, x+w/2, y+30);
  textSize(24);
  text(value, x+w/2, y+70);
}

function logWaste(){
  var val = parseFloat(wasteInput.value());
  if(isNaN(val) || val<=0){
    swal("Please enter a valid weight in kg.");
    return;
  }
  if (wasteTypeDropdown.value() === 'Select Waste Type') {
      swal("Please select the type of waste.");
      return;
  }
  var user = auth.currentUser;
  if(user){
    var uid = user.uid;
    var newLogRef = database.ref('users/'+uid+'/wasteLog').push();
    var today = new Date().toISOString().split('T')[0];
    newLogRef.set({
    date: today,
    amount: val,
    type: wasteTypeDropdown.value(),    
    timestamp: Date.now()          
  }).then(()=>{    
      swal("Logged Successfully!", "Come back tomorrow to log more", "success");
      wasteInput.value('');
    });
  }
}

function updateStatsFromLogs(logs){
  var total = 0;
  var count = 0;
  var dates = {};
  var today = new Date().toISOString().split('T')[0];
  for(var key in logs){
    var entry = logs[key];
    total += entry.amount;
    dates[entry.date] = true;
    count+=1
  }
  totalWaste = total;
  if (count!=0) {
      avgWaste = total/count;
  }
  else{
    avgWaste=0;
  }

  // streak calculation
  console.log(count)
  currentStreak = 0;
  var d = new Date(today);
  while(dates[d.toISOString().split('T')[0]]){
    currentStreak++;
    d.setDate(d.getDate()-1);
  }
  // recent entries
  recentEntries = Object.entries(logs)
  .sort((a, b) => b[1].timestamp - a[1].timestamp)  // newest first
  .map(entry => entry[1]);

  currentEntryPage = 0;
}

function openAnalytics(){
  analyticsCanvas.style("display", "block");
  generateChart();
  wasteInput.hide();
  logButton.hide();
  wasteTypeDropdown.hide();
}

function openTips(){
  tipsArea.style("display", "block");
  wasteInput.hide();
  logButton.hide();
  wasteTypeDropdown.hide();
}

function toggleChartType(){
  currentChartType = (currentChartType === "bar") ? "doughnut" : "bar";
  generateChart();
}

function generateChart(){
  if (window.myChart) {
    window.myChart.destroy();
  }

  // Collect data
  let byDate = {};
  let byType = {};
  for (let entry of recentEntries) {
    if (!byDate[entry.date]) byDate[entry.date] = 0;
    byDate[entry.date] += entry.amount;

    if (entry.type) {
      if (!byType[entry.type]) byType[entry.type] = 0;
      byType[entry.type] += entry.amount;
    }
  }

  let ctx = document.getElementById('wasteChart').getContext('2d');

  if (currentChartType === "bar") {
    window.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(byDate),
        datasets: [{
          label: 'Weight (kg)',
          data: Object.values(byDate),
          backgroundColor: '#8bc34a'
        }]
      }
    });
  } else {
    window.myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(byType),
        datasets: [{
          label: 'Weight (kg)',
          data: Object.values(byType),
          backgroundColor: ['#ffcc80', '#aed581', '#81d4fa', '#b39ddb']
        }]
      }
    });
  }
}

function updateArrowStates() {
  let totalPages = Math.ceil(recentEntries.length / entriesPerPage);
  if (currentEntryPage <= 0) {
    leftArrow.attribute("disabled", true);
  } else {
    leftArrow.removeAttribute("disabled");
  }

  if (currentEntryPage >= totalPages - 1) {
    rightArrow.attribute("disabled", true);
  } else {
    rightArrow.removeAttribute("disabled");
  }
}

function showMenu(){
  menuOverlay.show();
  tempOverlay.hide();
  logoutBtn.hide();
  sdgBtn.hide();
  menuBtn.hide();
}

function hideMenu(){
  wasteInput.show();
  logButton.show();
  menuOverlay.hide();
  wasteTypeDropdown.show();
  logoutBtn.show();
  sdgBtn.show();
  menuBtn.show();
  analyticsCanvas.style("display", "none");
  tipsArea.style("display", "none");
  tempOverlay.hide();
}

function closeMenu(){
  menuOverlay.hide();
  tempOverlay.show();
}