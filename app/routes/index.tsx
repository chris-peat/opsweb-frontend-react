import { useNavigate } from 'react-router';
import type { Route } from './+types/login';
import { useEffect } from 'react';

export default function Index({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // check for valid access token, if not present redirect to login

    const accessToken = localStorage.getItem("accessToken");
    const accessTokenExpiry = localStorage.getItem("accessTokenExpiry");

    if (!accessToken || !accessTokenExpiry) {
      navigate("/login");
      //return null;
    }

    if (Date.parse(accessTokenExpiry!) <  Date.now()) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("accessTokenExpiry");
      navigate("/login");
      //return null;
    }

    // If we have a valid token, redirect to the last selected project
    let projId = localStorage.getItem("selectedProject");
    if (projId) {
      navigate("/project/:" + projId);
      //return null;
    }
  }, []);

  return (
    <div>Index</div>
  );
}
