import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloudUploadAlt, 
  faFile, 
  faFileImage, 
  faFilePdf, 
  faFileWord, 
  faFileExcel, 
  faTimes,
  faDownload,
  faEye,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

const FileUpload = ({ 
  projectId, 
  onFileUpload, 
  onFileDelete,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // 파일 타입별 아이콘 반환
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return faFileImage;
    if (file.type === 'application/pdf') return faFilePdf;
    if (file.type.includes('word')) return faFileWord;
    if (file.type.includes('excel')) return faFileExcel;
    return faFile;
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 파일 유효성 검사
  const validateFile = (file) => {
    // 파일 크기 검사
    if (file.size > maxFileSize) {
      alert(`파일 크기가 너무 큽니다. 최대 ${formatFileSize(maxFileSize)}까지 업로드 가능합니다.`);
      return false;
    }

    // 파일 타입 검사
    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });

    if (!isValidType) {
      alert('지원하지 않는 파일 형식입니다.');
      return false;
    }

    return true;
  };

  // 파일 선택 처리
  const handleFileSelect = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(validateFile);
    
    if (files.length + validFiles.length > maxFiles) {
      alert(`최대 ${maxFiles}개까지 업로드 가능합니다.`);
      return;
    }

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      uploadedAt: new Date().toISOString()
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  // 드래그 앤 드롭 처리
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // 파일 업로드 처리
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // localStorage에 파일 정보 저장
      const existingFiles = JSON.parse(localStorage.getItem(`project_${projectId}_files`) || '[]');
      const uploadedFiles = files.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        uploadedAt: f.uploadedAt,
        projectId: projectId
      }));
      
      const allFiles = [...existingFiles, ...uploadedFiles];
      localStorage.setItem(`project_${projectId}_files`, JSON.stringify(allFiles));

      // 콜백 호출
      if (onFileUpload) {
        onFileUpload(uploadedFiles);
      }

      // 파일 목록 초기화
      setFiles([]);
      
      alert('파일이 성공적으로 업로드되었습니다!');
    } catch (error) {
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 파일 삭제
  const handleFileDelete = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // 파일 미리보기
  const handleFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      window.open(file.preview, '_blank');
    } else {
      // 문서 파일의 경우 다운로드
      const link = document.createElement('a');
      link.href = URL.createObjectURL(file.file);
      link.download = file.name;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* 파일 업로드 영역 */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faCloudUploadAlt} className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              파일을 여기에 드래그하거나 클릭하여 업로드하세요
            </h3>
            <p className="text-gray-600">
              최대 {maxFiles}개, 각 파일 {formatFileSize(maxFileSize)}까지 업로드 가능
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            파일 선택
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* 선택된 파일 목록 */}
      {files.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              선택된 파일 ({files.length}/{maxFiles})
            </h3>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  업로드 중...
                </div>
              ) : (
                '업로드하기'
              )}
            </button>
          </div>

          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={getFileIcon(file)} className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleFilePreview(file)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="미리보기/다운로드"
                  >
                    <FontAwesomeIcon icon={file.type.startsWith('image/') ? faEye : faDownload} className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleFileDelete(file.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 업로드된 파일 목록 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📁 업로드된 파일</h3>
        <div className="space-y-3">
          {/* 여기에 업로드된 파일 목록이 표시됩니다 */}
          <p className="text-gray-500 text-center py-8">아직 업로드된 파일이 없습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;




