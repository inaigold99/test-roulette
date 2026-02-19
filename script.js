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

// 사다리 그리기
function drawLadder(count, crossings, starts, ends) {
  const container = document.getElementById('ladderContainer');
  container.innerHTML = '';
  
  const startX = 60;      // 왼쪽 시작 여백
  const gap = 80;        // 줄 사이 간격 (7명 입력 시에도 넉넉함)
  const ladderTop = 60;   // 사다리 세로선이 시작되는 y좌표
  const ladderHeight = 300; // 사다리 세로선의 순수 길이

  // 1. 컨테이너 너비를 인원수에 맞게 동적으로 확장 (스크롤 방지)
  const totalWidth = startX * 2 + (count - 1) * gap;
  container.style.width = totalWidth + "px";
  container.style.height = (ladderTop + ladderHeight + 80) + "px"; // 세로 높이도 자동 확보

  for (let i = 0; i < count; i++) {
    const currentX = startX + i * gap;
    
    // 2. 시작 이름 (상단)
    // transform: translateX(-50%)와 조합되어 선 중앙에 위치함
    container.innerHTML += `<div class='ladder-start' style="left:${currentX}px; top:20px;">${starts[i]}</div>`;
    
    // 3. 세로줄 
    // 선의 두께(4px) 절반인 2px를 빼서 정확히 중앙에 배치
    container.innerHTML += `<div class='ladder-line ladder-vertical' style="left:${currentX - 2}px; top:${ladderTop}px; height:${ladderHeight}px;"></div>`;
    
    // 4. 끝지점 상품 (하단)
    // 세로줄이 끝나는 지점(ladderTop + ladderHeight)에서 20px 여유를 둠
    container.innerHTML += `<div class='ladder-end' style="left:${currentX}px; top:${ladderTop + ladderHeight + 20}px;">${ends[i]}</div>`;
  }

  // 5. 가로줄 (다리)
  crossings.forEach((c) => {
    const bridgeX = startX + c.x * gap;
    // 세로선 사이를 정확히 잇도록 너비를 gap으로 설정
    // c.y 값이 너무 크면 세로선 범위를 벗어나므로 보정 (c.y를 0~ladderHeight 사이로 가정)
    const bridgeY = ladderTop + (c.y % ladderHeight); 
    container.innerHTML += `<div class='ladder-line ladder-horizontal' style="left:${bridgeX}px; top:${bridgeY}px; width:${gap}px;"></div>`;
  });
}

// 사다리 이동 결과 계산
function runLadder(count, crossings){
  let result = [];
  for(let start=0; start<count; start++){
    let x = start;
    for(let i=0, y=36;i<crossings.length;i++,y+=22){
      // 해당 y에서 가로줄이 있으면 x 이동
      const found = crossings.filter(c=>c.y===y && (c.x===x || c.x===x-1));
      if(found.length){
        if(found[0].x===x) x++;
        else if(found[0].x===x-1) x--;
      }
    }
    result.push(x);
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