// src/api.ts

const BASE_URL = 'http://localhost:3001'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export async function apiRequest<T>(
  endpoint: string,
  method: Method = 'GET',
  body?: any
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
      throw new Error(`Erro do servidor: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Erro na requisição para ${endpoint}:`, error)
    throw error
  }
}

// Chamadas específicas (opcional)
export const getBalls = () => apiRequest<{ balls: number[] }>('/balls', 'GET')
export const postBall = (number: number) => apiRequest<{ balls: number[] }>('/balls', 'POST', { number })
export const getZoom = () => apiRequest<{ ctrlZoomPanel: number, sortedZoomPanel: number }>('/zoom', 'GET')
export const postZoom = (ctrlZoomPanel: number, sortedZoomPanel: number) => apiRequest<{ action: string, ctrlZoomPanel: number, sortedZoomPanel: number }>('/zoom', 'POST', { ctrlZoomPanel, sortedZoomPanel })
export const postBallClear = () => apiRequest<{ action: string }>('/balls/clear', 'POST', {})