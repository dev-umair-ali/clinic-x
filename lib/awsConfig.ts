import { Amplify } from 'aws-amplify'

type CognitoLoginWith = {
  email?: boolean
  username?: boolean
  oauth?: {
    domain: string
    scopes: string[]
    redirectSignIn: string[]
    redirectSignOut: string[]
    responseType: 'code' | 'token'
  }
}

type AmplifyCognitoConfig = {
  region: string
  userPoolId: string
  userPoolClientId: string
  loginWith: CognitoLoginWith
  signUpVerificationMethod: 'code' | 'link'
  userAttributes: {
    email: { required: boolean }
    name: { required: boolean }
  }
  passwordFormat: {
    minLength: number
    requireLowercase: boolean
    requireUppercase: boolean
    requireNumbers: boolean
    requireSpecialCharacters: boolean
  }
}

type AmplifyConfigType = {
  Auth: {
    Cognito: AmplifyCognitoConfig
  }
}

const amplifyConfig: AmplifyConfigType = {
  Auth: {
    Cognito: {
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-north-1',
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || 'eu-north-1_bgEkqoJLI',
      userPoolClientId:
        process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID ||
        '75sgp2n2jgl32u3e4q8dqjjf93',
      loginWith: {
        email: true,
        username: false,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
        name: {
          required: true,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
}

// Optional OAuth configuration
const oauthDomain = process.env.NEXT_PUBLIC_AWS_OAUTH_DOMAIN
if (oauthDomain) {
  amplifyConfig.Auth.Cognito.loginWith.oauth = {
    domain: oauthDomain,
    scopes: ['email', 'openid', 'profile'],
    redirectSignIn: ['https://api.clinicx.io/'],
    redirectSignOut: ['https://api.clinicx.io/'],
    responseType: 'code',
  }
}

Amplify.configure(amplifyConfig)

export default amplifyConfig
