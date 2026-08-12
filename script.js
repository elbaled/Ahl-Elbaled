script.js — أهل البلد

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  getDatabase,
  ref,
  push,
  set,
  get,
  onValue
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

const form =
  document.getElementById("addServiceForm");

const servicesContainer =
  document.getElementById("servicesContainer");

const addServiceHeroBtn =
  document.getElementById("addServiceHeroBtn");

const addServiceBtn =
  document.getElementById("addServiceBtn");

const addServiceModal =
  document.getElementById("addServiceModal");

const closeModalBtn =
  document.getElementById("closeModalBtn");

const loginBtn =
  document.getElementById("loginBtn");


// ==========================================
// بيانات المستخدم الحالي
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


    // ========================================
    // المستخدم غير مسجل
    // ========================================

    if (!user) {

      if (loginBtn) {

        loginBtn.innerHTML = "👤 دخول";

        loginBtn.href = "login.html";

      }

      return;
    }


    // ========================================
    // جلب بيانات المستخدم
    // ========================================

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

      }


      // ======================================
      // عرض اسم المستخدم
      // ======================================

      if (loginBtn) {

        const name =
          currentUserData?.name ||
          user.displayName ||
          "حسابي";


        loginBtn.innerHTML =
          "👤 " + escapeHTML(name);


        loginBtn.href =
          "#";

        loginBtn.onclick =
          (event) => {

            event.preventDefault();

            alert(
              "أهلاً بيك " +
              name +
              " 👋"
            );

          };

      }


      // ======================================
      // إذا كان أدمن
      // ======================================

      if (
        currentUserData &&
        currentUserData.role === "admin" &&
        currentUserData.status === "approved"
      ) {

        createAdminButton();

      }

    } catch (error) {

      console.error(
        "خطأ في قراءة بيانات المستخدم:",
        error
      );

    }

  }
);


// ==========================================
// إنشاء زر الإدارة للأدمن
// ==========================================

function createAdminButton() {

  const headerActions =
    document.querySelector(
      ".header-actions"
    );


  if (!headerActions) return;


  // منع تكرار الزر

  if (
    document.getElementById(
      "adminPanelBtn"
    )
  ) {

    return;

  }


  const adminButton =
    document.createElement("a");


  adminButton.id =
    "adminPanelBtn";


  adminButton.href =
    "admin.html";


  adminButton.className =
    "login-btn";


  adminButton.innerHTML =
    "⚙️ لوحة الإدارة";


  headerActions.appendChild(
    adminButton
  );

}


// ==========================================
// فتح نافذة إضافة الخدمة
// ==========================================

function openModal() {

  if (!addServiceModal) return;


  // ========================================
  // لازم يكون المستخدم مسجل دخول
  // ========================================

  if (!currentUser) {

    alert(
      "لازم تعمل حساب وتسجل الدخول أولًا لإضافة خدمة 🔐"
    );


    window.location.href =
      "login.html";


    return;

  }


  // ========================================
  // التأكد أن الحساب معتمد
  // ========================================

  if (
    currentUserData &&
    currentUserData.status !== "approved"
  ) {

    alert(
      "حسابك لم تتم الموافقة عليه بعد ⏳"
    );


    return;

  }


  addServiceModal.classList.add(
    "active"
  );


  addServiceModal.setAttribute(
    "aria-hidden",
    "false"
  );

}


// ==========================================
// إغلاق النافذة
// ==========================================

function closeModal() {

  if (!addServiceModal) return;


  addServiceModal.classList.remove(
    "active"
  );


  addServiceModal.setAttribute(
    "aria-hidden",
    "true"
  );

}


// ==========================================
// أزرار إضافة الخدمة
// ==========================================

if (addServiceHeroBtn) {

  addServiceHeroBtn.addEventListener(
    "click",
    openModal
  );

}


if (addServiceBtn) {

  addServiceBtn.addEventListener(
    "click",
    openModal
  );

}


if (closeModalBtn) {

  closeModalBtn.addEventListener(
    "click",
    closeModal
  );

}


// ==========================================
// إغلاق عند الضغط على الخلفية
// ==========================================

if (addServiceModal) {

  const overlay =
    addServiceModal.querySelector(
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
// إضافة خدمة
// ==========================================

if (form) {

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      // ======================================
      // التأكد من تسجيل الدخول
      // ======================================

      if (!currentUser) {

        alert(
          "لازم تعمل حساب وتسجل الدخول أولًا."
        );

        window.location.href =
          "login.html";

        return;

      }


      // ======================================
      // التأكد من موافقة الحساب
      // ======================================

      if (
        !currentUserData ||
        currentUserData.status !== "approved"
      ) {

        alert(
          "حسابك لم تتم الموافقة عليه من الإدارة بعد ⏳"
        );

        return;

      }


      const name =
        document
          .getElementById("serviceName")
          ?.value
          .trim();


      const category =
        document
          .getElementById("serviceCategory")
          ?.value;


      const description =
        document
          .getElementById("serviceDescription")
          ?.value
          .trim();


      const phone =
        document
          .getElementById("servicePhone")
          ?.value
          .trim();


      const address =
        document
          .getElementById("serviceAddress")
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
          push(servicesRef);


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

            accountNumber:
              currentUserData.accountNumber || null,

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

        console.error(error);


        alert(
          "حدث خطأ أثناء إرسال الخدمة."
        );

      }

    }
  );

}


// ==========================================
// عرض الخدمات المقبولة
// ==========================================

const servicesRef =
  ref(
    database,
    "services"
  );


onValue(
  servicesRef,
  (snapshot) => {

    if (!servicesContainer) return;


    servicesContainer.innerHTML =
      "";


    const data =
      snapshot.val();


    if (!data) {

      servicesContainer.innerHTML = `

        <div class="empty-state">

          <span>📭</span>

          <h3>
            لا توجد خدمات منشورة حاليًا
          </h3>

          <p>
            سيتم عرض الخدمات بعد اعتمادها.
          </p>

        </div>

      `;

      return;

    }


    let approvedCount =
      0;


    Object.values(data).forEach(
      (service) => {

        if (
          service.status !==
          "approved"
        ) {

          return;

        }


        approvedCount++;


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


    if (
      approvedCount === 0
    ) {

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

  },

  (error) => {

    console.error(
      "Firebase error:",
      error
    );

  }
);


// ==========================================
// حماية النصوص
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


console.log(
  "أهل البلد يعمل مع Firebase ✅"
);
