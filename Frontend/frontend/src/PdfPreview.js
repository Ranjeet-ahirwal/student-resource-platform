import { useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL

function PdfPreview() {
  const { filename } = useParams();

  const fileUrl = `${API_URL}/uploads/${filename}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 p-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          📄 PDF Viewer
        </h1>

        <div className="flex gap-3">

          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Open in New Tab
          </a>

          <a
            href={fileUrl}
            download
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Download
          </a>

        </div>
      </div>

      {/* PDF CONTAINER */}
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">

        <iframe
          src={fileUrl}
          title="PDF Viewer"
          className="w-full h-[80vh] border-0"
        />

      </div>

    </div>
  );
}

export default PdfPreview;