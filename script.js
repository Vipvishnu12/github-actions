// script.js

const REQUEST_STORAGE_KEY = "serviceRequests";

function getSavedRequests(){
  try{
    return JSON.parse(localStorage.getItem(REQUEST_STORAGE_KEY)) || [];
  }catch(error){
    return [];
  }
}

function saveRequests(requests){
  localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(requests));
}

function getPriorityRank(priority){
  if(priority === "High"){
    return 3;
  }

  if(priority === "Medium"){
    return 2;
  }

  if(priority === "Low" || priority === "Easy"){
    return 1;
  }

  return 0;
}

function renderRequests(){
  let requestGrid =
  document.querySelector("#requestPage .request-grid");

  if(!requestGrid){
    return;
  }

  let savedRequests = getSavedRequests();

  savedRequests.sort((left, right)=>{
    let priorityDifference = getPriorityRank(right.priority) - getPriorityRank(left.priority);

    if(priorityDifference !== 0){
      return priorityDifference;
    }

    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });

  let savedCards = savedRequests.map(request=>{
    return `
      <div class="request-card">
        <div class="card-top">
          <h3>${request.deviceName}</h3>
          <span class="priority">${request.priority}</span>
        </div>
        <p class="problem">${request.problem}</p>
        <div class="card-details">
          <p><i class="fa-solid fa-location-dot"></i>${request.serviceType}</p>
          <p><i class="fa-regular fa-calendar"></i>${request.date}</p>
          <p><i class="fa-solid fa-screwdriver-wrench"></i>${request.address}</p>
        </div>
        <div class="status-row">
          <span class="submitted">Submitted</span>
          <span class="payment">Not Paid</span>
        </div>
      </div>
    `;
  }).join("");

  requestGrid.innerHTML = `
    <div class="request-card">
      <div class="card-top">
        <h3>Mobile</h3>
        <span class="priority">High</span>
      </div>
      <p class="problem">Lap display issue</p>
      <div class="card-details">
        <p><i class="fa-solid fa-location-dot"></i>Home Service</p>
        <p><i class="fa-regular fa-calendar"></i>21/04/2026</p>
        <p><i class="fa-solid fa-screwdriver-wrench"></i>Scheduled: 24/04/2026</p>
      </div>
      <div class="status-row">
        <span class="submitted">Submitted</span>
        <span class="payment">Not Paid</span>
      </div>
    </div>
    ${savedCards}
  `;
}

function submitRequest(){
  let deviceName = document.getElementById("deviceName").value.trim();
  let serviceType = document.getElementById("serviceType").value;
  let priorityType = document.getElementById("priorityType").value;
  let addressInput = document.getElementById("addressInput").value.trim();
  let problemInput = document.getElementById("problemInput").value.trim();

  if(
    deviceName === "" ||
    serviceType === "Select Service" ||
    priorityType === "Priority" ||
    addressInput === "" ||
    problemInput === ""
  ){
    alert("Please fill all fields");
    return;
  }

  let savedRequests = getSavedRequests();

  savedRequests.unshift({
    deviceName: deviceName,
    serviceType: serviceType,
    priority: priorityType,
    address: addressInput,
    problem: problemInput,
    date: new Date().toLocaleDateString()
  });

  saveRequests(savedRequests);
  renderRequests();

  document.getElementById("deviceName").value = "";
  document.getElementById("serviceType").value = "Select Service";
  document.getElementById("priorityType").value = "Priority";
  document.getElementById("addressInput").value = "";
  document.getElementById("problemInput").value = "";

  showPage("requestPage", "My Requests", document.querySelector(".nav-item.active-nav") || document.querySelector(".nav-item"));
}

function initApp(){
  let username = localStorage.getItem("username");
  let mobile = localStorage.getItem("mobile");

  if(username && mobile){
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("website").classList.remove("hidden");
    loadProfile();
    renderRequests();
  }else{
    renderRequests();
  }
}

initApp();

function login(){

  let username =
  document.getElementById("username").value;

  let mobile =
  document.getElementById("mobile").value;

  if(username === "" || mobile === ""){

    alert("Please fill all fields");

    return;
  }

  // store data

  localStorage.setItem("username", username);
  localStorage.setItem("mobile", mobile);

  // hide login

  document.getElementById("loginPage")
  .classList.add("hidden");

  // show website

  document.getElementById("website")
  .classList.remove("hidden");

  // load profile

  loadProfile();
  renderRequests();
}

// PAGE CHANGE

function showPage(pageId, title, element){

  let pages =
  document.querySelectorAll(".page");

  pages.forEach(page=>{
    page.classList.remove("active");
  });

  document.getElementById(pageId)
  .classList.add("active");

  // title

  document.getElementById("pageTitle")
  .innerText = title;

  // active nav

  let navItems =
  document.querySelectorAll(".nav-item");

  navItems.forEach(item=>{
    item.classList.remove("active-nav");
  });

  element.classList.add("active-nav");
}

// LOAD PROFILE

function loadProfile(){

  let username =
  localStorage.getItem("username");

  let mobile =
  localStorage.getItem("mobile");

  document.getElementById("profileName")
  .innerText = username;

  document.getElementById("userNameText")
  .innerText = username;

  document.getElementById("mobileText")
  .innerText = mobile;
}

// LOGOUT

function logout(){

  localStorage.clear();

  location.reload();
}