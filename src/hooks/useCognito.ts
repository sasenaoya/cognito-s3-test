import { useRef, useState } from "react";
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession, IAuthenticationCallback } from "amazon-cognito-identity-js";
import Cookies from 'js-cookie';

// 手抜きだけど、ページ変わった時も残っててほしいのでグローバル変数で保持
let requiredAttributes: any;
let cognitoUser: CognitoUser | undefined;

export const useCognito = () => {
  const [session, setSession] = useState<CognitoUserSession>();
  const [error, setError] = useState<any>();
  const [needPasswordVerify, setNeedPasswordVerify] = useState(false);

  /** 認証 */
  const authenticateUser = (username: string, password: string) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    var userPool = new CognitoUserPool({
      UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID ?? '',
      ClientId: process.env.NEXT_PUBLIC_AWS_CLIENT_ID ?? '',
    });

    cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => authenticationSuccess(session),
      onFailure: (err) => {
        console.error(err);
        setError(err);
      },
      newPasswordRequired: (userAttributes, _requiredAttributes) => {
        requiredAttributes = _requiredAttributes;
        setNeedPasswordVerify(true);
      },
    });
  };

  /** パスワード変更 */
  const resetPassword = (newPassword: string) => {
    cognitoUser!.completeNewPasswordChallenge(newPassword, requiredAttributes, {
      onSuccess: (session) => authenticationSuccess(session),
      onFailure: (err) => {
        console.error(err);
        setError(err);
      },
    });
  };

  const authenticationSuccess = (session: CognitoUserSession) => {
    setSession(session),
    Cookies.set("TOKEN", session.getIdToken().getJwtToken(), { path: '/' });
  };

  const ref = useRef({ authenticateUser, resetPassword });
  return {
    authenticateUser: ref.current.authenticateUser,
    resetPassword: ref.current.resetPassword,
    session,
    error,
    needPasswordVerify,
  };
};
