window.CONFIG = {
  LIFF_ID: "2009610281-wwEmfodW",
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbzw0GdpbSqoBhYbPWyts_gae-YQ4Z-8NN_aPIRrFuBB9Qp-IELpZ-CqtquWk-vSCZPVtA/exec",
  CLOSE_LIFF_AFTER_SUCCESS: true,
  USE_FILE_UPLOAD: true
};

window.DN_COD_PRICE = { 5: 320, 10: 620, 15: 900, 20: 1140, 25: 1375, 30: 1590, 50: 2550, 100: 5000, 150: 7500, 200: 9600 };
window.H_COD_PRICE  = { 5: 320, 10: 620, 15: 900, 20: 1140, 25: 1400, 30: 1650, 50: 2750, 100: 5300, 150: 7875, 200: 10400 };
window.T_COD_PRICE  = { 5: 275, 10: 550, 15: 795, 20: 1020, 25: 1250, 30: 1470, 50: 2350, 100: 4600, 150: 6900, 200: 9000 };
window.I_COD_PRICE  = { 5: 275, 10: 550, 15: 795, 20: 1020, 25: 1250, 30: 1470, 50: 2350, 100: 4600, 150: 6900, 200: 9000 };
window.C_COD_PRICE  = { 5: 285, 10: 540, 15: 765, 20: 980, 25: 1200, 30: 1380, 50: 2200, 100: 4100, 150: 6000, 200: 9000 };

window.DN_TRANSFER_PRICE = { 5: 300, 10: 600, 15: 885, 20: 1100, 25: 1325, 30: 1560, 50: 2500, 100: 4900, 150: 7350, 200: 9400 };
window.H_TRANSFER_PRICE  = { 5: 300, 10: 600, 15: 885, 20: 1100, 25: 1375, 30: 1620, 50: 2650, 100: 5250, 150: 7800, 200: 10300 };
window.T_TRANSFER_PRICE  = { 5: 250, 10: 500, 15: 735, 20: 960, 25: 1175, 30: 1395, 50: 2250, 100: 4400, 150: 6600, 200: 8600 };
window.I_TRANSFER_PRICE  = { 5: 250, 10: 500, 15: 735, 20: 960, 25: 1175, 30: 1395, 50: 2250, 100: 4400, 150: 6600, 200: 8600 };
window.C_TRANSFER_PRICE  = { 5: 275, 10: 500, 15: 735, 20: 960, 25: 1150, 30: 1350, 50: 2100, 100: 4000, 150: 5850, 200: 7400 };

window.SWEET_PRICE_SAME = {
  50: 2000,
  100: 3600,
  150: 5400,
  200: 6400
};

window.GALLON_PRICE_SAME = {
  1: 490,
  2: 980,
  3: 1470,
  4: 1960,
  5: 2450,
  6: 2700
};

window.NORMAL_QUANTITIES = [5, 10, 15, 20, 25, 30, 50, 100, 150, 200];
window.SWEET_QUANTITIES = [50, 100, 150, 200];
window.GALLON_QUANTITIES = [1, 2, 3, 4, 5, 6];

window.GALLON_CODES = ["MNG", "MOG", "MLG", "MCG", "MPG"];
window.SWEET_CODES = ["MN", "MO", "ML", "MC", "MP"];
window.CAPSULE_CODES = ["DN", "H", "T", "I", "C"];

window.DEFAULT_DISCOUNT = 0;
window.DISCOUNT_STEP_QTY = 50;
window.DISCOUNT_STEP_AMOUNT = 0;
window.CUSTOMER_PROFILE_KEY = "miw_customer_profile_v1";

window.PRODUCT_PRICING = {
  DN: { "เก็บเงินปลายทาง": { ...window.DN_COD_PRICE }, "โอน": { ...window.DN_TRANSFER_PRICE } },
  H:  { "เก็บเงินปลายทาง": { ...window.H_COD_PRICE },  "โอน": { ...window.H_TRANSFER_PRICE } },
  T:  { "เก็บเงินปลายทาง": { ...window.T_COD_PRICE },  "โอน": { ...window.T_TRANSFER_PRICE } },
  I:  { "เก็บเงินปลายทาง": { ...window.I_COD_PRICE },  "โอน": { ...window.I_TRANSFER_PRICE } },
  C:  { "เก็บเงินปลายทาง": { ...window.C_COD_PRICE },  "โอน": { ...window.C_TRANSFER_PRICE } },

  MN: { "เก็บเงินปลายทาง": { ...window.SWEET_PRICE_SAME }, "โอน": { ...window.SWEET_PRICE_SAME } },
  MO: { "เก็บเงินปลายทาง": { ...window.SWEET_PRICE_SAME }, "โอน": { ...window.SWEET_PRICE_SAME } },
  ML: { "เก็บเงินปลายทาง": { ...window.SWEET_PRICE_SAME }, "โอน": { ...window.SWEET_PRICE_SAME } },
  MC: { "เก็บเงินปลายทาง": { ...window.SWEET_PRICE_SAME }, "โอน": { ...window.SWEET_PRICE_SAME } },
  MP: { "เก็บเงินปลายทาง": { ...window.SWEET_PRICE_SAME }, "โอน": { ...window.SWEET_PRICE_SAME } },

  MNG:{ "เก็บเงินปลายทาง": { ...window.GALLON_PRICE_SAME }, "โอน": { ...window.GALLON_PRICE_SAME } },
  MOG:{ "เก็บเงินปลายทาง": { ...window.GALLON_PRICE_SAME }, "โอน": { ...window.GALLON_PRICE_SAME } },
  MLG:{ "เก็บเงินปลายทาง": { ...window.GALLON_PRICE_SAME }, "โอน": { ...window.GALLON_PRICE_SAME } },
  MCG:{ "เก็บเงินปลายทาง": { ...window.GALLON_PRICE_SAME }, "โอน": { ...window.GALLON_PRICE_SAME } },
  MPG:{ "เก็บเงินปลายทาง": { ...window.GALLON_PRICE_SAME }, "โอน": { ...window.GALLON_PRICE_SAME } }
};

window.PRODUCT_META = {
  DN:  { name:"ฝาแดง", code:"DN", image:"https://i.ibb.co/wNYFfdHh/571561758-122125413194986210-7158405328129896096-n.png", stock:20, category:"capsule" },
  H:   { name:"ฝาเงิน", code:"H", image:"https://i.ibb.co/tp10qqWj/H.png", stock:12, category:"capsule" },
  T:   { name:"ฝาทอง", code:"T", image:"https://i.ibb.co/qFY9rhhc/T.png", stock:30, category:"capsule" },
  I:   { name:"ไอคลอ", code:"I", image:"https://i.ibb.co/VpcFmtNc/I.png", stock:16, category:"capsule" },
  C:   { name:"คลอริมีน", code:"C", image:"https://i.ibb.co/N2pyFQLg/ccc.png", stock:8, category:"capsule" },

  MN:  { name:"น้ำตาลสด", code:"MN", image:"https://i.ibb.co/jP1xqQsY/1.png", stock:180, category:"sweet" },
  MO:  { name:"โรมิโอ", code:"MO", image:"https://i.ibb.co/4RjcyNmV/4.png", stock:125, category:"sweet" },
  ML:  { name:"ลิ้นจี่", code:"ML", image:"https://i.ibb.co/F4pRWvDP/ML.png", stock:95, category:"sweet" },
  MC:  { name:"คาราเมล", code:"MC", image:"https://i.ibb.co/hFt4V18v/MC.png", stock:84, category:"sweet" },
  MP:  { name:"ใบเตย", code:"MP", image:"https://i.ibb.co/mVCbK7qp/1.png", stock:67, category:"sweet" },

  MNG: { name:"น้ำตาลสดแกลลอน", code:"MNG", image:"https://i.ibb.co/398qsBmT/MNG.png", stock:10, category:"gallon" },
  MOG: { name:"โรมิโอแกลลอน", code:"MOG", image:"https://i.ibb.co/F4mj2DnX/MOG6.png", stock:8, category:"gallon" },
  MLG: { name:"ลิ้นจี่แกลลอน", code:"MLG", image:"https://i.ibb.co/PG9vBksv/MLG.png", stock:5, category:"gallon" },
  MCG: { name:"คาราเมลแกลลอน", code:"MCG", image:"https://i.ibb.co/x83SF8Nv/MCG.png", stock:3, category:"gallon" },
  MPG: { name:"ใบเตยแกลลอน", code:"MPG", image:"https://i.ibb.co/rG31hdPt/MPG.png", stock:0, category:"gallon" }
};

window.PRODUCT_ORDER = ["DN","H","T","I","C","MN","MO","ML","MC","MP","MNG","MOG","MLG","MCG","MPG"];
