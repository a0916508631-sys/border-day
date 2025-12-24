console.log("app.js loaded");

const roleButtons = document.querySelectorAll(".role");
const moodButtons = document.querySelectorAll(".option");
const submit = document.getElementById("submit");
const log = document.getElementById("gameLog");

let selectedRole = "";
let selectedMood = "";

const world = JSON.parse(localStorage.getItem("world")) || {
  tension: 0,
  scar: 0
};

const meta = JSON.parse(localStorage.getItem("meta")) || {
  worldCycle: 1
};

log.innerHTML = `<small>第 ${meta.worldCycle} 次接近邊境</small><br><br>`;

roleButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    roleButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedRole = btn.dataset.role;
  });
});

moodButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    moodButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMood = btn.dataset.text;
  });
});

function fight(player, enemy) {
  while (player.hp > 0 && enemy.hp > 0) {
    enemy.hp -= player.atk;
    if (enemy.hp <= 0) break;
    player.hp -= enemy.atk;
  }
  return player.hp > 0;
}

submit.addEventListener("click", () => {
  if (!selectedRole || !selectedMood) {
    log.innerHTML += "你還沒決定自己是誰。<br>";
    return;
  }

  const roleAtk = {
    fighter: 2,
    mage: 1,
    archer: 1.5
  };

  const moodHp = {
    "撐著": 12,
    "空空的": 10,
    "很亂": 14,
    "還可以": 16
  };

  const player = {
    hp: moodHp[selectedMood],
    atk: roleAtk[selectedRole]
  };

  const enemy = {
    hp: 10 + world.tension,
    atk: 3
  };

  log.innerHTML += `
    你以「${selectedRole}」的身份，
    帶著「${selectedMood}」踏入邊境。<br><br>
  `;

  const win = fight(player, enemy);

  if (win) {
    log.innerHTML += "你活著回來了。<br>";
    world.tension += 3;
  } else {
    log.innerHTML += "你倒在邊境深處。<br>";
    world.scar += 2;
  }

  if (world.scar >= 12) {
    meta.worldCycle++;
    log.innerHTML += "<br><em>世界正在重組……</em><br>";
    world.tension = 0;
    world.scar = 0;
  }

  localStorage.setItem("world", JSON.stringify(world));
  localStorage.setItem("meta", JSON.stringify(meta));
});


