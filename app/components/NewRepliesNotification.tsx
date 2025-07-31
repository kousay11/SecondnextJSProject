"use client";
import { useEffect, useState } from "react";

export default function NewRepliesNotification() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier s'il y a une notification à afficher
    fetch("/api/messages/notify")
      .then((res) => res.json())
      .then((data) => {
        if (data.notify) {
          setShow(true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleClose = async () => {
    setShow(false);
    // Marquer la notification comme vue côté serveur
    await fetch("/api/messages/notify/mark", { method: "POST" });
  };

  if (!show || loading) return null;

  return (
    <div className="fixed top-6 right-6 z-50 bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded shadow-lg animate-bounce">
      <div className="flex items-center gap-4">
        <span>Votre message a été traité ! Consultez votre boîte mail 📧</span>
        <button
          onClick={handleClose}
          className="ml-4 px-3 py-1 bg-green-400 text-white rounded hover:bg-green-500 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}
