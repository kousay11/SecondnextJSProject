'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
interface ContactFormProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    emailAddresses: { emailAddress: string }[];
  } | null;
  dbUser?: { name: string; email: string } | null;
}

export default function ContactForm({ user, dbUser }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: dbUser?.name || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''),
    email: dbUser?.email || user?.emailAddresses?.[0]?.emailAddress || '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Le numéro de téléphone doit contenir exactement 8 chiffres';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Si l'utilisateur n'est pas connecté, afficher la demande de connexion
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage('Message envoyé avec succès !');
        setFormData({
          name: dbUser?.name || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''),
          email: dbUser?.email || user?.emailAddresses?.[0]?.emailAddress || '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        setSubmitMessage('Erreur lors de l\'envoi du message: ' + (errorData.error || 'Erreur inconnue'));
      }
    } catch {
      setSubmitMessage('Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Contactez-nous</h1>
      
      {/* Message de demande de connexion */}
      {showLoginPrompt && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Connexion requise</h3>
          <p className="text-blue-700 mb-3">
            Pour envoyer un message, vous devez être connecté. Cela nous permet de mieux vous identifier et de répondre à votre demande.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/sign-in')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Se connecter
            </button>
            <button
              onClick={() => router.push('/sign-up')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Créer un compte
            </button>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Votre nom complet"
            disabled={!!user}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="votre@email.com"
            disabled={!!user}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone * (8 chiffres)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Votre numéro de téléphone"
            maxLength={8}
            pattern="\d{8}"
            inputMode="numeric"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Sujet *
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.subject ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionnez un sujet</option>
            <option value="GENERAL_INQUIRY">Demande générale</option>
            <option value="TECHNICAL_SUPPORT">Support technique</option>
            <option value="BILLING_QUESTION">Question de facturation</option>
            <option value="PRODUCT_QUESTION">Question sur un produit</option>
            <option value="COMPLAINT">Réclamation</option>
            <option value="SUGGESTION">Suggestion</option>
            <option value="OTHER">Autre</option>
          </select>
          {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Votre message..."
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>

        {submitMessage && (
          <div className={`p-4 rounded-md ${
            submitMessage.includes('succès') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {submitMessage}
          </div>
        )}
      </form>

      {/* Fin du formulaire, plus de FAQ ici */}
    </div>
  );
}