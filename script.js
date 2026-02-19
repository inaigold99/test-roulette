// 참가자 입력 생성
function setupFields() {
  const count = Math.min(7, Math.max(1, parseInt(document.getElementById('playerCount').value)));
  document.getElementById('ladderForm').style.display = 'block';

  let startNames = '';
  let endNames = '';
  for(let i=1; i<=count; i++){
    startNames += `<input type="text" id="start${i}" placeholder="이름${i}" style="width:80px;margin:2px;">`;
    endNames   += `<input type="text" id="end${i}" placeholder="상품${i}" style="width:80px;margin:2px;">`;
  }
  document.getElementById('startNames').innerHTML = startNames;
  document.getElementById('endNames').innerHTML = endNames;
}

// 사다리 게임 시작
function startLadderGame() {
  const count = Math.min(7, Math.max(1, parseInt(document.getElementById('playerCount').value)));
  let starts = [], ends = [];
  for(let i=1;i<=count;i++){
    let sn = document.getElementById('start'+i).value.trim() || `이름${i}`;
    let en = document.getElementById('end'+i).value.trim() || `상품${i}`;
    starts.push(sn);
    ends.push(en);
  }
  // 사다리를 랜덤 생성
  let crossings = genCrossings(count, 12);
  drawLadder(count, crossings, starts, ends);
  let mapping = runLadder(count, crossings);
  showResults(starts, ends, mapping);
}

// 사다리 랜덤 가로선 생성
function genCrossings(count, numLines){
  let cross = [];
  for(let l=0; l<numLines; l++){
    let x = Math.floor(Math.random()*(count-1));  // 어느 줄에 놓을건지
    let y = 36 + l*22; // y좌표(높이) 간격 조정
    cross.push({x:x, y:y});
  }
  return cross;
}

// 사다리 그리기
function drawLadder(count, crossings, starts, ends){
  const container = document.getElementById('ladderContainer');
  container.innerHTML = '';
  const width = 60, gap = 55;
  // 시작/끝 이름
  for(let i=0; i<count; i++){
    container.innerHTML += `<div class='ladder-start' style="left:${width + i*gap}px;">${starts[i]}</div>`;
    container.innerHTML += `<div class='ladder-end' style="left:${width + i*gap}px;">${ends[i]}</div>`;
    // 세로 줄
    container.innerHTML += `<div class='ladder-line ladder-vertical' style="left:${width + i*gap + 28}px;top:34px;"></div>`;
  }
  // 가로줄
  crossings.forEach((c)=>{
    container.innerHTML += `<div class='ladder-line ladder-horizontal' style="left:${width + c.x*gap + 28}px;top:${c.y}px;width:${gap}px;"></div>`;
  });
}

// 사다리 이동 결과 계산
function runLadder(count, crossings){
  // 각 출발점에서 끝까지 이동
  let result = [];
  for(let start=0; start<count; start++){
    let x = start;
    for(let i=0, y=36;i<crossings.length;i++,y+=22){
      // 이 y에서 가로줄이 있으면 x 이동
      const found = crossings.filter(c=>c.y===y && (c.x===x || c.x===x-1));
      if(found.length){
        // 오른쪽에 가로줄이 있으면 오른쪽으로
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