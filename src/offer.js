/* Requer 
classes
inputbox
active

Tag .price
Div .inputbox
*/

const Offer = function (props) {
    const { variations, elements, cfg } = props;
    this.variations = variations;
    this.cfg = cfg;
    this.elements = {}

    Object.entries(elements).forEach(el => this.elements[el[0]] = document.querySelector(el[1]))

    this.generatedButtons = this.generateVariationsBtns();
    this.elementarize()
    this.generatedButtons[0].click()
}

Offer.prototype.generateVariationsBtns = function () {
    const that = this;
    let btnList = [];
    this.variations.forEach((variation) => {
        const btn = document.createElement("button")
        btn.innerText = variation.text;
        btn.dataset.sku = variation.sku;
        btn.dataset.price = variation.price;
        btn.addEventListener("click", function (e) { that.onChooseVariation(e) });
        if (variation.nostock) btn.classList.add("nostock");
        btnList.push(btn)
    })
    return btnList
}

Offer.prototype.elementarize = function () {
    this.generatedButtons.forEach((btn) => this.elements.inputBox.append(btn))
}

Offer.prototype.onChooseVariation = function (e) {
    const btn = e.target;
    const el = this.elements
    if ((this.selectedVariation && this.selectedVariation.sku === btn.dataset.sku) || btn.classList.contains("nostock")) return

    // Define sku selecionada globalmente
    this.selectedVariation = this.variations.filter(item => item.sku == btn.dataset.sku)[0]
    const product = this.selectedVariation;
    el.priceDiv.dataset.currentSKU = product.sku;

    // Seta preço
    let price = String(product.price).split(".")
    el.priceDiv.innerHTML = `R$ <span>${price[0]},</span><small>${price[1].padEnd(2, 0)}</small>`

    // Adiciona classe no botão
    this.generatedButtons.forEach(btn => btn.classList.remove("active"))
    btn.classList.add("active")

    if (el.title && product.title) el.title.innerHTML = product.title;
    if (el.model && product.text) el.model.innerText = `Modelo: ${product.text}`;
    if (el.fromPriceDiv && product.from_price) el.fromPriceDiv.innerText = `R$ ${product.from_price.toFixed(2).replace(".", ",")}`;
    if (el.discountDiv && product.from_price && product.from_price > product.price) el.discountDiv.innerText = `${Math.abs(parseInt((product.price / product.from_price - 1) * 100))}% OFF`;
    if (el.img && product.img) {
        el.img.src = product.img
        el.img.classList.remove("update");
        el.img.offsetWidth;
        el.img.classList.add("update");
    }

    let parcelCount = product.parcelCount || 3;
    if (el.parcelDiv && product.parcelCount) el.parcelDiv.innerHTML = `ou ${parcelCount}x de R$ ${(Math.floor(100 * product.price / parcelCount) / 100).toFixed(2)} s/ juros`

    let progressBar = el.progress.querySelector("span");
    if (el.progress && product.progressQty) {
        progressBar.style.width = `${product.progressQty * 2}%`
        el.progressLabel.innerText = product.progressQty
        if (product.progressQty >= 15) {
            progressBar.style.backgroundColor = "#f9d500"
        } else {
            progressBar.style.backgroundColor = "orange"
        }
    }

}

Offer.prototype.mountLink = function () {
    let cartObjsArray = this.getCart(), url, promocode = "", virgula = ",";
    if (!cartObjsArray) {
        return false;
    }
    url = this.cfg.baseURL;
    for (var [index, item] of cartObjsArray.entries()) {
        if (index == cartObjsArray.length - 1) {
            virgula = "";
            if (this.promoCode) {
                promocode = "?promoCode=" + this.promoCode;
            }
        }
        url += item.sku;
        url += ":";
        url += item.qty;
        url += virgula;
        url += promocode;
    }
    return url;
}