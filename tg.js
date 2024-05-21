var song
var fft
var particles = []
var img

window.onload = function () {
  inputbtn = createFileInput((file) => {
    song = loadSound(file)
    document.getElementsByTagName('input')[0].setAttribute('type', 'hidden')
  })
  var inputELE = document.getElementsByTagName('input')[0]
  inputELE.style.display = 'none'
  song = loadSound('/audio/1.mp3')
  img = loadImage(
    'https://images.unsplash.com/photo-1642455512074-e99118a44e8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1973&q=80'
  )
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  angleMode(DEGREES)
  imageMode(CENTER)
  rectMode(CENTER)
  fft = new p5.FFT(0.8, 512)
  img.filter(BLUR, 1)
  img.filter(THRESHOLD)
  noLoop()
}

function draw() {
  background(0)

  translate(width / 2, height / 2)

  fft.analyze()
  amp = fft.getEnergy(20, 200)

  push()
  if (amp > 230) {
    rotate(random(-1, 1))
  }
  image(img, 0, 0, width + 100, height + 100)
  pop()

  var alpha = map(amp, 0, 255, 100, 150)
  fill(20, alpha)
  noStroke()
  rect(0, 0, width, height)
  noStroke()
  fill(0, 255, 0)

  var wave = fft.waveform()

  for (var t = -1; t <= 1; t += 2) {
    beginShape()
    for (var i = 0; i <= 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length - 1))
      var r = map(wave[index], -1, 1, 90, 350)
      var x = r * sin(i) * t
      var y = r * cos(i)
      vertex(x, y)
    }
    endShape()
  }

  var p = new Particle()
  particles.push(p)

  for (var i = particles.length - 10; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 230)
      particles[i].show()
    } else {
      particles.splice(i, 1)
    }
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause()
    noLoop()
  } else {
    song.play()
    loop()
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0, 0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

    this.w = random(3, 5)
    this.color = [41, 204, 41]
  }
  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if (cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
  edges() {
    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    ) {
      return true
    } else {
      return false
    }
  }
  show() {
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}
function openNav() {
  document.getElementById('mySidenav').style.width = '250px'
  document.getElementById('main').style.marginLeft = '250px'
}

function closeNav() {
  document.getElementById('mySidenav').style.width = '0'
  document.getElementById('main').style.marginLeft = '0'
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}
