'use server'

export async function getAwsConfig() {

  return {
    aws_project_region: process.env.AUTH_AWS_REGION,
    aws_user_pools_id: process.env.AUTH_AWS_USER_POOL_ID,
    aws_user_pools_web_client_id: process.env.AUTH_AWS_USER_POOL_WEB_CLIENT_ID,
    Auth: {
      Cognito: {
        userPoolClientId: process.env.AUTH_AWS_USER_POOL_WEB_CLIENT_ID,
        userPoolId: process.env.AUTH_AWS_USER_POOL_ID,
      },
    }
  };
}
