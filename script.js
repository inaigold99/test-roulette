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
  
  const startX = 60;      // 왼쪽 시작 여백
  const gap = 80;         // 줄 사이 간격
  const ladderTop = 60;   // 세로선 시작 Y좌표
  const ladderHeight = 350; // 세로선 길이 (가로줄들이 이 안에 그려짐)

  // 컨테이너 크기 동적 조절 (7명 입력 시에도 여유로움)
  container.style.width = (startX * 2 + (count - 1) * gap) + "px";
  container.style.height = (ladderTop + ladderHeight + 80) + "px";

  for (let i = 0; i < count; i++) {
    const currentX = startX + i * gap;
    
    // 1. 이름 (상단) - 선 중앙 정렬
    container.innerHTML += `<div class='ladder-start' style="left:${currentX}px; top:20px;">${starts[i]}</div>`;
    
    // 2. 세로줄 - 두께 보정(-2px)
    container.innerHTML += `<div class='ladder-line ladder-vertical' style="left:${currentX - 2}px; top:${ladderTop}px; height:${ladderHeight}px;"></div>`;
    
    // 3. 상품 (하단) - 세로줄 바로 아래 배치
    container.innerHTML += `<div class='ladder-end' style="left:${currentX}px; top:${ladderTop + ladderHeight + 15}px;">${ends[i]}</div>`;
  }

  // 4. 가로줄 (다리) - 생성된 y값이 세로줄 범위 내에 오도록 보정
  crossings.forEach((c) => {
    const bridgeX = startX + c.x * gap;
    // genCrossings의 y값이 ladderHeight를 넘지 않도록 위치 계산
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
function showResults(starts, ends, mapping){
  let html = '';
  for(let i=0;i<starts.length;i++){
    html += `<div class='result-item'>🧑 ${starts[i]} → 🎁 ${ends[mapping[i]]}</div>`;
  }
  document.getElementById('results').innerHTML = html;
}