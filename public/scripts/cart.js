const shoppingCart = (function() {

  let cart = [];



  // sessions save and load cart
  const saveCart = function() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  };

  const loadCart = function() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  };
  if (sessionStorage.getItem("shoppingCart") !== null) {
    loadCart();
  }

  let obj = {};

  // Add to cart
  obj.addItemToCart = function(name, price, count) {
    for (const item in cart) {
      if (cart[item].name === name) {
        cart[item].count ++;
        saveCart();
        return;
      }
    }
    const item = {name, price, count};
    cart.push(item);
    saveCart();
  };
  // Set count from item
  obj.setCountForItem = function(name, count) {
    for (let i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function(name) {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart[item].count --;
        if (cart[item].count === 0) {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  };

  // Remove all items from cart
  obj.removeItemFromCartAll = function(name) {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  // Clear cart
  obj.clearCart = function() {
    cart = [];
    saveCart();
  };

  // Count cart
  obj.totalCount = function() {
    let totalCount = 0;
    for (let item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  };

  // Total cart
  obj.totalCart = function() {
    let totalCart = 0;
    for (let item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  };

  // List cart
  obj.listCart = function() {
    const cartCopy = [];
    for (let i in cart) {
      let item = cart[i];
      itemCopy = {};
      for (p in item) {
        itemCopy[p] = item[p];

      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };
  return obj;
})();



$('.add-to-cart').click(function(event) {
  event.preventDefault();
  const name = $(this).data('name');
  const price = Number($(this).data('price'));
  shoppingCart.addItemToCart(name, price, 1);
  displayCart();
});

// Clear items
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});


function displayCart() {
  const cartArray = shoppingCart.listCart();
  let output = "";
  for (let item in cartArray) {
    output += `<tr>
      <td> ${cartArray[item].name} </td>
      <td> ${cartArray[item].price} </td>
      <input type='number' class='item-count form-control' data-name=' ${cartArray[item].name} ' value='  ${cartArray[item].count}'>
      =
      <td>  ${cartArray[item].total} </td>
       </tr>
  `;}
  $('.show-cart').html(output);
  $('.total-cart').html(shoppingCart.totalCart());
  $('.total-count').html(shoppingCart.totalCount());
}

// Item count input
$('.show-cart').on("change", ".item-count", function(event) {
  const name = $(this).data('name');
  const count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();

