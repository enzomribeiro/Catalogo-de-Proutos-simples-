document.addEventListener("DOMContentLoaded", () => {

  /*ELEMENTOS DO MODAL DE DETALHES */
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const closeBtn = document.querySelector(".close-btn");

  /*ELEMENTOS DO MODAL DE COMENTÁRIOS */
  const commentNameInput = document.getElementById("comment-name");
  const commentTextInput = document.getElementById("comment-input");
  const commentBtn = document.getElementById("comment-btn");
  const commentsList = document.getElementById("comments-list");

  /*ELEMENTOS DO CARRINHO*/
  const cartIcon = document.getElementById("cart-icon");
  const cartModal = document.getElementById("cart-modal");
  const cartCloseBtn = document.querySelector(".cart-close");
  const cartItemsList = document.getElementById("cart-items-list");
  const cartCount = document.getElementById("cart-count");
  const cartTotalPrice = document.getElementById("cart-total-price");

  /*CARRINHO EM LOCALSTORAGE*/
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    cartCount.textContent = cartItems.length;
    displayCartItems();
    updateCartTotal();
  }

  function displayCartItems() {
    cartItemsList.innerHTML = "";
    cartItems.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `${item.title} — R$ ${item.price}`;
      cartItemsList.appendChild(li);
    });
  }

  function updateCartTotal() {
    const total = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.price.replace("R$", "").replace(",", "."));
    }, 0);

    cartTotalPrice.textContent = total.toFixed(2).replace(".", ",");
  }

  /*ABRIR DETALHES DO PRODUTO */
  let currentProductKey = "";

  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = btn.closest(".product");

      modalImg.src = product.dataset.img;
      modalTitle.innerHTML = product.dataset.title;
      modalDesc.innerHTML = product.dataset.desc;

      // cria botão "Adicionar ao Carrinho" dentro do modal
      createAddToCartButton(product);

      // carregar comentários
      currentProductKey = "comments_" + product.dataset.title.replace(/\s+/g, "_");
      loadComments();

      modal.classList.remove("hidden");
    });
  });

  /*ADICIONAR BOTÃO DE "ADICIONAR AO CARRINHO"*/
  function createAddToCartButton(product) {
    let existingBtn = document.getElementById("add-to-cart-modal-btn");
    if (existingBtn) existingBtn.remove();

    let btn = document.createElement("button");
    btn.id = "add-to-cart-modal-btn";
    btn.classList.add("btn");
    btn.style.background = "#28a745";
    btn.style.marginTop = "1.2rem";
    btn.textContent = "Adicionar ao Carrinho";

    btn.addEventListener("click", () => {
      const title = product.dataset.title;
      const price = product.querySelector("h2:last-of-type").textContent.replace("R$ ", "");
      
      cartItems.push({ title, price });
      updateCart();

      alert("Produto adicionado ao carrinho!");
    });

    modal.querySelector(".modal-content").appendChild(btn);
  }

  /* FECHAR MODAL DE DETALHES*/
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  /*MODAL DO CARRINHO*/
  cartIcon.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
  });

  cartCloseBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
  });

  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.classList.add("hidden");
  });

  /*COMENTÁRIOS*/
  function displayComments(comments) {
    commentsList.innerHTML = "";
    comments.forEach(c => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${escapeHtml(c.name)}:</strong> ${escapeHtml(c.text)}`;
      commentsList.appendChild(li);
    });
  }

  function loadComments() {
    const comments = JSON.parse(localStorage.getItem(currentProductKey)) || [];
    displayComments(comments);
  }

  function addComment(name, text) {
    name = (name || "").trim();
    text = (text || "").trim();

    if (!name || !text) {
      alert("Preencha seu nome e o comentário.");
      return;
    }

    const comments = JSON.parse(localStorage.getItem(currentProductKey)) || [];
    comments.push({ name, text, date: new Date().toISOString() });

    localStorage.setItem(currentProductKey, JSON.stringify(comments));
    displayComments(comments);

    commentNameInput.value = "";
    commentTextInput.value = "";
  }

  commentBtn.addEventListener("click", () => {
    addComment(commentNameInput.value, commentTextInput.value);
  });

  commentTextInput.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      addComment(commentNameInput.value, commentTextInput.value);
    }
  });

  /*PROTEÇÃO CONTRA HTML MALICIOSO*/
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /*INICIALIZANDO O CARRINHO */
  updateCart();
});
