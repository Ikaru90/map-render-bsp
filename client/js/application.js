const socket = io();

function application_initialize(map) {
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight
  });
  document.body.appendChild(app.view);

  const wallTexture = PIXI.Texture.from('assets/wall.png');
  const floorTexture = PIXI.Texture.from('assets/floor.png');

  function render_map() {
    for (let y = 0; y < map.length; y++ ) {
      for (let x = 0; x < map[y].length; x++ ) {
        if (map[y][x] === 1) {
          const wall = new PIXI.Sprite(wallTexture);
          wall.x = x * 20;
          wall.y = y * 20;
          app.stage.addChild(wall);
        }
        if (map[y][x] === 2) {
          const floor = new PIXI.Sprite(floorTexture);
          floor.x = x * 20;
          floor.y = y * 20;
          app.stage.addChild(floor);
        }
      }
    }
  }

  function resizeApplication(){
    app.renderer.resize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', resizeApplication, false);

  render_map();
}

socket.on('connect', function() {
  socket.on('send_map', function (map) {
    application_initialize(map);
  });
});
