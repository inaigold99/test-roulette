// 각 마블의 경로 상태 및 결과를 저장
function startMarbles() {
  const finalResult = document.getElementById('finalResult');
  finalResult.textContent = "";

  // 마블 초기 위치
  const marbles = [
    { id: "marble1", left: 45, top: 0, color: '#0ff', result: null },
    { id: "marble2", left: 105, top: 0, color: '#0f0', result: null },
    { id: "marble3", left: 165, top: 0, color: '#f0f', result: null }
  ];
  
  marbles.forEach((m,i) => {
    let marble = document.getElementById(m.id);
    marble.style.left = m.left+'px';
    marble.style.top = m.top+'px';
    marble.style.background = m.color;
  });

  let finishedCount = 0;
  let marbleStatus = [false,false,false];

  // 각각 마블을 애니메이션
  marbles.forEach((m, idx) => {
    animateMarble(m, idx);
  });

  function animateMarble(m, idx) {
    let y = m.top;
    let x = m.left;
    let stage = 0; // 0 : 첫 세로, 1~3 : 가로, 4: 마지막 세로
    // 각 장애물 위치 예시:
    const obstacles = [
      { x:70, y:100 }, // stage 1
      { x:150, y:180 }, // stage 2
      { x:70, y:220 }   // stage 3
    ];
    // 마블 애니메이션 진행
    function move() {
      // 세로 1
      if (stage === 0) {
        if (y < 70) {
          y += 2;
          setMarblePos(m.id, x, y);
          setTimeout(move, 15);
        } else {
          // 가로1
          stage++;
          horizontalMove(1);
        }
      }
      // 세로 2
      else if (stage === 4) {
        if (y < 325) {
          y += 2;
          setMarblePos(m.id, x, y);
          setTimeout(move, 15);
        } else {
          // 결과 판정
          marbleStatus[idx]=true;
          m.result = (x<100) ? "A" : "B";
          checkAllFinished();
        }
      }
    }
    // 가로로 이동(가로 stage = 1,2,3)
    function horizontalMove(stageNum) {
      let maxHoriz = 120; // 이동 길이
      let horizDist = 0;
      let moveDir = Math.random()<0.5?-1:1; // -1: 왼쪽, 1: 오른쪽
      function goHoriz() {
        if (horizDist < maxHoriz) {
          // 장애물 체크! 장애물 가까우면 방향전환
          const obs = obstacles[stageNum-1];
          if (Math.abs(x-obs.x)<12 && Math.abs(y-obs.y)<12) {
            // 장애물 효과: 방향 전환 or 랜덤 멈춤
            moveDir = Math.random()<0.5 ? -moveDir : moveDir;
            horizDist += 15; // 장애물에서 약간 멈춤 효과
          }
          x += moveDir*2;
          horizDist += 2;
          setMarblePos(m.id, x, y);
          setTimeout(goHoriz, 15);
        } else {
          // 다음 세로로
          stage++;
          y += 2;
          setMarblePos(m.id, x, y);
          verticalMove();
        }
      }
      goHoriz();
    }
    // 세로로 이동
    function verticalMove() {
      let yTarget = [150, 230, 325][stage-1];
      function goDown() {
        if (y < yTarget) {
          y += 2;
          setMarblePos(m.id, x, y);
          setTimeout(goDown, 15);
        } else {
          if (stage<4) {
            horizontalMove(stage);
          } else {
            move(); // 마지막 세로
          }
        }
      }
      goDown();
    }
    // 마블 위치 업데이트
    function setMarblePos(id, left, top) {
      const marble = document.getElementById(id);
      marble.style.left = left+'px';
      marble.style.top = top+'px';
    }
    move();
  }

  // 모두 끝나면 결과 출력
  function checkAllFinished() {
    if (marbleStatus.every(v=>v)) {
      const marble1 = marbles[0];
      const marble2 = marbles[1];
      const marble3 = marbles[2];
      finalResult.textContent = `결과: [1번:${marble1.result}] [2번:${marble2.result}] [3번:${marble3.result}]`;
    }
  }
}