import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DocumentUpload = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (files) => {
    setIsUploading(true);
    
    try {
      for (const file of files) {
        // Validate file type
        if (!file.type.includes('pdf') && !file.type.includes('text')) {
          toast({
            title: "Invalid file type",
            description: "Please upload PDF or text files only",
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload files smaller than 10MB",
            variant: "destructive",
          });
          continue;
        }

        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        const document = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date(),
          status: 'processed'
        };

        onUpload(document);
        
        toast({
          title: "Document uploaded successfully",
          description: `${file.name} is ready for questions`,
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, toast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, [handleFileUpload]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFileUpload(files);
  };

  return (
    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
      <CardContent className="p-6">
        <div
          className="text-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => e.preventDefault()}
        >
          <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Upload Study Materials
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Drag and drop your PDFs or text files here, or click to browse
          </p>
          
          <input
            type="file"
            multiple
            accept=".pdf,.txt,.md"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={isUploading}
          />
          
          <label htmlFor="file-upload">
            <Button 
              asChild
              disabled={isUploading}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              <span>
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Choose Files
                  </>
                )}
              </span>
            </Button>
          </label>
          
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <AlertCircle className="w-4 h-4 mr-1" />
            Max file size: 10MB | Supported: PDF, TXT
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
