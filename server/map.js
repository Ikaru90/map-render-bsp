const { performance } = require('perf_hooks');
const Leaf = require('./leaf');

const Map = function (x, y, width, height) {
  const fullTime = performance.now();
  const map = [];
  const leafs = [];
  const MAX_LEAF_SIZE = 20;

  const rootTime = performance.now();
  const rootLeaf = new Leaf(x , y, width, height);
  leafs.push(rootLeaf);
  console.log('Cоздание корневого листа =', performance.now() - rootTime);

  const leafsTime = performance.now();
  let did_split = true;
  while(did_split) {
    did_split = false;
    leafs.forEach(function(leaf){
      if (!leaf.leftChild && !leaf.rightChild) {
        if (leaf.width > MAX_LEAF_SIZE || leaf.height > MAX_LEAF_SIZE || Math.random() > 0.25) {
          if (leaf.split()) {
            leafs.push(leaf.leftChild);
            leafs.push(leaf.rightChild);
            did_split = true;
          };
        }
      }
    });
  }
  console.log('Деление листов =', performance.now() - leafsTime);

  const roomsTime = performance.now();
  rootLeaf.createRooms();
  console.log('Создание комнат и переходов =', performance.now() - roomsTime);

  const mapRenderTime = performance.now();
  for (let i = 0; i < leafs[0].height; i++) {
    map[i] = [];
    for (let j = 0; j < leafs[0].width; j++) {
      map[i][j] = 0;
    }
  }
  leafs.forEach(function(leaf) {
    if (leaf.room) {
      for (let i = leaf.room.y; i < leaf.room.y + leaf.room.height; i++) {
        for (let j = leaf.room.x; j < leaf.room.x + leaf.room.width; j++) {
          map[i][j] = 2;
        }
      }
    }
    if (leaf.halls) {
      leaf.halls.forEach(function(hall) {
        for (let i = hall.y; i < hall.y + hall.height; i++) {
          for (let j = hall.x; j < hall.x + hall.width; j++) {
            map[i][j] = 2;
          }
        }
      });
    }
  });

  const offsets = [
    [-1,-1], [0,-1], [1,-1], [1, 0],
    [ 1, 1], [0, 1], [-1, 1], [-1, 0],
  ];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] == 0) {
        for (let i = 0; i < 8; i++) {
          if (map[(y + offsets[i][1])] && map[(y + offsets[i][1])][(x + offsets[i][0])] == 2) {
            map[y][x] = 1;
            break;
          }
        }
      }
    }
  }

  for (let y = 1; y < map.length -1 ; y++) {
    for (let x = 1; x < map[y].length - 1; x++) {
      if (map[y][x] == 1) {
        let skip = false;
        for (let i = 0; i < 8; i++) {
          if (map[(y + offsets[i][1])] && map[(y + offsets[i][1])][(x + offsets[i][0])] == 0) {
            skip = true;
            break;
          }
        }
        if (!skip) {
          map[y][x] = 2;
        }
      }
    }
  }
  console.log('Создание массива карты =', performance.now() - mapRenderTime);

  console.log('Общее время создания карты =', performance.now() - fullTime);
  return map;
};

module.exports = Map;
