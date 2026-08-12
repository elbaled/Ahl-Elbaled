// ========================================
// أهل البلد - Main JavaScript
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // العناصر الأساسية
    // ==============================

    const addServiceModal =
        document.getElementById("addServiceModal");

    const addServiceBtn =
        document.getElementById("addServiceBtn");

    const addServiceHeroBtn =
        document.getElementById("addServiceHeroBtn");

    const closeModalBtn =
        document.getElementById("closeModalBtn");

    const modalOverlay =
        document.querySelector(".modal-overlay");

    const addServiceForm =
        document.getElementById("addServiceForm");

    const notificationBtn =
        document.getElementById("notificationBtn");

    const notificationsPanel =
        document.getElementById("notificationsPanel");

    const closeNotificationsBtn =
        document.getElementById("closeNotificationsBtn");

    const searchInput =
        document.getElementById("searchInput");

    const searchBtn =
        document.getElementById("searchBtn");

    const servicesContainer =
        document.getElementById("servicesContainer");


    // ==============================
    // فتح نافذة إضافة الخدمة
    // ==============================

    function openAddServiceModal() {

        if (!addServiceModal) return;

        addServiceModal.classList.add("active");
        addServiceModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";
    }


    // ==============================
    // إغلاق نافذة إضافة الخدمة
    // ==============================

    function closeAddServiceModal() {

        if (!addServiceModal) return;

        addServiceModal.classList.remove("active");
        addServiceModal.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow = "";
    }


    // ==============================
    // أزرار إضافة الخدمة
    // ==============================

    if (addServiceBtn) {

        addServiceBtn.addEventListener(
            "click",
            openAddServiceModal
        );
    }


    if (addServiceHeroBtn) {

        addServiceHeroBtn.addEventListener(
            "click",
            openAddServiceModal
        );
    }


    if (closeModalBtn) {

        closeModalBtn.addEventListener(
            "click",
            closeAddServiceModal
        );
    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeAddServiceModal
        );
    }


    // ==============================
    // إغلاق النافذة بزر ESC
    // ==============================

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {

                closeAddServiceModal();

            }

        }
    );


    // ==============================
    // نموذج إضافة الخدمة
    // ==============================

    if (addServiceForm) {

        addServiceForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const serviceName =
                    document.getElementById(
                        "serviceName"
                    ).value.trim();

                const serviceCategory =
                    document.getElementById(
                        "serviceCategory"
                    ).value;

                const serviceDescription =
                    document.getElementById(
                        "serviceDescription"
                    ).value.trim();

                const servicePhone =
                    document.getElementById(
                        "servicePhone"
                    ).value.trim();

                const serviceAddress =
                    document.getElementById(
                        "serviceAddress"
                    ).value.trim();


                if (
                    !serviceName ||
                    !serviceCategory ||
                    !serviceDescription ||
                    !servicePhone ||
                    !serviceAddress
                ) {

                    alert(
                        "من فضلك املأ جميع البيانات المطلوبة."
                    );

                    return;
                }


                /*
                 * مؤقتًا سنعرض رسالة فقط.
                 *
                 * في المرحلة القادمة:
                 * البيانات هتروح إلى Firebase
                 * بحالة:
                 *
                 * pending
                 *
                 * وبعد موافقة الإدارة
                 * تتحول إلى:
                 *
                 * approved
                 */


                alert(
                    "تم إرسال الخدمة للمراجعة بنجاح ✅"
                );


                addServiceForm.reset();

                closeAddServiceModal();

            }
        );

    }


    // ==============================
    // الإشعارات
    // ==============================

    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            () => {

                if (!notificationsPanel) return;

                notificationsPanel.classList.toggle(
                    "active"
                );

                const isOpen =
                    notificationsPanel.classList.contains(
                        "active"
                    );

                notificationsPanel.setAttribute(
                    "aria-hidden",
                    isOpen ? "false" : "true"
                );

            }
        );

    }


    if (closeNotificationsBtn) {

        closeNotificationsBtn.addEventListener(
            "click",
            () => {

                notificationsPanel.classList.remove(
                    "active"
                );

                notificationsPanel.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }
        );

    }


    // ==============================
    // البحث
    // ==============================

    function searchServices() {

        const searchText =
            searchInput
                ? searchInput.value.trim().toLowerCase()
                : "";


        if (!searchText) {

            alert(
                "اكتب اسم الخدمة أو المحل الذي تبحث عنه."
            );

            return;
        }


        /*
         * البحث الحقيقي في الخدمات
         * هنربطه ببيانات Firebase
         * في المرحلة القادمة.
         */

        alert(
            `جاري البحث عن: ${searchText}`
        );

    }


    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            searchServices
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {

                    searchServices();

                }

            }
        );

    }


    // ==============================
    // التصنيفات
    // ==============================

    const categoryButtons =
        document.querySelectorAll(
            ".category-card"
        );


    categoryButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const category =
                        button.dataset.category;

                    /*
                     * لاحقًا هنستخدم category
                     * لعرض الخدمات الخاصة بالقسم
                     * من Firebase.
                     */

                    if (servicesContainer) {

                        servicesContainer.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }
            );

        }
    );


    // ==============================
    // تسجيل الدخول
    // ==============================

    const loginBtn =
        document.getElementById("loginBtn");


    if (loginBtn) {

        loginBtn.addEventListener(
            "click",
            () => {

                alert(
                    "صفحة تسجيل الدخول هنضيفها في المرحلة القادمة."
                );

            }
        );

    }


    // ==============================
    // رسالة بداية الموقع
    // ==============================

    console.log(
        "أهل البلد يعمل بنجاح ✅"
    );

});
