// Configuration Brevo (ex-Sendinblue) - 9000 emails gratuits/mois
export interface EmailTemplate {
  to: string
  from: string
  subject: string
  html: string
  templateData?: Record<string, unknown>
}

export interface SessionData {
  title: string
  date: string
  time: string
  trainer: string
  room: string
  type: 'in_person' | 'online' | 'hybrid'
  zoomLink?: string
  participantName: string
}

// Templates d'emails professionnels
export const emailTemplates = {
  confirmation: (sessionData: SessionData): EmailTemplate => ({
    to: '',
    from: import.meta.env.VITE_FROM_EMAIL || 'TrainingHub <noreply@votre-domaine.com>',
    subject: `✅ Inscription confirmée - ${sessionData.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation d'inscription</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">🎓 TrainingHub</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Votre inscription est confirmée !</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px 20px;">
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">Bonjour <strong>${sessionData.participantName}</strong>,</p>
            
            <p style="margin: 0 0 25px 0; font-size: 16px; color: #374151; line-height: 1.6;">
              Félicitations ! Votre inscription à la formation <strong>${sessionData.title}</strong> a été confirmée avec succès.
            </p>
            
            <!-- Session Details Card -->
            <div style="background-color: #f8fafc; border: 2px solid #e5e7eb; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="margin: 0 0 20px 0; color: #1f2937; font-size: 18px;">📅 Détails de votre formation</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #6b7280; width: 30%;"><strong>📚 Formation :</strong></td><td style="padding: 8px 0; color: #1f2937;">${sessionData.title}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;"><strong>📅 Date :</strong></td><td style="padding: 8px 0; color: #1f2937;">${sessionData.date}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;"><strong>⏰ Horaire :</strong></td><td style="padding: 8px 0; color: #1f2937;">${sessionData.time}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;"><strong>👨‍🏫 Formateur :</strong></td><td style="padding: 8px 0; color: #1f2937;">${sessionData.trainer}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;"><strong>📍 Lieu :</strong></td><td style="padding: 8px 0; color: #1f2937;">${sessionData.room}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b7280;"><strong>🎯 Mode :</strong></td><td style="padding: 8px 0; color: #1f2937;">${getSessionTypeLabel(sessionData.type)}</td></tr>
              </table>
            </div>
            
            ${sessionData.type === 'online' && sessionData.zoomLink ? `
              <!-- Zoom Access -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
                <h3 style="margin: 0 0 15px 0; font-size: 18px;">🎥 Accès à la formation en ligne</h3>
                <a href="${sessionData.zoomLink}" style="display: inline-block; background-color: white; color: #10b981; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0;">
                  🚀 Rejoindre la session Zoom
                </a>
                <p style="margin: 15px 0 5px 0; font-size: 14px; opacity: 0.9;">Lien direct : ${sessionData.zoomLink}</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">💡 Ce lien vous sera également envoyé 30 minutes avant la session</p>
              </div>
            ` : ''}
            
            <!-- Tips -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <h4 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px;">💡 Conseils pour réussir votre formation</h4>
              <ul style="margin: 0; padding-left: 20px; color: #92400e;">
                <li style="margin-bottom: 8px;">Préparez vos questions à l'avance</li>
                <li style="margin-bottom: 8px;">Munissez-vous de quoi prendre des notes</li>
                ${sessionData.type === 'online' ? '<li style="margin-bottom: 8px;">Testez votre connexion et équipement audio/vidéo</li>' : '<li style="margin-bottom: 8px;">Arrivez 10 minutes en avance</li>'}
                <li>N'hésitez pas à participer activement !</li>
              </ul>
            </div>
            
            <p style="margin: 25px 0 10px 0; font-size: 16px; color: #374151; line-height: 1.6;">
              Si vous avez des questions, n'hésitez pas à nous contacter. Nous avons hâte de vous accueillir !
            </p>
            
            <p style="margin: 20px 0 0 0; font-size: 16px; color: #374151;">
              À très bientôt,<br>
              <strong>L'équipe TrainingHub</strong> 🚀
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
              <strong>TrainingHub</strong> - Plateforme de gestion de formations professionnelles
            </p>
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">
              Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  reminder24h: (sessionData: SessionData): EmailTemplate => ({
    to: '',
    from: import.meta.env.VITE_FROM_EMAIL || 'TrainingHub <noreply@votre-domaine.com>',
    subject: `⏰ Rappel - ${sessionData.title} demain !`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">⏰ TrainingHub</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 600;">Votre formation c'est demain !</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">Bonjour <strong>${sessionData.participantName}</strong>,</p>
            
            <p style="margin: 0 0 25px 0; font-size: 16px; color: #374151; line-height: 1.6;">
              Un petit rappel amical : votre formation <strong>${sessionData.title}</strong> aura lieu <strong>demain</strong> !
            </p>
            
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="margin: 0 0 20px 0; color: #92400e; font-size: 18px;">📅 Récapitulatif</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #92400e; width: 30%;"><strong>📅 Date :</strong></td><td style="padding: 8px 0; color: #92400e; font-weight: 600;">${sessionData.date}</td></tr>
                <tr><td style="padding: 8px 0; color: #92400e;"><strong>⏰ Heure :</strong></td><td style="padding: 8px 0; color: #92400e; font-weight: 600;">${sessionData.time}</td></tr>
                <tr><td style="padding: 8px 0; color: #92400e;"><strong>📍 Lieu :</strong></td><td style="padding: 8px 0; color: #92400e; font-weight: 600;">${sessionData.room}</td></tr>
                <tr><td style="padding: 8px 0; color: #92400e;"><strong>👨‍🏫 Formateur :</strong></td><td style="padding: 8px 0; color: #92400e; font-weight: 600;">${sessionData.trainer}</td></tr>
              </table>
            </div>
            
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">✅ Derniers préparatifs</h4>
              <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                <li style="margin-bottom: 8px;">Préparez vos questions et objectifs</li>
                <li style="margin-bottom: 8px;">Apportez de quoi prendre des notes</li>
                ${sessionData.type === 'online' ? 
                  '<li style="margin-bottom: 8px;">Testez votre connexion internet et matériel</li><li style="margin-bottom: 8px;">Préparez un environnement calme</li>' : 
                  '<li style="margin-bottom: 8px;">Prévoyez d\'arriver 10 minutes en avance</li><li style="margin-bottom: 8px;">Vérifiez l\'adresse et l\'itinéraire</li>'
                }
                <li>Reposez-vous bien ce soir ! 😴</li>
              </ul>
            </div>
            
            <p style="margin: 25px 0 0 0; font-size: 16px; color: #374151; line-height: 1.6;">
              Nous avons hâte de vous retrouver demain pour cette formation enrichissante !
            </p>
            
            <p style="margin: 20px 0 0 0; font-size: 16px; color: #374151;">
              À demain !<br>
              <strong>L'équipe TrainingHub</strong> 💪
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  zoomLink: (sessionData: SessionData): EmailTemplate => ({
    to: '',
    from: import.meta.env.VITE_FROM_EMAIL || 'TrainingHub <noreply@votre-domaine.com>',
    subject: `🎥 MAINTENANT - Rejoignez ${sessionData.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🎥 TrainingHub</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 600;">C'est parti ! Votre formation commence</p>
          </div>
          
          <div style="padding: 30px 20px; text-align: center;">
            <p style="margin: 0 0 20px 0; font-size: 18px; color: #374151;">Bonjour <strong>${sessionData.participantName}</strong>,</p>
            
            <p style="margin: 0 0 30px 0; font-size: 16px; color: #374151; line-height: 1.6;">
              La formation <strong>${sessionData.title}</strong> commence dans quelques minutes !
            </p>
            
            <!-- Big Join Button -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 16px; margin: 30px 0;">
              <h3 style="margin: 0 0 20px 0; font-size: 20px;">🚀 Rejoindre la formation maintenant</h3>
              <a href="${sessionData.zoomLink}" style="display: inline-block; background-color: white; color: #10b981; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; margin: 15px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                🎯 ACCÉDER À ZOOM
              </a>
              <p style="margin: 20px 0 10px 0; font-size: 14px; opacity: 0.9; word-break: break-all;">
                Lien direct : ${sessionData.zoomLink}
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">
                💡 Cliquez sur le bouton ou copiez le lien dans votre navigateur
              </p>
            </div>
            
            <!-- Quick Tips -->
            <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: left;">
              <h4 style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 16px; text-align: center;">⚡ Vérifications rapides</h4>
              <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
                <li style="margin-bottom: 8px;">🎤 Votre micro fonctionne</li>
                <li style="margin-bottom: 8px;">📹 Votre caméra est prête (optionnel)</li>
                <li style="margin-bottom: 8px;">🌐 Votre connexion est stable</li>
                <li style="margin-bottom: 8px;">📝 Vos notes sont à portée de main</li>
                <li>☕ Vous avez votre boisson préférée !</li>
              </ul>
            </div>
            
            <p style="margin: 25px 0 0 0; font-size: 16px; color: #374151; line-height: 1.6;">
              En cas de problème technique, n'hésitez pas à nous contacter immédiatement.
            </p>
            
            <p style="margin: 20px 0 0 0; font-size: 16px; color: #374151;">
              Excellente formation !<br>
              <strong>L'équipe TrainingHub</strong> 🎓
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  cancellation: (sessionData: SessionData): EmailTemplate => ({
    to: '',
    from: import.meta.env.VITE_FROM_EMAIL || 'TrainingHub <noreply@votre-domaine.com>',
    subject: `❌ Annulation - ${sessionData.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">❌ TrainingHub</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: 600;">Formation annulée</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #374151;">Bonjour <strong>${sessionData.participantName}</strong>,</p>
            
            <p style="margin: 0 0 25px 0; font-size: 16px; color: #374151; line-height: 1.6;">
              Nous regrettons sincèrement de vous informer que la formation <strong>${sessionData.title}</strong> a dû être annulée.
            </p>
            
            <div style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 12px; padding: 25px; margin: 25px 0;">
              <h3 style="margin: 0 0 20px 0; color: #dc2626; font-size: 18px;">📅 Formation annulée</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #dc2626; width: 30%;"><strong>📚 Formation :</strong></td><td style="padding: 8px 0; color: #dc2626;">${sessionData.title}</td></tr>
                <tr><td style="padding: 8px 0; color: #dc2626;"><strong>📅 Date prévue :</strong></td><td style="padding: 8px 0; color: #dc2626;">${sessionData.date}</td></tr>
                <tr><td style="padding: 8px 0; color: #dc2626;"><strong>⏰ Heure prévue :</strong></td><td style="padding: 8px 0; color: #dc2626;">${sessionData.time}</td></tr>
              </table>
            </div>
            
            <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">📞 Prochaines étapes</h4>
              <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
                <li style="margin-bottom: 10px;"><strong>Nouvelles dates :</strong> Nous vous proposerons de nouvelles sessions très prochainement</li>
                <li style="margin-bottom: 10px;"><strong>Votre inscription :</strong> Reste valide et prioritaire pour la prochaine session</li>
                <li style="margin-bottom: 10px;"><strong>Aucune action requise :</strong> Nous vous recontacterons automatiquement</li>
                <li><strong>Remboursement :</strong> Sera traité si vous aviez effectué un paiement</li>
              </ul>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                <strong>💬 Une question ?</strong> Notre équipe est disponible pour vous aider. 
                N'hésitez pas à nous contacter si vous avez besoin de plus d'informations.
              </p>
            </div>
            
            <p style="margin: 25px 0 10px 0; font-size: 16px; color: #374151; line-height: 1.6;">
              Nous nous excusons sincèrement pour ce contretemps et vous remercions pour votre compréhension.
            </p>
            
            <p style="margin: 20px 0 0 0; font-size: 16px; color: #374151;">
              Cordialement,<br>
              <strong>L'équipe TrainingHub</strong>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}

function getSessionTypeLabel(type: string): string {
  switch (type) {
    case 'online': return '🌐 Formation en ligne (Zoom)'
    case 'hybrid': return '🔄 Formation hybride (Présentiel + Zoom)'
    case 'in_person': return '🏢 Formation en présentiel'
    default: return type
  }
}

// Fonction d'envoi avec Brevo API
export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  try {
    if (!import.meta.env.VITE_BREVO_API_KEY) {
      console.log('📧 Mode simulation Brevo - Email qui aurait été envoyé:', {
        to: template.to,
        subject: template.subject,
        service: 'Brevo (9000 emails gratuits/mois)'
      })
      return true
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': import.meta.env.VITE_BREVO_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          email: template.from.includes('<') ? 
            template.from.match(/<(.+)>/)?.[1] : template.from,
          name: template.from.includes('<') ? 
            template.from.split('<')[0].trim() : 'TrainingHub'
        },
        to: [{ email: template.to }],
        subject: template.subject,
        htmlContent: template.html
      })
    })

    if (response.ok) {
      console.log('📧 Email envoyé avec succès via Brevo à:', template.to)
      return true
    } else {
      const error = await response.text()
      console.error('❌ Erreur Brevo:', error)
      return false
    }
  } catch (error) {
    console.error('❌ Erreur envoi email Brevo:', error)
    return false
  }
}

// Fonctions d'envoi spécialisées
export async function sendConfirmationEmail(sessionData: SessionData, participantEmail: string) {
  const template = emailTemplates.confirmation(sessionData)
  template.to = participantEmail
  return await sendEmail(template)
}

export async function sendReminderEmail(sessionData: SessionData, participantEmail: string) {
  const template = emailTemplates.reminder24h(sessionData)
  template.to = participantEmail
  return await sendEmail(template)
}

export async function sendZoomLinkEmail(sessionData: SessionData, participantEmail: string) {
  const template = emailTemplates.zoomLink(sessionData)
  template.to = participantEmail
  return await sendEmail(template)
}

export async function sendCancellationEmail(sessionData: SessionData, participantEmail: string) {
  const template = emailTemplates.cancellation(sessionData)
  template.to = participantEmail
  return await sendEmail(template)
}