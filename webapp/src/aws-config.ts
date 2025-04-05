import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_Mek0EYbHc',
      userPoolClientId: '4vks1t7k7ot8n33be4611l6c1d'
    }
  }
});