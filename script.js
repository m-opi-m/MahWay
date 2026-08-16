// تهيئة AOS للأنيميشن
AOS.init({
    duration: 1200,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// تهيئة Particles.js
document.addEventListener('DOMContentLoaded', function() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            }
        });
    }
});

// متغيرات الترجمة الكاملة
const translations = {
    ar: {
        // التنقل
        "nav.home": "الرئيسية",
        "nav.services": "خدماتنا",
        "nav.shippingForm": "طلب شحن",
        "nav.tracking": "تتبع شحنتك",
        "nav.contact": "اتصل بنا",
        "nav.quickOrder": "طلب سريع",

        // تتبع الشحنة
        "tracking.title": "تتبع شحنتك",
        "tracking.subtitle": "أدخل كود التتبع اللي استلمته بعد إرسال طلب الشحن",
        "tracking.placeholder": "مثال: MW-7K2P9Q",
        "tracking.button": "تتبع",
        "tracking.codeLabel": "كود التتبع",
        "tracking.distributorPhone": "تليفون الموزع",
        "tracking.notFound": "مفيش شحنة بهذا الكود. تأكد من الكود وحاول تاني.",
        "tracking.emptyInput": "من فضلك أدخل كود التتبع",
        "tracking.error": "حصل خطأ أثناء البحث عن الشحنة. حاول تاني.",
        "tracking.status.received": "تم استلام الطلب",
        "tracking.status.picked_up": "تم استلام الشحنة من العميل",
        "tracking.status.in_warehouse": "وصلت المخزن",
        "tracking.status.to_distribution_point": "في الطريق لنقطة التوزيع",
        "tracking.status.in_distribution_center": "وصلت نقطة التوزيع",
        "tracking.status.with_distributor": "في يد الموزع",
        "tracking.status.delivered": "تم التسليم للعميل",
        
        // الهيرو
        "hero.tagline": "Import Export Shipping",
        "hero.description": "حلول شحن ذكية لتجارة الاستيراد والتصدير العالمية",
        "hero.orderNow": "اطلب شحنتك الآن",
        "hero.exploreServices": "استكشف خدماتنا",
        
        // الإحصائيات
        "stats.shipments": "شحنة ناجحة",
        "stats.countries": "دولة",
        "stats.support": "ساعة دعم",
        "stats.satisfaction": "% رضا العملاء",
        
        // الخدمات السريعة
        "quickServices.title": "خدماتنا السريعة",
        "service.fast": "شحن سريع ⚡",
        "service.air": "شحن جوي",
        "service.sea": "شحن بحري",
        "service.fast.desc": "توصيل فوري مع أفضل الأسعار",
        "service.air.desc": "أسرع وسائل النقل للبضائع العاجلة",
        "service.sea.desc": "الحل الأمثل للشحنات الكبيرة",
        "service.time.fast": "24-48 ساعة",
        "service.time.air": "2-5 أيام",
        "service.time.sea": "15-30 يوم",
        
        // نموذج الشحن
        "form.title": "طلب خدمة الشحن",
        "form.subtitle": "املأ البيانات وسنتواصل معك خلال دقائق",
        "form.details": "تفاصيل الشحنة",
        "form.fullName": "الاسم بالكامل *",
        "form.phone": "رقم الهاتف *",
        "form.email": "البريد الإلكتروني (لإرسال كود التتبع)",
        "form.weight": "الوزن (كجم) *",
        "form.productLink": "رابط المنتج (اختياري)",
        "form.shippingType": "نوع الشحن *",
        "form.shippingRoute": "مسار الشحن *",
        "form.governorate": "محافظة الاستلام/التسليم *",
        "form.chooseGovernorate": "اختر المحافظة",
        "form.notes": "ملاحظات إضافية",
        "form.chooseType": "اختر نوع الشحن",
        "form.fastOption": "شحن سريع ⚡",
        "form.normalOption": "شحن عادي",
        "form.chooseRoute": "اختر مسار الشحن",
        "form.egyptOption": "داخل مصر 🇪🇬",
        "form.turkeyOption": "داخل تركيا 🇹🇷",
        "form.internationalOption": "شحن دولي (من بلد لبلد) 🌍",
        "form.notesPlaceholder": "أي معلومات إضافية عن الشحنة...",
        "form.send": "إرسال طلب الشحن",
        "form.location": "حدد موقع الاستلام على الخريطة *",
        "form.useMyLocation": "استخدام موقعي الحالي",
        "form.dragPinHint": "تقدر تسحب الدبوس لتحديد الموقع بدقة",
        "form.confirmLocation": "تأكيد الموقع المحدد",
        "form.locationConfirmed": "تم تأكيد الموقع ✓",
        "form.locationNotConfirmed": "حدد موقعك على الخريطة، وبعد كده اضغط \"تأكيد الموقع المحدد\"",

        // تأكيد التسليم من العميل
        "tracking.deliveryWaiting": "الموزع سلّمك كود تأكيد الاستلام؟ أدخله هنا:",
        "tracking.pickupWaiting": "المندوب اللي جاي يستلم شحنتك دّالك كود؟ أدخله هنا عشان تأكد إنه هو فعلاً المسؤول:",
        "tracking.confirmDelivery": "تأكيد الاستلام",
        "tracking.deliverySuccess": "تم تأكيد الاستلام بنجاح، شكرًا لثقتك في MahWay",
        "tracking.deliveryCodeError": "الكود غير صحيح",
        
        // الخدمات
        "services.title": "خدماتنا المتكاملة",
        "service.express": "شحن اكسبريس",
        "service.international": "شحن دولي",
        "service.storage": "تخزين",
        "service.customs": "تخليص جمركي",
        "service.express.desc": "توصيل فوري مع أفضل وسائل النقل المتاحة",
        "service.international.desc": "توصيل عالمي مع تغطية شاملة للجمارك",
        "service.storage.desc": "خدمات تخزين آمنة مع إدارة المخزون",
        "service.customs.desc": "تخليص جمركي متكامل مع متابعة المستندات",
        "service.feature.fast": "⚡ 24-48 ساعة",
        "service.feature.tracking": "📱 تتبع مباشر",
        "service.feature.countries": "🌍 25 دولة",
        "service.feature.customs": "🛃 تخليص جمركي",
        "service.feature.secure": "🔒 تخزين آمن",
        "service.feature.inventory": "📊 إدارة مخزون",
        "service.feature.documents": "📋 مستندات",
        "service.feature.quick": "⚡ خدمة سريعة",
        
        // التقييم
        "ratings.title": "تقييم الخدمة",
        "ratings.subtitle": "كيف كانت تجربتك مع MahWay؟",
        "ratings.default": "اضغط على النجوم للتقييم",
        "ratings.submit": "إرسال التقييم",
        "ratings.thanks": "شكراً لك! تم تسجيل تقييمك بنجاح",
        "ratings.based": "بناءً على",
        "ratings.ratings": "تقييم",
        
        // اتصل بنا
        "contact.title": "اتصل بنا",
        "contact.company": "MahWay Shipping",
        "contact.info": "معلومات التواصل",
        "contact.phone": "الهاتف",
        "contact.email": "البريد الإلكتروني",
        "contact.register": "السجل التجاري",
        
        // الفوتر
        "footer.rights": "جميع الحقوق محفوظة"
    },
    en: {
        // Navigation
        "nav.home": "Home",
        "nav.services": "Services",
        "nav.shippingForm": "Shipping Request",
        "nav.tracking": "Track Shipment",
        "nav.contact": "Contact Us",
        "nav.quickOrder": "Quick Order",

        // Tracking
        "tracking.title": "Track Your Shipment",
        "tracking.subtitle": "Enter the tracking code you received after sending your shipping request",
        "tracking.placeholder": "e.g. MW-7K2P9Q",
        "tracking.button": "Track",
        "tracking.codeLabel": "Tracking Code",
        "tracking.distributorPhone": "Distributor Phone",
        "tracking.notFound": "No shipment found with this code. Please check and try again.",
        "tracking.emptyInput": "Please enter a tracking code",
        "tracking.error": "Something went wrong while looking up your shipment. Please try again.",
        "tracking.status.received": "Order received",
        "tracking.status.picked_up": "Picked up from you",
        "tracking.status.in_warehouse": "Arrived at the warehouse",
        "tracking.status.to_distribution_point": "On its way to the distribution point",
        "tracking.status.in_distribution_center": "Arrived at the distribution center",
        "tracking.status.with_distributor": "With the distributor",
        "tracking.status.delivered": "Delivered to customer",
        
        // Hero
        "hero.tagline": "Import Export Shipping",
        "hero.description": "Smart shipping solutions for global import and export trade",
        "hero.orderNow": "Order Your Shipment Now",
        "hero.exploreServices": "Explore Our Services",
        
        // Statistics
        "stats.shipments": "Successful Shipments",
        "stats.countries": "Countries",
        "stats.support": "Support Hours",
        "stats.satisfaction": "% Customer Satisfaction",
        
        // Quick Services
        "quickServices.title": "Our Quick Services",
        "service.fast": "Fast Shipping ⚡",
        "service.air": "Air Shipping",
        "service.sea": "Sea Shipping",
        "service.fast.desc": "Instant delivery with best prices",
        "service.air.desc": "Fastest transport for urgent goods",
        "service.sea.desc": "Ideal solution for large shipments",
        "service.time.fast": "24-48 Hours",
        "service.time.air": "2-5 Days",
        "service.time.sea": "15-30 Days",
        
        // Shipping Form
        "form.title": "Shipping Service Request",
        "form.subtitle": "Fill the data and we'll contact you within minutes",
        "form.details": "Shipment Details",
        "form.fullName": "Full Name *",
        "form.phone": "Phone Number *",
        "form.email": "Email (to receive your tracking code)",
        "form.weight": "Weight (kg) *",
        "form.productLink": "Product Link (optional)",
        "form.shippingType": "Shipping Type *",
        "form.shippingRoute": "Shipping Route *",
        "form.governorate": "Pickup/Delivery Governorate *",
        "form.chooseGovernorate": "Choose Governorate",
        "form.notes": "Additional Notes",
        "form.chooseType": "Choose Shipping Type",
        "form.fastOption": "Fast Shipping ⚡",
        "form.normalOption": "Normal Shipping",
        "form.chooseRoute": "Choose Shipping Route",
        "form.egyptOption": "Within Egypt 🇪🇬",
        "form.turkeyOption": "Within Turkey 🇹🇷",
        "form.internationalOption": "International (Country to Country) 🌍",
        "form.notesPlaceholder": "Any additional information about the shipment...",
        "form.send": "Send Shipping Request",
        "form.location": "Pin your pickup location on the map *",
        "form.useMyLocation": "Use my current location",
        "form.dragPinHint": "You can drag the pin to set the exact location",
        "form.confirmLocation": "Confirm selected location",
        "form.locationConfirmed": "Location confirmed ✓",
        "form.locationNotConfirmed": "Pick your location on the map, then press \"Confirm selected location\"",

        // Customer delivery confirmation
        "tracking.deliveryWaiting": "Did the distributor give you a delivery code? Enter it here:",
        "tracking.pickupWaiting": "Did the agent picking up your shipment give you a code? Enter it here to confirm it's them:",
        "tracking.confirmDelivery": "Confirm receipt",
        "tracking.deliverySuccess": "Delivery confirmed, thank you for trusting MahWay",
        "tracking.deliveryCodeError": "Invalid code",
        
        // Services
        "services.title": "Our Integrated Services",
        "service.express": "Express Shipping",
        "service.international": "International Shipping",
        "service.storage": "Storage",
        "service.customs": "Customs Clearance",
        "service.express.desc": "Instant delivery with best available transport",
        "service.international.desc": "Global delivery with full customs coverage",
        "service.storage.desc": "Secure storage services with inventory management",
        "service.customs.desc": "Integrated customs clearance with document follow-up",
        "service.feature.fast": "⚡ 24-48 Hours",
        "service.feature.tracking": "📱 Live Tracking",
        "service.feature.countries": "🌍 25 Countries",
        "service.feature.customs": "🛃 Customs Clearance",
        "service.feature.secure": "🔒 Secure Storage",
        "service.feature.inventory": "📊 Inventory Management",
        "service.feature.documents": "📋 Documents",
        "service.feature.quick": "⚡ Fast Service",
        
        // Ratings
        "ratings.title": "Service Rating",
        "ratings.subtitle": "How was your experience with MahWay?",
        "ratings.default": "Click on stars to rate",
        "ratings.submit": "Submit Rating",
        "ratings.thanks": "Thank you! Your rating has been submitted successfully",
        "ratings.based": "Based on",
        "ratings.ratings": "ratings",
        
        // Contact
        "contact.title": "Contact Us",
        "contact.company": "MahWay Shipping",
        "contact.info": "Contact Information",
        "contact.phone": "Phone",
        "contact.email": "Email",
        "contact.register": "Commercial Register",
        
        // Footer
        "footer.rights": "All rights reserved"
    },
    tr: {
        // Navigation
        "nav.home": "Ana Sayfa",
        "nav.services": "Hizmetler",
        "nav.shippingForm": "Nakliye Talebi",
        "nav.tracking": "Gönderi Takibi",
        "nav.contact": "İletişim",
        "nav.quickOrder": "Hızlı Sipariş",

        // Takip
        "tracking.title": "Gönderinizi Takip Edin",
        "tracking.subtitle": "Nakliye talebinizi gönderdikten sonra aldığınız takip kodunu girin",
        "tracking.placeholder": "örn: MW-7K2P9Q",
        "tracking.button": "Takip Et",
        "tracking.codeLabel": "Takip Kodu",
        "tracking.distributorPhone": "Dağıtıcı Telefonu",
        "tracking.notFound": "Bu kodla eşleşen bir gönderi bulunamadı. Lütfen kontrol edip tekrar deneyin.",
        "tracking.emptyInput": "Lütfen bir takip kodu girin",
        "tracking.error": "Gönderi aranırken bir hata oluştu. Lütfen tekrar deneyin.",
        "tracking.status.received": "Sipariş alındı",
        "tracking.status.picked_up": "Sizden teslim alındı",
        "tracking.status.in_warehouse": "Depoya ulaştı",
        "tracking.status.to_distribution_point": "Dağıtım noktasına doğru yolda",
        "tracking.status.in_distribution_center": "Dağıtım noktasına ulaştı",
        "tracking.status.with_distributor": "Dağıtıcıda",
        "tracking.status.delivered": "Müşteriye teslim edildi",
        
        // Hero
        "hero.tagline": "Import Export Shipping",
        "hero.description": "Küresel ithalat ve ihracat ticareti için akıllı nakliye çözümleri",
        "hero.orderNow": "Şimdi Nakliyenizi Sipariş Edin",
        "hero.exploreServices": "Hizmetlerimizi Keşfedin",
        
        // Statistics
        "stats.shipments": "Başarılı Sevkiyat",
        "stats.countries": "Ülke",
        "stats.support": "Destek Saati",
        "stats.satisfaction": "% Müşteri Memnuniyeti",
        
        // Quick Services
        "quickServices.title": "Hızlı Hizmetlerimiz",
        "service.fast": "Hızlı Nakliye ⚡",
        "service.air": "Hava Nakliyesi",
        "service.sea": "Deniz Nakliyesi",
        "service.fast.desc": "En iyi fiyatlarla anında teslimat",
        "service.air.desc": "Acil kargolar için en hızlı taşıma",
        "service.sea.desc": "Büyük sevkiyatlar için ideal çözüm",
        "service.time.fast": "24-48 Saat",
        "service.time.air": "2-5 Gün",
        "service.time.sea": "15-30 Gün",
        
        // Shipping Form
        "form.title": "Nakliye Hizmeti Talebi",
        "form.subtitle": "Verileri doldurun, sizi dakikalar içinde arayalım",
        "form.details": "Sevkiyat Detayları",
        "form.fullName": "Tam Ad *",
        "form.phone": "Telefon Numarası *",
        "form.email": "E-posta (takip kodunuzu almak için)",
        "form.weight": "Ağırlık (kg) *",
        "form.productLink": "Ürün Bağlantısı (isteğe bağlı)",
        "form.shippingType": "Nakliye Türü *",
        "form.shippingRoute": "Nakliye Rotası *",
        "form.governorate": "Teslim Alma/Teslimat İli *",
        "form.chooseGovernorate": "İl Seçin",
        "form.notes": "Ek Notlar",
        "form.chooseType": "Nakliye Türünü Seçin",
        "form.fastOption": "Hızlı Nakliye ⚡",
        "form.normalOption": "Normal Nakliye",
        "form.chooseRoute": "Nakliye Rotasını Seçin",
        "form.egyptOption": "Mısır İçi 🇪🇬",
        "form.turkeyOption": "Türkiye İçi 🇹🇷",
        "form.internationalOption": "Uluslararası (Ülkeden Ülkeye) 🌍",
        "form.notesPlaceholder": "Sevkiyat hakkında herhangi bir ek bilgi...",
        "form.send": "Nakliye Talebini Gönder",
        "form.location": "Teslim alma konumunu haritada işaretleyin *",
        "form.useMyLocation": "Mevcut konumumu kullan",
        "form.dragPinHint": "Konumu tam olarak belirlemek için pini sürükleyebilirsiniz",
        "form.confirmLocation": "Seçilen konumu onayla",
        "form.locationConfirmed": "Konum onaylandı ✓",
        "form.locationNotConfirmed": "Konumunuzu haritada seçin, sonra \"Seçilen konumu onayla\" düğmesine basın",

        // Müşteri teslimat onayı
        "tracking.deliveryWaiting": "Dağıtıcı size bir teslimat kodu verdi mi? Buraya girin:",
        "tracking.pickupWaiting": "Gönderinizi almaya gelen görevli size bir kod verdi mi? Doğrulamak için buraya girin:",
        "tracking.confirmDelivery": "Teslim alındı onayla",
        "tracking.deliverySuccess": "Teslimat onaylandı, MahWay'e güvendiğiniz için teşekkürler",
        "tracking.deliveryCodeError": "Kod geçersiz",
        
        // Services
        "services.title": "Entegre Hizmetlerimiz",
        "service.express": "Ekspres Nakliye",
        "service.international": "Uluslararası Nakliye",
        "service.storage": "Depolama",
        "service.customs": "Gümrük Takibi",
        "service.express.desc": "Mevcut en iyi taşıma ile anında teslimat",
        "service.international.desc": "Tam gümrük kapsamıyla küresel teslimat",
        "service.storage.desc": "Envanter yönetimi ile güvenli depolama hizmetleri",
        "service.customs.desc": "Belge takibi ile entegre gümrük takibi",
        "service.feature.fast": "⚡ 24-48 Saat",
        "service.feature.tracking": "📱 Canlı Takip",
        "service.feature.countries": "🌍 25 Ülke",
        "service.feature.customs": "🛃 Gümrük Takibi",
        "service.feature.secure": "🔒 Güvenli Depolama",
        "service.feature.inventory": "📊 Envanter Yönetimi",
        "service.feature.documents": "📋 Belgeler",
        "service.feature.quick": "⚡ Hızlı Hizmet",
        
        // Ratings
        "ratings.title": "Hizmet Değerlendirmesi",
        "ratings.subtitle": "MahWay deneyiminiz nasıldı?",
        "ratings.default": "Derecelendirmek için yıldızlara tıklayın",
        "ratings.submit": "Değerlendirmeyi Gönder",
        "ratings.thanks": "Teşekkürler! Derecelendirmeniz başarıyla gönderildi",
        "ratings.based": "Dayalı",
        "ratings.ratings": "değerlendirme",
        
        // Contact
        "contact.title": "Bize Ulaşın",
        "contact.company": "MahWay Shipping",
        "contact.info": "İletişim Bilgileri",
        "contact.phone": "Telefon",
        "contact.email": "E-posta",
        "contact.register": "Ticaret Sicil No",
        
        // Footer
        "footer.rights": "Tüm hakları saklıdır"
    }
};

// اللغة الحالية
let currentLanguage = 'ar';

// تبديل اللغة
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const lang = this.dataset.lang;
        switchLanguage(lang);
    });
});

// تطبيق الترجمة
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // تحديث الأزرار النشطة
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add('active');
    
    // تغيير اتجاه الصفحة
    if (lang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
    } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = lang;
    }
    
    // تطبيق جميع الترجمات
    applyAllTranslations();
}

// تطبيق جميع الترجمات
function applyAllTranslations() {
    const langData = translations[currentLanguage];
    
    // ترجمة كل العناصر مع data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            element.textContent = langData[key];
        }
    });
    
    // ترجمة الـ placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (langData[key]) {
            element.placeholder = langData[key];
        }
    });
    
    // ترجمة خيارات الـ select
    document.querySelectorAll('select option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        if (langData[key]) {
            option.textContent = langData[key];
        }
    });
}

// نظام التقييم
let currentRating = 0;
let hasRated = false;
const RATING_LOCK_MS = 24 * 60 * 60 * 1000; // 24 ساعة

// تهيئة نظام التقييم
function initRatingSystem() {
    // التحقق إذا كان المستخدم قيم خلال آخر 24 ساعة
    const savedRating = localStorage.getItem('mahway_rating');
    const savedDate = localStorage.getItem('mahway_rating_date');
    const stillLocked = savedRating && savedDate &&
        (Date.now() - new Date(savedDate).getTime() < RATING_LOCK_MS);

    if (stillLocked) {
        hasRated = true;
        currentRating = parseInt(savedRating);
        updateStarsDisplay(currentRating);
        showRatingSuccess();
    } else {
        // انتهت مدة القفل (أو لم يقيّم من قبل) - نظف أي بيانات قديمة واسمح بالتقييم
        localStorage.removeItem('mahway_rating');
        localStorage.removeItem('mahway_rating_date');
        hasRated = false;
        currentRating = 0;
    }

    // إضافة event listeners للنجوم (دايمًا، عشان لو الـ 24 ساعة خلصت تشتغل صح)
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', handleStarClick);
        star.addEventListener('mouseenter', handleStarHover);
    });

    // إعادة ضبط عرض النجوم لما الماوس يسيب المنطقة
    const starsContainer = document.getElementById('starsContainer');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', function() {
            if (!hasRated) {
                updateStarsDisplay(currentRating);
            }
        });
    }

    // إضافة event listener للزر
    document.getElementById('submitRating').addEventListener('click', submitRating);

    // جيب الإحصائيات الحقيقية من السيرفر (متوسط التقييم + العدد الكلي)
    fetchRatingStats();
}

// التعامل مع النقر على النجوم
function handleStarClick(e) {
    if (hasRated) return;
    
    const star = e.currentTarget;
    const rating = parseInt(star.getAttribute('data-rating'));
    currentRating = rating;
    
    updateStarsDisplay(rating);
    updateRatingMessage(rating);
    enableSubmitButton();
}

// التعامل مع hover على النجوم
function handleStarHover(e) {
    if (hasRated) return;
    
    const star = e.currentTarget;
    const rating = parseInt(star.getAttribute('data-rating'));
    
    updateStarsDisplay(rating, true);
}

// تحديث عرض النجوم - الإصدار المصحح
function updateStarsDisplay(rating, isHover = false) {
    const stars = document.querySelectorAll('.star');

    stars.forEach((star) => {
        const starRating = parseInt(star.getAttribute('data-rating'));

        if (starRating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// تحديث رسالة التقييم
function updateRatingMessage(rating) {
    const messages = {
        ar: {
            1: "سيء جداً 😞",
            2: "ليس جيداً 🙁",
            3: "جيد 😊",
            4: "جيد جداً 😄",
            5: "ممتاز! 🤩"
        },
        en: {
            1: "Very Bad 😞",
            2: "Not Good 🙁",
            3: "Good 😊",
            4: "Very Good 😄",
            5: "Excellent! 🤩"
        },
        tr: {
            1: "Çok Kötü 😞",
            2: "İyi Değil 🙁",
            3: "İyi 😊",
            4: "Çok İyi 😄",
            5: "Mükemmel! 🤩"
        }
    };
    
    const messageElement = document.getElementById('ratingMessage');
    const langMessages = messages[currentLanguage] || messages.ar;
    messageElement.textContent = langMessages[rating];
}

// تمكين زر الإرسال
function enableSubmitButton() {
    const submitBtn = document.getElementById('submitRating');
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';
    submitBtn.style.pointerEvents = 'all';
}

// إرسال التقييم
function submitRating() {
    if (hasRated || currentRating === 0) return;
    
    // حفظ التقييم في localStorage (يقفل التقييم لمدة 24 ساعة بس)
    localStorage.setItem('mahway_rating', currentRating.toString());
    localStorage.setItem('mahway_rating_date', new Date().toISOString());
    
    hasRated = true;
    showRatingSuccess();
    
    // إرسال التقييم فعليًا للسيرفر (Google Sheet) عشان يتحسب مع كل الزوار
    sendRatingToServer(currentRating);
}

// إرسال التقييم للسيرفر
function sendRatingToServer(rating) {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')) {
        console.warn('GOOGLE_SCRIPT_URL غير مضبوط. التقييم لم يُحفظ على السيرفر.');
        return;
    }

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ type: 'rating', rating: rating })
    })
    .catch((err) => console.error('فشل إرسال التقييم:', err))
    .finally(() => {
        // ناخد شوية وقت للسيرفر يسجل التقييم، بعدين نجيب الإحصائيات المحدثة
        setTimeout(fetchRatingStats, 1200);
    });
}

// جلب متوسط التقييم وعدد التقييمات من السيرفر
function fetchRatingStats() {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')) return;

    fetch(GOOGLE_SCRIPT_URL + '?action=ratingStats')
        .then(res => res.json())
        .then(data => {
            if (typeof data.average === 'number' && typeof data.total === 'number') {
                updateRatingStatsDisplay(data.average, data.total);
            }
        })
        .catch((err) => console.error('فشل جلب إحصائيات التقييم:', err));
}

// عرض رسالة النجاح
function showRatingSuccess() {
    const starsContainer = document.getElementById('starsContainer');
    const submitBtn = document.getElementById('submitRating');
    const successDiv = document.getElementById('ratingSuccess');
    
    starsContainer.style.opacity = '0.5';
    starsContainer.style.pointerEvents = 'none';
    submitBtn.style.display = 'none';
    successDiv.style.display = 'flex';
    
    // تحديث رسالة النجاح حسب اللغة
    const successMessages = {
        ar: "شكراً لك! تم تسجيل تقييمك بنجاح",
        en: "Thank you! Your rating has been submitted successfully",
        tr: "Teşekkürler! Derecelendirmeniz başarıyla gönderildi"
    };
    
    successDiv.querySelector('span').textContent = successMessages[currentLanguage] || successMessages.ar;
}

// تحديث واجهة إحصائيات التقييم بأرقام حقيقية جاية من السيرفر
function updateRatingStatsDisplay(average, total) {
    const averageElement = document.getElementById('averageRating');
    const totalElement = document.getElementById('totalRatings');

    averageElement.textContent = total > 0 ? average.toFixed(1) : '0';
    totalElement.textContent = total;

    updateAverageStars(average);
}

// تحديث النجوم في قسم الإحصائيات
function updateAverageStars(average) {
    const starsContainer = document.querySelector('.average-stars');
    starsContainer.innerHTML = '';
    
    const fullStars = Math.floor(average);
    const hasHalfStar = average % 1 >= 0.5;
    
    // إضافة النجوم الكاملة
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        starsContainer.appendChild(star);
    }
    
    // إضافة نصف نجمة إذا لزم الأمر
    if (hasHalfStar) {
        const halfStar = document.createElement('i');
        halfStar.className = 'fas fa-star-half-alt';
        starsContainer.appendChild(halfStar);
    }
    
    // إضافة النجوم الفارغة (بنفس شكل النجوم المليانة بس بلون فاتح)
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        const emptyStar = document.createElement('i');
        emptyStar.className = 'fas fa-star empty-star';
        starsContainer.appendChild(emptyStar);
    }
}

// نظام قائمة الجوال
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (!mobileToggle) return;
    
    // إنشاء overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    
    // فتح/إغلاق القائمة
    mobileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // إغلاق القائمة عند النقر على overlay
    overlay.addEventListener('click', function() {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        this.classList.remove('active');
        body.style.overflow = '';
    });
    
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        });
    });
    
    // إغلاق القائمة عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// إصلاح مشاكل اللمس في الجوال
function fixTouchIssues() {
    // منع الزوم المزدوج
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // تحسين أداء التمرير
    document.addEventListener('touchmove', function (event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, { passive: false });
    
    // إصلاح ارتفاع 100vh في الجوال
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
}

// تأثير التمرير للهيدر
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header-animation');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        header.style.padding = '0.5rem 0';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = 'none';
        header.style.padding = '1rem 0';
    }
});

// الانتقال للنموذج
function scrollToForm() {
    document.getElementById('shipping-form').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// الانتقال للخدمات
function scrollToServices() {
    document.getElementById('services').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// عدّاد الإحصائيات
function startCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let started = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-count');
                    const duration = 2500;
                    const step = target / (duration / 16);
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(document.querySelector('.stats'));
}

// رابط Google Apps Script Web App لاستقبال طلبات الشحن
// اتبع الخطوات اللي هبعتهالك عشان تحصل على الرابط ده وتحطه هنا بدل الرابط الفاضي
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3SBQ16fLDJkPrrbElvhR_vAPN7Pspw6REpP5kCaB2v78WMRc0RccEyXtCVxDbXgPO/exec';

// نموذج الشحن
// خانة "المحافظة" بتظهر وتبقى مطلوبة بس لما الشحن يكون داخل مصر - مش لها
// معنى في الشحن الدولي أو داخل تركيا
(function initGovernorateToggle() {
    const routeSelect = document.getElementById('shipping-route');
    const governorateRow = document.getElementById('governorateRow');
    const governorateSelect = document.getElementById('governorate');
    if (!routeSelect || !governorateRow || !governorateSelect) return;

    function syncGovernorateVisibility() {
        if (routeSelect.value === 'egypt') {
            governorateRow.style.display = 'flex';
            governorateSelect.setAttribute('required', 'required');
        } else {
            governorateRow.style.display = 'none';
            governorateSelect.removeAttribute('required');
            governorateSelect.value = '';
        }
    }

    routeSelect.addEventListener('change', syncGovernorateVisibility);
    syncGovernorateVisibility();
})();

document.getElementById('shippingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const submitBtn = form.querySelector('.submit-btn');

    // لازم العميل يكون ضغط "تأكيد الموقع المحدد" فعليًا قبل ما نبعت الطلب
    const confirmError = document.getElementById('locationConfirmError');
    if (!window.orderLocationConfirmed) {
        if (confirmError) {
            confirmError.textContent = getTrackingText('form.locationNotConfirmed');
            confirmError.style.display = 'inline-block';
        }
        const mapEl = document.getElementById('orderMapPicker');
        if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    submitBtn.classList.add('loading');

    const trackingCode = generateTrackingCode();

    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        weight: document.getElementById('weight').value,
        productLink: document.getElementById('product-link').value,
        shippingType: document.getElementById('shipping-type').value,
        shippingRoute: document.getElementById('shipping-route').value,
        governorate: document.getElementById('governorate') ? document.getElementById('governorate').value : '',
        notes: document.getElementById('notes').value,
        trackingCode: trackingCode,
        lat: document.getElementById('orderLat') ? document.getElementById('orderLat').value : '',
        lng: document.getElementById('orderLng') ? document.getElementById('orderLng').value : ''
    };

    const thanksMessage = currentLanguage === 'ar' ?
        'شكراً لك! تم استلام طلب الشحن 🚀<br>سنتواصل معك خلال 24 ساعة.' :
        currentLanguage === 'en' ?
        'Thank you! Shipping request received 🚀<br>We will contact you within 24 hours.' :
        'Teşekkürler! Nakliye talebiniz alındı 🚀<br>24 saat içinde sizinle iletişime geçeceğiz.';

    const errorMessage = currentLanguage === 'ar' ?
        'حصل خطأ أثناء إرسال الطلب. من فضلك تواصل معنا مباشرة على 010 4472 7702.' :
        currentLanguage === 'en' ?
        'Something went wrong while sending your request. Please contact us directly at +20 10 4472 7702.' :
        'Talep gönderilirken bir hata oluştu. Lütfen bizimle doğrudan +20 10 4472 7702 numaralı telefondan iletişime geçin.';

    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')) {
        // لسه الرابط مش متظبط - نعرض تنبيه بدل ما ندّي انطباع كاذب إن الطلب اتبعت
        console.warn('GOOGLE_SCRIPT_URL غير مضبوط. طلبات الشحن مش هتوصل لحد. راجع تعليمات الربط.');
        console.log('بيانات طلب الشحن (لم يتم الإرسال):', formData);
        setTimeout(() => {
            showOrderConfirmation(trackingCode, thanksMessage);
            form.reset();
            resetLocationConfirmState();
            submitBtn.classList.remove('loading');
        }, 1000);
        return;
    }

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(formData)
    })
    .then(() => {
        // no-cors ما بيسمحش نقرا الرد، فبنفترض النجاح لو مفيش استثناء شبكة
        showOrderConfirmation(trackingCode, thanksMessage);
        form.reset();
        resetLocationConfirmState();
    })
    .catch((err) => {
        console.error('فشل إرسال طلب الشحن:', err);
        showSuccessMessage(errorMessage);
    })
    .finally(() => {
        submitBtn.classList.remove('loading');
    });
});

// ---------- تتبع الشحنة ----------
const TRACKING_STATUS_ORDER = [
    'received',
    'picked_up',
    'in_warehouse',
    'to_distribution_point',
    'in_distribution_center',
    'with_distributor',
    'delivered'
];

function initTrackingSystem() {
    const trackingForm = document.getElementById('trackingForm');
    if (!trackingForm) return;

    trackingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const input = document.getElementById('trackingCodeInput');
        const code = input.value.trim();
        const resultBox = document.getElementById('trackingResult');
        const errorBox = document.getElementById('trackingError');
        const errorText = document.getElementById('trackingErrorText');
        const submitBtn = trackingForm.querySelector('.track-btn');

        resultBox.style.display = 'none';
        errorBox.style.display = 'none';

        if (!code) {
            errorText.textContent = getTrackingText('tracking.emptyInput');
            errorBox.style.display = 'flex';
            return;
        }

        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')) {
            errorText.textContent = getTrackingText('tracking.error');
            errorBox.style.display = 'flex';
            return;
        }

        submitBtn.disabled = true;

        fetch(GOOGLE_SCRIPT_URL + '?action=track&code=' + encodeURIComponent(code))
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    renderTrackingResult(data);
                } else {
                    errorText.textContent = data.message || getTrackingText('tracking.notFound');
                    errorBox.style.display = 'flex';
                }
            })
            .catch((err) => {
                console.error('فشل تتبع الشحنة:', err);
                errorText.textContent = getTrackingText('tracking.error');
                errorBox.style.display = 'flex';
            })
            .finally(() => {
                submitBtn.disabled = false;
            });
    });
}

function getTrackingText(key) {
    const dict = translations[currentLanguage] || translations.ar;
    return dict[key] || translations.ar[key] || key;
}

function renderTrackingResult(data) {
    const resultBox = document.getElementById('trackingResult');
    const timelineEl = document.getElementById('trackingTimeline');
    const codeEl = document.getElementById('resultTrackingCode');
    const phoneBox = document.getElementById('distributorPhoneBox');
    const phoneLink = document.getElementById('distributorPhoneLink');

    codeEl.textContent = data.trackingCode;
    timelineEl.innerHTML = '';

    const currentIndex = TRACKING_STATUS_ORDER.indexOf(data.status);

    TRACKING_STATUS_ORDER.forEach((statusKey, index) => {
        const li = document.createElement('li');
        let stateClass = '';
        if (index < currentIndex) stateClass = 'completed';
        else if (index === currentIndex) stateClass = 'completed current';

        li.className = stateClass.trim();

        const icon = document.createElement('div');
        icon.className = 'step-icon';
        icon.innerHTML = index <= currentIndex ? '<i class="fas fa-check"></i>' : '<i class="fas fa-circle" style="font-size:0.6rem;"></i>';

        const text = document.createElement('div');
        text.className = 'step-text';
        const label = document.createElement('div');
        label.className = 'step-label';
        label.textContent = getTrackingText('tracking.status.' + statusKey);
        text.appendChild(label);

        if (index === currentIndex && data.lastUpdate) {
            const dateEl = document.createElement('div');
            dateEl.className = 'step-date';
            try {
                dateEl.textContent = new Date(data.lastUpdate).toLocaleString(currentLanguage === 'ar' ? 'ar-EG' : (currentLanguage === 'tr' ? 'tr-TR' : 'en-US'));
            } catch (e) {}
            text.appendChild(dateEl);
        }

        li.appendChild(icon);
        li.appendChild(text);
        timelineEl.appendChild(li);
    });

    if (data.status === 'with_distributor' && data.distributorPhone) {
        phoneLink.textContent = data.distributorPhone;
        phoneLink.href = 'tel:' + data.distributorPhone;
        phoneBox.style.display = 'flex';
    } else {
        phoneBox.style.display = 'none';
    }

    lastTrackedCode = data.trackingCode;
    const confirmBox = document.getElementById('deliveryConfirmBox');
    if (confirmBox) {
        confirmBox.style.display = data.waitingForCustomerCode ? 'flex' : 'none';
        const msgEl = document.getElementById('deliveryConfirmMsg');
        if (msgEl) msgEl.textContent = '';

        // النص بيتغيّر حسب المرحلة المطلوب تأكيدها: استلام أولي من العميل
        // (المندوب واقف قدامه) ولا تسليم نهائي ليه
        const labelEl = document.getElementById('deliveryConfirmLabel');
        if (labelEl && data.waitingForCustomerCode) {
            const key = data.pendingToStatus === 'picked_up' ? 'tracking.pickupWaiting' : 'tracking.deliveryWaiting';
            labelEl.textContent = getTrackingText(key);
        }
    }

    resultBox.style.display = 'block';
}

// ---------- تأكيد استلام الشحنة نهائيًا بكود التسليم (العميل بنفسه) ----------
let lastTrackedCode = '';

function initDeliveryConfirmForm() {
    const confirmForm = document.getElementById('deliveryConfirmForm');
    if (!confirmForm) return;

    confirmForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const codeInput = document.getElementById('deliveryConfirmCodeInput');
        const msgEl = document.getElementById('deliveryConfirmMsg');
        const code = codeInput.value.trim();
        if (!code || !lastTrackedCode) return;

        msgEl.style.color = '';
        msgEl.textContent = '';

        if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')) {
            msgEl.style.color = '#b91c1c';
            msgEl.textContent = getTrackingText('tracking.error');
            return;
        }

        const submitBtn = confirmForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ type: 'confirmDelivery', trackingCode: lastTrackedCode, code: code })
        })
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    msgEl.style.color = '#15803d';
                    msgEl.textContent = data.message || getTrackingText('tracking.deliverySuccess');
                    codeInput.value = '';
                    // نحدّث الخط الزمني والحالة على طول
                    fetch(GOOGLE_SCRIPT_URL + '?action=track&code=' + encodeURIComponent(lastTrackedCode))
                        .then(r => r.json())
                        .then(fresh => { if (fresh.result === 'success') renderTrackingResult(fresh); });
                } else {
                    msgEl.style.color = '#b91c1c';
                    msgEl.textContent = data.message || getTrackingText('tracking.deliveryCodeError');
                }
            })
            .catch((err) => {
                console.error('فشل تأكيد الاستلام:', err);
                msgEl.style.color = '#b91c1c';
                msgEl.textContent = getTrackingText('tracking.error');
            })
            .finally(() => {
                if (submitBtn) submitBtn.disabled = false;
            });
    });
}

// ---------- خريطة تحديد موقع الطلب (OpenStreetMap عبر Leaflet - مجاني، بدون API Key) ----------
function initOrderMapPicker() {
    const mapEl = document.getElementById('orderMapPicker');
    if (!mapEl || typeof L === 'undefined') return;

    const latInput = document.getElementById('orderLat');
    const lngInput = document.getElementById('orderLng');
    const locateBtn = document.getElementById('useMyLocationBtn');
    const confirmBtn = document.getElementById('confirmLocationBtn');
    const confirmedBadge = document.getElementById('locationConfirmedBadge');
    const confirmError = document.getElementById('locationConfirmError');

    // نقطة افتراضية (القاهرة) لحد ما نحدد موقع المستخدم الفعلي
    const defaultCenter = [30.0444, 31.2357];
    const map = L.map('orderMapPicker').setView(defaultCenter, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // الدبوس قابل للسحب زي Uber
    const marker = L.marker(defaultCenter, { draggable: true }).addTo(map);

    // تأكيد الموقع خطوة منفصلة ومقصودة من العميل، مش مجرد إن الدبوس اتحرك.
    // أي تحريك جديد للدبوس (سحب / نقر / تحديد موقعي) بيلغي التأكيد القديم
    // تلقائيًا، عشان نضمن إن الموقع المؤكَّد هو نفسه آخر مكان وقف عنده الدبوس.
    window.orderLocationConfirmed = false;

    function setCoords(lat, lng) {
        latInput.value = lat;
        lngInput.value = lng;
        window.orderLocationConfirmed = false;
        if (confirmedBadge) confirmedBadge.style.display = 'none';
        if (confirmError) confirmError.style.display = 'none';
    }

    function placeAt(lat, lng, zoom) {
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng], zoom || map.getZoom());
        setCoords(lat, lng);
    }

    marker.on('dragend', function () {
        const pos = marker.getLatLng();
        setCoords(pos.lat, pos.lng);
    });

    // نقر على الخريطة بينقل الدبوس كمان
    map.on('click', function (e) {
        placeAt(e.latlng.lat, e.latlng.lng);
    });

    function useMyLocation() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            function (pos) {
                placeAt(pos.coords.latitude, pos.coords.longitude, 16);
            },
            function () {
                // المستخدم رفض السماح بالموقع أو حصل خطأ - يقدر يحدد يدويًا بالسحب
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    }

    if (locateBtn) locateBtn.addEventListener('click', useMyLocation);

    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            if (!latInput.value || !lngInput.value) {
                if (confirmError) {
                    confirmError.textContent = getTrackingText('form.locationNotConfirmed');
                    confirmError.style.display = 'inline-block';
                }
                return;
            }
            window.orderLocationConfirmed = true;
            if (confirmedBadge) confirmedBadge.style.display = 'inline-flex';
            if (confirmError) confirmError.style.display = 'none';
        });
    }

    // أول ما الفورم يظهر، جرّب نحدد موقع المستخدم تلقائيًا (Geolocation)
    useMyLocation();

    // Leaflet محتاج إعادة حساب المقاس لو الحاوية كانت مخفية وقت الإنشاء
    setTimeout(() => map.invalidateSize(), 300);
}

// بعد ما الطلب يتبعت بنجاح وتتعمل form.reset()، لازم نرجّع حالة تأكيد
// الموقع لبدايتها كمان عشان لو العميل بعت طلب تاني من نفس الصفحة
function resetLocationConfirmState() {
    window.orderLocationConfirmed = false;
    const badge = document.getElementById('locationConfirmedBadge');
    const err = document.getElementById('locationConfirmError');
    if (badge) badge.style.display = 'none';
    if (err) err.style.display = 'none';
}

// عرض نافذة تأكيد الطلب مع كود التتبع + زرار نسخ + زرار موافق (ملهاش قفل تلقائي)
function showOrderConfirmation(trackingCode, thanksMessage) {
    const texts = {
        ar: {
            trackingLabel: 'كود تتبع شحنتك',
            hint: 'احتفظ بالكود ده عشان تتبع شحنتك من قسم "تتبع شحنتك"',
            copy: 'نسخ الكود',
            copied: 'تم النسخ ✓',
            ok: 'موافق'
        },
        en: {
            trackingLabel: 'Your tracking code',
            hint: 'Save this code to track your shipment from the "Track Shipment" section',
            copy: 'Copy code',
            copied: 'Copied ✓',
            ok: 'OK'
        },
        tr: {
            trackingLabel: 'Takip kodunuz',
            hint: 'Gönderinizi "Gönderi Takibi" bölümünden takip etmek için bu kodu saklayın',
            copy: 'Kodu kopyala',
            copied: 'Kopyalandı ✓',
            ok: 'Tamam'
        }
    };
    const t = texts[currentLanguage] || texts.ar;

    const overlay = document.createElement('div');
    overlay.className = 'order-confirm-overlay';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.55);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        animation: fadeInOverlay 0.3s ease forwards;
    `;

    const box = document.createElement('div');
    box.className = 'order-confirm-box';
    box.style.cssText = `
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 2.2rem 2.4rem;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0,0,0,0.35);
        text-align: center;
        max-width: 90vw;
        width: 440px;
        font-family: 'Cairo', sans-serif;
        transform: scale(0);
        animation: boxPopIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    `;

    box.innerHTML = `
        <div style="font-size:1.25rem;font-weight:700;line-height:1.6;">${thanksMessage}</div>
        <div style="margin-top:1.4rem;background:rgba(255,255,255,0.15);border-radius:14px;padding:1rem 1.2rem;">
            <div style="font-size:0.9rem;opacity:0.9;margin-bottom:0.4rem;">${t.trackingLabel}</div>
            <div style="font-size:1.4rem;font-weight:900;letter-spacing:1px;">${trackingCode}</div>
        </div>
        <div style="font-size:0.85rem;opacity:0.9;margin-top:0.8rem;line-height:1.5;">${t.hint}</div>
        <div style="display:flex;gap:0.7rem;margin-top:1.6rem;flex-wrap:wrap;">
            <button type="button" class="order-confirm-copy-btn" style="flex:1;min-width:140px;background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.5);color:white;padding:0.8rem 1rem;border-radius:12px;font-family:'Cairo',sans-serif;font-size:0.95rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;transition:background 0.2s;">
                <i class="fas fa-copy"></i><span>${t.copy}</span>
            </button>
            <button type="button" class="order-confirm-ok-btn" style="flex:1;min-width:140px;background:white;color:#059669;border:none;padding:0.8rem 1rem;border-radius:12px;font-family:'Cairo',sans-serif;font-size:0.95rem;font-weight:800;cursor:pointer;">
                ${t.ok}
            </button>
        </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const copyBtn = box.querySelector('.order-confirm-copy-btn');
    const copySpan = copyBtn.querySelector('span');
    copyBtn.addEventListener('click', () => {
        const finishCopyFeedback = () => {
            copySpan.textContent = t.copied;
            setTimeout(() => { copySpan.textContent = t.copy; }, 2000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(trackingCode).then(finishCopyFeedback).catch(() => {
                fallbackCopyText(trackingCode);
                finishCopyFeedback();
            });
        } else {
            fallbackCopyText(trackingCode);
            finishCopyFeedback();
        }
    });

    const okBtn = box.querySelector('.order-confirm-ok-btn');
    okBtn.addEventListener('click', () => {
        overlay.style.animation = 'fadeOutOverlay 0.3s ease forwards';
        setTimeout(() => {
            if (overlay.parentNode) document.body.removeChild(overlay);
        }, 300);
    });
}

// نسخ احتياطي للنسخ لو navigator.clipboard مش متاح
function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); } catch (e) { console.warn('فشل النسخ الاحتياطي', e); }
    document.body.removeChild(textarea);
}

// عرض رسالة النجاح
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 2rem 3rem;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        font-size: 1.3rem;
        font-weight: 700;
        max-width: 90vw;
        width: 420px;
        animation: popIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'popOut 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 600);
    }, 7000);
}

// توليد كود تتبع عشوائي للشحنة (نفس صيغة السيرفر)
function generateTrackingCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'MW-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// إضافة أنيميشن للرسالة
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        70% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    @keyframes popOut {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        30% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    }
    @keyframes fadeInOverlay {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
    @keyframes fadeOutOverlay {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
    @keyframes boxPopIn {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.05); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

// إصلاح viewport للـ iOS
function fixViewportForIOS() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
}

// تهيئة الترجمة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    switchLanguage('ar');
    startCounters();
    initRatingSystem();
    initTrackingSystem();
    initDeliveryConfirmForm();
    initOrderMapPicker();
    initMobileMenu();
    fixTouchIssues();
    fixViewportForIOS();
    
    // تأثيرات Hover للبطاقات
    document.querySelectorAll('.service-card, .quick-service-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const angleY = (x - centerX) / 25;
                const angleX = (centerY - y) / 25;
                
                this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.05)`;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            }
        });
    });
});

// منع تكبير الصفحة على iOS
document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) { event.preventDefault(); }
}, { passive: false });
