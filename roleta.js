const $ = document.querySelector.bind(document);
const roletaUL = $("#roleta");

class Roletter {
    constructor(obj) {
        this.items = obj.items;
        this.itemWidth = 135;
        this.itemGap = 10;
        this.animDelay = 500;
        this.baseDelay = Number(this.animDelay.toString());
        this.turn = 0;
        this.maxTurns = 200;

        this.items.forEach((item, index) => this.appendItem(item, index));
        this.appendItem();
        this.appendItem();
        this.appendItem();
        this.appendItem();
        this.appendItem();
        this.appendItem();
        this.appendItem();
        this.appendItem();
        this.appendItem();
        this.appendItem();
        this.appendItem();
        this.appendItem();
        this.appendItem();
        this.organize();

    };

    organize() {
        Array.from(roletaUL.children).forEach((item, index) => {
            item.style.left = ((-(12 * this.itemWidth + 11 * this.itemGap) + (this.itemWidth + this.itemGap) * index) + "px");
        });
    }

    moveLeft() {
        Array.from(roletaUL.children).forEach((item, index) => {
            const currentLeft = Number(item.style.left.replace("px", ""));
            item.style.left = currentLeft - this.itemWidth - this.itemGap + "px";
        });
        this.appendItem();
        setTimeout(fn => {
            roletaUL.children[0].remove();
            this.organize()
        }, this.animDelay);
    }

    appendItem(item = null, index = null) {
        if (!index) index = this.lastAppendedIndex === this.items.length - 1 ? 0 : this.lastAppendedIndex + 1;
        if (!item) item = this.items[index];
        const html = `
        <li data-index="${index}">
            <h1>${item.title}</h1>
        </li>
    `;
        this.lastAppendedIndex = index;
        roletaUL.insertAdjacentHTML('beforeend', html);
    }

    start() {
        this.timer = setTimeout(fn => {
            this.controlSpeed();
            this.moveLeft();
            this.turn += 1;
            if (this.turn <= this.maxTurns) this.start();
            else this.stop();
        }, (this.animDelay));
    }

    controlSpeed() {
        if (this.turn < 2) this.changeSpeed(.8);
        else if (this.turn < 3) this.changeSpeed(.5);
        else if (this.turn < 4) this.changeSpeed(.4);
        else if (this.turn < 5) this.changeSpeed(.3);
        else if (this.turn < 6) this.changeSpeed(.2);
        else if (this.turn < Math.floor(this.maxTurns * .8)) this.changeSpeed(.1);
        else if (this.turn < Math.floor(this.maxTurns * .805)) this.changeSpeed(.2);
        else if (this.turn < Math.floor(this.maxTurns * .81)) this.changeSpeed(.3);
        else if (this.turn < Math.floor(this.maxTurns * .82)) this.changeSpeed(.4);
        else if (this.turn < Math.floor(this.maxTurns * .83)) this.changeSpeed(.5);
        else if (this.turn < Math.floor(this.maxTurns * .84)) this.changeSpeed(.6);
        else if (this.turn < Math.floor(this.maxTurns * .85)) this.changeSpeed(.7);
        else if (this.turn < Math.floor(this.maxTurns * .86)) this.changeSpeed(.8);
        else if (this.turn < Math.floor(this.maxTurns * .87)) this.changeSpeed(.8);
        else if (this.turn < Math.floor(this.maxTurns * .88)) this.changeSpeed(.9);
        else if (this.turn < Math.floor(this.maxTurns * .95)) this.changeSpeed(1);

    }

    stop() {
        clearTimeout(this.timer);
        this.turn = 0;
    }

    changeSpeed(speed) {
        this.animDelay = this.baseDelay * speed;
    }
}

const roleta = new Roletter({ items: [{ title: 1 }, { title: 2 }, { title: 3 }, { title: 4 }] });

roleta.start();