import {
  getDatabase,
  ref,
  push,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const database = getDatabase();

// عناصر الصفحة
const form = document.getElementById("addServiceForm");
const servicesContainer = document.getElementById("servicesContainer");

// إضافة خدمة
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("serviceName")?.value.trim();
    const category = document.getElementById("serviceCategory")?.value;
    const description = document.getElementById("serviceDescription")?.value.trim();
    const phone = document.getElementById("servicePhone")?.value.trim();
    const address = document.getElementById("serviceAddress")?.value.trim();

    if (!name || !category || !description || !phone || !address) {
      alert("من فضلك املأ جميع البيانات المطلوبة.");
      return;
    }

    try {
      const servicesRef = ref(database, "services");
      const newService = push(servicesRef);

      await set(newService, {
        name,
        category,
        description,
        phone,
        address,
        status: "pending",
        createdAt: Date.now()
      });

      alert("تم إرسال طلبك للمراجعة بنجاح ✅");

      form.reset();

    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء إرسال البيانات.");
    }
  });
}

// عرض الخدمات المقبولة فقط
const servicesRef = ref(database, "services");

onValue(servicesRef, (snapshot) => {

  if (!servicesContainer) return;

  servicesContainer.innerHTML = "";

  const data = snapshot.val();

  if (!data) {
    servicesContainer.innerHTML = `
      <div class="empty-state">
        <span>📭</span>
        <h3>لا توجد خدمات منشورة حاليًا</h3>
        <p>سيتم عرض الخدمات بعد اعتمادها.</p>
      </div>
    `;
    return;
  }

  let approvedCount = 0;

  Object.values(data).forEach((service) => {

    if (service.status !== "approved") return;

    approvedCount++;

    const card = document.createElement("div");

    card.className = "service-card";

    card.innerHTML = `
      <div class="service-image">
        🏪
      </div>

      <div class="service-content">

        <h3>${escapeHTML(service.name)}</h3>

        <p>${escapeHTML(service.description)}</p>

        <div class="service-meta">

          <span class="meta-item">
            📍 ${escapeHTML(service.address)}
          </span>

          <span class="meta-item">
            📞 ${escapeHTML(service.phone)}
          </span>

        </div>

      </div>
    `;

    servicesContainer.appendChild(card);
  });

  if (approvedCount === 0) {

    servicesContainer.innerHTML = `
      <div class="empty-state">
        <span>⏳</span>
        <h3>لا توجد خدمات منشورة حاليًا</h3>
        <p>الخدمات الجديدة تظهر بعد موافقة الإدارة.</p>
      </div>
    `;
  }

});

// حماية النصوص
function escapeHTML(value) {

  const div = document.createElement("div");

  div.textContent = value || "";

  return div.innerHTML;
}

console.log("أهل البلد يعمل مع Firebase ✅");
