import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Trash2, Download } from 'lucide-react';
import DocumentUpload from './DocumentUpload';

const DocumentSidebar = ({ documents, selectedDocument, onSelectDocument, onDocumentUpload }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Documents ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {documents.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
              No documents uploaded yet
            </p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDocument?.id === doc.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => onSelectDocument(doc)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(doc.size)} • {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-500 p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete document
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <DocumentUpload onUpload={onDocumentUpload} />
    </div>
  );
};

export default DocumentSidebar;
