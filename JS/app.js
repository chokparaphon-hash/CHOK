const form = document.getElementById("orderForm");
const statusBox = document.getElementById("statusBox");
const submitBtn = document.getElementById("submitBtn");
const displayNameEl = document.getElementById("displayName");
const lineStatusEl = document.getElementById("lineStatus");
const profilePictureEl = document.getElementById("profilePicture");

const productNameEl = document.getElementById("productName");
const productCodeEl = document.getElementById("productCode");
const productCodeDisplayEl = document.getElementById("productCodeDisplay");
const quantityEl = document.getElementById("quantity");
const quantityHintEl = document.getElementById("quantityHint");
const priceDisplayEl = document.getElementById("priceDisplay");
const basePriceEl = document.getElementById("basePrice");
const discountAmountEl = document.getElementById("discountAmount");
const finalPriceEl = document.getElementById("finalPrice");
const priceSubtextEl = document.getElementById("priceSubtext");
const rememberCustomerEl = document.getElementById("rememberCustomer");
const qrPaymentBoxEl = document.getElementById("qrPaymentBox");
const paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');
const customerGroupInputs = document.querySelectorAll('input[name="customerGroup"]');
const catButtons = document.querySelectorAll(".cat-btn");
const productGridEl = document.getElementById("productGrid");
const drawerEl = document.getElementById("orderDrawer");
const backdropEl = document.getElementById("drawerBackdrop");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const editAddressBtn = document.getElementById("editAddressBtn");
const savedNameEl = document.getElementById("savedName");
const savedAddressEl = document.getElementById("savedAddress");
const drawerImageEl = document.getElementById("drawerImage");
const drawerTitleEl = document.getElementById("drawerTitle");
const drawerCodeEl = document.getElementById("drawerCode");
const drawerStartPriceEl = document.getElementById("drawerStartPrice");
const drawerStockEl = document.getElementById("drawerStock");

let LIFF_READY = false;
let CURRENT_CATEGORY = "all";
let CURRENT_PRODUCT = null;
let USE_SHEET_PRODUCTS = false;
let USE_SHEET_PRICE = false;
let SHEET_PRODUCTS = [];

function showStatus(message, type = "ok") {
  statusBox.className = `status show ${type}`;
  statusBox.textContent = message;
}

function clearStatus() {
  statusBox.className = "status";
  statusBox.textContent = "";
}

function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : "";
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toThaiDateTimeString(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

function formatBaht(amount) {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(amount || 0));
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadSavedCustomerProfile() {
  try {
    const raw = localStorage.getItem(CUSTOMER_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function saveCustomerProfile(profile) {
  localStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(profile));
}

function clearCustomerProfile() {
  localStorage.removeItem(CUSTOMER_PROFILE_KEY);
}

function applySavedCustomerProfile() {
  const profile = loadSavedCustomerProfile();
  if (!profile) return;
  if (profile.name) document.getElementById("name").value = profile.name;
  if (profile.address) document.getElementById("address").value = profile.address;
  if (profile.phone) document.getElementById("phone").value = profile.phone;
  if (typeof profile.remember === "boolean") rememberCustomerEl.checked = profile.remember;
  renderSavedAddressCard();
}

function renderSavedAddressCard() {
  const profile = {
    name: document.getElementById("name").value.trim(),
    address: document.getElementById("address").value.trim(),
    phone: document.getElementById("phone").value.trim()
  };

  savedNameEl.textContent = profile.name || "ยังไม่ได้บันทึกชื่อ";
  savedAddressEl.innerHTML = profile.address
    ? `${profile.address}<br>โทร ${profile.phone || "-"}`
    : "ยังไม่ได้บันทึกที่อยู่";
}

function editAddressQuick() {
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const addressInput = document.getElementById("address");

  const nextName = prompt("ชื่อผู้รับ", nameInput.value || "");
  if (nextName === null) return;

  const nextPhone = prompt("เบอร์โทร", phoneInput.value || "");
  if (nextPhone === null) return;

  const nextAddress = prompt("ที่อยู่จัดส่ง", addressInput.value || "");
  if (nextAddress === null) return;

  nameInput.value = nextName.trim();
  phoneInput.value = nextPhone.trim();
  addressInput.value = nextAddress.trim();

  if (rememberCustomerEl.checked) {
    saveCustomerProfile({
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      address: addressInput.value.trim(),
      remember: true
    });
  }

  renderSavedAddressCard();
}

function isLikelyValidLiffId(value) {
  return /^\d{10,}[:-]/.test(String(value || "").trim());
}

function setLineProfile(profile) {
  document.getElementById("lineUserId").value = profile.userId || "";
  document.getElementById("lineDisplayName").value = profile.displayName || "";
  displayNameEl.textContent = profile.displayName || "ลูกค้า LINE";
  lineStatusEl.textContent = "เชื่อมต่อ LINE สำเร็จ";
  if (profile.pictureUrl) {
    profilePictureEl.src = profile.pictureUrl;
  }
}

function setFallbackMode() {
  LIFF_READY = false;
  displayNameEl.textContent = "ลูกค้า MIW";
  lineStatusEl.textContent = "พร้อมกรอกข้อมูลสั่งซื้อ";
  document.getElementById("lineUserId").value = "";
  document.getElementById("lineDisplayName").value = "";
  profilePictureEl.src = "https://cdn-icons-png.flaticon.com/512/2202/2202112.png";
}

async function initLiff() {
  if (!window.liff || !isLikelyValidLiffId(CONFIG.LIFF_ID)) {
    setFallbackMode();
    return;
  }

  try {
    await liff.init({ liffId: CONFIG.LIFF_ID });

    if (!liff.isLoggedIn()) {
      if (liff.isInClient()) {
        liff.login();
        return;
      }
      setFallbackMode();
      return;
    }

    const profile = await liff.getProfile();
    setLineProfile(profile);
    LIFF_READY = true;
  } catch (_) {
    setFallbackMode();
  }
}

function getSelectedPaymentMethod() {
  return getRadioValue("paymentMethod");
}

function getSheetProductByCode(code) {
  return SHEET_PRODUCTS.find(item => item.code === code) || null;
}

function getBasePrice(productCode, quantity, paymentMethod) {
  const qty = String(quantity || "").trim();
  if (!productCode || !qty || !paymentMethod) return null;

  const productTable = PRODUCT_PRICING[productCode];
  if (!productTable) return null;

  const paymentTable = productTable[paymentMethod];
  if (!paymentTable) return null;

  const value = paymentTable[qty];
  return typeof value === "number" ? value : null;
}

function calculateDiscount() {
  return 0;
}

function syncPaymentUi() {
  const paymentMethod = getSelectedPaymentMethod();
  qrPaymentBoxEl.classList.toggle("show", paymentMethod === "โอน");
}

function renderQuantityOptions(code) {
  const currentValue = quantityEl.value;
  const isGallon = GALLON_CODES.includes(code);
  const isSweet = SWEET_CODES.includes(code);

  let quantities = NORMAL_QUANTITIES;
  if (isGallon) quantities = GALLON_QUANTITIES;
  if (isSweet) quantities = SWEET_QUANTITIES;

  quantityEl.innerHTML =
    '<option value="">เลือกจำนวน</option>' +
    quantities.map((qty) => `<option value="${qty}">${qty}</option>`).join("");

  if (quantities.map(String).includes(currentValue)) {
    quantityEl.value = currentValue;
  } else {
    quantityEl.value = "";
  }

  quantityHintEl.textContent = isGallon
    ? "สินค้าแกลลอนเลือกได้เฉพาะ 1-6 เท่านั้น"
    : isSweet
    ? "สินค้าหวานเลือกได้เฉพาะ 50, 100, 150, 200"
    : "สินค้าทั่วไปเลือกได้เฉพาะ 5, 10, 15, 20, 25, 30, 50, 100, 150, 200";
}

async function syncPrice() {
  const code = productCodeEl.value;
  const qty = quantityEl.value;
  const paymentMethod = getSelectedPaymentMethod();
  const customerGroup = getRadioValue("customerGroup");

  if (!code || !qty || !paymentMethod || !customerGroup) {
    basePriceEl.value = "";
    finalPriceEl.value = "";
    discountAmountEl.value = "0";
    priceDisplayEl.textContent = "-";
    priceSubtextEl.textContent = "เลือกสินค้า จำนวน กลุ่มลูกค้า และวิธีชำระเงิน ระบบจะคำนวณให้อัตโนมัติ";
    return;
  }

  if (USE_SHEET_PRICE && CONFIG.APPS_SCRIPT_URL) {
    try {
      const url =
        `${CONFIG.APPS_SCRIPT_URL}?action=price` +
        `&productCode=${encodeURIComponent(code)}` +
        `&quantity=${encodeURIComponent(qty)}` +
        `&paymentMethod=${encodeURIComponent(paymentMethod)}` +
        `&customerGroup=${encodeURIComponent(customerGroup)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data && data.ok) {
        basePriceEl.value = String(data.basePrice ?? "");
        finalPriceEl.value = String(data.finalPrice ?? "");
        discountAmountEl.value = String(data.discountAmount ?? 0);
        priceDisplayEl.textContent = `${formatBaht(data.finalPrice)} บาท`;
        priceSubtextEl.textContent = `ราคาจากชีต ${formatBaht(data.basePrice)} บาท`;
        return;
      }

      priceSubtextEl.textContent = (data && data.message) ? data.message : "ไม่พบราคาในชีต ใช้ราคาสำรองในไฟล์แทน";
    } catch (_) {
      priceSubtextEl.textContent = "ดึงราคาจากชีตไม่สำเร็จ ใช้ราคาสำรองในไฟล์แทน";
    }
  }

  const basePrice = getBasePrice(code, qty, paymentMethod);
  const discount = calculateDiscount();

  if (basePrice === null) {
    basePriceEl.value = "";
    finalPriceEl.value = "";
    discountAmountEl.value = "0";
    priceDisplayEl.textContent = "-";
    priceSubtextEl.textContent = `ยังไม่ได้ตั้งราคา ${paymentMethod} สำหรับสินค้านี้หรือจำนวนนี้`;
    return;
  }

  const finalPrice = Math.max(0, basePrice - discount);
  basePriceEl.value = String(basePrice);
  finalPriceEl.value = String(finalPrice);
  discountAmountEl.value = String(discount);
  priceDisplayEl.textContent = `${formatBaht(finalPrice)} บาท`;
  priceSubtextEl.textContent = `ราคาสำรองในไฟล์ ${formatBaht(basePrice)} บาท`;
}

function syncProductCode() {
  const selectedOption = productNameEl.options[productNameEl.selectedIndex];
  const code = selectedOption ? (selectedOption.dataset.code || "") : "";
  productCodeEl.value = code;
  productCodeDisplayEl.value = code;
  renderQuantityOptions(code);
  syncDrawerProductInfo(code);
  syncPrice();
}

function getStartPrice(code) {
  const sheetProduct = getSheetProductByCode(code);
  if (sheetProduct && sheetProduct.startPrice !== null && sheetProduct.startPrice !== undefined && sheetProduct.startPrice !== "") {
    return `${formatBaht(sheetProduct.startPrice)} บาท`;
  }

  const table = PRODUCT_PRICING[code] && PRODUCT_PRICING[code]["โอน"];
  if (!table) return "-";

  const values = Object.values(table);
  return values.length ? `${formatBaht(values[0])} บาท` : "-";
}

function getStockText(stock) {
  const qty = Number(stock || 0);
  if (qty <= 0) return `<span class="stock-out">สินค้าหมด</span>`;
  if (qty <= 5) return `<span class="stock-low">เหลือ ${qty} ชิ้น</span>`;
  return `คงเหลือ ${qty} ชิ้น`;
}

function getMergedProductMeta(code) {
  const localMeta = PRODUCT_META[code] || {
    code,
    name: code,
    image: "https://cdn-icons-png.flaticon.com/512/590/590836.png",
    stock: 0,
    category: "sweet"
  };

  const sheetMeta = getSheetProductByCode(code);
  if (!sheetMeta) return localMeta;

  return {
    ...localMeta,
    name: sheetMeta.name || localMeta.name,
    code,
    stock: Number(sheetMeta.stock ?? localMeta.stock ?? 0),
    category: sheetMeta.category || localMeta.category,
    startPrice: sheetMeta.startPrice
  };
}

function getRenderableProducts(category = "all") {
  const baseCodes = USE_SHEET_PRODUCTS && SHEET_PRODUCTS.length
    ? SHEET_PRODUCTS.map(item => item.code)
    : PRODUCT_ORDER;

  return baseCodes
    .map(code => getMergedProductMeta(code))
    .filter(Boolean)
    .filter(item => category === "all" ? true : item.category === category);
}

function renderProducts(category = "all") {
  const items = getRenderableProducts(category);

  productGridEl.innerHTML = items.map(item => `
    <div class="product-card">
      <img src="${item.image}" alt="${item.name}">
      <div class="product-name">${item.name}</div>
      <div class="product-code">SKU: ${item.code}</div>
      <div class="product-price">${getStartPrice(item.code)}</div>
      <div class="product-stock">${getStockText(item.stock)}</div>
      <button class="btn btn-green" type="button" onclick="openProductByCode('${item.code}')" ${Number(item.stock) <= 0 ? 'disabled style="opacity:.6;cursor:not-allowed"' : ''}>
        ${Number(item.stock) <= 0 ? 'สินค้าหมด' : 'สั่งซื้อ'}
      </button>
    </div>
  `).join("");
}

function syncDrawerProductInfo(code) {
  const meta = getMergedProductMeta(code);
  if (!meta) return;

  CURRENT_PRODUCT = meta;
  drawerImageEl.src = meta.image;
  drawerTitleEl.textContent = meta.name;
  drawerCodeEl.textContent = meta.code;
  drawerStartPriceEl.textContent = getStartPrice(meta.code);
  drawerStockEl.innerHTML = getStockText(meta.stock);
}

function selectProductInForm(code) {
  const option = [...productNameEl.options].find(opt => opt.dataset.code === code);
  if (!option) return false;
  productNameEl.value = option.value;
  syncProductCode();
  return true;
}

function openProductByCode(code) {
  const meta = getMergedProductMeta(code);
  if (!meta || Number(meta.stock) <= 0) return;
  selectProductInForm(code);
  clearStatus();
  openDrawer();
}

function openDrawer() {
  drawerEl.classList.add("show");
  backdropEl.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  drawerEl.classList.remove("show");
  backdropEl.classList.remove("show");
  document.body.style.overflow = "";
}

function rebuildProductSelect() {
  const items = getRenderableProducts("all");
  const currentCode = productCodeEl.value || productCodeDisplayEl.value || "";

  productNameEl.innerHTML =
    '<option value="">เลือกสินค้า</option>' +
    items.map(item => `<option value="${item.name}" data-code="${item.code}">${item.name}</option>`).join("");

  if (currentCode) {
    const option = [...productNameEl.options].find(opt => opt.dataset.code === currentCode);
    if (option) productNameEl.value = option.value;
  }
}

async function loadProductsFromSheet() {
  if (!CONFIG.APPS_SCRIPT_URL) return;

  try {
    const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=products`);
    const data = await res.json();

    if (!data || !data.ok || !Array.isArray(data.products) || !data.products.length) {
      USE_SHEET_PRODUCTS = false;
      USE_SHEET_PRICE = false;
      return;
    }

    SHEET_PRODUCTS = data.products.map(item => ({
      code: String(item.productCode || item.code || "").trim().toUpperCase(),
      name: String(item.productName || item.name || "").trim(),
      startPrice: Number(item.startRetailTransferPrice ?? item.startWholesaleTransferPrice ?? item.startPrice ?? 0),
      category: inferCategory(String(item.productCode || item.code || "").trim().toUpperCase()),
      stock: Number(item.stock || PRODUCT_META[String(item.productCode || item.code || "").trim().toUpperCase()]?.stock || 0)
    })).filter(item => item.code);

    USE_SHEET_PRODUCTS = SHEET_PRODUCTS.length > 0;
    USE_SHEET_PRICE = true;

    rebuildProductSelect();
    renderProducts(CURRENT_CATEGORY);
  } catch (_) {
    USE_SHEET_PRODUCTS = false;
    USE_SHEET_PRICE = false;
  }
}

function inferCategory(code) {
  if (GALLON_CODES.includes(code)) return "gallon";
  if (CAPSULE_CODES.includes(code)) return "capsule";
  return "sweet";
}

async function postOrder(payload) {
  const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Apps Script returned HTTP ${response.status}`);
  }

  if (!text || text.trim() === "") {
    return { ok: true, message: "ส่งข้อมูลสำเร็จ" };
  }

  let result;
  try {
    result = JSON.parse(text);
  } catch (_) {
    return { ok: true, message: "ส่งข้อมูลสำเร็จ" };
  }

  if (result.ok === false) {
    throw new Error(result.message || "ส่งข้อมูลไม่สำเร็จ");
  }

  return result;
}

async function handleSubmit(event) {
  event.preventDefault();
  clearStatus();

  if (!CONFIG.APPS_SCRIPT_URL) {
    showStatus("ยังไม่ได้ตั้งค่า Apps Script URL", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "กำลังส่งข้อมูล...";

  try {
    const slipFile = document.getElementById("slipFile").files[0];
    let slipBase64 = "";
    let slipFileName = "";

    if (CONFIG.USE_FILE_UPLOAD && slipFile) {
      slipBase64 = await fileToBase64(slipFile);
      slipFileName = slipFile.name;
    }

    const customerProfile = {
      name: document.getElementById("name").value.trim(),
      address: document.getElementById("address").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      remember: rememberCustomerEl.checked
    };

    if (rememberCustomerEl.checked) saveCustomerProfile(customerProfile);
    else clearCustomerProfile();

    const paymentMethod = getSelectedPaymentMethod();
    if (!paymentMethod) throw new Error("กรุณาเลือกวิธีชำระเงิน");
    if (paymentMethod === "โอน" && !slipFile) throw new Error("กรุณาแนบไฟล์สลิปก่อนยืนยันคำสั่งซื้อ");
    if (!productCodeEl.value) throw new Error("กรุณาเลือกสินค้า");
    if (!quantityEl.value) throw new Error("กรุณาเลือกจำนวนสินค้า");
    if (!finalPriceEl.value) throw new Error("ยังไม่สามารถคำนวณราคาได้");

    const selectedMeta = getMergedProductMeta(productCodeEl.value);
    if (selectedMeta && Number(selectedMeta.stock) > 0 && Number(quantityEl.value) > Number(selectedMeta.stock)) {
      throw new Error("จำนวนสินค้ามากกว่าสต๊อกคงเหลือ");
    }

    const payload = {
      date: toThaiDateTimeString(),
      product_name: productNameEl.value,
      product_code: productCodeEl.value,
      quantity: quantityEl.value,
      name: customerProfile.name,
      address: customerProfile.address,
      phone: customerProfile.phone,
      customer_group: getRadioValue("customerGroup"),
      payment_method: paymentMethod,
      slip_file_name: slipFileName,
      slip_base64: slipBase64,
      base_price: basePriceEl.value,
      discount_amount: discountAmountEl.value,
      final_price: finalPriceEl.value,
      line_user_id: document.getElementById("lineUserId").value,
      line_display_name: document.getElementById("lineDisplayName").value,
      liff_ready: LIFF_READY
    };

    const result = await postOrder(payload);
    if (result.ok === false) {
      throw new Error(result.message || "ส่งข้อมูลไม่สำเร็จ");
    }

    showStatus("ส่งคำสั่งซื้อเรียบร้อยแล้ว ระบบส่งต่อไปยังพนักงานแพ็คทันที", "ok");

    if (window.liff && LIFF_READY && liff.isInClient()) {
      await liff.sendMessages([
        {
          type: "text",
          text: `รับออเดอร์เรียบร้อย ✅\nสินค้า: ${payload.product_code}\nจำนวน: ${payload.quantity}\nชื่อ: ${payload.name}\nชำระเงิน: ${payload.payment_method}`
        }
      ]).catch(() => {});
    }

    document.getElementById("slipFile").value = "";
    quantityEl.value = "";
    customerGroupInputs.forEach(i => i.checked = false);
    paymentMethodInputs.forEach(i => i.checked = false);
    basePriceEl.value = "";
    discountAmountEl.value = "0";
    finalPriceEl.value = "";
    priceDisplayEl.textContent = "-";
    priceSubtextEl.textContent = "เลือกสินค้า จำนวน กลุ่มลูกค้า และวิธีชำระเงิน ระบบจะคำนวณให้อัตโนมัติ";
    syncPaymentUi();
    renderSavedAddressCard();

    if (CONFIG.CLOSE_LIFF_AFTER_SUCCESS && window.liff && LIFF_READY && liff.isInClient()) {
      setTimeout(() => liff.closeWindow(), 1400);
    } else {
      setTimeout(() => closeDrawer(), 900);
    }
  } catch (error) {
    showStatus(error.message || "เกิดข้อผิดพลาดระหว่างส่งข้อมูล", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "ยืนยันคำสั่งซื้อ";
  }
}

catButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    catButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    CURRENT_CATEGORY = btn.dataset.category;
    renderProducts(CURRENT_CATEGORY);
  });
});

productNameEl.addEventListener("change", syncProductCode);
quantityEl.addEventListener("change", syncPrice);
paymentMethodInputs.forEach(input => input.addEventListener("change", () => {
  syncPaymentUi();
  syncPrice();
}));
customerGroupInputs.forEach(input => input.addEventListener("change", syncPrice));

document.getElementById("name").addEventListener("input", renderSavedAddressCard);
document.getElementById("phone").addEventListener("input", renderSavedAddressCard);
document.getElementById("address").addEventListener("input", renderSavedAddressCard);

form.addEventListener("submit", handleSubmit);
backdropEl.addEventListener("click", closeDrawer);
closeDrawerBtn.addEventListener("click", closeDrawer);
editAddressBtn.addEventListener("click", editAddressQuick);

window.openProductByCode = openProductByCode;

applySavedCustomerProfile();
renderSavedAddressCard();
rebuildProductSelect();
renderProducts(CURRENT_CATEGORY);
syncProductCode();
syncPaymentUi();
syncPrice();
initLiff();
loadProductsFromSheet();