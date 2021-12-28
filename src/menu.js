const simpleMenu = function (props) {
    const { toggleBtn, toggleDiv, header = null, body = "body" } = props
    this.elems = {
        btn: document.querySelector(toggleBtn),
        menuDiv: document.querySelector(toggleDiv),
        header: document.querySelector(header),
        body: document.querySelector(body)
    }
    this.elems.btn.addEventListener("click", () => { this.toggleMenu() })
    this.elems.menuDiv.querySelectorAll("ul li").forEach(item => {
        if (item.dataset.closeonclick == "true") item.addEventListener("click", e => this.closeMenu())
    })
}
simpleMenu.prototype.toggleMenu = function () {
    if (this.elems.menuDiv.classList.contains("menuShow")) this.closeMenu();
    else this.openMenu()
}

simpleMenu.prototype.openMenu = function () {
    this.elems.menuDiv.style.maxHeight = this.elems.menuDiv.scrollHeight + "px"
    this.elems.menuDiv.classList.add("menuShow")
    this.elems.header.classList.add("menuShow")
    this.elems.btn.classList.add("open")
    this.elems.body.classList.add("locked")
}

simpleMenu.prototype.closeMenu = function () {
    this.elems.menuDiv.style.maxHeight = null
    this.elems.menuDiv.classList.remove("menuShow")
    this.elems.header.classList.remove("menuShow")
    this.elems.btn.classList.remove("open")
    this.elems.body.classList.remove("locked")
}