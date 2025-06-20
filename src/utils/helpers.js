export const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getCategoryName = (categoryId, categories) => {
  const category = categories.find((cat) => cat.id === categoryId);
  return category ? category.name : categoryId;
};

export const getGenderName = (genderId, genders) => {
  const gender = genders.find((g) => g.id === genderId);
  return gender ? gender.name : genderId;
};

// Discount code model example:
// {
//   code: 'SALE20MAY',
//   createdAt: '2024-05-20T10:00:00.000Z',
//   expiresAt: '2024-06-20T10:00:00.000Z',
//   used: false,
//   discountValue: 1000000 // số tiền giảm hoặc %
// }

export function generateDiscountCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getDiscountCodes(userId) {
  const codes = localStorage.getItem(`discountCodes_${userId}`);
  return codes ? JSON.parse(codes) : [];
}

export function saveDiscountCodes(userId, codes) {
  localStorage.setItem(`discountCodes_${userId}`, JSON.stringify(codes));
}

export function addDiscountCode(userId, discountCode) {
  const codes = getDiscountCodes(userId);
  codes.push(discountCode);
  saveDiscountCodes(userId, codes);
}

export function markDiscountCodeUsed(userId, code) {
  const codes = getDiscountCodes(userId);
  const idx = codes.findIndex(c => c.code === code);
  if (idx !== -1) {
    codes[idx].used = true;
    saveDiscountCodes(userId, codes);
  }
}

export function isDiscountCodeValid(userId, code) {
  const codes = getDiscountCodes(userId);
  const now = new Date();
  const found = codes.find(c => c.code === code && !c.used && new Date(c.expiresAt) > now);
  return !!found;
}

export function getDiscountValue(userId, code) {
  const codes = getDiscountCodes(userId);
  const found = codes.find(c => c.code === code);
  return found ? found.discountValue : 0;
}