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
    get
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
   عناصر الصفحة
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
   نافذة التفاصيل
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
   حالة المستخدم
===================================== */

let currentUser = null;

let currentUserData = null;


/* =====================================
   تسجيل حالة المستخدم
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
   إغلاق نافذة الإضافة
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
   الأزرار
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
   إرسال الخدمة
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
                    .value
                    .trim();


            const category =
                document
                    .getElementById(
                        "serviceCategory"
                    )
                    .value;


            const description =
                document
                    .getElementById(
                        "serviceDescription"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "servicePhone"
                    )
                    .value
                    .trim();


            const address =
                document
                    .getElementById(
                        "serviceAddress"
                    )
                    .value
                    .trim();


            const workingHours =
                document
                    .getElementById(
                        "serviceWorkingHours"
                    )
                    .value
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
   عرض الخدمات المقبولة
===================================== */

/* =====================================
   بيانات وفلترة الخدمات
===================================== */

let allServices = {};


/* =====================================
   تحميل الخدمات
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

                if (
                    !service ||
                    service.status !==
                    "approved"
                ) {

                    return;

                }


                /* فلترة القسم */

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

                        ${
                            service.category === "craftsmen"
                                ? "🔨"
                                : service.category === "pharmacies"
                                ? "💊"
                                : service.category === "herbal"
                                ? "🌿"
                                : service.category === "shops"
                                ? "🛒"
                                : "🛠️"
                        }

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
                            service
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


                        /* أرقام تهمك */

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


                        /* الخدمات والأقسام */

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
   زر عرض كل الخدمات
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
        "craftsmen"
    ) {

        message =
            "لا يوجد حرفيين منشورين حاليًا";

    }

    else if (
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
   تفاصيل الخدمة
===================================== */

function openServiceDetails(service) {

    if (!detailsModal)
        return;


    detailsName.textContent =
        service.name ||
        "خدمة بدون اسم";


    detailsCategory.textContent =
        getCategoryName(
            service.category
        );


    detailsDescription.textContent =
        service.description ||
        "لا يوجد وصف للخدمة.";


    detailsAddress.textContent =
        service.address ||
        "لم يتم تحديد العنوان";


    detailsPhone.textContent =
        service.phone ||
        "لم يتم إضافة رقم الهاتف";


    detailsWorkingHours.textContent =
        service.workingHours ||
        "لم يتم تحديد مواعيد العمل";


    if (service.phone) {

        detailsCallButton.href =
            "tel:" + service.phone;

        detailsCallButton.style.display =
            "block";

    }

    else {

        detailsCallButton.style.display =
            "none";

    }


    detailsImage.innerHTML =
        "🏪";


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
                    "🏪";

            };


        detailsImage.innerHTML =
            "";

        detailsImage.appendChild(
            image
        );

    }


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
   إغلاق التفاصيل
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

function getCategoryName(category) {

    const categories = {

        services:
            "🛠️ الخدمات",

        craftsmen:
            "🔨 الحرفيين",

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
   لا توجد خدمات
===================================== */

function showEmptyServices() {

    if (!servicesContainer)
        return;


    servicesContainer.innerHTML = `

        <div class="empty-state">

            <span>⏳</span>

            <h3>
                لا توجد خدمات منشورة حاليًا
            </h3>

            <p>
                الخدمات الجديدة تظهر بعد موافقة الإدارة.
            </p>

        </div>

    `;

}


/* =====================================
   حماية HTML
===================================== */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value || "";


    return div.innerHTML;

}


console.log(
    "أهل البلد - script.js يعمل بنجاح ✅"
);
