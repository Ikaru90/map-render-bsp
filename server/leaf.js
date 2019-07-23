function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const Leaf = function (x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.leftChild;
  this.rightChild;
  this.room;
  this.halls = [];

  const MIN_LEAF_SIZE = 10;

  this.split = function () {
    if (this.leftChild || this.rightChild) {
      return false;
    }

    let splitByHeight = Math.random() > 0.5;
    if (width > height && width / height >= 1.25) {
      splitByHeight = false;
    } else if (height > width && height / width >= 1.25) {
      splitByHeight = true;
    }

    const MAX_LEAF_SIZE = (splitByHeight ? height : width) - MIN_LEAF_SIZE;

    if (MAX_LEAF_SIZE <= MIN_LEAF_SIZE) {
      return false;
    }

    const split = getRandomNumber(MIN_LEAF_SIZE, MAX_LEAF_SIZE);

    if (splitByHeight){
      this.leftChild = new Leaf(x, y, width, split);
      this.rightChild = new Leaf(x, y + split, width, height - split);
    } else {
      this.leftChild = new Leaf(x, y, split, height);
      this.rightChild = new Leaf(x + split, y, width - split, height);
    }

    return true;
  };

  this.createRooms = function () {
    if (this.leftChild || this.rightChild) {
      this.leftChild && this.leftChild.createRooms();
      this.rightChild && this.rightChild.createRooms();
      if (this.leftChild && this.rightChild) {
        this.createHall(this.leftChild.getRoom(), this.rightChild.getRoom());
      }
    } else {
      const roomSize = {
        width: getRandomNumber(5, width - 1),
        height: getRandomNumber(5, height - 1)
      };
      const roomPos = {
        x: getRandomNumber(2, width - roomSize.width - 1),
        y: getRandomNumber(2, height - roomSize.height - 1)
      };
      this.room = {x: x + roomPos.x, y: y + roomPos.y, width: roomSize.width, height: roomSize.height};
    }
  };

  this.getRoom = function () {
    if (this.room) {
      return this.room;
    }
    const leftRoom = this.leftChild && this.leftChild.getRoom();;
    const rightRoom = this.rightChild && this.rightChild.getRoom();
    if (!leftRoom && !rightRoom) {
      return null;
    } else if (!leftRoom) {
      return rightRoom;
    } else if (!rightRoom) {
      return leftRoom;
    } else if (Math.random() > 0.5) {
      return rightRoom;
    } else {
      return leftRoom;
    }
  };

  this.createHall = function (leftRoom, rightRoom) {
    const startPoint = {
      x: getRandomNumber(leftRoom.x + 1, leftRoom.x + leftRoom.width - 1),
      y: getRandomNumber(leftRoom.y + 1, leftRoom.y + leftRoom.height - 1)
    };
    const finishPoint = {
      x: getRandomNumber(rightRoom.x + 1, rightRoom.x + rightRoom.width - 1),
      y: getRandomNumber(rightRoom.y + 1, rightRoom.y + rightRoom.height - 1)
    };

    const w = finishPoint.x - startPoint.x;
    const h = finishPoint.y - startPoint.y;

    if (w < 0)	{
      if (h < 0) {
        if (Math.random() < 0.5) {
          this.halls.push({x: finishPoint.x, y: startPoint.y, width: Math.abs(w) + 1, height: 1});
          this.halls.push({x: finishPoint.x, y: finishPoint.y, width: 1, height: Math.abs(h) + 1});
        } else {
          this.halls.push({x: finishPoint.x, y: finishPoint.y, width: Math.abs(w) + 1, height: 1});
          this.halls.push({x: startPoint.x, y: finishPoint.y, width: 1, height: Math.abs(h) + 1});
        }
      } else if (h > 0) {
        if (Math.random() < 0.5) {
          this.halls.push({x: finishPoint.x, y: startPoint.y, width: Math.abs(w) + 1, height: 1});
          this.halls.push({x: finishPoint.x, y: startPoint.y, width: 1, height: Math.abs(h) + 1});
        } else {
          this.halls.push({x: finishPoint.x, y: finishPoint.y, width: Math.abs(w) + 1, height: 1});
          this.halls.push({x: startPoint.x, y: startPoint.y, width: 1, height: Math.abs(h) + 1});
        }
      } else {
        this.halls.push({x: finishPoint.x, y: finishPoint.y, width: Math.abs(w) + 1, height: 1});
      }
    } else if (w > 0) {
      if (h < 0) {
        if (Math.random() < 0.5) {
          this.halls.push({x: startPoint.x, y: finishPoint.y, width: Math.abs(w) + 1, height: 1});
          this.halls.push({x: startPoint.x, y: finishPoint.y, width: 1, height: Math.abs(h) + 1});
        } else {
          this.halls.push({x: startPoint.x, y: startPoint.y, width: Math.abs(w) + 1, height: 1});
          this.halls.push({x: finishPoint.x, y: finishPoint.y, width: 1, height: Math.abs(h) + 1});
        }
      } else if (h > 0) {
        if (Math.random() < 0.5) {
          this.halls.push({x: startPoint.x, y: startPoint.y, width: Math.abs(w) + 1, height: 1});
          this.halls.push({x: finishPoint.x, y: startPoint.y, width: 1, height: Math.abs(h) + 1});
        } else {
          this.halls.push({x: startPoint.x, y: finishPoint.y, width: Math.abs(w) + 1, height: 1});
          this.halls.push({x: startPoint.x, y: startPoint.y, width: 1, height: Math.abs(h) + 1});
        }
      } else {
        this.halls.push({x: startPoint.x, y: startPoint.y, width: Math.abs(w) + 1, height: 1});
      }
    } else {
      if (h < 0) {
        this.halls.push({x: finishPoint.x, y: finishPoint.y, width: 1, height: Math.abs(h) + 1});
      } else if (h > 0) {
        this.halls.push({x: startPoint.x, y: startPoint.y, width: 1, height: Math.abs(h) + 1});
      }
    }
  };
};

module.exports = Leaf;
