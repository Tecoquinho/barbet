import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSessionStore } from "../stores/sessionStore";

export function useRequireSession() {
  const navigate = useNavigate();
  const params = useParams();
  const { session, hydrate } = useSessionStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!session && params.barSlug && params.mesaCodigo) {
      navigate(`/bar/${params.barSlug}/mesa/${params.mesaCodigo}`, { replace: true });
    }
  }, [navigate, params.barSlug, params.mesaCodigo, session]);

  return session;
}
