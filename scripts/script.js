const orderModalOpenProd = document.querySelector('.order-modal_btn');
const orderModalList = document.querySelector('.order-modal_list');
const cartProductsList = document.querySelector('.cart');

let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');
let productArray = [];

menu.onclick = () =>{
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

window.onscroll = () =>{
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
}

document.querySelector('#search-icon').onclick = () =>{
    document.querySelector('#search-form').classList.toggle('active');
}

document.querySelector('#close').onclick = () =>{
    document.querySelector('#search-form').classList.remove('active');
}


var swiper = new Swiper(".home-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
    delay: 4500,
    disableOnInteraction: false,
    },
    pagination: {
    el: ".swiper-pagination",
    clickable: true,
    },
    loop:true,
});

var swiper = new Swiper(".review-slider", {
    spaceBetween: 20,
    centeredSlides: true,
    autoplay: {
    delay: 7500,
    disableOnInteraction: false,
    },
    loop:true,
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        640: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});


let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

// Открываем корзину при клике на иконку корзины
cartIcon.onclick = () => {
    cart.classList.add("active");
}

// Закрываем корзину при клике на кнопку закрытия
closeCart.onclick = () => {
    cart.classList.remove("active");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    loadCartFromLocalStorage();

    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }

    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    var addCartButtons = document.getElementsByClassName("btn");
    for (var i = 0; i < addCartButtons.length; i++) {
        var button = addCartButtons[i];
        button.addEventListener("click", addCartClicked);
    }

    document.getElementsByClassName("btn-buy")[0].addEventListener("click", buyButtonClicked);
}

function buyButtonClicked() {
    alert('Спасибо за заказ');
    var cartContent = document.getElementsByClassName("cart-content")[0];
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }
    updateTotal();
    saveCartToLocalStorage();
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartToLocalStorage();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartToLocalStorage();
}

function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.parentElement.parentElement;
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src;
    addProductToCart(title, price, productImg);
    updateTotal();
    saveCartToLocalStorage();
}

function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName('cart-content')[0];
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title');

    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].textContent.trim() === title.trim()) {
            alert("Ты уже заказал этот товар");
            return;
        }
    }

    var cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class='bx bxs-trash-alt cart-remove'></i>
    `;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);

    cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
    cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged);

    saveCartToLocalStorage();
}

function updateTotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace("₽", ""));
        var quantity = quantityElement.value;
        total += price * quantity;
    }

    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("total-price")[0].innerText = "₽" + total;
}

function saveCartToLocalStorage() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems = [];

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var title = cartBox.getElementsByClassName('cart-product-title')[0].innerText;
        var price = cartBox.getElementsByClassName('cart-price')[0].innerText;
        var productImg = cartBox.getElementsByClassName('cart-img')[0].src;
        var quantity = cartBox.getElementsByClassName('cart-quantity')[0].value;

        cartItems.push({
            title: title,
            price: price,
            productImg: productImg,
            quantity: quantity
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCartFromLocalStorage() {
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    for (var i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];
        addProductToCart(item.title, item.price, item.productImg);
        var cartContent = document.getElementsByClassName('cart-content')[0];
        var cartBoxes = cartContent.getElementsByClassName('cart-box');
        var lastCartBox = cartBoxes[cartBoxes.length - 1];
        lastCartBox.getElementsByClassName('cart-quantity')[0].value = item.quantity;
    }

    updateTotal();
}


let flag = 0;
orderModalOpenProd.addEventListener('click', (e) => {
    if (flag == 0) {
        orderModalOpenProd.classList.add('open');
        orderModalList.style.display ='block';
        flag = 1;
    } else {
        orderModalOpenProd.classList.remove('open');
        orderModalList.style.display ='none';
        flag = 0;
    }

}); 

function generateOrderNumber() {
    return 'ORD-' + Math.floor(Math.random() * 1000000);
}

document.querySelector('.btn-buy').addEventListener('click', () => {
    const orderModalList = document.querySelector('.order-modal_list');
    const orderModalQuantity = document.querySelector('.order-modal_quantity span');
    const orderModalSumm = document.querySelector('.order-modal_summ span');
    orderModalList.innerHTML = ""; // Очищаем содержимое модального окна перед заполнением

    // Получаем содержимое корзины
    var cartContent = document.querySelector('.cart-content');
    var cartBoxes = cartContent.querySelectorAll('.cart-box');

    let totalQuantity = 0;
    let totalPrice = 0;

    // Генерируем уникальный номер заказа
    const orderNumber = generateOrderNumber();

    // Очищаем массив продуктов перед заполнением
    productArray = [];

    // Проходимся по товарам в корзине и добавляем их в модальное окно
    cartBoxes.forEach(cartBox => {
        var title = cartBox.querySelector('.cart-product-title').innerText;
        var price = parseFloat(cartBox.querySelector('.cart-price').innerText.replace("₽", ""));
        var productImg = cartBox.querySelector('.cart-img').src;
        var quantity = cartBox.querySelector('.cart-quantity').value;

        var modalProductHTML = generateModalProduct(productImg, title, price, quantity);
        orderModalList.insertAdjacentHTML('beforeend', modalProductHTML);

        totalQuantity += parseInt(quantity);
        totalPrice += price * quantity;

        let obj = {
            title: title,
            price: price,
            quantity: quantity,
            orderNumber: orderNumber // Добавляем номер заказа
        };
        productArray.push(obj);
    });

    orderModalQuantity.innerText = `${totalQuantity} шт`;
    orderModalSumm.innerText = `${totalPrice.toFixed(2)} ₽`;

    // Добавляем номер заказа в модальное окно
    orderModalList.insertAdjacentHTML('beforeend', `<li class="order-modal_item"><span>Номер заказа: ${orderNumber}</span></li>`);

    // Отображаем номер заказа клиенту с помощью сообщения
    alert(`Ваш номер заказа: ${orderNumber}`);
});



// Функция для создания HTML-разметки товара в модальном окне
function generateModalProduct(img, title, price, quantity) {
    return `
    <li class="order-modal_item">
        <article class="order-modal_product order-product">
            <img src="${img}" alt="" class="order-product_img">
            <div class="order-product_text">
                <h3 class="order-product_title">${title}</h3>
                <span class="order-product_price">${price} ₽</span>
                <span class="order-product_quantity">Кол-во: ${quantity}</span>
            </div>
        </article>
    </li>
    `;
}




const modal = new Modal({
	isOpen: (modal) => {
		console.log('opened');
	},
	isClose: () => {
		console.log('closed');
	},
});


document.querySelector('.order').addEventListener('submit', (e) => {
    e.preventDefault();
    let self = e.currentTarget;
    let formData = new FormData();
    let name = self.querySelector('[name="Имя"]').value;
    let tel = self.querySelector('[name="Телефон"]').value;
    let mail = self.querySelector('[name="Email"]').value;

    // Используем orderNumber из productArray или генерируем новый, если массив пуст
    const orderNumber = productArray.length > 0 ? productArray[0].orderNumber : generateOrderNumber();

    // Включаем номер заказа в массив товаров
    productArray.forEach(product => product.orderNumber = orderNumber);

    formData.append('Товары', JSON.stringify(productArray));
    formData.append('Имя', name);
    formData.append('Телефон', tel);
    formData.append('Email', mail);
    formData.append('Номер заказа', orderNumber); // Добавляем номер заказа в formData

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Отправлено');
            }
        }
    }

    xhr.open('POST', 'mail.php', true);
    xhr.send(formData);

    self.reset();
});