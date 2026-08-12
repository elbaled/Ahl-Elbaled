 import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    getDatabase,
    ref,
    push,
    set,
    onValue,
    get,
    remove
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


/* =====================================
   Firebase
===================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyBpc-93tAPIRqYlrpKGc_Yg8QqxuX8PfGI",

    authDomain:
        "ahl-elbaled2.firebaseapp.com",

    databaseURL:
        "https://ahl-elbaled2-default-rtdb.europe-west1.firebasedatabase.app",

    projectId:
        "ahl-elbaled2",

    storageBucket:
        "ahl-elbaled2.firebasestorage.app",

    messagingSenderId:
        "984455426367",

    appId:
        "1:984455426367:web:5420f680f2a4f9b609238a",

    measurementId:
        "G-NQFQWK5T57"
};


const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const database =
    getDatabase(app);


/* =====================================
   عناصر إضافة الخدمة
===================================== */

const modal =
    document.getElementById(
        "addServiceModal"
    );

const form =
    document.getElementById(
        "addServiceForm"
    );

const heroButton =
    document.getElementById(
        "addServiceHeroBtn"
    );

const addButton =
    document.getElementById(
        "addServiceBtn"
    );

const closeButton =
    document.getElementById(
        "closeModalBtn"
    );

const servicesContainer =
    document.getElementById(
        "servicesContainer"
    );


/* =====================================
   نافذة تفاصيل الخدمة
===================================== */

const detailsModal =
    document.getElementById(
        "serviceDetailsModal"
    );

const detailsOverlay =
    document.getElementById(
        "serviceDetailsOverlay"
    );

const detailsClose =
    document.getElementById(
        "serviceDetailsClose"
    );

const detailsName =
    document.getElementById(
        "detailsName"
    );

const detailsCategory =
    document.getElementById(
        "detailsCategory"
    );

const detailsDescription =
    document.getElementById(
        "detailsDescription"
    );

const detailsAddress =
    document.getElementById(
        "detailsAddress"
    );

const detailsPhone =
    document.getElementById(
        "detailsPhone"
    );

const detailsWorkingHours =
    document.getElementById(
        "detailsWorkingHours"
    );

const detailsImage =
    document.getElementById(
        "detailsImage"
    );

const detailsGallery =
    document.getElementById(
        "detailsGallery"
    );

const detailsCallButton =
    document.getElementById(
        "detailsCallButton"
    );


/* =====================================
   زر حذف الخدمة
===================================== */

const detailsDeleteButton =
    document.getElementById(
        "detailsDeleteButton"
    );


/* =====================================
   حالة المستخدم
===================================== */

let currentUser =
    null;

let currentUserData =
    null;


/* =====================================
   الخدمة المفتوحة حاليًا
===================================== */

let currentService =
    null;

let currentServiceId =
    null;


/* =====================================
   جميع الخدمات
===================================== */

let allServices =
    {};


/* =====================================
   حالة تسجيل الدخول
===================================== */

onAuthStateChanged(
    auth,
    async (user) => {

        currentUser =
            user;

        currentUserData =
            null;


        if (!user) {

            console.log(
                "المستخدم غير مسجل الدخول"
            );

            return;

        }


        try {

            const userRef =
                ref(
                    database,
                    "users/" + user.uid
                );


            const snapshot =
                await get(userRef);


            if (snapshot.exists()) {

                currentUserData =
                    snapshot.val();


                console.log(
                    "بيانات المستخدم:",
                    currentUserData
                );

            }

        }

        catch (error) {

            console.error(
                "خطأ في قراءة المستخدم:",
                error
            );

        }

    }
);


/* =====================================
   معرفة هل المستخدم أدمن
===================================== */

function isAdmin() {

    if (!currentUserData)
        return false;


    return (
        currentUserData.role === "admin" ||
        currentUserData.isAdmin === true ||
        currentUserData.type === "admin"
    );

}


/* =====================================
   فتح نافذة إضافة الخدمة
===================================== */

function openModal() {

    if (!currentUser) {

        alert(
            "يجب تسجيل الدخول أولًا لإضافة خدمة."
        );

        window.location.href =
            "login.html";

        return;

    }


    if (!currentUserData) {

        alert(
            "جاري تحميل بيانات الحساب، حاول مرة أخرى."
        );

        return;

    }


    if (
        currentUserData.status !==
        "approved"
    ) {

        alert(
            "حسابك لم تتم الموافقة عليه بعد."
        );

        return;

    }


    if (!modal) {

        alert(
            "نافذة إضافة الخدمة غير موجودة."
        );

        return;

    }


    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


/* =====================================
   إغلاق نافذة إضافة الخدمة
===================================== */

function closeModal() {

    if (!modal)
        return;


    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


/* =====================================
   أزرار إضافة الخدمة
===================================== */

if (heroButton) {

    heroButton.addEventListener(
        "click",
        openModal
    );

}


if (addButton) {

    addButton.addEventListener(
        "click",
        openModal
    );

}


if (closeButton) {

    closeButton.addEventListener(
        "click",
        closeModal
    );

}


if (modal) {

    const overlay =
        modal.querySelector(
            ".modal-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeModal
        );

    }

}


/* =====================================
   إضافة خدمة جديدة
===================================== */

if (form) {

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (!currentUser) {

                alert(
                    "يجب تسجيل الدخول أولًا."
                );

                return;

            }


            if (
                !currentUserData ||
                currentUserData.status !==
                "approved"
            ) {

                alert(
                    "حسابك غير معتمد لإضافة خدمة."
                );

                return;

            }


            const name =
                document
                    .getElementById(
                        "serviceName"
                    )
                    ?.value
                    .trim();


            const category =
                document
                    .getElementById(
                        "serviceCategory"
                    )
                    ?.value;


            const description =
                document
                    .getElementById(
                        "serviceDescription"
                    )
                    ?.value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "servicePhone"
                    )
                    ?.value
                    .trim();


            const address =
                document
                    .getElementById(
                        "serviceAddress"
                    )
                    ?.value
                    .trim();


            const workingHours =
                document
                    .getElementById(
                        "serviceWorkingHours"
                    )
                    ?.value
                    .trim();


            if (
                !name ||
                !category ||
                !description ||
                !phone ||
                !address
            ) {

                alert(
                    "من فضلك املأ جميع البيانات المطلوبة."
                );

                return;

            }


            try {

                const servicesRef =
                    ref(
                        database,
                        "services"
                    );


                const newService =
                    push(
                        servicesRef
                    );


                await set(
                    newService,
                    {

                        name:
                            name,

                        category:
                            category,

                        description:
                            description,

                        phone:
                            phone,

                        address:
                            address,

                        workingHours:
                            workingHours ||
                            "لم يتم تحديد مواعيد العمل",

                        status:
                            "pending",

                        userId:
                            currentUser.uid,

                        userEmail:
                            currentUser.email,

                        createdAt:
                            Date.now()

                    }
                );


                alert(
                    "تم إرسال الخدمة للمراجعة بنجاح ✅"
                );


                form.reset();

                closeModal();

            }

            catch (error) {

                console.error(
                    "Firebase Error:",
                    error
                );


                alert(
                    "حدث خطأ أثناء إرسال الخدمة:\n" +
                    error.message
                );

            }

        }
    );

}


/* =====================================
   تحميل الخدمات من Firebase
===================================== */

if (servicesContainer) {

    const servicesRef =
        ref(
            database,
            "services"
        );


    onValue(

        servicesRef,

        (snapshot) => {

            allServices =
                snapshot.val() || {};


            renderServices(
                allServices
            );

        },

        (error) => {

            console.error(
                "Firebase services error:",
                error
            );


            servicesContainer.innerHTML = `

                <div class="empty-state">

                    <span>⚠️</span>

                    <h3>
                        حدث خطأ في تحميل الخدمات
                    </h3>

                    <p>
                        ${escapeHTML(
                            error.message
                        )}
                    </p>

                </div>

            `;

        }

    );

}


/* =====================================
   أيقونة القسم
===================================== */

function getCategoryIcon(
    category
) {

    switch (category) {

        case "pharmacies":
            return "💊";

        case "herbal":
            return "🌿";

        case "shops":
            return "🛒";

        case "services":
            return "🛠️";

        default:
            return "🏪";

    }

}


/* =====================================
   عرض الخدمات
===================================== */

function renderServices(
    data,
    categoryFilter = null
) {

    if (!servicesContainer)
        return;


    servicesContainer.innerHTML =
        "";


    let count =
        0;


    Object.entries(data)
        .forEach(
            ([id, service]) => {

                if (!service)
                    return;


                if (
                    service.status !==
                    "approved"
                ) {

                    return;

                }


                if (
                    categoryFilter &&
                    service.category !==
                    categoryFilter
                ) {

                    return;

                }


                count++;


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "service-card";


                card.dataset.serviceId =
                    id;


                card.innerHTML = `

                    <div class="service-image">

                        ${getCategoryIcon(
                            service.category
                        )}

                    </div>

                    <div class="service-content">

                        <h3>
                            ${escapeHTML(
                                service.name
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                service.description
                            )}
                        </p>

                        <div class="service-meta">

                            <span class="meta-item">

                                📍
                                ${escapeHTML(
                                    service.address
                                )}

                            </span>

                            <span class="meta-item">

                                📞
                                ${escapeHTML(
                                    service.phone
                                )}

                            </span>

                        </div>

                        <div style="
                            margin-top:12px;
                            color:#2563eb;
                            font-weight:bold;
                            font-size:14px;
                        ">

                            👆 اضغط لعرض التفاصيل

                        </div>

                    </div>

                `;


                card.addEventListener(
                    "click",
                    () => {

                        openServiceDetails(
                            service,
                            id
                        );

                    }
                );


                servicesContainer.appendChild(
                    card
                );

            }
        );


    if (count === 0) {

        showEmptyServices(
            categoryFilter
        );

    }

}


/* =====================================
   تشغيل أقسام الموقع
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const categoryCards =
            document.querySelectorAll(
                ".category-card"
            );


        categoryCards.forEach(
            (card) => {

                card.addEventListener(
                    "click",
                    () => {

                        const category =
                            card.dataset.category;


                        /* أرقام مهمة */

                        if (
                            category ===
                            "important-numbers"
                        ) {

                            const section =
                                document.getElementById(
                                    "important-numbers"
                                );


                            if (section) {

                                section.scrollIntoView({
                                    behavior:
                                        "smooth"
                                });

                            }

                            return;

                        }


                        /* الإعلانات */

                        if (
                            category ===
                            "ads"
                        ) {

                            const section =
                                document.getElementById(
                                    "ads"
                                );


                            if (section) {

                                section.scrollIntoView({
                                    behavior:
                                        "smooth"
                                });

                            }

                            return;

                        }


                        /* الخدمات */

                        if (
                            category
                        ) {

                            renderServices(
                                allServices,
                                category
                            );


                            const section =
                                document.getElementById(
                                    "services"
                                );


                            if (section) {

                                section.scrollIntoView({
                                    behavior:
                                        "smooth"
                                });

                            }

                        }

                    }
                );

            }
        );

    }
);


/* =====================================
   عرض كل الخدمات
===================================== */

function showAllServices() {

    renderServices(
        allServices
    );

}


/* =====================================
   رسالة عدم وجود خدمات
===================================== */

function showEmptyServices(
    category = null
) {

    if (!servicesContainer)
        return;


    let message =
        "لا توجد خدمات منشورة حاليًا";


    if (
        category ===
        "pharmacies"
    ) {

        message =
            "لا توجد صيدليات منشورة حاليًا";

    }

    else if (
        category ===
        "herbal"
    ) {

        message =
            "لا توجد محلات عطارة منشورة حاليًا";

    }

    else if (
        category ===
        "shops"
    ) {

        message =
            "لا توجد محلات منشورة حاليًا";

    }

    else if (
        category ===
        "services"
    ) {

        message =
            "لا توجد خدمات منشورة حاليًا";

    }


    servicesContainer.innerHTML = `

        <div class="empty-state">

            <span>⏳</span>

            <h3>
                ${message}
            </h3>

            <p>
                الخدمات الجديدة تظهر بعد موافقة الإدارة.
            </p>

        </div>

    `;

}


/* =====================================
   فتح تفاصيل الخدمة
===================================== */

function openServiceDetails(
    service,
    serviceId
) {

    if (!detailsModal)
        return;


    currentService =
        service;

    currentServiceId =
        serviceId;


    if (detailsName) {

        detailsName.textContent =
            service.name ||
            "خدمة بدون اسم";

    }


    if (detailsCategory) {

        detailsCategory.textContent =
            getCategoryName(
                service.category
            );

    }


    if (detailsDescription) {

        detailsDescription.textContent =
            service.description ||
            "لا يوجد وصف للخدمة.";

    }


    if (detailsAddress) {

        detailsAddress.textContent =
            service.address ||
            "لم يتم تحديد العنوان";

    }


    if (detailsPhone) {

        detailsPhone.textContent =
            service.phone ||
            "لم يتم إضافة رقم الهاتف";

    }


    if (detailsWorkingHours) {

        detailsWorkingHours.textContent =
            service.workingHours ||
            "لم يتم تحديد مواعيد العمل";

    }


    /* زر الاتصال */

    if (
        detailsCallButton &&
        service.phone
    ) {

        detailsCallButton.href =
            "tel:" + service.phone;

        detailsCallButton.style.display =
            "block";

    }

    else if (detailsCallButton) {

        detailsCallButton.style.display =
            "none";

    }


    /* الصورة الأساسية */

    if (detailsImage) {

        detailsImage.innerHTML =
            getCategoryIcon(
                service.category
            );


        if (service.imageUrl) {

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                service.imageUrl;


            image.alt =
                service.name ||
                "صورة الخدمة";


            image.onerror =
                () => {

                    detailsImage.innerHTML =
                        getCategoryIcon(
                            service.category
                        );

                };


            detailsImage.innerHTML =
                "";


            detailsImage.appendChild(
                image
            );

        }

    }


    /* معرض الصور */

    if (detailsGallery) {

        detailsGallery.innerHTML =
            "";


        if (
            service.images &&
            Array.isArray(service.images) &&
            service.images.length > 0
        ) {

            service.images.forEach(
                (imageUrl) => {

                    if (!imageUrl)
                        return;


                    const image =
                        document.createElement(
                            "img"
                        );


                    image.src =
                        imageUrl;


                    image.alt =
                        service.name ||
                        "صورة الخدمة";


                    image.onerror =
                        () => {

                            image.style.display =
                                "none";

                        };


                    detailsGallery.appendChild(
                        image
                    );

                }
            );

        }

        else {

            const empty =
                document.createElement(
                    "div"
                );


            empty.className =
                "service-gallery-empty";


            empty.textContent =
                "🖼️ لا توجد صور مضافة حاليًا";


            detailsGallery.appendChild(
                empty
            );

        }

    }


    /* =====================================
       زر الحذف
    ===================================== */

    if (detailsDeleteButton) {

        detailsDeleteButton.style.display =
            "none";


        /*
         * الأدمن يستطيع حذف أي خدمة
         *
         * صاحب الخدمة يستطيع حذف خدمته
         */

        const isOwner =
            currentUser &&
            service.userId ===
            currentUser.uid;


        if (
            isAdmin() ||
            isOwner
        ) {

            detailsDeleteButton.style.display =
                "block";

        }

    }


    /* فتح النافذة */

    detailsModal.classList.add(
        "active"
    );


    detailsModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =====================================
   حذف الخدمة
===================================== */

async function deleteCurrentService() {

    if (
        !currentService ||
        !currentServiceId
    ) {

        alert(
            "لم يتم تحديد الخدمة."
        );

        return;

    }


    if (!currentUser) {

        alert(
            "يجب تسجيل الدخول أولًا."
        );

        return;

    }


    const isOwner =
        currentService.userId ===
        currentUser.uid;


    if (
        !isAdmin() &&
        !isOwner
    ) {

        alert(
            "ليس لديك صلاحية حذف هذه الخدمة."
        );

        return;

    }


    const confirmDelete =
        confirm(
            "هل أنت متأكد أنك تريد حذف هذه الخدمة نهائيًا؟"
        );


    if (!confirmDelete)
        return;


    try {

        const serviceRef =
            ref(
                database,
                "services/" +
                currentServiceId
            );


        await remove(
            serviceRef
        );


        alert(
            "تم حذف الخدمة بنجاح ✅"
        );


        currentService =
            null;

        currentServiceId =
            null;


        closeServiceDetails();


        /*
         * إعادة عرض الخدمات
         */

        renderServices(
            allServices
        );

    }

    catch (error) {

        console.error(
            "Delete service error:",
            error
        );


        alert(
            "حدث خطأ أثناء حذف الخدمة:\n" +
            error.message
        );

    }

}


/* =====================================
   زر حذف الخدمة
===================================== */

if (detailsDeleteButton) {

    detailsDeleteButton.addEventListener(
        "click",
        deleteCurrentService
    );

}


/* =====================================
   إغلاق تفاصيل الخدمة
===================================== */

function closeServiceDetails() {

    if (!detailsModal)
        return;


    detailsModal.classList.remove(
        "active"
    );


    detailsModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    currentService =
        null;

    currentServiceId =
        null;

}


if (detailsClose) {

    detailsClose.addEventListener(
        "click",
        closeServiceDetails
    );

}


if (detailsOverlay) {

    detailsOverlay.addEventListener(
        "click",
        closeServiceDetails
    );

}


/* =====================================
   زر Escape
===================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            closeServiceDetails();

            closeModal();

        }

    }
);


/* =====================================
   أسماء الأقسام
===================================== */

function getCategoryName(
    category
) {

    const categories = {

        services:
            "🛠️ الخدمات",

        pharmacies:
            "💊 الصيدليات",

        herbal:
            "🌿 العطارة",

        shops:
            "🛒 المحلات"

    };


    return (
        categories[category] ||
        category ||
        "خدمة"
    );

}


/* =====================================
   حماية HTML
===================================== */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value || "";


    return div.innerHTML;

}


/* =====================================
   تشغيل
===================================== */

/* =====================================
   البحث في الخدمات
===================================== */

const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchBtn =
    document.getElementById(
        "searchBtn"
    );


/* =====================================
   تنظيف النص قبل البحث
===================================== */

function normalizeSearchText(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[أإآ]/g, "ا")
        .replace(/ة/g, "ه")
        .replace(/ى/g, "ي");

}


/* =====================================
   تنفيذ البحث
===================================== */

function searchServices() {

    if (!servicesContainer) {
        return;
    }


    const searchText =
        normalizeSearchText(
            searchInput
                ? searchInput.value
                : ""
        );


    /* لو البحث فاضي */
    if (!searchText) {

        renderServices(
            allServices
        );

        return;

    }


    servicesContainer.innerHTML = "";


    let count = 0;


    Object.entries(
        allServices || {}
    ).forEach(
        ([id, service]) => {


            /* تجاهل الخدمة غير الموجودة */
            if (!service) {
                return;
            }


            /* عرض الخدمات المقبولة فقط */
            if (
                service.status !==
                "approved"
            ) {
                return;
            }


            const serviceName =
                normalizeSearchText(
                    service.name
                );


            const serviceCategory =
                normalizeSearchText(
                    getCategoryName(
                        service.category
                    )
                );


            const serviceDescription =
                normalizeSearchText(
                    service.description
                );


            const serviceAddress =
                normalizeSearchText(
                    service.address
                );


            const servicePhone =
                normalizeSearchText(
                    service.phone
                );


            const serviceWorkingHours =
                normalizeSearchText(
                    service.workingHours
                );


            /*
             * البحث في:
             *
             * اسم الخدمة
             * القسم
             * الوصف
             * العنوان
             * رقم الهاتف
             * مواعيد العمل
             */

            const found =
                serviceName.includes(
                    searchText
                ) ||

                serviceCategory.includes(
                    searchText
                ) ||

                serviceDescription.includes(
                    searchText
                ) ||

                serviceAddress.includes(
                    searchText
                ) ||

                servicePhone.includes(
                    searchText
                ) ||

                serviceWorkingHours.includes(
                    searchText
                );


            if (!found) {
                return;
            }


            count++;


            /* =================================
               إنشاء كارت الخدمة
            ================================= */

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "service-card";


            card.dataset.serviceId =
                id;


            let serviceIcon =
                "🛠️";


            if (
                service.category ===
                "craftsmen"
            ) {

                serviceIcon =
                    "🔨";

            }

            else if (
                service.category ===
                "pharmacies"
            ) {

                serviceIcon =
                    "💊";

            }

            else if (
                service.category ===
                "herbal"
            ) {

                serviceIcon =
                    "🌿";

            }

            else if (
                service.category ===
                "shops"
            ) {

                serviceIcon =
                    "🛒";

            }

            else if (
                service.category ===
                "services"
            ) {

                serviceIcon =
                    "🛠️";

            }


            card.innerHTML = `

                <div class="service-image">

                    ${serviceIcon}

                </div>


                <div class="service-content">

                    <h3>

                        ${escapeHTML(
                            service.name ||
                            "خدمة بدون اسم"
                        )}

                    </h3>


                    <p>

                        ${escapeHTML(
                            service.description ||
                            "لا يوجد وصف للخدمة."
                        )}

                    </p>


                    <div class="service-meta">

                        <span class="meta-item">

                            📍

                            ${escapeHTML(
                                service.address ||
                                "العنوان غير متوفر"
                            )}

                        </span>


                        <span class="meta-item">

                            📞

                            ${escapeHTML(
                                service.phone ||
                                "رقم الهاتف غير متوفر"
                            )}

                        </span>

                    </div>


                    <div style="
                        margin-top:12px;
                        color:#2563eb;
                        font-weight:bold;
                        font-size:14px;
                    ">

                        👆 اضغط لعرض التفاصيل

                    </div>

                </div>

            `;


            /* =================================
               فتح تفاصيل الخدمة
            ================================= */

            card.addEventListener(
                "click",
                () => {

                    openServiceDetails(
                        service
                    );

                }
            );


            servicesContainer.appendChild(
                card
            );

        }
    );


    /* =================================
       لا توجد نتائج
    ================================= */

    if (count === 0) {

        servicesContainer.innerHTML = `

            <div class="empty-state">

                <span>
                    🔎
                </span>


                <h3>
                    لا توجد نتائج
                </h3>


                <p>

                    لم نجد خدمة مطابقة لـ:

                    <strong>
                        ${escapeHTML(
                            searchInput
                                ? searchInput.value
                                : ""
                        )}
                    </strong>

                </p>


                <button
                    type="button"
                    id="clearSearchBtn"
                    style="
                        margin-top:15px;
                        padding:10px 20px;
                        border:0;
                        border-radius:10px;
                        background:#2563eb;
                        color:white;
                        cursor:pointer;
                        font-family:inherit;
                        font-weight:bold;
                    ">

                    مسح البحث

                </button>

            </div>

        `;


        const clearSearchBtn =
            document.getElementById(
                "clearSearchBtn"
            );


        if (clearSearchBtn) {

            clearSearchBtn.addEventListener(
                "click",
                () => {

                    if (searchInput) {

                        searchInput.value =
                            "";

                    }


                    renderServices(
                        allServices
                    );

                }
            );

        }

    }


    /* =================================
       الانتقال للخدمات بعد البحث
    ================================= */

    const servicesSection =
        document.getElementById(
            "services"
        );


    if (servicesSection) {

        servicesSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =====================================
   الضغط على زر البحث
===================================== */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchServices
    );

}


/* =====================================
   البحث أثناء الكتابة
===================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const value =
                searchInput.value.trim();


            /*
             * لو المستخدم مسح
             * مربع البحث
             * نرجع كل الخدمات
             */

            if (!value) {

                renderServices(
                    allServices
                );

            }

        }
    );


    /* =================================
       البحث بزر Enter
    ================================= */

    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                searchServices();

            }

        }
    );

}


/* =====================================
   نهاية البحث
===================================== */

console.log(
    "نظام البحث في أهل البلد يعمل بنجاح 🔎✅"
);
console.log(
    "أهل البلد - script.js يعمل بنجاح ✅"
);
