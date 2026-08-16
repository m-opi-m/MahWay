/**
 * MahWay - سكريبت الباك إند (طلبات الشحن + التقييمات + تتبع الشحنات + بوابة الموظفين)
 * -----------------------------------------------------------------------------
 * لازم تستبدل الكود القديم في مشروع Apps Script بتاعك بالكود ده بالكامل،
 * بعدين تعمل Deploy > Manage deployments > تعدّل الـ deployment الموجود
 * وتختار "New version" (مش New deployment) عشان الرابط في script.js يفضل
 * شغال زي ما هو من غير ما تغيره.
 *
 * الشيتات اللي بيستخدمها السكريبت (بيتعملوا تلقائي أول مرة لو مش موجودين):
 *  - Orders          : طلبات الشحن من الفورم
 *  - Ratings         : تقييمات العملاء
 *  - Shipments       : الشحنات وحالتها (ده اللي بيتربط بيه التتبع)
 *  - Employees       : حسابات الموظفين (بريد + باسورد مُشفّر + أدوار + تليفون + صورة + أيام عمل)
 *  - Sessions        : جلسات الدخول (توكن مؤقت لكل موظف بعد تسجيل الدخول)
 *  - PasswordResets  : أكواد "نسيت كلمة المرور" المؤقتة (بتتحذف/تنتهي تلقائي)
 *  - AuditLog        : سجل تفصيلي لكل حركة استلام/تسليم/نقل حصلت على أي شحنة
 *
 * ملحوظة: أي شيت من القديم (Orders / Shipments) هيترقّى تلقائيًا لما السكريبت
 * الجديد يشتغل - بيضيف الأعمدة الناقصة (الموقع، أكواد التأكيد...) من غير ما
 * يلمس أي بيانات موجودة قبل كده. مفيش داعي تعمل حاجة يدوي في الشيتات.
 *
 * ============================================================================
 * نظام تأكيد الاستلام/التسليم بالأكواد (Handoff Confirmation Codes)
 * ============================================================================
 * أي انتقال للشحنة من مرحلة لل مرحلة اللي بعدها في SHIPMENT_STATUSES بقى
 * لازم يعدي بخطوتين:
 *  1) generateHandoffCode: الموظف اللي شحنته حاليًا في مرحلته (حسب دوره في
 *     ROLES_REGISTRY) بيولّد كود من 6 أرقام وبياخده فيزيائيًا للطرف التاني.
 *  2) confirmHandoffCode (لموظف) أو confirmDelivery (للعميل، من غير تسجيل
 *     دخول، للمرحلة اللي عليها customerConfirms:true) بيدخل الكود، والنظام
 *     بيتأكد منه ويكمّل النقل ويسجّله في AuditLog.
 * مفيش تحديث مباشر للحالة من غير الكود ده خالص - النظام رافض أي محاولة تانية.
 * إضافة مرحلة جديدة مستقبلاً = إضافة entry في SHIPMENT_STATUSES + تحديد دورها
 * في ROLES_REGISTRY بس، والباقي كله بيشتغل تلقائي.
 *
 * ============================================================================
 * نظام الأدوار والصلاحيات (Dynamic Roles & Permissions)
 * ============================================================================
 * كل موظف ممكن يكون ليه أكتر من دور في نفس الوقت (مثلاً: مخازن + موصل)،
 * وصلاحياته النهائية = اتحاد (union) صلاحيات كل الأدوار المحددة له.
 *
 * كل الأدوار وصلاحياتها متعرّفة في مكان واحد بس: ROLES_REGISTRY تحت.
 * عشان تضيف دور جديد في المستقبل، كل اللي محتاجه إنك تضيف بلوك جديد جوا
 * ROLES_REGISTRY بالشكل ده:
 *
 *   my_new_role: {
 *     label: 'اسم الدور اللي هيظهر للـ HR وللموظف',
 *     permissions: {
 *       shipmentStatuses: ['status_key_1', 'status_key_2'], // الحالات اللي الدور ده يقدر يحدّثها
 *       manageEmployees: false // لو true، الدور ده بيدي صلاحية إدارة الموظفين (زي HR)
 *     }
 *   }
 *
 * مفيش أي مكان تاني في السكريبت محتاج تلمسه: تسجيل الدخول، عرض الشحنات
 * المسموح تحديثها، صفحة الـ HR، كل حاجة بتقرأ من ROLES_REGISTRY تلقائيًا.
 *
 * ⚠️ مهم: عشان تضيف أول موظف (أو موظف الـ HR) يدويًا من الشيت مباشرة، لازم الأول
 * تجيب نسخة مشفّرة (hash) من الباسورد. افتح في المتصفح الرابط ده (غيّر
 * PASSWORD_HERE بالباسورد اللي عايزه):
 *   YOUR_SCRIPT_URL?action=hashPassword&password=PASSWORD_HERE
 * هياخدلك كود طويل، انسخه وحطه في عمود "PasswordHash" في شيت Employees.
 * وبعدين ضيف صف جديد في شيت Employees بالترتيب ده:
 *   Email | PasswordHash | Name | Roles | Phone | Active | PhotoUrl | WorkingDays
 * Roles ممكن يكون دور واحد أو أكتر مفصولين بفاصلة، مثال: warehouse,distributor
 * ولازم كل دور يكون من الأدوار المعرّفة في ROLES_REGISTRY تحت.
 * Active لازم تكون: TRUE
 * WorkingDays رقم عدد أيام العمل الأسبوعية للموظف (اختياري، ممكن تسيبه فاضي)
 * (PhotoUrl ممكن تسيبه فاضي؛ موظف الـ HR هيقدر يضيف باقي الموظفين وصورهم من
 * البوابة نفسها بعد كده من غير ما يلمس الشيت خالص)
 */

const NOTIFY_EMAIL = 'mahway.contact@gmail.com';
const ORDERS_SHEET_NAME = 'Orders';
const RATINGS_SHEET_NAME = 'Ratings';
const SHIPMENTS_SHEET_NAME = 'Shipments';
const EMPLOYEES_SHEET_NAME = 'Employees';
const SESSIONS_SHEET_NAME = 'Sessions';
const PASSWORD_RESETS_SHEET_NAME = 'PasswordResets';
const AUDIT_LOG_SHEET_NAME = 'AuditLog';
const SPREADSHEET_ID = '16EkrGhXzN4JUfp2KzQwUAgYCzOsOErWB52Mu3T95fhw';
const SESSION_DURATION_HOURS = 12;
const RESET_CODE_EXPIRY_MINUTES = 15;
const PHOTOS_DRIVE_FOLDER_NAME = 'MahWay - صور الموظفين';
// مدة صلاحية كود تأكيد الاستلام/التسليم (بالساعات) قبل ما ينتهي ولازم يتولّد كود جديد
const HANDOFF_CODE_EXPIRY_HOURS = 48;

// ============================================================================
// محافظة المخزن الفعلي (شحن محلي داخل نفس المحافظة)
// ============================================================================
// لو محافظة العميل (المُختارة في فورم الطلب) هي نفس المحافظة دي، الشحنة
// بتتحول لما توصل المخزن ("in_warehouse") على طول لـ"في يد الموزع"
// ("with_distributor") من غير ما تعدي على "في الطريق لنقطة التوزيع" أو
// "وصلت نقطة التوزيع" - لأنها شحنة محلية مش محتاجة تتنقل لمحافظة تانية.
// غيّر القيمة دي لو المخزن في محافظة مختلفة.
const WAREHOUSE_GOVERNORATE = 'القاهرة';

// حالات الشحنة المسموح بيها + النص اللي بيتعرض للعميل
// ============================================================================
// النظام قابل للتوسع بالكامل: عشان تضيف مرحلة جديدة في المستقبل (مثلاً مرحلة
// جمرك، أو فرع فرعي جديد) كل اللي محتاجه:
//  1) ضيف status key جديد هنا بترتيب (order) مناسب بين المرحلتين اللي هي جواهم.
//  2) حدد مين الدور (أو الأدوار) المسؤولة عنها في ROLES_REGISTRY تحت
//     (shipmentStatuses)، ودي هي نفسها اللي هتحدد مين يقدر "يستلم" الشحنة
//     في المرحلة دي بكود التأكيد تلقائيًا - مفيش أي كود تاني محتاج تعديل.
//  3) لو المرحلة الأخيرة محتاجة تأكيد من العميل نفسه (مش موظف)، حط
//     customerConfirms: true (زي "delivered" تحت).
// ============================================================================
const SHIPMENT_STATUSES = {
  received:               { ar: 'تم استلام الطلب', order: 1 },
  // العميل نفسه بيدخل الكود ده (من صفحة التتبع العامة) عشان يأكد إن اللي واقف
  // قدامه فعلاً هو المستلم المسؤول، وإنه فعلاً سلّمه الشحنة - مفيش نقل مباشر
  // من غير الخطوة دي
  picked_up:               { ar: 'تم استلام الشحنة من العميل', order: 2, customerConfirms: true },
  in_warehouse:            { ar: 'وصلت المخزن', order: 3 },
  to_distribution_point:   { ar: 'في الطريق لنقطة التوزيع', order: 4 },
  in_distribution_center:  { ar: 'وصلت نقطة التوزيع', order: 5 },
  with_distributor:        { ar: 'في يد الموزع', order: 6 },
  delivered:               { ar: 'تم التسليم للعميل', order: 7, customerConfirms: true }
};

/**
 * ============================================================================
 * مصدر الحقيقة الوحيد لكل الأدوار وصلاحياتها.
 * ============================================================================
 * ضيف/عدّل/احذف أي دور من هنا بس، والنظام كله هيتحدّث تلقائي:
 * - صفحة الـ HR هتعرض الدور الجديد كخيار جاهز للتحديد لأي موظف.
 * - أي موظف عليه الدور ده هياخد صلاحياته تلقائي من غير أي تعديل تاني.
 * - تعديل صلاحيات دور موجود بيتطبّق فورًا على كل الموظفين اللي عندهم الدور ده.
 */
const ROLES_REGISTRY = {
  warehouse: {
    label: 'مخازن',
    icon: 'fa-warehouse',
    permissions: {
      // موظف المخازن بيدخل الكود اللي أخده من مندوب الشحن، والشحنة بتتحول
      // على طول لـ"وصلت المخزن" - مفيش مرحلة وسيطة "في الطريق للمخازن"
      shipmentStatuses: ['in_warehouse']
    }
  },
  receiver: {
    label: 'مندوب شحن',
    icon: 'fa-motorcycle',
    permissions: {
      // مندوب الشحن هو المسؤول عن رحلة الشحنة كلها برا المخازن ونقاط التوزيع:
      //  'received' + 'picked_up'         -> استلام الشحنة من العميل في البداية
      //  'to_distribution_point'          -> نقل الشحنة لنقطة التوزيع
      //  'with_distributor' + 'delivered' -> تسليم الشحنة للعميل في النهاية
      shipmentStatuses: ['received', 'picked_up', 'to_distribution_point', 'with_distributor', 'delivered']
    }
  },
  distribution_center: {
    label: 'مركز توزيع',
    icon: 'fa-building-circle-check',
    permissions: {
      shipmentStatuses: ['in_distribution_center']
    }
  },
  hr: {
    label: 'موارد بشرية (HR)',
    icon: 'fa-users-gear',
    permissions: {
      shipmentStatuses: [],
      // الدور ده بيدي صلاحية إدارة بيانات وأدوار كل الموظفين
      manageEmployees: true
    }
  }
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    switch (data.type) {
      case 'rating':
        return handleRatingSubmit(data);
      case 'changePassword':
        return jsonResponse(handleChangePassword(data));
      case 'forgotPasswordRequest':
        return jsonResponse(handleForgotPasswordRequest(data));
      case 'forgotPasswordVerify':
        return jsonResponse(handleForgotPasswordVerify(data));
      case 'addEmployee':
        return jsonResponse(handleAddEmployee(data));
      case 'updateEmployee':
        return jsonResponse(handleUpdateEmployee(data));
      case 'deleteEmployee':
        return jsonResponse(handleDeleteEmployee(data));
      case 'generateHandoffCode':
        return jsonResponse(handleGenerateHandoffCode(data));
      case 'confirmHandoffCode':
        return jsonResponse(handleConfirmHandoffCode(data));
      case 'confirmDelivery':
        return jsonResponse(handleConfirmDelivery(data));
      default:
        // الفورم بتاع طلبات الشحن مش بيبعت "type"، فده السلوك الافتراضي زي ما هو
        return handleOrderSubmit(data);
    }

  } catch (err) {
    return jsonResponse({ result: 'error', message: err.toString() });
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'ratingStats') {
      return jsonResponse(getRatingStats());
    }
    if (action === 'track') {
      return jsonResponse(trackShipment(e.parameter.code));
    }
    if (action === 'login') {
      return jsonResponse(handleLogin(e.parameter.email, e.parameter.passwordHash));
    }
    if (action === 'getShipments') {
      return jsonResponse(getShipmentsForEmployee(e.parameter.token));
    }
    if (action === 'updateShipment') {
      return jsonResponse(updateShipmentStatus(e.parameter.token, e.parameter.code, e.parameter.status));
    }
    if (action === 'hashPassword') {
      return jsonResponse({ result: 'success', hash: hashText(e.parameter.password || '') });
    }
    if (action === 'logout') {
      return jsonResponse(handleLogout(e.parameter.token));
    }
    if (action === 'listEmployees') {
      return jsonResponse(listEmployeesForHr(e.parameter.token));
    }

    return jsonResponse({ result: 'error', message: 'unknown action' });
  } catch (err) {
    return jsonResponse({ result: 'error', message: err.toString() });
  }
}

// ---------- طلبات الشحن ----------
function handleOrderSubmit(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(ORDERS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(ORDERS_SHEET_NAME);
    sheet.appendRow([
      'التاريخ', 'الاسم', 'الهاتف', 'البريد الإلكتروني', 'الوزن (كجم)',
      'رابط المنتج', 'نوع الشحن', 'مسار الشحن', 'ملاحظات', 'كود التتبع',
      'خط العرض (Lat)', 'خط الطول (Lng)', 'المحافظة'
    ]);
  }
  ensureSheetHasColumns(sheet, ['التاريخ', 'الاسم', 'الهاتف', 'البريد الإلكتروني', 'الوزن (كجم)',
    'رابط المنتج', 'نوع الشحن', 'مسار الشحن', 'ملاحظات', 'كود التتبع',
    'خط العرض (Lat)', 'خط الطول (Lng)', 'المحافظة']);

  // كود التتبع بيتبعت جاهز من الموقع (اتولّد عند العميل وقت الإرسال)
  const trackingCode = (data.trackingCode || generateTrackingCode()).toUpperCase();
  const lat = (typeof data.lat !== 'undefined' && data.lat !== null && data.lat !== '') ? Number(data.lat) : '';
  const lng = (typeof data.lng !== 'undefined' && data.lng !== null && data.lng !== '') ? Number(data.lng) : '';

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.phone || '',
    data.email || '',
    data.weight || '',
    data.productLink || '',
    data.shippingType || '',
    data.shippingRoute || '',
    data.notes || '',
    trackingCode,
    lat,
    lng,
    data.governorate || ''
  ]);

  createShipmentRecord(trackingCode, data.name || '', data.phone || '', lat, lng, data.governorate || '');

  const subject = 'طلب شحن جديد من موقع MahWay - ' + (data.name || 'بدون اسم');
  const body =
    'وصل طلب شحن جديد من الموقع:\n\n' +
    'الاسم: ' + (data.name || '-') + '\n' +
    'الهاتف: ' + (data.phone || '-') + '\n' +
    'البريد الإلكتروني: ' + (data.email || '-') + '\n' +
    'الوزن: ' + (data.weight || '-') + ' كجم\n' +
    'رابط المنتج: ' + (data.productLink || '-') + '\n' +
    'نوع الشحن: ' + (data.shippingType || '-') + '\n' +
    'مسار الشحن: ' + (data.shippingRoute || '-') + '\n' +
    'المحافظة: ' + (data.governorate || '-') + '\n' +
    'ملاحظات: ' + (data.notes || '-') + '\n' +
    'كود التتبع: ' + trackingCode + '\n';

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

  // لو العميل كتب بريده الإلكتروني، ابعتله كود التتبع في إيميل منفصل
  if (data.email && isValidEmail(data.email)) {
    sendTrackingCodeEmail(data.email, data.name || '', trackingCode);
  }

  return jsonResponse({ result: 'success', trackingCode: trackingCode });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sendTrackingCodeEmail(customerEmail, customerName, trackingCode) {
  const subject = 'كود تتبع شحنتك في MahWay: ' + trackingCode;
  const body =
    'أهلاً ' + (customerName || '') + '،\n\n' +
    'شكراً لطلبك الشحن مع MahWay. ده كود تتبع شحنتك:\n\n' +
    trackingCode + '\n\n' +
    'ممكن تتابع حالة شحنتك في أي وقت من صفحة "تتبع شحنتك" على موقعنا باستخدام الكود ده.\n\n' +
    'شكراً لثقتك في MahWay.';

  try {
    MailApp.sendEmail(customerEmail, subject, body);
  } catch (err) {
    // لو حصل خطأ في إرسال الإيميل للعميل، ميوقفش باقي العملية
    console.error('فشل إرسال إيميل كود التتبع للعميل: ' + err.toString());
  }
}

// أداة عامة لترقية أي شيت قديم: بتتأكد إن الهيدر فيه كل الأعمدة المطلوبة،
// ولو ناقص عمود بتضيفه آخر الصف من غير ما تلمس أي بيانات موجودة قبل كده.
// كده أي شيت اتعمل بنسخة قديمة من السكريبت بيترقّى تلقائيًا أول ما يتستخدم.
function ensureSheetHasColumns(sheet, requiredHeaders) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => (h || '').toString().trim());

  requiredHeaders.forEach((header, idx) => {
    const col = idx + 1;
    if (col > currentHeaders.length || !currentHeaders[col - 1]) {
      sheet.getRange(1, col).setValue(header);
    }
  });
}

function generateTrackingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'MW-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ---------- التقييمات ----------
function handleRatingSubmit(data) {
  const rating = parseInt(data.rating, 10);
  if (!rating || rating < 1 || rating > 5) {
    return jsonResponse({ result: 'error', message: 'invalid rating' });
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(RATINGS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(RATINGS_SHEET_NAME);
    sheet.appendRow(['التاريخ', 'التقييم']);
  }

  sheet.appendRow([new Date(), rating]);

  return jsonResponse({ result: 'success' });
}

function getRatingStats() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(RATINGS_SHEET_NAME);

  if (!sheet || sheet.getLastRow() < 2) {
    return { average: 0, total: 0 };
  }

  const values = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  let sum = 0;
  let count = 0;

  values.forEach(row => {
    const val = Number(row[0]);
    if (!isNaN(val) && val > 0) {
      sum += val;
      count++;
    }
  });

  return {
    average: count > 0 ? sum / count : 0,
    total: count
  };
}

// ---------- الشحنات + التتبع ----------
// ترتيب أعمدة شيت Shipments:
// 1 TrackingCode | 2 CustomerName | 3 CustomerPhone | 4 Status | 5 DistributorPhone
// 6 UpdatedByName | 7 LastUpdate | 8 CreatedAt | 9 Latitude | 10 Longitude
// 11 UpdatedByEmail | 12 PendingToStatus | 13 PendingCodeHash
// 14 PendingGeneratedByEmail | 15 PendingGeneratedByName | 16 PendingExpiresAt
// 17 PendingCodePlain (نص الكود الصريح - بيترجع بس للموظف نفسه اللي ولّده)
// 18 Governorate (محافظة العميل - مُختارة من فورم الطلب، بتستخدم عشان نقرر
//    لو الشحنة محلية جوا نفس محافظة المخزن أو لأ)
const SHIPMENTS_HEADERS = [
  'كود التتبع', 'اسم العميل', 'هاتف العميل', 'الحالة',
  'تليفون الموزع', 'آخر تحديث بواسطة', 'تاريخ آخر تحديث', 'تاريخ الإنشاء',
  'خط العرض (Lat)', 'خط الطول (Lng)', 'بريد آخر تحديث',
  'كود معلّق - للمرحلة', 'كود معلّق - Hash', 'كود معلّق - بريد المولّد',
  'كود معلّق - اسم المولّد', 'كود معلّق - ينتهي في', 'كود معلّق - نص صريح',
  'المحافظة', 'هاتف آخر تحديث'
];
const SHIPMENTS_COLUMNS_COUNT = SHIPMENTS_HEADERS.length;

function getShipmentsSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHIPMENTS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHIPMENTS_SHEET_NAME);
    sheet.appendRow(SHIPMENTS_HEADERS);
  }
  ensureSheetHasColumns(sheet, SHIPMENTS_HEADERS);
  return sheet;
}

function createShipmentRecord(trackingCode, customerName, customerPhone, lat, lng, governorate) {
  const sheet = getShipmentsSheet();
  // بنخزّن الوقت كرقم (epoch ms) مش كـ Date object، عشان نضمن إن القراءة والكتابة
  // من/لجوجل شيتس ما تتأثرش بأي فرق تايم زون بين إعدادات المشروع والشيت (اللي
  // كان بيسبب إن العداد بيبدأ من وقت متقدّم مش من صفر فعليًا)
  const now = Date.now();
  sheet.appendRow([
    trackingCode, customerName, customerPhone, 'received', '', '', now, now,
    (typeof lat !== 'undefined' ? lat : ''), (typeof lng !== 'undefined' ? lng : ''),
    '', '', '', '', '', '', '',
    governorate || '', ''
  ]);
  logAudit({
    trackingCode: trackingCode,
    eventType: 'order_created',
    fromStatus: '',
    toStatus: 'received',
    performedByEmail: '',
    performedByName: customerName || 'العميل',
    performedByRole: 'عميل',
    counterpartyName: '',
    counterpartyContact: '',
    codeUsed: '',
    notes: 'إنشاء الطلب من الموقع'
  });
}

function findShipmentRow(sheet, trackingCode) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const codes = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const target = (trackingCode || '').toString().trim().toUpperCase();
  for (let i = 0; i < codes.length; i++) {
    if ((codes[i][0] || '').toString().trim().toUpperCase() === target) {
      return i + 2; // رقم الصف الفعلي في الشيت
    }
  }
  return -1;
}

function trackShipment(code) {
  if (!code) return { result: 'error', message: 'رجاء إدخال كود التتبع' };

  const sheet = getShipmentsSheet();
  const row = findShipmentRow(sheet, code);
  if (row === -1) {
    return { result: 'error', message: 'مفيش شحنة بهذا الكود. تأكد من الكود وحاول تاني.' };
  }

  const values = sheet.getRange(row, 1, 1, SHIPMENTS_COLUMNS_COUNT).getValues()[0];
  const statusKey = values[3] || 'received';
  const statusInfo = SHIPMENT_STATUSES[statusKey] || SHIPMENT_STATUSES.received;
  const pendingToStatus = values[11] || '';
  const pendingExpiresAt = values[15] || '';
  const pendingActive = !!pendingToStatus && new Date(pendingExpiresAt).getTime() > Date.now();
  // العميل بس هو اللي يشوف "في انتظار كود التسليم" لو المرحلة الجاية محتاجة تأكيده هو
  const waitingForCustomerCode = pendingActive && SHIPMENT_STATUSES[pendingToStatus] && SHIPMENT_STATUSES[pendingToStatus].customerConfirms;

  return {
    result: 'success',
    trackingCode: values[0],
    customerName: values[1],
    status: statusKey,
    statusLabel: statusInfo.ar,
    statusOrder: statusInfo.order,
    distributorPhone: values[4] || '',
    lastUpdate: values[6] ? new Date(values[6]).toISOString() : '',
    createdAt: values[7] ? new Date(values[7]).toISOString() : '',
    latitude: values[8] || '',
    longitude: values[9] || '',
    waitingForCustomerCode: !!waitingForCustomerCode,
    // مين الحالة اللي محتاجة تأكيد العميل عليها دلوقتي (لو فيه) - عشان الفرونت
    // يعرف يعرض النص المناسب (استلام أولي من العميل، أو تسليم نهائي له)
    pendingToStatus: waitingForCustomerCode ? pendingToStatus : ''
  };
}

// ---------- أدوات الأدوار والصلاحيات (Roles & Permissions helpers) ----------

// كل مفاتيح الأدوار المعرّفة حاليًا في ROLES_REGISTRY
function getAllRoleKeys() {
  return Object.keys(ROLES_REGISTRY);
}

// اسم الدور بالعربي، أو نفس المفتاح لو مش معروف (احتياطي)
function getRoleLabel(roleKey) {
  const roleDef = ROLES_REGISTRY[roleKey];
  return roleDef ? roleDef.label : roleKey;
}

// خريطة { roleKey: label } لكل الأدوار، بتتبعت لصفحة الـ HR عشان تبني منها الخيارات
function getRoleLabelsMap() {
  const map = {};
  getAllRoleKeys().forEach(key => { map[key] = getRoleLabel(key); });
  return map;
}

// كتالوج كامل للأدوار (id + label + icon) لبناء واجهة اختيار الأدوار في صفحة الـ HR
function getRolesCatalog() {
  return getAllRoleKeys().map(key => ({
    id: key,
    label: ROLES_REGISTRY[key].label,
    icon: ROLES_REGISTRY[key].icon || 'fa-briefcase'
  }));
}

// خريطة الأدوار القديمة اللي اتلغت أو اتدمجت في دور تاني، عشان أي موظف كان
// متسجل بيها قبل كده (في شيت Employees) يفضل شغال عادي من غير ما حد يدخل
// يعدّل بياناته يدويًا. لو ضفت دمج/إلغاء دور جديد في المستقبل، ضيفه هنا.
const ROLE_KEY_ALIASES = {
  // اتدمج دور "موزع" في دور "مندوب شحن" (receiver)
  distributor: 'receiver',
  // اتدمج دور "موصل" في دور "مندوب شحن" (receiver) كمان
  courier: 'receiver'
};

// تحويل نص "warehouse,distributor" (من الشيت) إلى مصفوفة أدوار صحيحة فقط
function parseRolesString(rawRoles) {
  const mapped = (rawRoles || '')
    .toString()
    .split(',')
    .map(r => r.trim())
    .map(r => ROLE_KEY_ALIASES[r] || r)
    .filter(r => r && !!ROLES_REGISTRY[r]);
  // احذف أي تكرار ممكن يحصل بعد الدمج (مثلاً موظف كان "receiver,distributor")
  return Array.from(new Set(mapped));
}

// تحويل مصفوفة أدوار (زي اللي جاية من الفرونت إند) إلى نص مفصول بفاصلة للتخزين في الشيت
function serializeRoles(rolesArray) {
  const clean = (rolesArray || [])
    .map(r => (r || '').toString().trim())
    .filter(r => r && !!ROLES_REGISTRY[r]);
  // احذف أي تكرار
  return Array.from(new Set(clean)).join(',');
}

// نص عرض بيجمع لابيلز كل الأدوار المحددة لموظف، مثال: "مخازن + موصل"
function getCombinedRoleLabel(rolesArray) {
  const labels = (rolesArray || []).map(getRoleLabel);
  return labels.length ? labels.join(' + ') : 'بدون دور محدد';
}

/**
 * الصلاحيات الفعلية للموظف = اتحاد صلاحيات كل الأدوار المحددة له.
 * لو الموظف عنده أكتر من دور، بياخد مميزات وصلاحيات كل الأدوار مجمّعة مع بعض.
 */
function computePermissions(rolesArray) {
  const allowedStatusesSet = new Set();
  let manageEmployees = false;

  (rolesArray || []).forEach(roleKey => {
    const roleDef = ROLES_REGISTRY[roleKey];
    if (!roleDef || !roleDef.permissions) return;

    (roleDef.permissions.shipmentStatuses || []).forEach(status => {
      allowedStatusesSet.add(status);
    });
    if (roleDef.permissions.manageEmployees) {
      manageEmployees = true;
    }
  });

  return {
    allowedStatuses: Array.from(allowedStatusesSet),
    manageEmployees: manageEmployees
  };
}

// ---------- أدوات تسلسل المراحل (Stage Transitions) ----------
// كل الأدوات دي بتشتق تلقائيًا من SHIPMENT_STATUSES و ROLES_REGISTRY، فمفيش
// أي بيانات مكررة محتاجة مزامنة يدوية لما تتضاف مرحلة جديدة.

// مفاتيح الحالات مرتبة حسب order
function getOrderedStatusKeys() {
  return Object.keys(SHIPMENT_STATUSES).sort((a, b) => SHIPMENT_STATUSES[a].order - SHIPMENT_STATUSES[b].order);
}

// الحالة اللي بعد الحالة الحالية في التسلسل، أو null لو دي آخر حالة
function getNextStatusKey(currentStatus) {
  const ordered = getOrderedStatusKeys();
  const idx = ordered.indexOf(currentStatus);
  if (idx === -1 || idx === ordered.length - 1) return null;
  return ordered[idx + 1];
}

// شحنة "محلية" = محافظة العميل نفس محافظة المخزن (WAREHOUSE_GOVERNORATE)
function isSameGovernorateAsWarehouse(governorate) {
  return !!governorate && governorate.toString().trim() === WAREHOUSE_GOVERNORATE;
}

// زي getNextStatusKey العادية، لكن لو الشحنة "وصلت المخزن" وهي محلية (نفس
// محافظة المخزن)، بتتخطى "في الطريق لنقطة التوزيع" و"وصلت نقطة التوزيع"
// وتروح على طول لـ"في يد الموزع" - لأنها مش محتاجة تتنقل لمحافظة تانية.
function getEffectiveNextStatusKey(currentStatus, governorate) {
  if (currentStatus === 'in_warehouse' && isSameGovernorateAsWarehouse(governorate)) {
    return 'with_distributor';
  }
  return getNextStatusKey(currentStatus);
}

// الأدوار المسؤولة عن حالة معينة (أي دور من صلاحياته إنه يحدّث الشحنة للحالة دي)
// نفس الأدوار دي هي اللي "بتحوز" الشحنة وهي في المرحلة دي، وبالتالي هي اللي
// تقدر تولّد كود التسليم لما الشحنة تتحرك للمرحلة اللي بعدها.
function getRolesForStatus(statusKey) {
  return getAllRoleKeys().filter(roleKey => {
    const roleDef = ROLES_REGISTRY[roleKey];
    return roleDef && roleDef.permissions && (roleDef.permissions.shipmentStatuses || []).indexOf(statusKey) !== -1;
  });
}

function rolesIntersect(rolesA, rolesB) {
  return (rolesA || []).some(r => (rolesB || []).indexOf(r) !== -1);
}

// ---------- سجل العمليات (Audit Log) ----------
const AUDIT_LOG_HEADERS = [
  'التاريخ والوقت', 'كود التتبع', 'نوع العملية', 'الحالة قبل', 'نص الحالة قبل',
  'الحالة بعد', 'نص الحالة بعد', 'بريد من قام بالعملية', 'اسم من قام بالعملية',
  'دور من قام بالعملية', 'الطرف الآخر (اسم)', 'الطرف الآخر (تواصل)', 'كود التأكيد المستخدم', 'ملاحظات'
];

function getAuditLogSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(AUDIT_LOG_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(AUDIT_LOG_SHEET_NAME);
    sheet.appendRow(AUDIT_LOG_HEADERS);
  }
  ensureSheetHasColumns(sheet, AUDIT_LOG_HEADERS);
  return sheet;
}

// بيسجّل عملية واحدة بكل تفاصيلها في سجل العمليات. بيتنادى من كل نقطة في
// النظام بيحصل فيها تغيير على حالة الشحنة (إنشاء، توليد كود، تأكيد نقل...)
function logAudit(entry) {
  const sheet = getAuditLogSheet();
  const fromLabel = entry.fromStatus ? (SHIPMENT_STATUSES[entry.fromStatus] ? SHIPMENT_STATUSES[entry.fromStatus].ar : entry.fromStatus) : '';
  const toLabel = entry.toStatus ? (SHIPMENT_STATUSES[entry.toStatus] ? SHIPMENT_STATUSES[entry.toStatus].ar : entry.toStatus) : '';
  sheet.appendRow([
    new Date(),
    entry.trackingCode || '',
    entry.eventType || '',
    entry.fromStatus || '',
    fromLabel,
    entry.toStatus || '',
    toLabel,
    entry.performedByEmail || '',
    entry.performedByName || '',
    entry.performedByRole || '',
    entry.counterpartyName || '',
    entry.counterpartyContact || '',
    entry.codeUsed || '',
    entry.notes || ''
  ]);
}

// ---------- الموظفين + تسجيل الدخول ----------
// ترتيب أعمدة شيت Employees:
// 1 Email | 2 PasswordHash | 3 Name | 4 Roles | 5 Phone | 6 Active | 7 PhotoUrl | 8 WorkingDays
const EMPLOYEES_COLUMNS_COUNT = 8;
// ترتيب أعمدة شيت Sessions:
// 1 Token | 2 Email | 3 Name | 4 Roles | 5 Phone | 6 ExpiresAt | 7 PhotoUrl
const SESSIONS_COLUMNS_COUNT = 7;

// بيدوّر على موظف بالبريد الإلكتروني بتاعه ويرجّع اسمه وهاتفه - مستخدمة لما نحتاج
// نعرض بيانات المندوب اللي كان حائز الشحنة، حتى في سياقات مفيهاش سيشن (زي تأكيد
// العميل نفسه) فمينفعش نعتمد على session.phone هناك
function getEmployeeByEmail(email) {
  if (!email) return null;
  const sheet = getEmployeesSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const rows = sheet.getRange(2, 1, lastRow - 1, EMPLOYEES_COLUMNS_COUNT).getValues();
  const target = email.toString().trim().toLowerCase();
  for (let i = 0; i < rows.length; i++) {
    const rowEmail = (rows[i][0] || '').toString().trim().toLowerCase();
    if (rowEmail === target) {
      return { name: rows[i][2] || '', phone: rows[i][4] || '' };
    }
  }
  return null;
}

// زي getEmployeeByEmail بس بالاسم - مستخدمة في التصحيح الرجعي (backfill) بس،
// لما محتاجين نلاقي هاتف موظف من سجل قديم مسجّل فيه اسمه بس من غير بريده
function getEmployeeByName(name) {
  if (!name) return null;
  const sheet = getEmployeesSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const rows = sheet.getRange(2, 1, lastRow - 1, EMPLOYEES_COLUMNS_COUNT).getValues();
  const target = name.toString().trim().toLowerCase();
  for (let i = 0; i < rows.length; i++) {
    const rowName = (rows[i][2] || '').toString().trim().toLowerCase();
    if (rowName === target) {
      return { email: rows[i][0] || '', phone: rows[i][4] || '' };
    }
  }
  return null;
}

// ---------- تصحيح رجعي (Backfill) - مرة واحدة بس ----------
// شحنات اتأكد استلامها من العميل *قبل* إصلاح باج "الشحنة حاليًا مع" (كانت
// بتتسجّل باسم العميل بدل المندوب) لسه فاضلة بالبيانات القديمة الغلط، لأن
// الإصلاح بيشتغل بس على العمليات الجديدة من لحظة النشر. الفانكشن دي بتصحّح
// السجلات القديمة دي رجعيًا بالرجوع لسجل العمليات (Audit Log) ولاقيّة مين
// المندوب اللي أكّد استلامها فعلاً.
// طريقة التشغيل: من محرر Apps Script، افتح الفانكشن دي من القائمة المنسدلة
// فوق واضغط Run (▶) مرة واحدة بس. مش متسجّلة كـ endpoint فمفيش خطر إنها
// تتنفّذ من غير قصد من الموقع.
function backfillPickupHolders() {
  const sheet = getShipmentsSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const rows = sheet.getRange(2, 1, lastRow - 1, SHIPMENTS_COLUMNS_COUNT).getValues();
  const auditSheet = getAuditLogSheet();
  const auditLastRow = auditSheet.getLastRow();
  const auditRows = auditLastRow >= 2
    ? auditSheet.getRange(2, 1, auditLastRow - 1, AUDIT_LOG_HEADERS.length).getValues()
    : [];

  let fixedCount = 0;
  rows.forEach((row, idx) => {
    const trackingCode = row[0];
    const status = row[3];
    const holderName = (row[5] || '').toString();
    // بس الشحنات اللي لسه واقفة عند "picked_up" ومسجّلة غلط باسم العميل
    if (status !== 'picked_up' || !holderName.includes('(تأكيد العميل)')) return;

    let mandubName = '';
    for (let i = auditRows.length - 1; i >= 0; i--) {
      if (auditRows[i][1] === trackingCode && auditRows[i][2] === 'confirm_pickup') {
        mandubName = auditRows[i][10] || ''; // عمود "الطرف الآخر (اسم)"
        break;
      }
    }
    if (!mandubName) return;

    const employee = getEmployeeByName(mandubName);
    const rowNum = idx + 2;
    sheet.getRange(rowNum, 6).setValue(mandubName);
    sheet.getRange(rowNum, 19).setValue(employee ? (employee.phone || '') : '');
    fixedCount++;
  });

  Logger.log('تم تصحيح ' + fixedCount + ' شحنة');
  return fixedCount;
}

function getEmployeesSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(EMPLOYEES_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(EMPLOYEES_SHEET_NAME);
    sheet.appendRow(['Email', 'PasswordHash', 'Name', 'Roles', 'Phone', 'Active', 'PhotoUrl', 'WorkingDays']);
  }
  return sheet;
}

function getSessionsSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SESSIONS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SESSIONS_SHEET_NAME);
    sheet.appendRow(['Token', 'Email', 'Name', 'Roles', 'Phone', 'ExpiresAt', 'PhotoUrl']);
  }
  return sheet;
}

function getPasswordResetsSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(PASSWORD_RESETS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(PASSWORD_RESETS_SHEET_NAME);
    sheet.appendRow(['Email', 'CodeHash', 'ExpiresAt']);
  }
  return sheet;
}

function hashText(text) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8);
  return digest.map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}

function handleLogin(email, passwordHash) {
  if (!email || !passwordHash) {
    return { result: 'error', message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' };
  }

  const sheet = getEmployeesSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return { result: 'error', message: 'لا يوجد حساب بهذا البريد أو كلمة المرور غير صحيحة' };
  }

  const rows = sheet.getRange(2, 1, lastRow - 1, EMPLOYEES_COLUMNS_COUNT).getValues();
  const targetEmail = email.toString().trim().toLowerCase();

  for (let i = 0; i < rows.length; i++) {
    const [rowEmail, rowHash, name, rolesRaw, phone, active, photoUrl, workingDays] = rows[i];
    if ((rowEmail || '').toString().trim().toLowerCase() === targetEmail) {
      const isActive = active === true || active.toString().trim().toUpperCase() === 'TRUE';
      if (!isActive) {
        return { result: 'error', message: 'هذا الحساب موقوف. تواصل مع الإدارة.' };
      }
      if ((rowHash || '').toString().trim() !== passwordHash.toString().trim()) {
        return { result: 'error', message: 'لا يوجد حساب بهذا البريد أو كلمة المرور غير صحيحة' };
      }

      const rolesArray = parseRolesString(rolesRaw);
      const permissions = computePermissions(rolesArray);

      const token = Utilities.getUuid();
      const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000);
      const sessionsSheet = getSessionsSheet();
      sessionsSheet.appendRow([token, rowEmail, name, serializeRoles(rolesArray), phone, expiresAt, photoUrl || '']);

      return {
        result: 'success',
        token: token,
        name: name,
        roles: rolesArray,
        roleLabels: rolesArray.map(getRoleLabel),
        roleLabel: getCombinedRoleLabel(rolesArray),
        permissions: permissions,
        phone: phone,
        photoUrl: photoUrl || '',
        workingDays: workingDays || ''
      };
    }
  }

  return { result: 'error', message: 'لا يوجد حساب بهذا البريد أو كلمة المرور غير صحيحة' };
}

function getSessionByToken(token) {
  if (!token) return null;
  const sheet = getSessionsSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const rows = sheet.getRange(2, 1, lastRow - 1, SESSIONS_COLUMNS_COUNT).getValues();
  for (let i = 0; i < rows.length; i++) {
    const [rowToken, email, name, rolesRaw, phone, expiresAt, photoUrl] = rows[i];
    if ((rowToken || '').toString().trim() === token.toString().trim()) {
      if (new Date(expiresAt).getTime() < Date.now()) {
        return null; // الجلسة منتهية
      }
      const rolesArray = parseRolesString(rolesRaw);
      return {
        email,
        name,
        roles: rolesArray,
        permissions: computePermissions(rolesArray),
        phone,
        photoUrl: photoUrl || ''
      };
    }
  }
  return null;
}

// جلسة HR: أي موظف من ضمن أدواره دور بيدي صلاحية إدارة الموظفين (manageEmployees)
function requireHrSession(token) {
  const session = getSessionByToken(token);
  if (!session) return null;
  if (!session.permissions || !session.permissions.manageEmployees) return null;
  return session;
}

function handleLogout(token) {
  const sheet = getSessionsSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { result: 'success' };

  const tokens = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < tokens.length; i++) {
    if ((tokens[i][0] || '').toString().trim() === (token || '').toString().trim()) {
      sheet.deleteRow(i + 2);
      break;
    }
  }
  return { result: 'success' };
}

function getShipmentsForEmployee(token) {
  const session = getSessionByToken(token);
  if (!session) {
    return { result: 'error', message: 'الجلسة منتهية. سجل الدخول تاني.' };
  }

  const sheet = getShipmentsSheet();
  const lastRow = sheet.getLastRow();
  const shipments = [];

  if (lastRow >= 2) {
    const rows = sheet.getRange(2, 1, lastRow - 1, SHIPMENTS_COLUMNS_COUNT).getValues();
    rows.forEach(row => {
      const statusKey = row[3] || 'received';
      const statusInfo = SHIPMENT_STATUSES[statusKey] || SHIPMENT_STATUSES.received;
      const governorate = row[17] || '';
      const nextStatus = getEffectiveNextStatusKey(statusKey, governorate);
      const pendingToStatus = row[11] || '';
      const pendingExpiresAt = row[15] || '';
      const pendingActive = !!pendingToStatus && new Date(pendingExpiresAt).getTime() > Date.now();
      const pendingGeneratedByEmail = row[13] || '';
      // الكود الصريح بيترجع بس لو الموظف الحالي هو نفسه اللي ولّده (matching
      // على البريد) - كده بيقدر يشوفه حتى لو بدّل جهاز/متصفح، ومفيش حد تاني
      // (زي الطرف اللي هيستلم) بيقدر يشوفه من الداتا الراجعة له
      const isMyPendingCode = pendingActive && pendingGeneratedByEmail
        && session.email
        && pendingGeneratedByEmail.toString().trim().toLowerCase() === session.email.toString().trim().toLowerCase();

      // هل الموظف ده من الدور المسؤول عن الحالة الحالية؟ لو أيوه، هو اللي
      // "حائز" الشحنة دلوقتي (سواء عنده إجراء يعمله دلوقتي ولا لأ)
      const generatorRoles = getRolesForStatus(statusKey);
      const ownedByMe = rolesIntersect(session.roles, generatorRoles);
      // يقدر يولّد كود تسليم للمرحلة الجاية طول ما هو الحائز الحالي للشحنة،
      // حتى لو المرحلة الحالية نفسها اتأكدت بكود من العميل (زي "تم استلام
      // الشحنة من العميل") - أهم حاجة إن مفيش كود معلّق فعلاً دلوقتي
      const canGenerateNext = !!nextStatus && !pendingActive && ownedByMe;

      // هل فيه كود معلّق حاليًا، ودور الموظف ده هو المسؤول عن استلامه؟
      const nextIsCustomerConfirm = pendingToStatus && SHIPMENT_STATUSES[pendingToStatus] && SHIPMENT_STATUSES[pendingToStatus].customerConfirms;
      const confirmerRoles = pendingToStatus ? getRolesForStatus(pendingToStatus) : [];
      const canConfirmPending = pendingActive && !nextIsCustomerConfirm && rolesIntersect(session.roles, confirmerRoles);

      shipments.push({
        trackingCode: row[0],
        customerName: row[1],
        customerPhone: row[2],
        status: statusKey,
        statusLabel: statusInfo.ar,
        statusOrder: statusInfo.order,
        distributorPhone: row[4] || '',
        updatedBy: row[5] || '',
        // هاتف مين حائز الشحنة دلوقتي (المندوب/الموظف أو العميل حسب الحالة) - بيتخزّن
        // فعليًا وقت كل تحويل، عشان بوكس "الشحنة حاليًا مع" يعرض بيانات صح دايمًا
        updatedByPhone: row[18] || '',
        lastUpdate: row[6] ? new Date(row[6]).toISOString() : '',
        createdAt: row[7] ? new Date(row[7]).toISOString() : '',
        latitude: row[8] || '',
        longitude: row[9] || '',
        nextStatus: nextStatus || '',
        nextStatusLabel: nextStatus ? SHIPMENT_STATUSES[nextStatus].ar : '',
        pendingActive: pendingActive,
        pendingToStatus: pendingActive ? pendingToStatus : '',
        pendingToStatusLabel: pendingActive ? SHIPMENT_STATUSES[pendingToStatus].ar : '',
        pendingGeneratedByName: pendingActive ? (row[14] || '') : '',
        pendingWaitingForCustomer: pendingActive && !!nextIsCustomerConfirm,
        canGenerateNext: canGenerateNext,
        canConfirmPending: canConfirmPending,
        // هل الحالة الحالية للشحنة دي تحت مسؤولية دور الموظف ده دلوقتي؟ بتُستخدم
        // في الفرونت إند عشان تحدد الشحنة تفضل في "النشطة" ولا تتنقل تلقائيًا
        // لـ"الأرشيف" عنده لما تبقى بره مسؤوليته (مثلاً وصلت المخزن عند مندوب الشحن)
        ownedByMe: ownedByMe,
        // نص الكود الصريح - موجود بس لو الموظف الحالي هو مين ولّده، وفاضي لأي حد تاني
        myPendingCode: isMyPendingCode ? (row[16] || '') : '',
        // محافظة العميل + هل الشحنة دي "محلية" (نفس محافظة المخزن)، بتُستخدم
        // في تبويب "المخزن" عند مندوب الشحن عشان يعرف الشحنة هتروح مباشرة
        // للموزع (محلية) ولا هتعدي على نقطة التوزيع (تانية) الأول
        governorate: governorate,
        isLocalToWarehouse: isSameGovernorateAsWarehouse(governorate)
      });
    });
  }

  // الأحدث إنشاءً أولاً
  shipments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return {
    result: 'success',
    roles: session.roles,
    roleLabels: session.roles.map(getRoleLabel),
    roleLabel: getCombinedRoleLabel(session.roles),
    name: session.name,
    // صلاحيات الموظف = اتحاد صلاحيات كل أدواره (dynamic، بتتحدّث تلقائي مع أي تعديل في الأدوار)
    allowedStatuses: session.permissions.allowedStatuses,
    statusLabels: Object.keys(SHIPMENT_STATUSES).reduce((acc, key) => {
      acc[key] = SHIPMENT_STATUSES[key].ar;
      return acc;
    }, {}),
    warehouseGovernorate: WAREHOUSE_GOVERNORATE,
    shipments: shipments
  };
}

// ملحوظة: التحديث المباشر للحالة اتلغى عمدًا. أي انتقال بين مراحل الشحنة
// دلوقتي لازم يعدي على نظام كود التأكيد (generateHandoffCode ثم
// confirmHandoffCode / confirmDelivery) عشان نضمن إن الحركة اتأكدت فعليًا
// من الطرفين. الفانكشن دي متسيبة كـ stub للتوافق مع أي استدعاء قديم فقط.
function updateShipmentStatus(token, trackingCode, newStatus) {
  return { result: 'error', message: 'التحديث المباشر ملغي. لازم تولّد كود تأكيد وتاخد تأكيد الطرف التاني الأول.' };
}

function generateHandoffCodeNumeric() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // كود 6 أرقام
}

// الموظف "الحائز" على الشحنة (حسب دوره ومرحلتها الحالية) بيولّد كود تسليم/تحويل
// للمرحلة الجاية، وبياخده فيزيائيًا للطرف التاني (موظف أو عميل) عشان يدخله
function handleGenerateHandoffCode(data) {
  const session = getSessionByToken(data.token);
  if (!session) {
    return { result: 'error', message: 'الجلسة منتهية. سجل الدخول تاني.' };
  }

  const sheet = getShipmentsSheet();
  const row = findShipmentRow(sheet, data.trackingCode);
  if (row === -1) {
    return { result: 'error', message: 'كود التتبع غير موجود' };
  }

  const values = sheet.getRange(row, 1, 1, SHIPMENTS_COLUMNS_COUNT).getValues()[0];
  const currentStatus = values[3] || 'received';
  const governorate = values[17] || '';
  const nextStatus = getEffectiveNextStatusKey(currentStatus, governorate);

  if (!nextStatus) {
    return { result: 'error', message: 'الشحنة وصلت لآخر مرحلة بالفعل (تم التسليم)' };
  }

  const generatorRoles = getRolesForStatus(currentStatus);
  if (!rolesIntersect(session.roles, generatorRoles)) {
    return { result: 'error', message: 'مسموحلكش تولّد كود لنقل الشحنة دي - لازم يكون عندك الدور المسؤول عن مرحلتها الحالية' };
  }

  const pendingExpiresAt = values[15] || '';
  const pendingActive = values[11] && new Date(pendingExpiresAt).getTime() > Date.now();
  if (pendingActive && values[11] !== nextStatus) {
    return { result: 'error', message: 'فيه كود معلّق بالفعل على الشحنة دي لمرحلة تانية، استنى انتهاءه أو تأكيده الأول' };
  }

  const code = generateHandoffCodeNumeric();
  const codeHash = hashText(code);
  const expiresAt = new Date(Date.now() + HANDOFF_CODE_EXPIRY_HOURS * 60 * 60 * 1000);

  // بنخزّن نص الكود الصريح في العمود 17 كمان (مش بس الـ hash) عشان لو نفس
  // الموظف اللي ولّده فتح البوابة من جهاز/متصفح تاني، getShipmentsForEmployee
  // يقدر يرجّعهولّه تاني (matching على بريده) من غير ما يعتمد على تخزين محلي
  // في المتصفح بس. الكود بيترجع فقط لصاحبه (بريده اتسجل هنا)، مش لأي حد تاني.
  sheet.getRange(row, 12, 1, 6).setValues([[nextStatus, codeHash, session.email, session.name, expiresAt, code]]);

  logAudit({
    trackingCode: data.trackingCode,
    eventType: 'generate_code',
    fromStatus: currentStatus,
    toStatus: nextStatus,
    performedByEmail: session.email,
    performedByName: session.name,
    performedByRole: getCombinedRoleLabel(session.roles),
    counterpartyName: '',
    counterpartyContact: '',
    codeUsed: '****' + code.slice(-2), // بيتسجل مقنّع وقت التوليد؛ بيتسجل كامل وقت التأكيد لأنه بيبقى مستهلك وقتها
    notes: 'تم توليد كود تسليم/استلام للمرحلة الجاية'
  });

  const nextStatusInfo = SHIPMENT_STATUSES[nextStatus];
  return {
    result: 'success',
    code: code,
    nextStatus: nextStatus,
    nextStatusLabel: nextStatusInfo.ar,
    forCustomer: !!nextStatusInfo.customerConfirms,
    expiresAt: expiresAt.toISOString(),
    message: nextStatusInfo.customerConfirms
      ? 'اديله للعميل نفسه عشان يدخله ويأكد الاستلام'
      : 'اديه للطرف اللي هيستلم الشحنة عشان يدخله في حسابه ويأكد الاستلام'
  };
}

// الطرف المستلم (موظف من الدور المسؤول عن المرحلة الجاية) بيدخل الكود
// اللي أخده من اللي سلّمه، والنظام بيتأكد ويكمّل النقل
function handleConfirmHandoffCode(data) {
  const session = getSessionByToken(data.token);
  if (!session) {
    return { result: 'error', message: 'الجلسة منتهية. سجل الدخول تاني.' };
  }

  const sheet = getShipmentsSheet();
  const row = findShipmentRow(sheet, data.trackingCode);
  if (row === -1) {
    return { result: 'error', message: 'كود التتبع غير موجود' };
  }

  const values = sheet.getRange(row, 1, 1, SHIPMENTS_COLUMNS_COUNT).getValues()[0];
  const currentStatus = values[3] || 'received';
  const pendingToStatus = values[11] || '';
  const pendingCodeHash = values[12] || '';
  const pendingGeneratedByEmail = values[13] || '';
  const pendingGeneratedByName = values[14] || '';
  const pendingExpiresAt = values[15] || '';

  if (!pendingToStatus || new Date(pendingExpiresAt).getTime() < Date.now()) {
    return { result: 'error', message: 'مفيش كود تأكيد معلّق (أو انتهت صلاحيته). لازم الطرف المسؤول يولّد كود جديد الأول' };
  }

  const nextStatusInfo = SHIPMENT_STATUSES[pendingToStatus];
  if (nextStatusInfo && nextStatusInfo.customerConfirms) {
    return { result: 'error', message: 'المرحلة دي محتاجة تأكيد العميل نفسه، مش موظف' };
  }

  const confirmerRoles = getRolesForStatus(pendingToStatus);
  if (!rolesIntersect(session.roles, confirmerRoles)) {
    return { result: 'error', message: 'الكود ده مخصص لدور تاني غير دورك' };
  }

  if (hashText((data.code || '').toString().trim()) !== pendingCodeHash) {
    return { result: 'error', message: 'الكود غير صحيح' };
  }

  // كل حاجة تمام: نفّذ النقل، سجّل مين حدّث، وامسح الكود المعلّق
  sheet.getRange(row, 4).setValue(pendingToStatus);
  if (pendingToStatus === 'with_distributor') {
    sheet.getRange(row, 5).setValue(session.phone || '');
  }
  sheet.getRange(row, 6).setValue(session.name || session.email);
  // هاتف الحائز الجديد فعليًا للشحنة (بيتعرض في بوكس "الشحنة حاليًا مع")
  sheet.getRange(row, 19).setValue(session.phone || '');
  // بنخزّن وقت التحديث كرقم (epoch ms) مش Date object، عشان العداد اللي بيحسب
  // "من وقت الاستلام" في الفرونت يبدأ صح من صفر - مفيش فرق تايم زون ممكن يأثّر
  // على رقم مباشر زي ما بيأثّر على تحويل Date-object جوه جوجل شيتس
  sheet.getRange(row, 7).setValue(Date.now());
  sheet.getRange(row, 11).setValue(session.email || '');
  sheet.getRange(row, 12, 1, 6).setValues([['', '', '', '', '', '']]); // تفريغ الكود المعلّق (بما فيه النص الصريح)

  logAudit({
    trackingCode: data.trackingCode,
    eventType: 'confirm_transfer',
    fromStatus: currentStatus,
    toStatus: pendingToStatus,
    performedByEmail: session.email,
    performedByName: session.name,
    performedByRole: getCombinedRoleLabel(session.roles),
    counterpartyName: pendingGeneratedByName,
    counterpartyContact: pendingGeneratedByEmail,
    codeUsed: (data.code || '').toString().trim(),
    notes: 'تأكيد استلام بالكود من ' + (pendingGeneratedByName || 'الطرف المسلّم')
  });

  return { result: 'success', message: 'تم تأكيد الاستلام وتحديث حالة الشحنة', status: pendingToStatus, statusLabel: nextStatusInfo.ar };
}

// العميل نفسه بيدخل كود التسليم النهائي (من صفحة تتبع الشحنة العامة، من
// غير أي تسجيل دخول) عشان يأكد استلامه للطلب فعليًا
function handleConfirmDelivery(data) {
  const trackingCode = (data.trackingCode || '').toString().trim();
  const code = (data.code || '').toString().trim();
  if (!trackingCode || !code) {
    return { result: 'error', message: 'الرجاء إدخال كود التتبع وكود التسليم' };
  }

  const sheet = getShipmentsSheet();
  const row = findShipmentRow(sheet, trackingCode);
  if (row === -1) {
    return { result: 'error', message: 'كود التتبع غير موجود' };
  }

  const values = sheet.getRange(row, 1, 1, SHIPMENTS_COLUMNS_COUNT).getValues()[0];
  const currentStatus = values[3] || 'received';
  const customerName = values[1] || 'العميل';
  const customerPhone = values[2] || '';
  const pendingToStatus = values[11] || '';
  const pendingCodeHash = values[12] || '';
  const pendingGeneratedByEmail = values[13] || '';
  const pendingGeneratedByName = values[14] || '';
  const pendingExpiresAt = values[15] || '';

  if (!pendingToStatus || new Date(pendingExpiresAt).getTime() < Date.now()) {
    return { result: 'error', message: 'مفيش كود تسليم معلّق حاليًا (أو انتهت صلاحيته)' };
  }

  const nextStatusInfo = SHIPMENT_STATUSES[pendingToStatus];
  if (!nextStatusInfo || !nextStatusInfo.customerConfirms) {
    return { result: 'error', message: 'المرحلة دي مش محتاجة تأكيد من العميل' };
  }

  if (hashText(code) !== pendingCodeHash) {
    return { result: 'error', message: 'كود التسليم غير صحيح' };
  }

  // نص التأكيد وسجل العمليات بيختلفوا حسب المرحلة: استلام أولي من العميل (بيدّي)
  // أو تسليم نهائي ليه (بياخد) - نفس آلية الكود، لكن الاتجاه عكسي
  const isPickupStage = pendingToStatus === 'picked_up';

  sheet.getRange(row, 4).setValue(pendingToStatus);

  // مين حائز الشحنة فعليًا بعد التأكيد؟
  // - في مرحلة "الاستلام من العميل" (picked_up): العميل بيأكد إنه سلّم الشحنة
  //   فعليًا للمندوب اللي واقف قدامه، يعني الحائز الجديد هو المندوب ده (اللي
  //   ولّد الكود)، مش العميل - كان فيه لبس هنا إن الحائز كان بيتسجّل خطأ باسم
  //   العميل نفسه مع إن الشحنة عمليًا بقت في إيد المندوب
  // - في مرحلة "التسليم النهائي" (delivered): العميل هو اللي استلم فعلاً، يعني
  //   هو الحائز الجديد بجد
  if (isPickupStage) {
    const generatorEmployee = getEmployeeByEmail(pendingGeneratedByEmail);
    const holderName = pendingGeneratedByName || (generatorEmployee && generatorEmployee.name) || 'المندوب';
    const holderPhone = (generatorEmployee && generatorEmployee.phone) || '';
    sheet.getRange(row, 6).setValue(holderName);
    sheet.getRange(row, 19).setValue(holderPhone);
  } else {
    sheet.getRange(row, 6).setValue(customerName + ' (تأكيد العميل)');
    sheet.getRange(row, 19).setValue(customerPhone);
  }

  // بنخزّن وقت التحديث كرقم (epoch ms) مش Date object، عشان العداد اللي بيحسب
  // "من وقت الاستلام" في الفرونت يبدأ صح من صفر، من غير أي فرق تايم زون
  sheet.getRange(row, 7).setValue(Date.now());
  sheet.getRange(row, 11).setValue('');
  sheet.getRange(row, 12, 1, 6).setValues([['', '', '', '', '', '']]);

  logAudit({
    trackingCode: trackingCode,
    eventType: isPickupStage ? 'confirm_pickup' : 'confirm_delivery',
    fromStatus: currentStatus,
    toStatus: pendingToStatus,
    performedByEmail: '',
    performedByName: customerName,
    performedByRole: 'عميل',
    counterpartyName: pendingGeneratedByName,
    counterpartyContact: '',
    codeUsed: code,
    notes: isPickupStage
      ? 'العميل أكّد إن المستلم اللي واقف قدامه هو المسؤول، وسلّمه الشحنة'
      : 'العميل أكّد استلام الشحنة بنفسه'
  });

  return {
    result: 'success',
    message: isPickupStage
      ? 'تم تأكيد استلام المستلم للشحنة منك، شكرًا لثقتك في MahWay'
      : 'تم تأكيد استلام الشحنة، شكرًا لثقتك في MahWay',
    status: pendingToStatus,
    statusLabel: nextStatusInfo.ar
  };
}

// ---------- تغيير / استعادة كلمة المرور ----------
function findEmployeeRow(sheet, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const emails = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const target = (email || '').toString().trim().toLowerCase();
  for (let i = 0; i < emails.length; i++) {
    if ((emails[i][0] || '').toString().trim().toLowerCase() === target) {
      return i + 2; // رقم الصف الفعلي في الشيت
    }
  }
  return -1;
}

// تغيير الباسورد من جوا الحساب (لازم يبعت الباسورد القديم صح الأول)
function handleChangePassword(data) {
  const session = getSessionByToken(data.token);
  if (!session) {
    return { result: 'error', message: 'الجلسة منتهية. سجل الدخول تاني.' };
  }
  if (!data.oldPasswordHash || !data.newPasswordHash) {
    return { result: 'error', message: 'الرجاء إدخال كلمة المرور القديمة والجديدة' };
  }
  if (data.newPasswordHash.toString().trim().length < 10) {
    return { result: 'error', message: 'كلمة المرور الجديدة غير صحيحة' };
  }

  const sheet = getEmployeesSheet();
  const row = findEmployeeRow(sheet, session.email);
  if (row === -1) {
    return { result: 'error', message: 'الحساب غير موجود' };
  }

  const currentHash = sheet.getRange(row, 2).getValue().toString().trim();
  if (currentHash !== data.oldPasswordHash.toString().trim()) {
    return { result: 'error', message: 'كلمة المرور القديمة غير صحيحة' };
  }

  sheet.getRange(row, 2).setValue(data.newPasswordHash.toString().trim());
  return { result: 'success', message: 'تم تغيير كلمة المرور بنجاح' };
}

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // كود من 6 أرقام
}

// طلب "نسيت كلمة المرور": بيبعت كود على إيميل الموظف
function handleForgotPasswordRequest(data) {
  const email = (data.email || '').toString().trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return { result: 'error', message: 'الرجاء إدخال بريد إلكتروني صحيح' };
  }

  const employeesSheet = getEmployeesSheet();
  const empRow = findEmployeeRow(employeesSheet, email);

  // ملحوظة: النظام ده داخلي لموظفينا بس (مش تسجيل عام)، فبنقول صراحة
  // لو الإيميل مش مسجل عندنا كموظف، بدل ما نسيب المستخدم مستني كود
  // مش هيوصله أبدًا.
  if (empRow === -1) {
    return { result: 'error', message: 'الإيميل ده مش مسجل عندنا كموظف. تأكد من الإيميل وحاول تاني.' };
  }

  const isActive = (() => {
    const active = employeesSheet.getRange(empRow, 6).getValue();
    return active === true || active.toString().trim().toUpperCase() === 'TRUE';
  })();
  if (!isActive) {
    return { result: 'error', message: 'هذا الحساب موقوف. تواصل مع الإدارة.' };
  }

  const code = generateResetCode();
  const codeHash = hashText(code);
  const expiresAt = new Date(Date.now() + RESET_CODE_EXPIRY_MINUTES * 60 * 1000);

  const resetsSheet = getPasswordResetsSheet();
  // امسح أي كود قديم لنفس الإيميل الأول
  const lastRow = resetsSheet.getLastRow();
  if (lastRow >= 2) {
    const emails = resetsSheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (let i = emails.length - 1; i >= 0; i--) {
      if ((emails[i][0] || '').toString().trim().toLowerCase() === email) {
        resetsSheet.deleteRow(i + 2);
      }
    }
  }
  resetsSheet.appendRow([email, codeHash, expiresAt]);

  const subject = 'كود استعادة كلمة المرور - MahWay';
  const body =
    'أهلاً،\n\n' +
    'استخدم الكود ده عشان تغيّر كلمة المرور بتاعتك في بوابة موظفي MahWay:\n\n' +
    code + '\n\n' +
    'الكود صالح لمدة ' + RESET_CODE_EXPIRY_MINUTES + ' دقيقة بس.\n' +
    'لو إنت مش اللي طلبت الاستعادة دي، تجاهل الرسالة دي.';

  try {
    MailApp.sendEmail(email, subject, body);
  } catch (err) {
    console.error('فشل إرسال إيميل كود الاستعادة: ' + err.toString());
    return { result: 'error', message: 'حصل خطأ في إرسال الإيميل. حاول تاني كمان شوية.' };
  }

  return { result: 'success', message: 'تم إرسال كود التحقق على بريدك الإلكتروني.' };
}

// تأكيد الكود + تحديد كلمة مرور جديدة
function handleForgotPasswordVerify(data) {
  const email = (data.email || '').toString().trim().toLowerCase();
  const code = (data.code || '').toString().trim();
  const newPasswordHash = (data.newPasswordHash || '').toString().trim();

  if (!email || !code || !newPasswordHash) {
    return { result: 'error', message: 'الرجاء إدخال كل البيانات المطلوبة' };
  }

  const resetsSheet = getPasswordResetsSheet();
  const lastRow = resetsSheet.getLastRow();
  if (lastRow < 2) {
    return { result: 'error', message: 'الكود غير صحيح أو منتهي. اطلب كود جديد.' };
  }

  const rows = resetsSheet.getRange(2, 1, lastRow - 1, 3).getValues();
  const codeHash = hashText(code);

  for (let i = 0; i < rows.length; i++) {
    const [rowEmail, rowCodeHash, expiresAt] = rows[i];
    if ((rowEmail || '').toString().trim().toLowerCase() === email) {
      if (new Date(expiresAt).getTime() < Date.now()) {
        resetsSheet.deleteRow(i + 2);
        return { result: 'error', message: 'الكود منتهي الصلاحية. اطلب كود جديد.' };
      }
      if ((rowCodeHash || '').toString().trim() !== codeHash) {
        return { result: 'error', message: 'الكود غير صحيح' };
      }

      // الكود صحيح: حدّث الباسورد وامسح كود الاستعادة
      const employeesSheet = getEmployeesSheet();
      const empRow = findEmployeeRow(employeesSheet, email);
      if (empRow === -1) {
        return { result: 'error', message: 'الحساب غير موجود' };
      }
      employeesSheet.getRange(empRow, 2).setValue(newPasswordHash);
      resetsSheet.deleteRow(i + 2);

      return { result: 'success', message: 'تم تغيير كلمة المرور بنجاح. سجل الدخول بكلمة المرور الجديدة.' };
    }
  }

  return { result: 'error', message: 'الكود غير صحيح أو منتهي. اطلب كود جديد.' };
}

// ---------- إدارة الموظفين (خاص بموظف الـ HR) ----------

// بيرفع صورة الموظف على Google Drive وبيرجع لينك مباشر للصورة
function savePhotoToDrive(base64Data, mimeType, fileName) {
  const folders = DriveApp.getFoldersByName(PHOTOS_DRIVE_FOLDER_NAME);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(PHOTOS_DRIVE_FOLDER_NAME);

  const decoded = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(decoded, mimeType || 'image/jpeg', fileName || ('employee-' + Date.now()));
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return 'https://drive.google.com/uc?export=view&id=' + file.getId();
}

function listEmployeesForHr(token) {
  const session = requireHrSession(token);
  if (!session) {
    return { result: 'error', message: 'الجلسة منتهية أو مفيش صلاحية لعرض الموظفين' };
  }

  const sheet = getEmployeesSheet();
  const lastRow = sheet.getLastRow();
  const employees = [];

  if (lastRow >= 2) {
    const rows = sheet.getRange(2, 1, lastRow - 1, EMPLOYEES_COLUMNS_COUNT).getValues();
    rows.forEach(row => {
      const [email, , name, rolesRaw, phone, active, photoUrl, workingDays] = row;
      const isActive = active === true || (active || '').toString().trim().toUpperCase() === 'TRUE';
      const rolesArray = parseRolesString(rolesRaw);
      employees.push({
        email: email,
        name: name,
        roles: rolesArray,
        roleLabels: rolesArray.map(getRoleLabel),
        roleLabel: getCombinedRoleLabel(rolesArray),
        phone: phone || '',
        active: isActive,
        photoUrl: photoUrl || '',
        workingDays: (workingDays === '' || workingDays === null || typeof workingDays === 'undefined')
          ? ''
          : Number(workingDays)
      });
    });
  }

  return {
    result: 'success',
    employees: employees,
    // كتالوج الأدوار المتاحة (كامل ومحدّث دائمًا من ROLES_REGISTRY) عشان الـ HR
    // يبني منه واجهة اختيار الأدوار (checkboxes) لكل موظف
    rolesCatalog: getRolesCatalog(),
    roleLabels: getRoleLabelsMap(),
    roles: getAllRoleKeys() // للتوافق الخلفي مع أي كود قديم بيتوقع مصفوفة أسماء بس
  };
}

function handleAddEmployee(data) {
  const session = requireHrSession(data.token);
  if (!session) {
    return { result: 'error', message: 'مفيش صلاحية لإضافة موظفين' };
  }

  const email = (data.email || '').toString().trim().toLowerCase();
  const name = (data.name || '').toString().trim();
  const phone = (data.phone || '').toString().trim();
  const rolesArray = Array.isArray(data.roles) ? data.roles : parseRolesString(data.roles || data.role || '');
  const passwordHash = (data.passwordHash || '').toString().trim();
  const workingDays = (typeof data.workingDays !== 'undefined' && data.workingDays !== '')
    ? Number(data.workingDays)
    : '';

  if (!email || !isValidEmail(email)) {
    return { result: 'error', message: 'الرجاء إدخال بريد إلكتروني صحيح' };
  }
  if (!name) {
    return { result: 'error', message: 'الرجاء إدخال اسم الموظف' };
  }

  const cleanRoles = rolesArray.filter(r => !!ROLES_REGISTRY[r]);
  if (cleanRoles.length === 0) {
    return { result: 'error', message: 'الرجاء تحديد دور واحد على الأقل للموظف' };
  }
  if (!passwordHash) {
    return { result: 'error', message: 'الرجاء تحديد كلمة مرور للموظف' };
  }
  if (workingDays !== '' && (isNaN(workingDays) || workingDays < 0 || workingDays > 7)) {
    return { result: 'error', message: 'عدد أيام العمل لازم يكون رقم بين 0 و 7' };
  }

  const sheet = getEmployeesSheet();
  if (findEmployeeRow(sheet, email) !== -1) {
    return { result: 'error', message: 'يوجد بالفعل حساب بهذا البريد الإلكتروني' };
  }

  let photoUrl = '';
  if (data.photoBase64) {
    try {
      photoUrl = savePhotoToDrive(data.photoBase64, data.photoMimeType, email + '-' + Date.now());
    } catch (err) {
      console.error('فشل رفع صورة الموظف: ' + err.toString());
    }
  }

  sheet.appendRow([email, passwordHash, name, serializeRoles(cleanRoles), phone, true, photoUrl, workingDays]);

  return { result: 'success', message: 'تم إضافة الموظف بنجاح' };
}

function handleUpdateEmployee(data) {
  const session = requireHrSession(data.token);
  if (!session) {
    return { result: 'error', message: 'مفيش صلاحية لتعديل بيانات الموظفين' };
  }

  const targetEmail = (data.targetEmail || '').toString().trim().toLowerCase();
  if (!targetEmail) {
    return { result: 'error', message: 'الموظف غير محدد' };
  }

  const sheet = getEmployeesSheet();
  const row = findEmployeeRow(sheet, targetEmail);
  if (row === -1) {
    return { result: 'error', message: 'الموظف غير موجود' };
  }

  // تغيير الإيميل نفسه (لو HR بعت إيميل جديد مختلف عن القديم)
  if (data.newEmail) {
    const newEmail = data.newEmail.toString().trim().toLowerCase();
    if (newEmail !== targetEmail) {
      if (!isValidEmail(newEmail)) {
        return { result: 'error', message: 'البريد الإلكتروني الجديد غير صحيح' };
      }
      if (findEmployeeRow(sheet, newEmail) !== -1) {
        return { result: 'error', message: 'يوجد بالفعل حساب بهذا البريد الإلكتروني' };
      }
      sheet.getRange(row, 1).setValue(newEmail);
    }
  }

  if (data.name) {
    sheet.getRange(row, 3).setValue(data.name.toString().trim());
  }

  // تحديث الأدوار: الـ HR يقدر يضيف أو يلغي أي دور للموظف في أي وقت، وبمجرد
  // الحفظ تتحدث صلاحيات الموظف تلقائيًا (لأن الصلاحيات بتتحسب لحظيًا من
  // الأدوار المخزّنة، مفيش أي "صلاحيات" مخزنة بشكل منفصل تحتاج مزامنة يدوية)
  if (typeof data.roles !== 'undefined') {
    const rolesArray = Array.isArray(data.roles) ? data.roles : parseRolesString(data.roles);
    const cleanRoles = rolesArray.filter(r => !!ROLES_REGISTRY[r]);
    if (cleanRoles.length === 0) {
      return { result: 'error', message: 'الرجاء تحديد دور واحد على الأقل للموظف' };
    }
    sheet.getRange(row, 4).setValue(serializeRoles(cleanRoles));
  }

  if (typeof data.phone !== 'undefined') {
    sheet.getRange(row, 5).setValue((data.phone || '').toString().trim());
  }
  if (typeof data.active !== 'undefined') {
    sheet.getRange(row, 6).setValue(data.active === true || data.active === 'true');
  }
  if (data.newPasswordHash) {
    sheet.getRange(row, 2).setValue(data.newPasswordHash.toString().trim());
  }
  if (data.photoBase64) {
    try {
      const photoUrl = savePhotoToDrive(data.photoBase64, data.photoMimeType, targetEmail + '-' + Date.now());
      sheet.getRange(row, 7).setValue(photoUrl);
    } catch (err) {
      console.error('فشل رفع صورة الموظف: ' + err.toString());
    }
  }
  if (typeof data.workingDays !== 'undefined') {
    if (data.workingDays === '' || data.workingDays === null) {
      sheet.getRange(row, 8).setValue('');
    } else {
      const workingDays = Number(data.workingDays);
      if (isNaN(workingDays) || workingDays < 0 || workingDays > 7) {
        return { result: 'error', message: 'عدد أيام العمل لازم يكون رقم بين 0 و 7' };
      }
      sheet.getRange(row, 8).setValue(workingDays);
    }
  }

  return { result: 'success', message: 'تم تحديث بيانات الموظف بنجاح' };
}

function handleDeleteEmployee(data) {
  const session = requireHrSession(data.token);
  if (!session) {
    return { result: 'error', message: 'مفيش صلاحية لحذف موظفين' };
  }

  const targetEmail = (data.targetEmail || '').toString().trim().toLowerCase();
  if (targetEmail === session.email.toString().trim().toLowerCase()) {
    return { result: 'error', message: 'مينفعش تحذف حسابك بنفسك' };
  }

  const sheet = getEmployeesSheet();
  const row = findEmployeeRow(sheet, targetEmail);
  if (row === -1) {
    return { result: 'error', message: 'الموظف غير موجود' };
  }

  sheet.deleteRow(row);
  return { result: 'success', message: 'تم حذف الموظف بنجاح' };
}

// ---------- أدوات مساعدة ----------
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
