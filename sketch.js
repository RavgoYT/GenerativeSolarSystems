let centralEntity;
let orbitingEntities = [];
let zoomLevel = 0.05; // Initial zoom level
let targetZoomLevel = 0.3;
let zoomTransitionDuration = 1.1; // Time in seconds for zoom transition
let targetEntityIndex = -1; // Index of the target entity to focus on
let menuScale = 1.35;
let entitySizeInput,
    numEntitiesInput,
    centralGravityInput,
    orbitalGravityInput,
    timeWarpSlider;
let c1;
let c2;
let c3;
let c4;
let c5;


function setup(newEntitySize, newNumEntities, newCentralGravity, newOrbitalGravity, newTimeWarp) {

    c1 = color(random(180, 255), 150 + random(-105, 105), 150 + random(-105, 105));
    c2 = color(random(180, 255), 150 + random(-105, 105), 150 + random(-105, 105));
    c3 = color(random(180, 255), 150 + random(-105, 105), 150 + random(-105, 105));
    c4 = color(random(180, 255), 150 + random(-105, 105), 150 + random(-105, 105));
    c5 = color(random(180, 255), 150 + random(-105, 105), 150 + random(-105, 105));
    c1.setAlpha(192);
    c2.setAlpha(192);
    c3.setAlpha(192);
    c4.setAlpha(192);
    c5.setAlpha(192);


    //creating default values for each of the input options
    let entitySize = newEntitySize || 26;
    let centralGravity = newCentralGravity || 9.2;
    let orbitalGravity = newOrbitalGravity || 2.3;    



    createCanvas(windowWidth - 2.5, windowHeight - 2.5);
    centralEntity = new Entity(width / 2, height / 2, entitySize, color(255, 255, 150));

    let numOrbitingEntities = newNumEntities || floor(random(20, 80));

    // Input elements for menu options
    entitySizeInput = createInput(entitySize);
    numEntitiesInput = createInput(numOrbitingEntities);
    centralGravityInput = createInput(centralGravity);
    orbitalGravityInput = createInput(orbitalGravity);
    timeWarpSlider = createSlider(0, 5, 1, 0.5);

    // entitySizeInput.addEventListener('input', updateSetup);
    // numEntitiesInput.addEventListener('input', updateSetup);
    // centralGravityInput.addEventListener('input', updateSetup);
    // orbitalGravityInput.addEventListener('input', updateSetup);
    // timeWarpSlider.addEventListener('input', updateSetup);



    for (let i = 0; i < numOrbitingEntities; i++) {
        let angle = map(i, 0, numOrbitingEntities, 0, TWO_PI);
        let minDistance = min(width, height) / 5.3 + 5;
        let maxDistance = min(width, height) / 0.9 + 5;
        let distance = random(minDistance, maxDistance);
        let size = min(random(5, 15), centralEntity.radius / 2);
        let x = centralEntity.pos.x + cos(angle) * distance;
        let y = centralEntity.pos.y + sin(angle) * distance;
        let tangentialVelocity = createVector(-sin(angle), cos(angle)).mult(random(2.7, 3.8));
        let radialVelocity = createVector(x - centralEntity.pos.x, y - centralEntity.pos.y).normalize().mult(random(0.09, 0.4));
        let initialVelocity = tangentialVelocity.add(radialVelocity);
        let pastelColor = color(random(180, 255), 150 + random(-105, 105), 150 + random(-105, 105));
        let rotationSpeed = 0; //random(-0.02, 0.02); // Adjust the range as needed

        orbitingEntities.push(new Entity(x, y, size, pastelColor, initialVelocity, tangentialVelocity.mag(), rotationSpeed, centralGravity, orbitalGravity));
    }
}

function draw() {
    background(0);

    // Draw title in the top left corner
    //fill(255);
    //textSize(36);
    //text('TheEntireUniverse', 170, 50);
    drawMenu(c1, c2, c3, c4, c5);
    translate(width / 2, height / 2);
    let tZoom = min(1.0, frameCount / (zoomTransitionDuration * 60));
    let lerpedZoom = lerp(zoomLevel, targetZoomLevel, tZoom);
    scale(lerpedZoom);

    // Update the target entity position
    let targetEntity = orbitingEntities[targetEntityIndex];
    if (targetEntityIndex == -1) {
        translate(-centralEntity.pos.x, -centralEntity.pos.y);
    } else {
        translate(-targetEntity.pos.x, -targetEntity.pos.y);
    }

    centralEntity.display();
    for (let i = 0; i < orbitingEntities.length; i++) {
        let entity = orbitingEntities[i];
        let force = entity.calculateGravityFromOthers();
        entity.applyForce(force);
        entity.update();
        entity.display();

        // Check for collisions with the central entity
        if (centralEntity.isColliding(entity)) {
            centralEntity.consume(entity);
            orbitingEntities.splice(i, 1); // Remove consumed entity from the array
        } else {
            // Check for collisions between orbiting entities
            for (let j = 0; j < orbitingEntities.length; j++) {
                if (i !== j) {
                    let otherEntity = orbitingEntities[j];
                    if (entity.isColliding(otherEntity)) {
                        entity.consume(otherEntity);
                        orbitingEntities.splice(j, 1); // Remove consumed entity from the array
                    }
                }
            }
        }
    }

    // Continuous zooming while arrow key is held down
    if (keyIsDown(UP_ARROW)) {
        targetZoomLevel *= 1.03; // Increase zoom level (zoom in)
    } else if (keyIsDown(DOWN_ARROW)) {
        targetZoomLevel /= 1.03; // Decrease zoom level (zoom out)
    }

    // Switch target entity with left and right arrow keys
}

function drawMenu(c1, c2, c3, c4, c5) {
    // Background
    noStroke();
    fill(18); // Greyscale color
    rect(width - 430 * menuScale, height / 2 - 300 + 270 * menuScale, 400 * menuScale, 230 * menuScale, 15 * menuScale);
    rect(width - 430 * menuScale, height / 2 + 50 + 260 * menuScale, 400 * menuScale, 170 * menuScale, 15 * menuScale);

    // Title
    fill(255);
    textAlign(CENTER);
    textSize(30 * menuScale);
    text("Menu", width - 230 * menuScale, height / 2 - 260 + 285 * menuScale);

    // Menu options
    textSize(20 * menuScale);
    fill(255);

    // Option 1: Change Central Entity Size
    text("Star Size", width - 300 * menuScale, height / 2 - 210 + 285 * menuScale);
    entitySizeInput.position(width - 210 * menuScale, height / 2 - 220 + 275 * menuScale);
    entitySizeInput.size(60 * menuScale, 20 * menuScale);
    entitySizeInput.style("background-color", c1);
    entitySizeInput.style('border', 'none');

    // Option 2: Change Number of Orbital Entities
    text("Planets", width - 300 * menuScale, height / 2 - 170 + 285 * menuScale);
    numEntitiesInput.position(width - 210 * menuScale, height / 2 - 180 + 275 * menuScale);
    numEntitiesInput.size(60 * menuScale, 20 * menuScale);
    numEntitiesInput.style('background-color', c2); // Adjust color as needed
    numEntitiesInput.style('border', 'none');

    // Option 3: Change Central Entity Gravity
    text("Star Gravity", width - 300 * menuScale, height / 2 - 130 + 285 * menuScale);
    centralGravityInput.position(width - 210 * menuScale, height / 2 - 140 + 275 * menuScale);
    centralGravityInput.size(60 * menuScale, 20 * menuScale);
    centralGravityInput.style('background-color', c3); // Adjust color as needed
    centralGravityInput.style('border', 'none');

    // Option 4: Change Orbital Entity Gravity
    text("Planet Gravity", width - 300 * menuScale, height / 2 - 90 + 285 * menuScale);
    orbitalGravityInput.position(width - 210 * menuScale, height / 2 - 100 + 275 * menuScale);
    orbitalGravityInput.size(60 * menuScale, 20 * menuScale);
    orbitalGravityInput.style('background-color', c4); // Adjust color as needed
    orbitalGravityInput.style('border', 'none');

    // Option 5: Time Warp (Speed Control)
    text("Time Warp", width - 300 * menuScale, height / 2 - 50 + 285 * menuScale);
    timeWarpSlider.position(width - 210 * menuScale, height / 2 - 55 + 275 * menuScale);
    timeWarpSlider.size(160 * menuScale, 20 * menuScale);
    //timewarpSlider.style('background-color', '#FF0000'); // Adjust color as needed

    // Keybinds
    // fill(200);
    // textSize(18 * menuScale);
    // drawKeyImage(width - 400 * menuScale, height / 2 - 10 * menuScale, 'left-arrow.png');
    // drawKeyImage(width - 400 * menuScale, height / 2 + 20 * menuScale, 'up-arrow.png');
    // drawKeyImage(width - 400 * menuScale, height / 2 + 50 * menuScale, 'space-bar.png');
    // drawKeyImage(width - 400 * menuScale, height / 2 + 80 * menuScale, 'enter-key.png');
}

//   // Function to draw key images
//   function drawKeyImage(x, y, imageName) {
//     let img = loadImage(imageName);
//     image(img, x, y, 20 * menuScale, 20 * menuScale);
//   }


function keyPressed() {
    if (keyCode === TAB) {
        targetEntityIndex = -1; // Set target to central entity
        // Reset zoom level and translation to center
        targetZoomLevel = 0.9;
        translate(width / 2, height / 2);
    } else if (keyCode === LEFT_ARROW) {
        targetEntityIndex = (targetEntityIndex - 1 + orbitingEntities.length) % orbitingEntities.length;
        targetZoomLevel = 1.3;
    } else if (keyCode === RIGHT_ARROW) {
        targetEntityIndex = (targetEntityIndex + 1) % orbitingEntities.length;
        targetZoomLevel = 1.3;
    }

}

function updateSetup() {
  // Capture updated values from user input
  const newEntitySize = parseFloat(entitySizeInput.value);
  const newNumEntities = parseInt(numEntitiesInput.value);
  const newCentralGravity = parseFloat(centralGravityInput.value);
  const newOrbitalGravity = parseFloat(orbitalGravityInput.value);
  const newTimeWarp = parseFloat(timeWarpSlider.value);

  // Call setup function with updated values
  setup(newEntitySize, newNumEntities, newCentralGravity, newOrbitalGravity, newTimeWarp);
}


class Entity {
    constructor(x, y, radius, entityColor, initialVelocity, tangentialMultiplier, rotationSpeed, centralGravity, orbitalGravity) {
        this.pos = createVector(x, y);
        this.vel = initialVelocity || createVector(0, 0); // Use provided initial velocity or default to zero
        this.acc = createVector(0, 0);
        this.radius = radius;
        this.color = entityColor;
        this.contrail = []; // Array to store contrail points
        this.tangentialMultiplier = tangentialMultiplier || 1; // Use provided tangential multiplier or default to 1
        this.rotationSpeed = rotationSpeed || 0; // Initial rotation speed
        this.centralGravity = centralGravity || 9.2
        this.orbitalGravity = orbitalGravity || -2.3
    }

    applyForce(force) {
        // Add the gravitational force to the acceleration
        this.acc.add(force);
    }

    update() {
        if (this.tangentialMultiplier >= 3.5) this.tangentialMultiplier = random(3.6, 4.8);
        // Calculate gravitational force from central entity
        let force = centralEntity.calculateGravity(this);
        this.applyForce(force);

        // Update velocity
        this.vel.add(this.acc);


        // Limit the maximum speed based on entity size
        let maxSpeed = 12 * (centralEntity.radius / this.radius); // Adjust this value as needed

        // If the velocity exceeds the maximum speed, scale it down
        if (this.vel.mag() > maxSpeed) {
            this.vel.setMag(maxSpeed);
        }

        this.vel.rotate(this.rotationSpeed);

        // Update position
        this.pos.add(this.vel);

        // Store contrail points
        this.contrail.push(createVector(this.pos.x, this.pos.y));

        // Limit contrail length
        while (this.contrail.length > 40 * this.radius) {
            this.contrail.shift(); // Remove oldest point if contrail is too long
        }

        // Reset acceleration
        this.acc.mult(0);
    }

    display() {
        noStroke();
        // Draw contrails
        for (let i = 0; i < this.contrail.length - 1; i++) {
            let alpha = map(i, 0, this.contrail.length - 1, 100, 0);
            fill(255, 255, 255, alpha);
            ellipse(this.contrail[i].x, this.contrail[i].y, 4, 4);
        }
        for (let i = 5; i > 0; i--) {
            let auraAlpha = map(i, 0, 5, 100, 0); // Gradual fading effect
            fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], auraAlpha);
            ellipse(this.pos.x, this.pos.y, (this.radius * 2 + this.radius / 2) * 8 / 4 * i / 5, (this.radius * 2 + this.radius / 2) * 8 / 4 * i / 5);
        }
        // Draw the actual entity
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
        // Display tangential velocity value
        fill(255);
        //the text is right here
        //   textAlign(CENTER, CENTER);
        //   textSize(40);
        //   text(nf(this.tangentialMultiplier, 1, 2), this.pos.x, this.pos.y + this.radius + 5);
    }

    calculateGravity(other) {
        let G;
        let forceMagValue;

        if (this === centralEntity) {
            // Adjust G based on the central entity's mass (assumed to be a large value)
            G = this.centralGravity;
            forceMagValue = 0.6; // Adjust this value based on the desired gravitational strength for the central entity
        } else {
            // Adjust G for orbiting entities, this one seems to be needing to be negative to pull 
            G = -this.orbitalGravity;
            forceMagValue = 11; // Adjust this value based on the desired gravitational strength for orbiting entities
        }

        // Calculate the distance between the entities
        const distance = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);

        // Adjust forceMag based on the distance and the entities' masses
        const forceMag = (-(G * this.radius * other.radius) / ((distance * distance) * forceMagValue)); // Adjust the coefficient based on the desired strength

        // Calculate the gravitational force vector, considering the changing mass of the central entity
        const force = createVector(other.pos.x - this.pos.x, other.pos.y - this.pos.y);
        force.setMag(forceMag * (centralEntity.radius / this.radius));

        return force;
    }

    calculateGravityFromOthers() {
        const totalForce = createVector(0, 0);

        for (let other of orbitingEntities) {
            if (other !== this) {
                const force = this.calculateGravity(other);
                totalForce.add(force);
            }
        }

        return totalForce;
    }


    isColliding(otherEntity) {
        // Check if this entity is colliding with the other entity
        let distance = dist(this.pos.x, this.pos.y, otherEntity.pos.x, otherEntity.pos.y);
        return distance < this.radius + otherEntity.radius;
    }

    consume(otherEntity) {
        // Animate the consumption process
        let framesToAnimate = 144; // Adjust as needed
        let centralConsumedColor = lerpColor(centralEntity.color, color(255, 0, 0), 0.35); // Mix colors
        let consumedColor = lerpColor(this.color, otherEntity.color, 0.5); // Mix colors

        for (let frame = 0; frame < framesToAnimate; frame++) {


            if (this === centralEntity) {
                this.radius += ((otherEntity.radius * 0.7) / framesToAnimate);
                // If the central entity is consuming, change its color
                centralEntity.color = centralConsumedColor;
            } else {
                this.radius += ((otherEntity.radius * 0.3) / framesToAnimate);
                // If an orbiting entity is consuming, change its color
                this.color = consumedColor;
            }

            // Add any additional visual effects for the consumption process
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}