import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


// ==========================================
// Firebase Configuration
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


// ==========================================
// Initialize Firebase
// ==========================================

const app = initializeApp(firebaseConfig);

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


// ==========================================
// فتح نافذة إضافة الخدمة
// ==========================================

function openModal() {

  if (!addServiceModal) return;

  addServiceModal.classList.add("active");

  addServiceModal.setAttribute(
    "aria-hidden",
    "false"
  );
}


// ==========================================
// إغلاق نافذة إضافة الخدمة
// ==========================================

function closeModal() {

  if (!addServiceModal) return;

  addServiceModal.classList.remove("active");

  addServiceModal.setAttribute(
    "aria-hidden",
    "true"
  );
}


// ==========================================
// زر أضف خدمتك
// ==========================================

if (addServiceHeroBtn) {

  addServiceHeroBtn.addEventListener(
    "click",
    openModal
  );

}


// ==========================================
// زر إضافة الآن
// ==========================================

if (addServiceBtn) {

  addServiceBtn.addEventListener(
    "click",
    openModal
  );

}


// ==========================================
// زر إغلاق النافذة
// ==========================================

if (closeModalBtn) {

  closeModalBtn.addEventListener(
    "click",
    closeModal
  );

}


// ==========================================
// الضغط على الخلفية لإغلاق النافذة
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
// إضافة خدمة إلى Firebase
// ==========================================

if (form) {

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


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


      // التأكد من البيانات

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

            name: name,

            category: category,

            description: description,

            phone: phone,

            address: address,

            status: "pending",

            createdAt: Date.now()

          }
        );


        alert(
          "تم إرسال طلبك للمراجعة بنجاح ✅"
        );


        form.reset();

        closeModal();


      } catch (error) {

        console.error(error);

        alert(
          "حدث خطأ أثناء إرسال البيانات."
        );

      }

    }
  );

}


// ==========================================
// عرض الخدمات المقبولة فقط
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


    servicesContainer.innerHTML = "";


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


    let approvedCount = 0;


    Object.values(data).forEach(
      (service) => {

        if (
          service.status !== "approved"
        ) {

          return;

        }


        approvedCount++;


        const card =
          document.createElement("div");


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
