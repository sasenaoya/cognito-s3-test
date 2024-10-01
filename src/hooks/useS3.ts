import { useRef, useState } from 'react';
import AWS from 'aws-sdk';
import Cookies from 'js-cookie';

AWS.config.region = process.env.NEXT_PUBLIC_AWS_REGION;

export type AuthenticateCallback = (err: AWS.AWSError | undefined) => void;
export type GetListCallback = (err: AWS.AWSError | undefined, data: AWS.S3.Types.ListObjectsOutput) => void;

export const useS3 = () => {
  const authenticate = (callback: AuthenticateCallback) => {
    const token = Cookies.get("TOKEN") ?? '';

    const credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID ?? '',
      Logins: {
        [`cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_AWS_USER_POOL_ID}`]: token,
      },
    });
    AWS.config.credentials = credentials;

    credentials.refresh(callback);
  }

  const getList = (callback: GetListCallback) => {
    const s3 = new AWS.S3;
    s3.listObjects({ Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET ?? '' }, callback);
  };

  const ref = useRef({ authenticate, getList });
  return {
    authenticate: ref.current.authenticate,
    getList: ref.current.getList,
   };
};