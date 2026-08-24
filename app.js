// app.js
// इसमें केवल फंक्शनलिटी और लॉजिक है।

let userSelectedCodes = [];

window.onload = function() {
  const allCodes = new Set();
  datesheetData.forEach(entry => entry.codes.forEach(c => allCodes.add(c)));
  
  const datalist = document.getElementById('courseList');
  Array.from(allCodes).sort().forEach(code => {
    const option = document.createElement('option');
    option.value = code;
    datalist.appendChild(option);
  });
  
  document.getElementById("courseInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addCourseCode();
    }
  });
};

function addCourseCode() {
  const inputEl = document.getElementById("courseInput");
  const code = inputEl.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  
  if (!code) return; 

  if (!userSelectedCodes.includes(code)) {
    userSelectedCodes.push(code);
    renderChips();
  } else {
    alert("यह कोड पहले से ही ऐड है!");
  }
  
  inputEl.value = ""; 
  inputEl.focus();    
}

function removeCode(codeToRemove) {
  userSelectedCodes = userSelectedCodes.filter(c => c !== codeToRemove);
  renderChips();
}

function renderChips() {
  const container = document.getElementById("chipsContainer");
  if (userSelectedCodes.length === 0) {
    container.innerHTML = '<span style="color:#94a3b8; font-size: 0.8rem; line-height: 28px;">No codes added yet. Add codes above.</span>';
    return;
  }
  
  container.innerHTML = userSelectedCodes.map(code => 
    `<div class="chip">
       ${code} 
       <span class="chip-close" onclick="removeCode('${code}')">×</span>
     </div>`
  ).join('');
}

function generateDatesheet() {
  if (userSelectedCodes.length === 0) {
    alert("कृपया पहले कम से कम एक Course Code 'Add' करें।");
    return;
  }

  const resultsWrap = document.getElementById("resultsWrap");
  const tbody = document.getElementById("tableBody");
  const matchCount = document.getElementById("matchCount");

  tbody.innerHTML = "";
  let matches = [];
  let sNo = 1;

  datesheetData.forEach(entry => {
    entry.codes.forEach(code => {
      if (userSelectedCodes.includes(code.toUpperCase())) {
        matches.push({
          sNo: sNo++,
          dateDay: `${entry.date} (${entry.day})`,
          code: code,
          shift: entry.shift,
          timing: entry.timing
        });
      }
    });
  });

  resultsWrap.style.display = "block";

  if (matches.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px; color: #ef4444; font-weight:700;">दर्ज किए गए कोड्स की परीक्षा तारीख नहीं मिली।</td></tr>`;
    matchCount.innerText = "0 Found";
    matchCount.style.background = "#ef4444";
    return;
  }

  matchCount.innerText = `${matches.length} Exams`;
  matchCount.style.background = "#22c55e";

  matches.forEach(item => {
    const row = document.createElement("tr");
    const shiftBadgeClass = item.shift === "Morning" ? "shift-morning" : "shift-evening";
    row.innerHTML = `
      <td style="color:#64748b; font-weight:700;">#${item.sNo}</td>
      <td><strong>${item.dateDay}</strong></td>
      <td><span class="code-chip">${item.code}</span></td>
      <td><span class="shift-tag ${shiftBadgeClass}">${item.shift}</span></td>
      <td><span class="timing-text">${item.timing}</span></td>
    `;
    tbody.appendChild(row);
  });

  resultsWrap.scrollIntoView({ behavior: 'smooth' });
}

function clearAll() {
  userSelectedCodes = [];
  renderChips();
  document.getElementById("courseInput").value = "";
  document.getElementById("resultsWrap").style.display = "none";
}
