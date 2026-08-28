import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { ArrowLeft, CircleHelp, FileArchive, FileText, UploadCloud, X } from "lucide-react";

import { ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE } from "../../../../data/csrRegistration";
import CSRRegistrationLayout from "../components/CSRRegistrationLayout";
import PageHeading from "../components/PageHeading";
import useCSRRegistration from "../../../../hooks/useCSRRegistration";
import type { CSRRegistrationData, FieldErrors } from "../../../../types/csrRegistration";
import {
  countWords,
  formatFileSize,
  getFileExtension,
  navigateToStep,
} from "../../../../utils/csrRegistration";
import { saveCSRRegistrationData } from "../../../../services/csrRegistrationStorage";
import { csrApplicationService } from "../../../../services/csr/csrApplicationService";

const MotivationStep = ({
  data,
  onChange,
}: Readonly<{
  data: CSRRegistrationData;
  onChange: (updates: Partial<CSRRegistrationData>) => void;
}>) => {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wordCount = useMemo(() => countWords(data.motivation), [data.motivation]);

  const validateAndStoreFile = (file: File | undefined) => {
    if (!file) return;

    const extension = getFileExtension(file.name);
    if (!ALLOWED_FILE_EXTENSIONS.includes(extension)) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        document: "Gunakan file PDF, DOC, DOCX, atau ZIP.",
      }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        document: "Ukuran file maksimal 20 MB.",
      }));
      return;
    }

    setSelectedFile(file);
    onChange({
      document: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    });
    setErrors((currentErrors) => ({ ...currentErrors, document: undefined }));
  };

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    validateAndStoreFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    validateAndStoreFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FieldErrors = {};

    if (wordCount < 100) {
      nextErrors.motivation = `Motivasi minimal 100 kata. Saat ini ${wordCount} kata.`;
    }
    if (!data.acceptedTerms) {
      nextErrors.acceptedTerms = "Anda perlu menyetujui syarat dan kebijakan privasi.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const result = await csrApplicationService.submit(data, selectedFile);
      const submittedData: CSRRegistrationData = {
        ...data,
        applicationId: result.applicationId,
        submittedAt: result.submittedAt,
      };
      saveCSRRegistrationData(submittedData);
      onChange(submittedData);
      navigateToStep(4);
    } catch (caughtError) {
      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : "Pendaftaran tidak dapat dikirim. Silakan coba kembali.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="csr-registration-stage" key="motivation-step">
      <PageHeading />

      <form className="csr-registration-motivation-card" onSubmit={handleSubmit} noValidate>
        <div className="csr-registration-section-heading">
          <CircleHelp size={17} strokeWidth={1.7} aria-hidden="true" />
          <span>Mengapa anda ingin bergabung?</span>
        </div>
        <p className="csr-registration-section-helper">
          Ceritakan visi dan motivasi utama anda dalam berkontribusi pada ekosistem Mahreen CSR (minimal 100 kata).
        </p>

        <div className="csr-registration-motivation-wrap">
          <textarea
            className="csr-registration-textarea"
            data-error={Boolean(errors.motivation)}
            value={data.motivation}
            placeholder="Tuliskan aspirasi, pengalaman, atau rencana kolaborasi anda di sini..."
            onChange={(event) => {
              onChange({ motivation: event.target.value });
              if (errors.motivation) {
                setErrors((currentErrors) => ({ ...currentErrors, motivation: undefined }));
              }
            }}
          />
          <p className="csr-registration-word-count">{wordCount} / 100 Kata</p>
        </div>
        {errors.motivation && <p className="csr-registration-error">{errors.motivation}</p>}

        <div className="csr-registration-document-heading">
          <div>
            <div className="csr-registration-section-heading">
              <FileText size={17} strokeWidth={1.7} aria-hidden="true" />
              <span>Portfolio atau Proposal</span>
            </div>
            <p className="csr-registration-section-helper">
              Lampirkan dokumen pendukung untuk memperkuat aplikasi anda (Opsional).
            </p>
          </div>
          <span className="csr-registration-file-types">PDF, DOCX, ZIP (Max 20MB)</span>
        </div>

        <div
          className={`csr-registration-dropzone${isDragging ? " is-dragging" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.zip"
            onChange={handleFileInput}
          />

          {data.document ? (
            <div className="csr-registration-uploaded-file">
              <div className="csr-registration-uploaded-file__info">
                <FileArchive size={24} />
                <div>
                  <p className="csr-registration-uploaded-file__name">{data.document.name}</p>
                  <p className="csr-registration-uploaded-file__size">{formatFileSize(data.document.size)}</p>
                </div>
              </div>
              <button
                className="csr-registration-uploaded-file__remove"
                type="button"
                aria-label="Hapus dokumen"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedFile(undefined);
                  onChange({ document: null });
                }}
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="csr-registration-dropzone__content">
              <UploadCloud size={36} strokeWidth={1.55} />
              <span>Tarik file ke sini atau <strong>pilih dari perangkat</strong></span>
            </div>
          )}
        </div>
        {errors.document && <p className="csr-registration-error">{errors.document}</p>}

        <label className="csr-registration-consent">
          <input
            type="checkbox"
            checked={data.acceptedTerms}
            onChange={(event) => {
              onChange({ acceptedTerms: event.target.checked });
              if (errors.acceptedTerms) {
                setErrors((currentErrors) => ({ ...currentErrors, acceptedTerms: undefined }));
              }
            }}
          />
          <span>
            Saya menyatakan bahwa semua informasi yang diberikan adalah benar dan saya menyetujui{" "}
            <a href="/syarat-ketentuan">Syarat &amp; Ketentuan</a> serta{" "}
            <a href="/kebijakan-privasi">Kebijakan Privasi</a> Mahreen Indonesia.
          </span>
        </label>
        {errors.acceptedTerms && <p className="csr-registration-error">{errors.acceptedTerms}</p>}
        {submitError && <p className="csr-registration-error" role="alert">{submitError}</p>}

        <div className="csr-registration-motivation-actions">
          <button
            className="csr-registration-button csr-registration-button--ghost"
            type="button"
            onClick={() => navigateToStep(2)}
          >
            <ArrowLeft size={14} />
            Kembali
          </button>
          <button className="csr-registration-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

const CSRMotivationPage = () => {
  const { data, updateData } = useCSRRegistration(3);

  return (
    <CSRRegistrationLayout currentStep={3}>
      <MotivationStep data={data} onChange={updateData} />
    </CSRRegistrationLayout>
  );
};

export default CSRMotivationPage;
