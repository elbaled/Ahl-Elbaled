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


// ==========================================
// Firebase
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyBpc-93tAPIRqYlrpKGc_Yg8QqxuX8PfGI",
    authDomain: "ahl-elbaled2.firebaseapp.com",
    databaseURL: "https://ahl-elbaled2-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ahl-elbaled2",
    storageBucket: "ahl-elbaled2.firebasestorage.app",
    messagingSenderId: "984455426367",
    appId: "1:984455426367:web:5420f680f2a4f9b609238a",
    measurementId: "G-NQFQWK5T57"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const database = getDatabase(app);


// ==========================================
// عناصر الصفحة
// ==========================================

const modal =
    document.getElementById("addServiceModal");

const form =
    document.getElementById("addServiceForm");

const heroButton =
    document.getElementById("addServiceHeroBtn");

const addButton =
    document.getElementById("addServiceBtn");

const closeButton =
    document.getElementById("closeModalBtn");

const servicesContainer =
    document.getElementById("servicesContainer");


// ==========================================
// بيانات المستخدم
// ==========================================

let currentUser = null;

let currentUserData = null;


// ==========================================
// التحقق من تسجيل الدخول
// ==========================================

onAuthStateChanged(
    auth,
    async (user) => {

        currentUser = user;

        currentUserData = null;


        if (!user) {

            console.log(
                "لا يوجد مستخدم مسجل الدخول"
            );

            return;
        }


        console.log(
            "المستخدم مسجل:",
            user.email
        );


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
                    "بيانات الحساب:",
                    currentUserData
                );

            } else {

                console.log(
                    "بيانات الحساب غير موجودة في Database"
                );

            }


        } catch (error) {

            console.error(
                "خطأ في قراءة بيانات الحساب:",
                error
            );

        }

    }
);


// ==========================================
// فتح نافذة إضافة الخدمة
// ==========================================

function openModal() {

    console.log(
        "تم الضغط على زر أضف خدمتك"
    );


    // ======================================
    // التأكد من وجود النافذة
    // ======================================

    if (!modal) {

        alert(
            "خطأ: نافذة إضافة الخدمة غير موجودة."
        );

        console.error(
            "addServiceModal غير موجود في HTML"
        );

        return;
    }


    // ======================================
    // لو المستخدم غير مسجل
    // ======================================

    if (!currentUser) {

        alert(
            "يجب تسجيل الدخول أولًا لإضافة خدمة."
        );

        window.location.href =
            "login.html";

        return;
    }


    // ======================================
    // فتح النافذة
    // ======================================

    modal.style.display = "flex";

    modal.style.visibility = "visible";

    modal.style.opacity = "1";

    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";


    console.log(
        "نافذة إضافة الخدمة مفتوحة ✅"
    );

}


// ==========================================
// إغلاق نافذة إضافة الخدمة
// ==========================================

function closeModal() {

    if (!modal) return;


    modal.style.display =
        "none";

    modal.style.visibility =
        "hidden";

    modal.style.opacity =
        "0";

    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";


    console.log(
        "تم إغلاق النافذة"
    );

}


// ==========================================
// زر أضف خدمتك الموجود في Hero
// ==========================================

if (heroButton) {

    heroButton.addEventListener(
        "click",
        openModal
    );

} else {

    console.error(
        "زر addServiceHeroBtn غير موجود"
    );

}


// ==========================================
// زر إضافة الآن الموجود أسفل الموقع
// ==========================================

if (addButton) {

    addButton.addEventListener(
        "click",
        openModal
    );

} else {

    console.error(
        "زر addServiceBtn غير موجود"
    );

}


// ==========================================
// زر X لإغلاق النافذة
// ==========================================

if (closeButton) {

    closeButton.addEventListener(
        "click",
        closeModal
    );

}


// ==========================================
// الضغط على الخلفية لإغلاق النافذة
// ==========================================

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


// ==========================================
// إرسال الخدمة
// ==========================================

if (form) {

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // ==================================
            // التأكد من تسجيل الدخول
            // ==================================

            if (!currentUser) {

                alert(
                    "يجب تسجيل الدخول أولًا."
                );

                window.location.href =
                    "login.html";

                return;
            }


            // ==================================
            // التأكد من بيانات الحساب
            // ==================================

            if (!currentUserData) {

                try {

                    const userRef =
                        ref(
                            database,
                            "users/" +
                            currentUser.uid
                        );


                    const snapshot =
                        await get(userRef);


                    if (
                        !snapshot.exists()
                    ) {

                        alert(
                            "بيانات الحساب غير موجودة."
                        );

                        return;
                    }


                    currentUserData =
                        snapshot.val();

                } catch (error) {

                    console.error(error);

                    alert(
                        "تعذر قراءة بيانات الحساب."
                    );

                    return;
                }

            }


            // ==================================
            // التأكد من الموافقة
            // ==================================

            if (
                currentUserData.status !==
                "approved"
            ) {

                alert(
                    "حسابك لم تتم الموافقة عليه بعد."
                );

                return;
            }


            // ==================================
            // قراءة البيانات
            // ==================================

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


            // ==================================
            // التحقق من البيانات
            // ==================================

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


            // ==================================
            // إرسال Firebase
            // ==================================

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


            } catch (error) {

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

} else {

    console.error(
        "نموذج addServiceForm غير موجود"
    );

}


// ==========================================
// عرض الخدمات المقبولة فقط
// ==========================================

if (servicesContainer) {

    const servicesRef =
        ref(
            database,
            "services"
        );


    onValue(
        servicesRef,

        (snapshot) => {

            servicesContainer.innerHTML =
                "";


            const data =
                snapshot.val();


            if (!data) {

                showEmptyServices();

                return;
            }


            let count = 0;


            Object.values(data).forEach(
                (service) => {

                    if (
                        service.status !==
                        "approved"
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


                    card.innerHTML = `

                        <div class="service-image">
                            🏪
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

                        </div>

                    `;


                    servicesContainer.appendChild(
                        card
                    );

                }
            );


            if (count === 0) {

                showEmptyServices();

            }

        },

        (error) => {

            console.error(
                "Firebase services error:",
                error
            );

        }
    );

}


// ==========================================
// لا توجد خدمات
// ==========================================

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


// ==========================================
// حماية HTML
// ==========================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value || "";


    return div.innerHTML;

}


// ==========================================
// رسالة نجاح
// ==========================================

console.log(
    "أهل البلد - script.js يعمل بنجاح ✅"
);
