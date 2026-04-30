import { getAnonymousClient } from '../apollo';
import { gql, type TypedDocumentNode } from "@apollo/client";
import { useActionState } from 'react';
import { redirect, useNavigate } from 'react-router';

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

async function submitForm(prevState: any, formData: any): Promise<{ succeeded: boolean; message: string, requested: boolean }> {
  const client = getAnonymousClient();
  client.mutate({
    mutation: SIGNIN,
    variables: {
      credentials: {
        username: formData.get("username"),
        password: formData.get("password")
      }
    }
  }).then(result => {
    console.log("Sign in result: ", result);
    if (result.data?.signIn.status.succeeded) {
      localStorage.setItem("accessToken", result.data?.signIn.accessToken!);
      localStorage.setItem("accessTokenExpiry", result.data?.signIn.accessTokenExpiry!);
      return { succeeded: true, message: "Sign in successful", requested: true };
    }
    return result.data?.signIn.status || { succeeded: false, message: "Unknown error", requested: true };
  }).catch(error => {
    console.error("Sign in error: ", error);
    return { data: { signIn: { status: { succeeded: false, message: error.message }, accessToken: "", accessTokenExpiry: "" } }, requested: true };
  });

  return { succeeded: true, message: "Sign in successful", requested: true };
}

export default function Login() {
  const [state, formAction, isPending] = useActionState(submitForm, { succeeded: false, message: "", requested: false });
  
  if (!isPending && state?.succeeded) {
    let projId = localStorage.getItem("selectedProject");
    if (projId) 
      // window.location.href = "/project/:" + projId;
      return redirect("/project/:" + projId);
    else
      return redirect("/project/:*");
    // return (
    //   <div>Redirecting...</div>
    // );
  }

  if (!isPending && state?.requested) {
    console.log("Login failed: ", state?.message);
    return (
       <div>Login failed: {state?.message}</div>
    );
  }

  console.log("Login state: ", state, " isPending: ", isPending, " succeeded: ", state?.succeeded);
  return (
    <form action={formAction}>
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
        <div className='text-center align-middle w-full py-2'>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </div>

      </div>
    </form>
  );
}
