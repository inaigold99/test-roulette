function confirmPlayerCount() {
  // 읽어오기 및 값 제한
  const count = Math.min(7, Math.max(1, parseInt(document.getElementById('playerCount').value)));
  // 참가자 및 상품 입력창 생성
  let html = '<h3>시작지점 이름 입력</h3>';
  for(let i=1; i<=count; i++){
    html += `<input type="text" id="start${i}" placeholder="이름${i}" style="width:80px;margin:2px;">`;
  }
  html += '<h3 style="margin-top:10px;">끝지점 상품 입력</h3>';
  for(let i=1; i<=count;i++){
    html += `<input type="text" id="end${i}" placeholder="상품${i}" style="width:80px;margin:2px;">`;
  }
  // Start 버튼 추가
  html += `<div><button onclick="startLadderGame(${count})">Start</button></div>`;
  document.getElementById('setupArea').innerHTML = html;
  document.getElementById('setupArea').style.display = 'block';
  document.getElementById('ladderContainer').innerHTML = '';
  document.getElementById('results').innerHTML = '';
}

function startLadderGame(count) {
  let starts = [], ends = [];
  for(let i=1;i<=count;i++){
    let sn = document.getElementById('start'+i).value.trim() || `이름${i}`;
    let en = document.getElementById('end'+i).value.trim() || `상품${i}`;
    starts.push(sn);
    ends.push(en);
  }
  // 랜덤 가로줄 생성
  let crossings = genCrossings(count, 12);
  drawLadder(count, crossings, starts, ends);
  let mapping = runLadder(count, crossings);
  showResults(starts, ends, mapping);
}

// 사다리 랜덤 가로선 생성
function genCrossings(count, numLines){
  let cross = [];
  for(let l=0; l<numLines; l++){
    let x = Math.floor(Math.random()*(count-1));  // 줄 중 하나 선택
    let y = 36 + l*22; // y좌표 간격 조정
    cross.push({x:x, y:y});
  }
  return cross;
}

// 사다리 그리기 - 좌표 계산 완전 수정
function drawLadder(count, crossings, starts, ends) {
  const container = document.getElementById('ladderContainer');
  container.innerHTML = '';
  
  const startX = 60;        // 첫 번째 줄의 왼쪽 여백
  const gap = 80;          // 줄 사이의 간격
  const ladderTop = 60;     // 세로선이 시작되는 y좌표
  const ladderHeight = 350; // 세로선의 총 길이

  // 1. 컨테이너 크기 설정 (스크롤 없이 한눈에 보기 위해)
  const totalWidth = startX * 2 + (count - 1) * gap;
  container.style.width = totalWidth + "px";
  container.style.height = (ladderTop + ladderHeight + 60) + "px";

  for (let i = 0; i < count; i++) {
    const currentX = startX + i * gap;
    
    // 2. 시작 이름 (상단)
    container.innerHTML += `<div class='ladder-start' style="left:${currentX}px; top:20px;">${starts[i]}</div>`;
    
    // 3. 세로줄 (중앙 정렬을 위해 두께의 절반인 2px 차감)
    container.innerHTML += `<div class='ladder-line ladder-vertical' style="left:${currentX - 2}px; top:${ladderTop}px; height:${ladderHeight}px;"></div>`;
    
    // 4. 상품 (하단 - 사다리 끝점에서 20px 아래)
    container.innerHTML += `<div class='ladder-end' style="left:${currentX}px; top:${ladderTop + ladderHeight + 20}px;">${ends[i]}</div>`;
  }

  // 5. 가로줄 (다리) - 세로줄 사이를 정확히 연결
  crossings.forEach((c) => {
    const bridgeX = startX + c.x * gap;
    // 가로줄이 세로선 범위 내에 골고루 배치되도록 y좌표 보정
    const bridgeY = ladderTop + (c.y % (ladderHeight - 40)) + 20; 
    container.innerHTML += `<div class='ladder-line ladder-horizontal' style="left:${bridgeX}px; top:${bridgeY}px; width:${gap}px;"></div>`;
  });
}

// 사다리 결과 계산 로직 보정 (가로줄 좌표 일치)
function runLadder(count, crossings){
  let result = [];
  // 각 출발점에서 끝까지 탐색
  for(let start=0; start<count; start++){
    let currentPos = start;
    // 가로줄을 y좌표 순으로 정렬하여 차례대로 타야 함
    let sortedCross = [...crossings].sort((a,b) => a.y - b.y);
    
    sortedCross.forEach(c => {
      if(c.x === currentPos) {
        currentPos++; // 오른쪽 이동
      } else if(c.x === currentPos - 1) {
        currentPos--; // 왼쪽 이동
      }
    });
    result.push(currentPos);
  }
  return result;
}

// 결과 표시
function showResults(starts, ends, mapping) {
  let html = '<h3 style="margin-bottom: 15px;">🏁 당첨 결과</h3>';
  for (let i = 0; i < starts.length; i++) {
    html += `
      <div class='result-item'>
        <strong>${starts[i]}</strong>님은 <br>
        <span style="color: #44b;">👉 ${ends[mapping[i]]}</span> 당첨!
      </div>`;
  }
  document.getElementById('results').innerHTML = html;
}