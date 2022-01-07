const menu = new simpleMenu({
    toggleBtn: "header .toggleMenu",
    toggleDiv: "header .menu",
    header: "header"
})

const offer = new Offer({
    elements: {
        inputBox: ".inputBox",
        priceDiv: "p.price",
        model: "#model",
        fromPriceDiv: "#from_price",
        discountDiv: "#price_discount",
        img: "#productImg",
        parcelDiv: "#offer_parcel",
        progress: ".progressDiv",
        progressLabel: "#progressQtyLabel",
        buybtn: "#buybtn",
        title: "#oferta_titulo"
    },
    variations: [
        { title: "Easy Dry™ – Rosa", text: "Rosa", sku: "asdx", price: 59.9, from_price: 79.9, img: "https://storage.googleapis.com/dsvstorage/easydry/prod_rosa.jpg", parcelCount: 3, progressQty: 5 },
        { title: "Easy Dry™ – Roxa", text: "Roxa", sku: "asd4x", price: 59.9, from_price: 79.9, img: "https://storage.googleapis.com/dsvstorage/easydry/prod_roxo.jpg", parcelCount: 3, progressQty: 13 },
        { title: "Easy Dry™ – Prata", text: "Prata", sku: "a3sdxx", price: 59.9, from_price: 79.9, img: "", parcelCount: 3, progressQty: 8, nostock: true },
        { title: "Easy Dry™ – Preta", text: "Preta", sku: "asd4x1", price: 59.9, from_price: 79.9, img: "https://storage.googleapis.com/dsvstorage/easydry/prod_preto.jpg", parcelCount: 3, progressQty: 9 }
    ],
    cfg: {
        baseURL: ""
    }
})

yoloReviews.init();
zoomify.init();
const sq = document.querySelector("#selledQty");

class Animate {
    #elements;
    constructor(options) {
        const { animateClass } = options;
        this.#elements = Array.from(document.querySelectorAll(animateClass));
        let loadFn;

        // Anim lazying
        if ("IntersectionObserver" in window) {
            let animObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        let element = entry.target;
                        element.classList.remove("animRight");
                        animObserver.unobserve(element);
                    }
                });
            }, { rootMargin: "0px 5000px 0px 5000px" });

            this.#elements.forEach(function (image) {
                animObserver.observe(image);
            });

        } else { // IntersectionObserver not supp

            let lazyloadThrottleTimeout;
            loadFn = function () {
                let that = this;

                if (lazyloadThrottleTimeout) {
                    clearTimeout(lazyloadThrottleTimeout);
                }

                lazyloadThrottleTimeout = setTimeout(function () {
                    let scrollTop = window.pageYOffset;
                    that.#elements.forEach(e => {
                        if (that.isInView(e)) {
                            e.classList.remove("animRight");
                            that.#elements = that.#elements.filter(el => el != e);
                        }
                    });
                    if (that.#elements.length == 0) {
                        document.removeEventListener("scroll", loadFn);
                        window.removeEventListener("resize", loadFn);
                        window.removeEventListener("orientationChange", loadFn);
                    }
                }, 5);
            }.bind(this)

            document.addEventListener("scroll", loadFn, { passive: true });
            window.addEventListener("resize", loadFn, { passive: true });
            window.addEventListener("orientationChange", loadFn, { passive: true });
        }

    }

    isInView(e) {
        const rect = e.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }
}

(function incrementor() {
    let start = 1637201567052;
    let now = Date.now();
    let incrementInterval = 60 * 1000 * 30;
    let dif = Math.floor((now - start) / incrementInterval);
    sq.textContent = Number(sq.dataset.value) + Number(dif);
})();

let animations = new Animate({ animateClass: ".animRight" })



// Lazy loading

let lazyloadImages;
if ("IntersectionObserver" in window) {
    lazyloadImages = document.querySelectorAll("img[data-src]");

    let imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let image = entry.target;
                image.src = image.dataset.src;
                observer.unobserve(image);
            }
        });
    }, { rootMargin: "600px 600px 600px 600px" });

    lazyloadImages.forEach(function (image) {
        imageObserver.observe(image);
    });

} else {
    let lazyloadThrottleTimeout;
    lazyloadImages = document.querySelectorAll("[data-src]");

    function lazyload() {
        if (lazyloadThrottleTimeout) {
            clearTimeout(lazyloadThrottleTimeout);
        }

        lazyloadThrottleTimeout = setTimeout(function () {
            let scrollTop = window.pageYOffset;
            lazyloadImages.forEach(function (img) {
                if (img.offsetTop < (window.innerHeight + scrollTop)) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                }
            });
            if (lazyloadImages.length == 0) {
                document.removeEventListener("scroll", lazyload, { passive: true });
                window.removeEventListener("resize", lazyload, { passive: true });
                window.removeEventListener("orientationChange", lazyload, { passive: true });
            }
        }, 20);
    }

    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
}


// Scroller
class Scroller {
    #elements;
    constructor(options) {
        this.#elements = document.querySelectorAll("[data-scroll]");
        this.#elements.forEach(el => {
            el.addEventListener("click", function scrollToTarget() {
                let scrollTarget = document.querySelector(el.dataset.scroll);
                this.doScrollTo(scrollTarget);
                this.clock = setInterval(fn => this.checkScroll(scrollTarget), 150);
                setTimeout(fn => clearTimeout(this.clock), 4000) // Safe disable
            }.bind(this));
        })
    }

    checkScroll(scrollTarget, margin = 0) {
        const pageY = window.pageYOffset || document.documentElement.scrollTop;
        if (pageY === this.scrollingLastPos) {
            if (pageY < scrollTarget.offsetTop + margin - 50) { // 100 = safe margin
                this.doScrollTo(scrollTarget)
            }
            else { clearInterval(this.clock); }
        }
        this.scrollingLastPos = pageY;
    }

    doScrollTo(element, margin = 0) {
        const pos = element.offsetTop + margin;
        window.scroll(0, pos);
    }
}

let scroller = new Scroller();

class InfoDiv {
    #scruct = {};
    constructor(configs) {
        const { struct: cfgstruct, trigger: cfgtrigger } = configs;
        const triggers = document.querySelectorAll(cfgtrigger);

        window.addEventListener("hashchange", this.checkHash.bind(this));

        for (let key in cfgstruct) {
            let element = document.querySelector(cfgstruct[key]);
            if (element) this.#scruct[key] = element;
        }

        for (let el of triggers) {
            el.addEventListener("click", e => { this.manageContent({ contentId: e.target.dataset?.info }); this.showInfo() })
        }

        if (this.#scruct.close) this.#scruct.close.addEventListener("click", fn => this.hideInfo())
    }

    showInfo() {
        this.#scruct.root.classList.add("show_info");
        document.body.classList.add("locked");
        document.location.hash = "#info";
    }

    hideInfo() {
        this.#scruct.root.classList.remove("show_info");
        document.body.classList.remove("locked");
        document.location.hash = "#noinfo";
    }

    checkHash(e) {
        if (e.oldURL.includes("#info")) {
            this.hideInfo();
        };
    }

    loadContent(title, content) {
        this.#scruct.title.innerHTML = title;
        this.#scruct.content.innerHTML = content;
        this.#scruct.content.scroll(0, 0);
    }

    manageContent(options) {
        const thelogo = `<div style="display:flex; align-items:center;"><img src="./assets/img/logo.svg" height="30"><span
        style="font-size: 18px; margin-left: 8px;font-weight: bold">`;
        if (options.contentId) {
            switch (options.contentId) {
                case "pp":
                    this.loadContent(`${thelogo}Política de Privacidade</span></div>`, contents.pol_privacidade);
                    break;
                case "pt":
                    this.loadContent(`${thelogo}Política de Troca</span></div>`, contents.pol_devolucao);
                    break;
                case "pf":
                    this.loadContent(`${thelogo}Perguntas frequentes</span></div>`, contents.pf);
                    setAccords();
                    break;
            }
        }
    }
}

const infodiv = new InfoDiv({
    struct: {
        root: ".infodiv",
        close: ".id_close",
        title: ".id_title",
        content: ".id_content_html"
    },
    trigger: "[data-info]"
})

function setAccords() {
    let dsv_acc = document.querySelectorAll(".dlv_accord");
    dsv_acc.forEach(function (acc) {
        if (acc.dataset.loaded == "true") return;
        acc.dataset.loaded = true;
        acc.addEventListener("click", function () {
            let activeAcc = document.querySelector(".dlv_accord.active");
            if (activeAcc && activeAcc != acc) {
                activeAcc.classList.remove("active")
                activeAcc.nextElementSibling.style.maxHeight = null; // panel close
            }

            let panel = acc.nextElementSibling;
            acc.classList.toggle("active");
            panel.classList.toggle("active");
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                let rect = acc.getBoundingClientRect();
                panel.style.maxHeight = panel.scrollHeight + "px";
                setTimeout(fn => {
                    if (rect.top / window.innerHeight > .4 || rect.top / window.innerHeight < 0)
                        acc.scrollIntoView()
                }, 300);
            }

        });
    });
}

setAccords();

class Cart {
    #configs = {};
    constructor(options = {}) {
        const host = window.location.hostname.replace("www.", "");
        const { checkoutBaseURL = `https://seguro.${host}/`, promoCode } = options;
        this.#configs.checkoutBaseURL = checkoutBaseURL;
        this.#configs.promoCode = promoCode;
    }

    mount(sku, promocode) {
        // promocode ? promocode = `&promoCode=${promocode}` : null
        let url = "", virgula = ",";
        sku = typeof sku != "object" ? [sku] : sku;
        url += this.#configs.checkoutBaseURL;

        sku.forEach(k => {
            typeof k === "object" ? url += k?.sku : url += k;
            url += ":";
            typeof k === "object" ? url += k?.qty || 1 : url += 1;
            url += virgula;
        })
        // if (promocode) url += promocode;
        if (url.endsWith(',')) url = url.slice(0, -1)
        console.log(url)
        return url
    }
}

let cart = new Cart();

offer.elements.buybtn.addEventListener("click", () => {
    window.location.href = cart.mount(offer.selectedVariation.sku);
});

function createPlaceholderCanvas(width, height, color = "#aaa") {
    const element = document.createElement("canvas");
    const context = element.getContext("2d");

    element.width = width;
    element.height = height;

    // Fill in the background
    context.fillStyle = color;
    context.fillRect(0, 0, element.width, element.height);

    return element.toDataURL("image/jpeg", 0.1);
}

document.querySelectorAll("img[data-w][data-h]:not([src*=''])").forEach(i => {
    if (!i.src) {
        i.src = createPlaceholderCanvas(i.dataset.w, i.dataset.h);
    }
});

const openLink = (link, newtab = false) => newtab ? window.open(link, "_blank").focus() : window.location.href = link;