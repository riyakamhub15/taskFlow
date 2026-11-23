self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : {};

  const options = {
    body: data.body || "You have an upcoming task deadline!",
    icon: "/vite.svg",
    badge: "/vite.svg",
    data: {
      url: data.url || "/dashboard",
    },
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "TaskFlow Reminder",
      options
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(
      event.notification.data.url || "/dashboard"
    )
  );
});