let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');
let filter = document.querySelector('.filter');
let count = document.getElementById('count');
iconCart.addEventListener('click', () => {
    cart.classList.toggle(`active`)
})
close.addEventListener('click', () => {
    cart.classList.remove(`active`)
});

let products = null;

fetch('http://localhost:3000/foodStorage')
    .then(res => res.json())
    .then(data => {
        // console.log(data)
        products = data;
        addDataToHtml();

        filter.addEventListener('submit', function (e) {
            e.preventDefault();
            let valueFilter = e.target;
            products = data.filter(item => {

                if (valueFilter.category.value != '') {
                    if (item.category != valueFilter.category.value) {
                        return false;
                    }
                }

                if (valueFilter.kitchen.value != '') {
                    if (item.kitchen != valueFilter.kitchen.value) {
                        return false;
                    }
                }

                if (valueFilter.minPrice.value != '') {
                    if (item.price < valueFilter.minPrice.value) {
                        return false;
                    }
                }

                if (valueFilter.maxPrice.value != '') {
                    if (item.price > valueFilter.maxPrice.value) {
                        return false;
                    }
                }


                return true;
            })

            addDataToHtml(products);

        })
    })


function addDataToHtml() {
    let listProductHtml = document.querySelector('.listProduct');
    count.innerText = products.length;
    listProductHtml.innerHTML = '';
    products.sort(() => {
        return (0.5 - Math.random())
    })

    // add new datas
    if (products != null) {
        products.forEach(el => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML =
                `<img src="${el.img}" alt="">
            <h2>${el.name}</h2>
            <div class="desc">${el.description}</div>
            <div class="price">${el.price}$</div>
            <button onclick="addCart(${el.id})">Add To Cart</button>`;
            listProductHtml.appendChild(newProduct);

        });
    }
}
let listCart = [];

function checkCart() {
    let cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
    } else {
        listCart = [];
    }
}
checkCart();

function addCart($idProduct) {
    let productCopy = JSON.parse(JSON.stringify(products));
    // Если продукта нету в корзинке
    if (!listCart[$idProduct]) {
        let dataProduct = productCopy.filter(
            product => product.id == $idProduct
        )[0];
        // Добавление продукта в корзинку
        listCart[$idProduct] = dataProduct;
        listCart[$idProduct].quantity = 1;
    } else {
        listCart[$idProduct].quantity++;
    }
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    addCartToHtml()
};
addCartToHtml();
function addCartToHtml() {
    // очистка даты
    let listCartHtml = document.querySelector('.listCart');
    listCartHtml.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    if (listCart) {
        listCart.forEach(el => {
            if (el) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML =
                    `
                <img src="${el.img}">
                <div class="content">
                    <div class="name">${el.name}</div>
                    <div class="price">${el.price}</div>
                </div>
                <div class="quantity">
                    <button class='cart-btn' onClick="changeQuantity(${el.id}, '-')">-</button>
                    <span class="value">${el.quantity}</span>
                    <button class='cart-btn' onClick="changeQuantity(${el.id}, '+')">+</button>
                </div>`

                listCartHtml.appendChild(newCart);
                totalQuantity = totalQuantity + el.quantity;
            }
        });
    }
    totalHTML.innerText = totalQuantity;
};
function changeQuantity($idProduct, $type) {
    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;

            // если значение равно 0,то удали его
            if (listCart[$idProduct].quantity <= 0) {
                delete listCart[$idProduct];
            }
            break;


        default:
            break;
    }
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

    addCartToHtml();
}
