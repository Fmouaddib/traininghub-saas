import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

export interface ZoomMeeting {
  id: string
  topic: string
  start_time: string
  duration: number
  join_url: string
  password?: string
}

export interface ZoomConfig {
  account_id: string
  client_id: string
  client_secret: string
  access_token?: string
  refresh_token?: string
}

export async function getZoomAccessToken(): Promise<string> {
  try {
    if (!import.meta.env.VITE_ZOOM_ACCOUNT_ID || 
        !import.meta.env.VITE_ZOOM_CLIENT_ID || 
        !import.meta.env.VITE_ZOOM_CLIENT_SECRET) {
      console.log('🎥 Mode simulation Zoom - Configuration manquante')
      return 'simulation-token'
    }

    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${import.meta.env.VITE_ZOOM_CLIENT_ID}:${import.meta.env.VITE_ZOOM_CLIENT_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'account_credentials',
        account_id: import.meta.env.VITE_ZOOM_ACCOUNT_ID
      })
    })

    if (!response.ok) {
      throw new Error(`Erreur Zoom OAuth: ${response.status}`)
    }

    const data = await response.json()
    return data.access_token

  } catch (error) {
    console.error('Erreur lors de la récupération du token Zoom:', error)
    return 'simulation-token'
  }
}

export async function createZoomMeeting(sessionData: {
  topic: string
  start_time: string
  duration: number
  agenda?: string
}): Promise<ZoomMeeting> {
  try {
    const accessToken = await getZoomAccessToken()
    
    if (accessToken === 'simulation-token') {
      const simulatedMeeting: ZoomMeeting = {
        id: `sim_${Date.now()}`,
        topic: sessionData.topic,
        start_time: sessionData.start_time,
        duration: sessionData.duration,
        join_url: `https://zoom.us/j/simulation-${Date.now()}`,
        password: 'simulation123'
      }
      
      console.log('🎥 Mode simulation Zoom - Réunion créée:', {
        topic: simulatedMeeting.topic,
        url: simulatedMeeting.join_url,
        password: simulatedMeeting.password
      })
      
      return simulatedMeeting
    }

    const meetingData = {
      topic: sessionData.topic,
      type: 2,
      start_time: new Date(sessionData.start_time).toISOString(),
      duration: sessionData.duration,
      timezone: 'Europe/Paris',
      agenda: sessionData.agenda || '',
      settings: {
        host_video: true,
        participant_video: true,
        cn_meeting: false,
        in_meeting: false,
        join_before_host: false,
        mute_upon_entry: true,
        watermark: false,
        use_pmi: false,
        approval_type: 2,
        audio: 'both',
        auto_recording: 'none',
        enforce_login: false,
        registrants_email_notification: true,
        waiting_room: true,
        meeting_authentication: false
      }
    }

    const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meetingData)
    })

    if (!response.ok) {
      throw new Error(`Erreur création meeting Zoom: ${response.status}`)
    }

    const meeting = await response.json()
    
    return {
      id: meeting.id.toString(),
      topic: meeting.topic,
      start_time: meeting.start_time,
      duration: meeting.duration,
      join_url: meeting.join_url,
      password: meeting.password
    }

  } catch (error) {
    console.error('Erreur lors de la création du meeting Zoom:', error)
    throw error
  }
}

export async function updateZoomMeeting(
  meetingId: string, 
  updateData: Partial<{
    topic: string
    start_time: string
    duration: number
    agenda: string
  }>
): Promise<boolean> {
  try {
    const accessToken = await getZoomAccessToken()
    
    if (accessToken === 'simulation-token') {
      console.log('🎥 Mode simulation Zoom - Réunion mise à jour:', {
        meetingId,
        updateData
      })
      return true
    }

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic: updateData.topic,
        start_time: updateData.start_time ? new Date(updateData.start_time).toISOString() : undefined,
        duration: updateData.duration,
        agenda: updateData.agenda
      })
    })

    return response.ok

  } catch (error) {
    console.error('Erreur lors de la mise à jour du meeting Zoom:', error)
    return false
  }
}

export async function deleteZoomMeeting(meetingId: string): Promise<boolean> {
  try {
    const accessToken = await getZoomAccessToken()
    
    if (accessToken === 'simulation-token') {
      console.log('🎥 Mode simulation Zoom - Réunion supprimée:', meetingId)
      return true
    }

    const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    return response.ok

  } catch (error) {
    console.error('Erreur lors de la suppression du meeting Zoom:', error)
    return false
  }
}

export async function saveZoomMeetingToDatabase(
  sessionId: string, 
  zoomMeeting: ZoomMeeting
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('training_sessions')
      .update({
        zoom_meeting_id: zoomMeeting.id,
        zoom_join_url: zoomMeeting.join_url,
        zoom_password: zoomMeeting.password
      })
      .eq('id', sessionId)

    if (error) {
      console.error('Erreur sauvegarde Zoom en base:', error)
      return false
    }

    return true

  } catch (error) {
    console.error('Erreur lors de la sauvegarde du meeting Zoom:', error)
    return false
  }
}