class Tower {
    constructor(col, row) {
        // Display
        this.border = [0, 0, 0];    // border color
        this.color = [0, 0, 0];     // main color
        this.hasBarrel = true;
        this.hasBase = true;
        this.length = 0.7;          // barrel length in tiles
        this.radius = 1;            // radius in tiles
        this.secondary = [0, 0, 0]; // secondary color
        this.width = 0.3;           // barrel width in tiles
        // Misc
        this.alive = true;
        this.name = 'tower';
        // Position
        this.angle = 0;
        this.gridPos = createVector(col, row);
        this.pos = createVector(col*ts + ts/2, row*ts + ts/2);
        // Stats
        this.cd = 0;                // current cooldown left
        this.cooldown = 10;
        this.damage = 1;
        this.range = 5;
    }

    aim(x, y) {
        this.angle = atan2(y - this.pos.y, x - this.pos.x);
    }

    canFire() {
        return this.cd === 0;
    }

    draw() {
        // Draw barrel
        if (this.hasBarrel) {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.angle);
            this.drawBarrel();
            pop();
        }
        // Draw turret base
        if (this.hasBase) this.drawBase();
    }

    drawBarrel() {
        stroke(this.border);
        fill(this.secondary);
        rect(0, -this.width * ts / 2, this.length * ts, this.width * ts);
    }

    drawBase() {
        stroke(this.border);
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius * ts, this.radius * ts);
    }

    kill() {
        this.alive = false;
    }

    onAim(e) {}

    onTarget(entities) {
        var e = this.target(entities);
        if (typeof e === 'undefined') return;
        this.onAim(e);
    }

    resetCooldown() {
        this.cd = this.cooldown;
    }

    target() {}

    update() {
        if (this.cd > 0) this.cd--;
    }

    upgrade(template) {
        template = typeof template === 'undefined' ? {} : template;
        var keys = Object.keys(template);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            this[key] = template[key];
        }
    }

    // Returns array of visible entities out of passed array
    visible(entities) {
        var visible = [];
        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            var c = this.pos;
            if (insideCircle(e.pos.x, e.pos.y, c.x, c.y, this.range * ts)) {
                visible.push(e);
            }
        }
        return visible;
    }
}