// --- Coordonnées des nœuds ---
const coords = {
  K: [192, 434], L: [354, 370], I: [390 , 460], J: [285 , 595], M: [466 , 334],
  H: [474 , 438], N: [522 , 234], O: [565 , 252], P: [692 , 353], C: [717 , 485],
  Q: [775 , 344], B: [784 , 498], A: [905 , 545], SI: [576 , 182], SU: [904 , 218]
};

const nodes = {
  K: [192, 434], L: [354, 370], I: [390 , 460], J: [285 , 595], M: [466 , 334],
  H: [474 , 438], N: [522 , 234], O: [565 , 252], P: [692 , 353], C: [717 , 485],
  Q: [775 , 344], B: [784 , 498], A: [905 , 545], SI: [576 , 182], SU: [904 , 218],
  X1: [216 , 492], X2: [245 , 414], X3: [361 , 416], X4: [384 , 415], X5: [323 , 534],
  X6: [368 , 542], X7: [475 , 561], X8: [473 , 412], X9: [538 , 420], X10: [536 , 225],
  X11: [710 , 424], X12: [673 , 408], X13: [759 , 408], X14: [874 , 500], X15: [845 , 313],
  X16: [722 , 558], X17: [841 , 409], X18: [846 , 518], X19: [710, 210]
};


const adjacency = {
  K: ["X2"], L: ["X3"], I: ["X4","X6"], J: ["X5"], M: ["X8"], H: ["X7","X8"],
  N: ["X10"], O: ["X10"], P: ["X12"], C: ["X11","X16"], Q: ["X13"], B: ["X13"],
  A: ["X14"], SI: ["X10", "X19"], SU: ["X15"], X1: ["X2","X5"], X2: ["K","X1","X3"],
  X3: ["L","X2","X4"], X4: ["I","X3","X8"], X5: ["J","X6","X1"], X6: ["I","X5","X7"],
  X7: ["X6","H","X16"], X8: ["M","H","X9","X4"], X9: ["X8","X12","X10"], X10: ["X9","N","O","SI"],
  X11: ["X12","C","X13"], X12: ["P","X11","X9"], X13: ["Q","B","X11","X17"], X14: ["X18","A"],
  X15: ["X17","SU", "X19"], X16: ["C","X18","X7"], X17: ["X13","X18","X15"], X18: ["X14","X16","X17"],
  X19: ["SI", "X15"]
};


let start = null;
const container = document.getElementById("container");
const SCALE = 1;
const OFFSET = 100*(1-SCALE)/2;
const OFFSET_X = -2;
const OFFSET_Y = -2; 

for (const key in coords){
    const button = document.createElement("button");
    const [x, y] = coords[key];
    
    button.className = "btn";
    button.textContent = key;
    
    const left = ((x / 1154) * 100 + OFFSET_X)*SCALE;
    const top = ((y / 741) * 100 + OFFSET_Y)*SCALE;
    
    button.style.position = "absolute";
    button.style.left = left + OFFSET + "%";
    button.style.top  = top + OFFSET + "%";

    button.onclick = () => handleClick(key);
    container.appendChild(button);
}


function dijkstra(graph, start, end) {
    const distances = {};
    const prev = {};
    const nodesSet = new Set(Object.keys(graph));

    for (const node in graph) distances[node] = Infinity;
    distances[start] = 0;

    while (nodesSet.size > 0) {
        const current = Array.from(nodesSet).reduce((a,b) => distances[a] < distances[b] ? a : b);
        nodesSet.delete(current);

        if (current === end) break;

        for (const neighbor of graph[current] || []) {
            const [nx, ny] = nodes[neighbor];
            const [cx, cy] = nodes[current];
            const alt = distances[current] + Math.hypot(nx - cx, ny - cy);
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                prev[neighbor] = current;
            }
        }
    }

    const path = [];
    let u = end;
    while (u) {
        path.unshift(u);
        u = prev[u];
    }
    return path;
}


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function mapX(x) {
    return (x / 1154) * canvas.width;
}

function mapY(y) {
    return (y / 741) * canvas.height;
}

function drawPath(path) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    const step = 12;
    const radius = 3;

    for (let i = 0; i < path.length - 1; i++) {
        const [x1, y1] = nodes[path[i]];
        const [x2, y2] = nodes[path[i+1]];

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.hypot(dx, dy);
        const steps = Math.floor(dist / step);

        for (let j = 0; j <= steps; j++) {
            const t = j / steps;
            const X = mapX(x1 + t * dx);
            const Y = mapY(y1 + t * dy);

            ctx.beginPath();
            ctx.arc(X, Y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}



document.getElementById("clear").onclick = function(){
    const path = [];
    drawPath(path);
    distance.innerHTML = "distance : ";
    time.innerHTML = "time : ";
    
}


function calcDistance(path) {
    let distance = 0;
    for (let i=0; i< path.length -1; i++){
        const [x1, y1] = nodes[path[i]];
        const [x2, y2] = nodes[path[i + 1]];
        distance += Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
    }
    return distance/1.05;
}


//MAIN----------------

const distance = document.getElementById("distance");
const time = document.getElementById("time");

function handleClick(node) {
    if (!start) {
        start = node;
        console.log("Start:", node);
    } else {
        const end = node;
        console.log("End:", node);
        const path = dijkstra(adjacency, start, end);
        console.log("Chemin :", path);
        drawPath(path);
        distance.innerHTML = "distance : " + calcDistance(path).toFixed(2) + "m";
        time.innerHTML = "time : " + (calcDistance(path)/(1.50*60)).toFixed(2) + "min";
        start = null;
    }
}