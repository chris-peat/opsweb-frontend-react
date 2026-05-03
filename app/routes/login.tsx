import { getAnonymousClient } from '../apollo';
import { gql, type TypedDocumentNode } from "@apollo/client";
import { useActionState } from 'react';
import { Form, redirect, useNavigate } from 'react-router';
import type { Route } from './+types/login';

const SIGNIN: TypedDocumentNode<
  { signIn: { status: { succeeded: boolean; message: string }; accessToken: string; accessTokenExpiry: string } }
> = gql`
  mutation ($credentials: CredentialsInput!) {
  signIn(credentials: $credentials) {
    status {
      succeeded
      message
    }
    accessToken
    accessTokenExpiry
  }
}
`;

export async function clientAction({ request }: Route.ClientActionArgs) {
  let formData = await request.formData();
  const client = getAnonymousClient();
  const result = await client.mutate({
    mutation: SIGNIN,
    variables: {
      credentials: {
        username: formData.get("username"),
        password: formData.get("password")
      }
    }
  });

  console.log("Sign in result: ", result);
  if (result.data?.signIn.status.succeeded) {
    localStorage.setItem("accessToken", result.data?.signIn.accessToken!);
    localStorage.setItem("accessTokenExpiry", result.data?.signIn.accessTokenExpiry!);

    let projId = localStorage.getItem("selectedProject");
    if (projId)
      return redirect("/project/:" + projId);
    else
      return redirect("/project/:*");
  }
  else {
    return "Invalid credentials";
  }
 }

export default function Login({ actionData }: Route.ComponentProps) {

  return (
    <div>
      <Form method="post">
        <div className="m-auto w-120 h-50 p-2 bg-gray-200 rounded grid gap-2 mt-20 cols-1">
          <div className="text-lg font-bold text-center">
            This is the login page
          </div>
          <div className='text-center'>
            <label>Username:
              <input className='bg-white border mx-1' type="text" placeholder="Username" name="username" />
            </label>
          </div>
          <div className='text-center'>
            <label>Password:
              <input className='bg-white border mx-1' type="password" placeholder="Password" name="password" />
            </label>
          </div>
          {actionData ? (
            <div className='text-center text-red-500'>
              {actionData}
            </div>
          ) : null}
          <div className='text-center align-middle w-full py-2'>
            <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
              Sign In
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
