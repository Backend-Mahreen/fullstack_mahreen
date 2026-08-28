import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ClientAccountLayout from "../../Akun/components/ClientAccountLayout";
import { useAuth } from "../../../hooks/useAuth";
import {
  clientDocumentsRepository,
  createLocalDocumentDownload,
} from "../../../services/documents/clientDocumentsRepository";
import { navigateToRoute } from "../../../utils/hashNavigation";
import ClientDocumentCard from "./components/ClientDocumentCard";
import ClientDocumentsSkeleton from "./components/ClientDocumentsSkeleton";
import type { ClientDocumentRecord } from "./types";
import "./ClientDocumentsPage.css";

const ClientDocumentsPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<ClientDocumentRecord[] | null>(null);

  useEffect(() => {
    if (!user) return;

    let active = true;
    const refresh = () => {
      const snapshot = clientDocumentsRepository.getSnapshot(user.id);
      if (active) setDocuments(snapshot);
    };
    const frame = window.requestAnimationFrame(refresh);
    const unsubscribe = clientDocumentsRepository.subscribe(refresh);
    window.addEventListener("focus", refresh);

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
      unsubscribe();
      window.removeEventListener("focus", refresh);
    };
  }, [user]);

  if (!user) return null;

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <ClientAccountLayout activeItem="documents" className="client-documents-page">
      <div className="client-documents-content">
        <header className="client-documents-header">
          <div>
            <h1>Docs</h1>
            <p>{today}</p>
          </div>
          <button type="button" onClick={() => navigateToRoute("/tanya-mahreen")}>
            <Plus aria-hidden="true" /> ORDER BARU
          </button>
        </header>

        {!documents ? (
          <ClientDocumentsSkeleton />
        ) : documents.length ? (
          <div className="client-documents-grid">
            {documents.map((document, index) => (
              <ClientDocumentCard
                document={document}
                index={index}
                key={document.id}
                onDownload={createLocalDocumentDownload}
              />
            ))}
          </div>
        ) : (
          <p className="client-documents-empty" role="status">
            Belum ada dokumen pada akun ini.
          </p>
        )}
      </div>
    </ClientAccountLayout>
  );
};

export default ClientDocumentsPage;
