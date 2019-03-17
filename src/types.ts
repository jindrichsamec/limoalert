export interface FetchAccessTokenResponse {
  ok: boolean,
  access_token: string,
  scope: string,
  user_id: string,
  team_name: string,
  team_id: string
}

export interface SendMessageResponse {
  ok: boolean
  error: string
  warning: string
  response_metadata: {
    warnings: Array<string>
  }
}
