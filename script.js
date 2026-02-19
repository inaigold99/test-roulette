function startMarble() {
  const marble = document.getElementById('marble');
  const finalResult = document.getElementById('finalResult');

  // 초기화
  marble.style.left = "33px";
  marble.style.top = "0px";
  finalResult.textContent = "";

  let y = 0;
  let animationStage = 0;

  // 갈림길에서 어디로 갈지 결정: 0(왼쪽 아래), 1(가로통로→오른쪽 아래)
  const direction = Math.random() < 0.5 ? 0 : 1;

  // 아래로 떨어지는 부분
  function moveDown() {
    if (y < 120) {
      marble.style.top = y + "px";
      y += 3;
      requestAnimationFrame(moveDown);
    } else {
      // 갈림길!
      if (direction === 1) {
        // 오른쪽(가로로 이동)
        moveRight();
      } else {
        // 왼쪽 아래로 직하강
        moveLeftDown();
      }
    }
  }

  // 오른쪽으로 가로 이동
  function moveRight() {
    let x = 33;
    function goRight() {
      if (x < 173) {
        marble.style.left = x + "px";
        x += 3;
        requestAnimationFrame(goRight);
      } else {
        moveRightDown();
      }
    }
    goRight();
  }

  // 오른쪽 아래로 떨어지기
  function moveRightDown() {
    let y2 = 120;
    function goDown() {
      if (y2 < 285) {
        marble.style.top = y2 + "px";
        y2 += 3;
        requestAnimationFrame(goDown);
      } else {
        // 결과 표시
        finalResult.textContent = "결과2!";
      }
    }
    goDown();
  }

  // 왼쪽 아래로 떨어지기
  function moveLeftDown() {
    let y2 = 120;
    function goDown() {
      if (y2 < 285) {
        marble.style.top = y2 + "px";
        y2 += 3;
        requestAnimationFrame(goDown);
      } else {
        finalResult.textContent = "결과1!";
      }
    }
    goDown();
  }

  moveDown();
}